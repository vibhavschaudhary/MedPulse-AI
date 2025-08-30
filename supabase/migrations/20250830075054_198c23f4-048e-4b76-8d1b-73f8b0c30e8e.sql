-- Create patients table for medical triage system
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
  symptoms TEXT NOT NULL,
  vitals TEXT,
  severity_score INTEGER NOT NULL CHECK (severity_score >= 0 AND severity_score <= 100),
  queue_position INTEGER NOT NULL,
  estimated_wait_time INTEGER NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patient access
-- Patients can view all records (public queue visibility)
CREATE POLICY "Anyone can view patients in queue" 
ON public.patients 
FOR SELECT 
USING (true);

-- Only authenticated users (doctors/staff) can insert new patients
CREATE POLICY "Authenticated users can create patients" 
ON public.patients 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update patient records
CREATE POLICY "Authenticated users can update patients" 
ON public.patients 
FOR UPDATE 
TO authenticated
USING (true);

-- Only authenticated users can delete patient records
CREATE POLICY "Authenticated users can delete patients" 
ON public.patients 
FOR DELETE 
TO authenticated
USING (true);

-- Create queue_history table for tracking patient flow
CREATE TABLE public.queue_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('checked_in', 'position_updated', 'seen_by_doctor', 'completed')),
  old_position INTEGER,
  new_position INTEGER,
  performed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.queue_history ENABLE ROW LEVEL SECURITY;

-- Create policies for queue history
CREATE POLICY "Anyone can view queue history" 
ON public.queue_history 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create queue history" 
ON public.queue_history 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'doctor' CHECK (role IN ('doctor', 'nurse', 'admin', 'staff')),
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.email),
    COALESCE(new.raw_user_meta_data ->> 'role', 'doctor')
  );
  RETURN new;
END;
$$;

-- Create trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to automatically update queue positions
CREATE OR REPLACE FUNCTION public.update_queue_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- Update queue positions based on severity score (higher score = higher priority)
  WITH ranked_patients AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY severity_score DESC, checked_in_at ASC) as new_position
    FROM public.patients 
    WHERE status = 'waiting'
  )
  UPDATE public.patients 
  SET queue_position = ranked_patients.new_position
  FROM ranked_patients 
  WHERE patients.id = ranked_patients.id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update queue positions when severity changes
CREATE TRIGGER trigger_update_queue_positions
  AFTER INSERT OR UPDATE OF severity_score, status ON public.patients
  FOR EACH STATEMENT EXECUTE FUNCTION public.update_queue_positions();

-- Enable realtime for patients table
ALTER TABLE public.patients REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;

-- Enable realtime for queue history
ALTER TABLE public.queue_history REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_history;

-- Insert some sample data for testing
INSERT INTO public.patients (name, age, symptoms, vitals, severity_score, queue_position, estimated_wait_time, checked_in_at, status)
VALUES 
  ('Sarah Johnson', 34, 'Severe chest pain, shortness of breath', 'BP: 160/90, HR: 110', 95, 1, 5, '2024-01-15T08:30:00Z', 'waiting'),
  ('Michael Chen', 67, 'Difficulty breathing, dizziness', 'BP: 140/85, HR: 95', 88, 2, 15, '2024-01-15T08:45:00Z', 'waiting'),
  ('Emma Rodriguez', 28, 'Severe headache, nausea, vomiting', 'BP: 130/80, HR: 88', 75, 3, 25, '2024-01-15T09:00:00Z', 'waiting'),
  ('David Thompson', 45, 'Ankle sprain from fall, moderate pain', 'BP: 120/75, HR: 78', 45, 4, 40, '2024-01-15T09:15:00Z', 'waiting'),
  ('Lisa Wang', 31, 'Minor cut on hand, bleeding controlled', 'BP: 115/70, HR: 72', 25, 5, 55, '2024-01-15T09:30:00Z', 'waiting'),
  ('Robert Garcia', 52, 'Persistent cough, low-grade fever', 'BP: 125/78, HR: 82', 35, 6, 65, '2024-01-15T09:45:00Z', 'waiting');