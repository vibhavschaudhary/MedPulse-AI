export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  vitals?: string;
  severityScore: number;
  queuePosition: number;
  estimatedWaitTime: number;
  checkedInAt: string;
  status: 'waiting' | 'in-progress' | 'completed';
}

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 34,
    symptoms: "Severe chest pain, shortness of breath",
    vitals: "BP: 160/90, HR: 110",
    severityScore: 95,
    queuePosition: 1,
    estimatedWaitTime: 5,
    checkedInAt: "2024-01-15T08:30:00Z",
    status: "waiting"
  },
  {
    id: "2", 
    name: "Michael Chen",
    age: 67,
    symptoms: "Difficulty breathing, dizziness",
    vitals: "BP: 140/85, HR: 95",
    severityScore: 88,
    queuePosition: 2,
    estimatedWaitTime: 15,
    checkedInAt: "2024-01-15T08:45:00Z",
    status: "waiting"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    age: 28,
    symptoms: "Severe headache, nausea, vomiting",
    vitals: "BP: 130/80, HR: 88",
    severityScore: 75,
    queuePosition: 3,
    estimatedWaitTime: 25,
    checkedInAt: "2024-01-15T09:00:00Z",
    status: "waiting"
  },
  {
    id: "4",
    name: "David Thompson",
    age: 45,
    symptoms: "Ankle sprain from fall, moderate pain",
    vitals: "BP: 120/75, HR: 78",
    severityScore: 45,
    queuePosition: 4,
    estimatedWaitTime: 40,
    checkedInAt: "2024-01-15T09:15:00Z",
    status: "waiting"
  },
  {
    id: "5",
    name: "Lisa Wang",
    age: 31,
    symptoms: "Minor cut on hand, bleeding controlled",
    vitals: "BP: 115/70, HR: 72",
    severityScore: 25,
    queuePosition: 5,
    estimatedWaitTime: 55,
    checkedInAt: "2024-01-15T09:30:00Z",
    status: "waiting"
  },
  {
    id: "6",
    name: "Robert Garcia",
    age: 52,
    symptoms: "Persistent cough, low-grade fever",
    vitals: "BP: 125/78, HR: 82",
    severityScore: 35,
    queuePosition: 6,
    estimatedWaitTime: 65,
    checkedInAt: "2024-01-15T09:45:00Z",
    status: "waiting"
  }
];

export const getSeverityColor = (score: number): string => {
  if (score >= 80) return "destructive";
  if (score >= 60) return "warning";
  return "success";
};

export const getSeverityLabel = (score: number): string => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "Moderate";
  return "Mild";
};