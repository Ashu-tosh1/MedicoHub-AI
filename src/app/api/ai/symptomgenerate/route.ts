/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part } from '@google/generative-ai'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * Retry function with exponential backoff.
 */
const retryWithBackoff = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn()
  } catch (err: any) {
    const status = err?.status || err?.statusCode || 500

    if (retries > 0 && status === 429) {
      console.log(`Rate limited. Retrying after ${delay}ms, ${retries} retries left`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryWithBackoff(fn, retries - 1, delay * 2)
    }

    throw err
  }
}

/**
 * Extract urgency level from the AI-generated text.
 */
const extractUrgencyLevel = (text: string): 'LOW' | 'MODERATE' | 'HIGH' => {
  const urgencyMatch = text.match(/Urgency Level.*?(low|medium|high)/i)
  if (!urgencyMatch) return 'MODERATE'

  const urgency = urgencyMatch[1].toLowerCase()

  switch (urgency) {
    case 'low':
      return 'LOW'
    case 'high':
      return 'HIGH'
    case 'medium':
    default:
      return 'MODERATE'
  }
}

/**
 * Extract possible conditions from the AI-generated text.
 */
const extractPossibleDiseases = (text: string): string => {
  const diseasesMatch = text.match(/Possible Conditions.*?(?:\n\n|$)/)
  return diseasesMatch ? diseasesMatch[0] : text.substring(0, 100)
}

/**
 * Extract recommendations from the AI-generated text.
 */
const extractRecommendations = (text: string): string => {
  
  // then match newlines explicitly.
  const recommendationsMatch = text.match(/Recommended Next Steps.*?(\n\n|$)/)
  return recommendationsMatch ? recommendationsMatch[0] : ''
}

export async function POST(req: NextRequest) {
  try {
    const { symptoms, patientId }: { symptoms: string; patientId: string } = await req.json()

    if (!symptoms || symptoms.trim() === '') {
      return NextResponse.json({ error: 'No symptoms provided' }, { status: 400 })
    }

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    const prompt = `
You are a medical AI assistant providing preliminary guidance based on user-submitted information.

A patient has reported the following:

${symptoms}

Based on this, provide a helpful and safe preliminary assessment. Structure your response like this:

1. **Possible Conditions**: List 2–3 possible conditions matching the symptoms in bullet points.
2. **Urgency Level**: Categorize as low / medium / high.
3. **Recommended Next Steps**: Suggest which department Doctor should they visit.
4. **You can experience**: Suggest 2-3 warning signs that the patient should watch for in bulletpoints.

⚠️ Note: Remind the user this is not a confirmed diagnosis and they should consult a licensed healthcare provider.

Keep the tone supportive and informative. Avoid alarming language unless absolutely necessary.
    `

    const modelOptions = ['gemini-1.5-flash', 'gemini-pro']
    let text: string | null = null
    let lastError: any = null

    for (const modelName of modelOptions) {
      if (text) break

      try {
        console.log(`Trying model: ${modelName}`)

        text = await retryWithBackoff(async () => {
          const model = genAI.getGenerativeModel({ model: modelName })

          if (modelName === 'gemini-pro') {
            const result = await model.generateContent(prompt)
            return result.response.text()
          }

          const result = await model.generateContent({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }] as Part[],  
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 32,
              topP: 0.95,
              maxOutputTokens: 800,
            },
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
            ],
          })
          

          return result.response.text()
        }, 2, 2000)

        console.log(`Successfully used model: ${modelName}`)
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error)
        lastError = error
      }
    }

    if (!text) {
      console.error('All models failed:', lastError)
      return NextResponse.json(
        { error: 'Unable to process symptoms at this time' },
        { status: lastError?.status === 429 ? 429 : 500 }
      )
    }

    const urgencyLevel = extractUrgencyLevel(text)
    const possibleDiseases = extractPossibleDiseases(text)
    const recommendations = extractRecommendations(text)

    try {
      const aiDiagnosis = await prisma.aIDiagnosis.create({
        data: {
          patientId,
          possibleDiseases,
          urgencyLevel,
          recommendations,
          confidenceScore: 0.85,
          generatedAt: new Date(),
        }
      })

      console.log("AI Diagnosis saved:", aiDiagnosis.id)
    } catch (dbError) {
      console.error("Failed to save diagnosis to database:", dbError)
    }

    return NextResponse.json({ diagnosis: text })
  } catch (error) {
    console.error('Symptom checker error:', error)
    return NextResponse.json({ error: 'Failed to process symptoms' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
