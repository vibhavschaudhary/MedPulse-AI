import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Activity, 
  RefreshCw,
  Heart,
  TrendingUp
} from "lucide-react";
import { mockPatients, getSeverityColor, getSeverityLabel } from "@/data/mockData";

const Queue = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate current patient (could be from props or context in real app)
  const currentPatient = mockPatients[2]; // Emma Rodriguez
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getWaitProgress = (position: number) => {
    return Math.max(0, 100 - (position * 20));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="gradient-medical p-4 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Patient Queue Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time updates • Last updated: {formatTime(currentTime)}
          </p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Current Patient Status */}
        <Card className="shadow-medical mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span>Your Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-primary mb-2">
                #{currentPatient.queuePosition}
              </div>
              <p className="text-lg text-muted-foreground">
                You are <span className="font-semibold text-foreground">3rd</span> in line
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="text-center p-4">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-semibold text-foreground">
                  {currentPatient.estimatedWaitTime}
                </div>
                <div className="text-sm text-muted-foreground">Minutes Remaining</div>
              </Card>
              
              <Card className="text-center p-4">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <Badge 
                  variant={getSeverityColor(currentPatient.severityScore) as any}
                  className="text-sm mb-2"
                >
                  {getSeverityLabel(currentPatient.severityScore)}
                </Badge>
                <div className="text-sm text-muted-foreground">Priority Level</div>
              </Card>
              
              <Card className="text-center p-4">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-semibold text-foreground">
                  {currentPatient.severityScore}
                </div>
                <div className="text-sm text-muted-foreground">Severity Score</div>
              </Card>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Treatment</span>
                <span>{getWaitProgress(currentPatient.queuePosition)}%</span>
              </div>
              <Progress value={getWaitProgress(currentPatient.queuePosition)} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Queue Overview */}
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <span>Current Queue</span>
              </span>
              <Badge variant="secondary" className="text-sm">
                {mockPatients.length} patients waiting
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPatients.slice(0, 6).map((patient, index) => (
                <div 
                  key={patient.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    patient.id === currentPatient.id ? 'bg-primary/5 border-primary' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      patient.id === currentPatient.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {patient.id === currentPatient.id ? 'You' : `Patient ${index + 1}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Age: {patient.age} • Checked in: {new Date(patient.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={getSeverityColor(patient.severityScore) as any}
                      className="text-xs"
                    >
                      {getSeverityLabel(patient.severityScore)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      ~{patient.estimatedWaitTime}m
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>
                  Queue times are estimates based on current capacity and patient severity. 
                  Critical cases may be prioritized ahead of schedule.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Queue;