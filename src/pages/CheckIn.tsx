import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus, 
  Clock, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSeverityColor, getSeverityLabel } from "@/data/mockData";

interface CheckInResult {
  queueNumber: number;
  estimatedWaitTime: number;
  severityScore: number;
  position: number;
}

const CheckIn = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: "",
    vitals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);

  // Simulate AI triage scoring
  const calculateSeverityScore = (symptoms: string, age: number): number => {
    let score = 20; // Base score
    
    const symptomKeywords = symptoms.toLowerCase();
    
    // Critical symptoms
    if (symptomKeywords.includes("chest pain") || 
        symptomKeywords.includes("difficulty breathing") ||
        symptomKeywords.includes("shortness of breath")) {
      score += 50;
    }
    
    // Moderate symptoms
    if (symptomKeywords.includes("headache") || 
        symptomKeywords.includes("nausea") ||
        symptomKeywords.includes("dizziness")) {
      score += 30;
    }
    
    // Age factor
    if (age > 65) score += 15;
    if (age < 5) score += 20;
    
    // Add some randomness for realistic simulation
    score += Math.floor(Math.random() * 15);
    
    return Math.min(100, Math.max(10, score));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.symptoms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const age = parseInt(formData.age);
    const severityScore = calculateSeverityScore(formData.symptoms, age);
    const queueNumber = Math.floor(Math.random() * 1000) + 100;
    
    // Calculate position based on severity (higher severity = higher priority)
    let position = 1;
    if (severityScore < 60) position = Math.floor(Math.random() * 8) + 4;
    else if (severityScore < 80) position = Math.floor(Math.random() * 3) + 2;
    
    const estimatedWaitTime = position * 15 + Math.floor(Math.random() * 10);
    
    const result: CheckInResult = {
      queueNumber,
      estimatedWaitTime,
      severityScore,
      position
    };
    
    setCheckInResult(result);
    setIsSubmitting(false);
    
    toast({
      title: "Check-in Successful",
      description: `You're number ${queueNumber} in the queue. Estimated wait: ${estimatedWaitTime} minutes.`,
      variant: "default"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (checkInResult) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-medical">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="gradient-success p-4 rounded-full">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">
                Check-in Successful!
              </CardTitle>
              <p className="text-muted-foreground">
                You've been added to the queue. Please wait for your turn.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Queue Number */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  #{checkInResult.queueNumber}
                </div>
                <p className="text-muted-foreground">Your Queue Number</p>
              </div>
              
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-semibold text-foreground">
                    {checkInResult.estimatedWaitTime}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </Card>
                
                <Card className="text-center p-4">
                  <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-semibold text-foreground">
                    {checkInResult.position}
                  </div>
                  <div className="text-sm text-muted-foreground">Position</div>
                </Card>
                
                <Card className="text-center p-4">
                  <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                  <Badge 
                    variant={getSeverityColor(checkInResult.severityScore) as any}
                    className="text-sm"
                  >
                    {getSeverityLabel(checkInResult.severityScore)}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Priority</div>
                </Card>
              </div>
              
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Queue Progress</span>
                  <span>{Math.max(0, 100 - (checkInResult.position * 15))}%</span>
                </div>
                <Progress value={Math.max(0, 100 - (checkInResult.position * 15))} />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setCheckInResult(null)}
                  variant="outline"
                  className="flex-1"
                >
                  New Check-in
                </Button>
                <Button 
                  onClick={() => window.location.href = '/queue'}
                  variant="medical"
                  className="flex-1"
                >
                  View Queue Status
                </Button>
              </div>
              
              {/* Important Notice */}
              <Card className="bg-muted/50 border-warning/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Important:</p>
                      <p className="text-muted-foreground">
                        If your condition worsens while waiting, please alert the front desk immediately. 
                        Our AI system continuously monitors and adjusts priorities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="gradient-medical p-4 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Patient Check-in
          </h1>
          <p className="text-muted-foreground">
            Please provide your information to join the queue. Our AI will assess your priority.
          </p>
        </div>
        
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="text-xl text-center">Check-in Form</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail..."
                  rows={4}
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vitals">Vitals (Optional)</Label>
                <Input
                  id="vitals"
                  type="text"
                  placeholder="e.g., Blood Pressure, Heart Rate, Temperature"
                  value={formData.vitals}
                  onChange={(e) => handleInputChange("vitals", e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                variant="hero"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Check-In & Get Queue Position
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;