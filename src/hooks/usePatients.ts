import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Patient {
  id: string
  name: string
  age: number
  symptoms: string
  vitals?: string
  severity_score: number
  queue_position: number
  estimated_wait_time: number
  checked_in_at: string
  status: 'waiting' | 'in-progress' | 'completed'
  created_at: string
  updated_at: string
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('status', 'waiting')
        .order('queue_position', { ascending: true })

      if (error) throw error

      setPatients((data || []) as Patient[])
      setError(null)
    } catch (err) {
      console.error('Error fetching patients:', err)
      setError('Failed to fetch patients')
      toast({
        title: "Error",
        description: "Failed to fetch patient data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const checkInPatient = async (patientData: {
    name: string
    age: number
    symptoms: string
    vitals?: string
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-triage', {
        body: patientData
      })

      if (error) throw error

      toast({
        title: "Check-in Successful",
        description: `${patientData.name} has been added to the queue`,
        variant: "default"
      })

      // Refresh the patients list
      await fetchPatients()

      return data
    } catch (err) {
      console.error('Error checking in patient:', err)
      toast({
        title: "Check-in Failed",
        description: "Unable to add patient to queue. Please try again.",
        variant: "destructive"
      })
      throw err
    }
  }

  const updatePatientStatus = async (patientId: string, status: Patient['status']) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status })
        .eq('id', patientId)

      if (error) throw error

      // Log the status change
      await supabase
        .from('queue_history')
        .insert({
          patient_id: patientId,
          action: status === 'in-progress' ? 'seen_by_doctor' : 'completed',
          notes: `Status changed to ${status}`
        })

      toast({
        title: "Status Updated",
        description: `Patient status updated to ${status}`,
        variant: "default"
      })

      // Refresh the patients list
      await fetchPatients()
    } catch (err) {
      console.error('Error updating patient status:', err)
      toast({
        title: "Update Failed",
        description: "Unable to update patient status",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchPatients()

    // Set up real-time subscription
    const channel = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          console.log('Real-time update:', payload)
          fetchPatients() // Refresh data on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    patients,
    loading,
    error,
    fetchPatients,
    checkInPatient,
    updatePatientStatus
  }
}