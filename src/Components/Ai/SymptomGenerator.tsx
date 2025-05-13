/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Stethoscope, Calendar, Clock3, FileText, Search } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "@/lib/utils"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [history, setHistory] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTab, setCurrentTab] = useState('input')
  const { user } = useUser(); 
  
  const handleCheck = async () => {
    if (!symptoms.trim() || !duration.trim()) {
      setError('Please fill in the symptoms and duration')
      return
    }

    setError('')
    setLoading(true)

    const formattedInput = `
Symptoms:
${symptoms.trim()}

Duration:
${duration.trim()}

Past Medical History:
${history.trim() || 'None'}

Additional Notes:
${notes.trim() || 'None'}
    `.trim()
   
    try {
        // Get the patientId from the logged-in user
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const clerkUserId = user.id;
        const patientResponse = await axios.post('/api/patient/getId', {
            clerkUserId,
        });
        const patientId = patientResponse.data.patientId;
      
        const res = await fetch('/api/ai/symptomgenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            symptoms: formattedInput,
            patientId
          })
        });
      
        if (!res.ok) throw new Error('Failed to analyze symptoms');
        const data = await res.json();
        console.log('Diagnosis data received:', data);
        
        // Store the diagnosis data
        if (data.diagnosis) {
          setDiagnosis(data.diagnosis);
          setCurrentTab('results');
          console.log('Full diagnosis text:', data.diagnosis);
        } else {
          throw new Error('No diagnosis data returned from API');
        }
    } catch (err) {
      console.error('Error in symptom check:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyClass = (text: string) => {
    if (!text) return {};
    
    const urgencyMatch = text.match(/Urgency Level.*?(low|medium|high)/i);
    if (!urgencyMatch) return {
      icon: <Clock className="h-5 w-5 text-amber-500" />, 
      color: 'bg-amber-50 border-amber-200', 
      textColor: 'text-amber-700'
    };
    
    const urgency = urgencyMatch[1].toLowerCase();
    
    const urgencyConfig = {
      low: { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
      medium: { icon: <Clock className="h-5 w-5 text-amber-500" />, color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
      high: { icon: <AlertCircle className="h-5 w-5 text-red-500" />, color: 'bg-red-50 border-red-200', textColor: 'text-red-700' }
    };
    
    return urgencyConfig[urgency] || urgencyConfig.medium;
  }

  const extractSectionContent = (text: string, sectionTitle: string) => {
    if (!text) return [];
    
    console.log(`Extracting section: ${sectionTitle} from diagnosis`);
    
    // For numbered sections like "1. **Possible Conditions**:"
    const numberedSectionPattern = new RegExp(`\\d+\\.\\s+\\*\\*${sectionTitle}\\*\\*:\\s*(.*?)(?=\\d+\\.\\s+\\*\\*|$)`, 's');
    const numberedMatch = text.match(numberedSectionPattern);
    
    if (numberedMatch && numberedMatch[1]) {
      console.log(`Found numbered section for ${sectionTitle}`);
      const content = numberedMatch[1].trim();
      // Extract items (potentially marked with asterisks)
      const items = content.split(/\*\*\*/).slice(1); // Skip the first empty part
      
      if (items.length > 0) {
        return items.map((item: string) => item.trim()).filter(Boolean);
      }
      
      // Fallback to line splitting if asterisk splitting didn't work
      return content.split(/\n/)
        .map((item: string) => item.replace(/^(-|\*|\d+\.)\s+/, '').trim())
        .filter(Boolean);
    }
    
    // Try regular section patterns
    const patterns = [
      // Pattern 1: Section title followed by colon and content until next section or end
      new RegExp(`${sectionTitle}[:\\s]+(.*?)(?=\\n\\n(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*:|$))`, 's'),
      // Pattern 2: Section title with or without colon
      new RegExp(`${sectionTitle}[:\\s]*(.*?)(?=\\n\\n|$)`, 's'),
      // Pattern 3: Section with markdown bold
      new RegExp(`\\*\\*${sectionTitle}\\*\\*[:\\s]*(.*?)(?=\\*\\*|$)`, 's'),
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        console.log(`Found regular pattern match for ${sectionTitle}`);
        const content = match[1].trim();
        // Split by new lines or bullet points
        return content.split(/\n/)
          .map((item: string) => item.replace(/^(-|\*|\d+\.)\s+/, '').trim())
          .filter(Boolean);
      }
    }
    
    // Fallback: try to find anything after the section title
    const titleVariants = [
      sectionTitle,
      `**${sectionTitle}**`,
      `**${sectionTitle}**:`,
    ];
    
    for (const variant of titleVariants) {
      const index = text.indexOf(variant);
      if (index >= 0) {
        console.log(`Found title variant for ${sectionTitle}: ${variant}`);
        const afterSection = text.substring(index + variant.length);
        const nextSectionMatch = afterSection.match(/\n\n\d+\.\s+\*\*|\n\n\*\*/);
        
        const relevantContent = nextSectionMatch 
          ? afterSection.substring(0, nextSectionMatch.index) 
          : afterSection;
        
        return relevantContent
          .replace(/^[:\s]+/, '')  // Remove leading colon and whitespace
          .split(/\n/)
          .map((item: string) => item.replace(/^(-|\*|\d+\.|\*\*\*)\s*/, '').trim())
          .filter(Boolean);
      }
    }
    
    console.log(`No match found for section: ${sectionTitle}`);
    return [];
  }

  const renderDiagnosisSection = (title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, content: string, icon: string | number | bigint | boolean | JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined) => {
    if (!diagnosis) return null;
    
    console.log(`Rendering section: ${title}`);
    const items = extractSectionContent(diagnosis, title);
    console.log(`Items found for ${title}:`, items);
    
    if (items.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="font-medium text-base flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="pl-7">
          {items.map((item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => {
            // Check if the item contains a sub-title (e.g. "***Tension headache:")
            const titleMatch = item.match(/^([^:]+):(.*)/);
            if (titleMatch) {
              return (
                <div key={i} className="mt-3">
                  <div className="font-medium">{titleMatch[1].replace(/\*/g, '').trim()}</div>
                  <div className="mt-1">{titleMatch[2].trim()}</div>
                </div>
              );
            }
            
            return (
              <div key={i} className="flex items-start gap-2 mt-1">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const urgencyConfig = getUrgencyClass(diagnosis);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Space for sidebar - you'll import your sidebar component here */}
      <div className="w-64 bg-white border-r border-gray-200">
        {/* Your sidebar will go here */}
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              AI Symptom Checker
            </h1>
            <p className="text-gray-500 mt-1">
              Input your symptoms for an AI-powered preliminary health assessment
            </p>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Input Symptoms
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2" disabled={!diagnosis}>
                <Search className="h-4 w-4" />
                Assessment Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input">
              <Card className="shadow-sm border-gray-100">
                <CardContent className="space-y-6 pt-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="symptoms" className="text-sm font-medium">
                          Symptoms
                        </Label>
                        <Textarea
                          id="symptoms"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Describe what you're experiencing..."
                          className="min-h-[120px] mt-1 resize-none"
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium">
                          Duration
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="e.g. 3 days, 1 week"
                            className="pl-9"
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="history" className="text-sm font-medium">
                          Past Medical History
                        </Label>
                        <Textarea
                          id="history"
                          value={history}
                          onChange={(e) => setHistory(e.target.value)}
                          placeholder="Any existing conditions or previous treatments..."
                          className="min-h-[120px] mt-1 resize-none"
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes" className="text-sm font-medium">
                          Additional Notes (optional)
                        </Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e: { target: { value: SetStateAction<string> } }) => setNotes(e.target.value)}
                          placeholder="Medications, allergies, or other relevant information..."
                          className="mt-1 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleCheck} 
                      disabled={loading} 
                      className="px-6"
                    >
                      {loading ? (
                        <>
                          <Clock3 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="mr-2 h-4 w-4" />
                          Analyze Symptoms
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              {diagnosis ? (
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">AI Health Assessment</h2>
                        
                        {urgencyConfig.icon && (
                          <div className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium", 
                            urgencyConfig.color,
                            urgencyConfig.textColor
                          )}>
                            {urgencyConfig.icon}
                            <span>
                              {diagnosis.match(/Urgency Level.*?(low|medium|high)/i)?.[1]?.toUpperCase() || 'MEDIUM'} URGENCY
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6 divide-y divide-gray-100">
                        {renderDiagnosisSection("Possible Conditions", diagnosis, <AlertCircle className="h-5 w-5 text-blue-500" />)}
                        {renderDiagnosisSection("Recommended Next Steps", diagnosis, <Clock3 className="h-5 w-5 text-purple-500" />)}
                        {renderDiagnosisSection("You can experience", diagnosis, <AlertCircle className="h-5 w-5 text-orange-500" />)}
                        
                        {/* Debug section to show what's being received */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-8 pt-4 border-t border-gray-200">
                            <details>
                              <summary className="cursor-pointer text-sm text-gray-500">Debug: Raw Diagnosis Data</summary>
                              <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-auto max-h-60">
                                {diagnosis}
                              </pre>
                            </details>
                          </div>
                        )}
                        
                        {/* Fallback section in case the AI response format is completely different */}
                        {diagnosis && 
                         !extractSectionContent(diagnosis, "Possible Conditions").length && 
                         !extractSectionContent(diagnosis, "Recommended Next Steps").length && 
                         !extractSectionContent(diagnosis, "You can experience").length && (
                          <div className="space-y-2 py-4">
                            <h3 className="font-medium text-base">Assessment Results</h3>
                            <div className="whitespace-pre-wrap">{diagnosis}</div>
                          </div>
                        )}
                      </div>

                      <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <AlertTitle>Important Health Notice</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          This is an AI-generated preliminary assessment and not a substitute for professional medical advice. Please consult a healthcare professional for a proper diagnosis.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" onClick={() => setCurrentTab('input')}>
                          Back to Symptoms
                        </Button>
                        <Button>
                          Schedule Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-pulse">
                    <Clock3 className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">No assessment results yet. Please submit your symptoms first.</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}