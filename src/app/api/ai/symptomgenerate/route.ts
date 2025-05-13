/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from '@google/generative-ai'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const retryWithBackoff = async (fn: { (): Promise<any>; (): any }, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (err) {
    const status = err?.status || err?.statusCode || 500
    
    // Only retry on rate limit errors (429)
    if (retries > 0 && status === 429) {
      console.log(`Rate limited. Retrying after ${delay}ms, ${retries} retries left`)
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Retry with exponential backoff
      return retryWithBackoff(fn, retries - 1, delay * 2)
    }
    
    // Re-throw the error if we can't retry
    throw err
  }
}

// Helper function to determine urgency level from text
const extractUrgencyLevel = (text: string) => {
  const urgencyMatch = text.match(/Urgency Level.*?(low|medium|high)/i)
  if (!urgencyMatch) return 'MODERATE' // default
  
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

// Helper function to extract possible diseases
const extractPossibleDiseases = (text: string) => {
  const diseasesMatch = text.match(/Possible Conditions.*?(?:\n\n|$)/s)
  return diseasesMatch ? diseasesMatch[0] : text.substring(0, 100)
}

// Helper function to extract recommendations
const extractRecommendations = (text: string) => {
  const recommendationsMatch = text.match(/Recommended Next Steps.*?(?:\n\n|$)/s)
  return recommendationsMatch ? recommendationsMatch[0] : ''
}

export async function POST(req: NextRequest) {
  try {
    const { symptoms, patientId } = await req.json()

    if (!symptoms || symptoms.trim() === '') {
      return NextResponse.json(
        { error: 'No symptoms provided' },
        { status: 400 }
      )
    }

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
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

    // Try different models with retry logic
    const modelOptions = ['gemini-1.5-flash', 'gemini-pro']
    let text = null
    let lastError = null

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
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              topK: 32,
              topP: 0.95,
              maxOutputTokens: 800,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
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

    // Extract data for database storage
    const urgencyLevel = extractUrgencyLevel(text)
    const possibleDiseases = extractPossibleDiseases(text)
    const recommendations = extractRecommendations(text)

    // Store AI diagnosis in database
    try {
      const aiDiagnosis = await prisma.aIDiagnosis.create({
        data: {
          patientId,
          possibleDiseases,
          urgencyLevel,
          recommendations,
          confidenceScore: 0.85, // Default confidence score
          generatedAt: new Date(),
        }
      })
      
      console.log("AI Diagnosis saved:", aiDiagnosis.id)
    } catch (dbError) {
      console.error("Failed to save diagnosis to database:", dbError)
      // Continue to return diagnosis even if DB save fails
    }

    return NextResponse.json({ diagnosis: text })
  } catch (error) {
    console.error('Symptom checker error:', error)
    return NextResponse.json(
      { error: 'Failed to process symptoms' },
      { status: 500 }
    )
  } finally {
    // Disconnect from the database to prevent connection leaks
    await prisma.$disconnect()
  }
}