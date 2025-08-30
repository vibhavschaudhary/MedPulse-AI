-- Fix security warnings by adding proper search_path to functions

-- Update the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the update_queue_positions function with proper search_path
CREATE OR REPLACE FUNCTION public.update_queue_positions()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
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
$$;