import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface TriageRequest {
  name: string
  age: number
  symptoms: string
  vitals?: string
}

// AI Triage Algorithm - calculates severity score based on symptoms and patient data
function calculateTriageSeverity(symptoms: string, age: number, vitals?: string): number {
  let score = 20 // Base score

  const symptomText = symptoms.toLowerCase()

  // Critical symptoms (high priority)
  const criticalSymptoms = [
    'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 
    'shortness of breath', 'severe bleeding', 'unconscious', 'seizure',
    'severe head injury', 'overdose', 'severe allergic reaction'
  ]
  
  // Moderate symptoms
  const moderateSymptoms = [
    'severe headache', 'high fever', 'severe pain', 'vomiting', 
    'dizziness', 'fainting', 'severe nausea', 'broken bone'
  ]
  
  // Mild symptoms
  const mildSymptoms = [
    'cough', 'cold', 'minor cut', 'sprain', 'rash', 'sore throat'
  ]

  // Check for critical symptoms
  for (const symptom of criticalSymptoms) {
    if (symptomText.includes(symptom)) {
      score += 40
      break
    }
  }

  // Check for moderate symptoms
  for (const symptom of moderateSymptoms) {
    if (symptomText.includes(symptom)) {
      score += 25
      break
    }
  }

  // Check for mild symptoms (reduces priority if only mild symptoms)
  let hasMildOnly = false
  for (const symptom of mildSymptoms) {
    if (symptomText.includes(symptom)) {
      hasMildOnly = true
      break
    }
  }

  if (hasMildOnly && score === 20) {
    score = 15 // Only mild symptoms
  }

  // Age-based adjustments
  if (age >= 65) score += 15  // Elderly priority
  if (age <= 5) score += 20   // Pediatric priority
  if (age >= 18 && age <= 30) score -= 5  // Young adult adjustment

  // Vital signs assessment (if provided)
  if (vitals) {
    const vitalsText = vitals.toLowerCase()
    
    // High blood pressure
    if (vitalsText.includes('bp:') || vitalsText.includes('blood pressure')) {
      const bpMatch = vitalsText.match(/(\d{2,3})\/(\d{2,3})/)
      if (bpMatch) {
        const systolic = parseInt(bpMatch[1])
        const diastolic = parseInt(bpMatch[2])
        if (systolic > 180 || diastolic > 110) score += 20
        else if (systolic > 140 || diastolic > 90) score += 10
      }
    }
    
    // Heart rate
    const hrMatch = vitalsText.match(/hr:\s*(\d+)|heart rate:\s*(\d+)/)
    if (hrMatch) {
      const hr = parseInt(hrMatch[1] || hrMatch[2])
      if (hr > 120 || hr < 50) score += 15
      else if (hr > 100 || hr < 60) score += 8
    }
    
    // Temperature
    const tempMatch = vitalsText.match(/temp:\s*(\d+\.?\d*)|temperature:\s*(\d+\.?\d*)/)
    if (tempMatch) {
      const temp = parseFloat(tempMatch[1] || tempMatch[2])
      if (temp > 103 || temp < 95) score += 15
      else if (temp > 101) score += 8
    }
  }

  // Add some controlled randomness for realistic variation
  score += Math.floor(Math.random() * 10) - 5

  // Ensure score is within bounds
  return Math.min(100, Math.max(5, score))
}

// Calculate estimated wait time based on queue position and severity
function calculateWaitTime(queuePosition: number, severity: number): number {
  let baseTime = queuePosition * 15 // 15 minutes per position base

  // Adjust based on severity
  if (severity >= 80) baseTime = Math.max(5, baseTime * 0.3) // Critical - fast track
  else if (severity >= 60) baseTime = baseTime * 0.7 // Moderate - some priority
  else baseTime = baseTime * 1.2 // Mild - longer wait

  // Add some variation
  baseTime += Math.floor(Math.random() * 10)

  return Math.round(baseTime)
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, age, symptoms, vitals }: TriageRequest = await req.json()

    // Validate input
    if (!name || !age || !symptoms) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, age, symptoms' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (age < 1 || age > 120) {
      return new Response(
        JSON.stringify({ error: 'Age must be between 1 and 120' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing triage for ${name}, age ${age}`)

    // Calculate severity score using AI algorithm
    const severityScore = calculateTriageSeverity(symptoms, age, vitals)

    // Get current queue size to determine position
    const { data: currentPatients, error: queueError } = await supabase
      .from('patients')
      .select('id, severity_score')
      .eq('status', 'waiting')
      .order('severity_score', { ascending: false })

    if (queueError) {
      console.error('Queue query error:', queueError)
      return new Response(
        JSON.stringify({ error: 'Failed to check queue status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate queue position based on severity
    let queuePosition = 1
    if (currentPatients) {
      queuePosition = currentPatients.filter(p => p.severity_score > severityScore).length + 1
    }

    // Calculate estimated wait time
    const estimatedWaitTime = calculateWaitTime(queuePosition, severityScore)

    // Insert patient into database
    const { data: newPatient, error: insertError } = await supabase
      .from('patients')
      .insert({
        name,
        age,
        symptoms,
        vitals,
        severity_score: severityScore,
        queue_position: queuePosition,
        estimated_wait_time: estimatedWaitTime,
        status: 'waiting'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to add patient to queue' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the check-in action
    await supabase
      .from('queue_history')
      .insert({
        patient_id: newPatient.id,
        action: 'checked_in',
        new_position: queuePosition,
        notes: `Patient checked in with severity score ${severityScore}`
      })

    console.log(`Successfully triaged ${name} with severity ${severityScore}, position ${queuePosition}`)

    // Return triage results
    return new Response(
      JSON.stringify({
        success: true,
        patient: newPatient,
        queueNumber: newPatient.id.slice(-6).toUpperCase(), // Use last 6 chars of UUID as queue number
        message: 'Successfully added to queue'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('AI Triage error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during triage processing' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})