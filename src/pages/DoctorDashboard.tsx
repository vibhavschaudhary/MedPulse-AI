import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Stethoscope, 
  Search, 
  SortDesc, 
  Clock, 
  Users,
  AlertTriangle,
  Filter
} from "lucide-react";
import { mockPatients, getSeverityColor, getSeverityLabel, Patient } from "@/data/mockData";

const DoctorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'severity' | 'time' | 'age'>('severity');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'moderate' | 'mild'>('all');
  
  // Filter and sort patients
  const filteredAndSortedPatients = mockPatients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'all' || 
                             (filterSeverity === 'critical' && patient.severityScore >= 80) ||
                             (filterSeverity === 'moderate' && patient.severityScore >= 60 && patient.severityScore < 80) ||
                             (filterSeverity === 'mild' && patient.severityScore < 60);
      
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          return b.severityScore - a.severityScore;
        case 'time':
          return new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime();
        case 'age':
          return b.age - a.age;
        default:
          return 0;
      }
    });
  
  const criticalCount = mockPatients.filter(p => p.severityScore >= 80).length;
  const moderateCount = mockPatients.filter(p => p.severityScore >= 60 && p.severityScore < 80).length;
  const mildCount = mockPatients.filter(p => p.severityScore < 60).length;
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getTimeSinceCheckin = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="gradient-medical p-3 rounded-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Doctor Dashboard
              </h1>
              <p className="text-muted-foreground">
                Patient queue management and triage overview
              </p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold text-foreground">{mockPatients.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Cases</p>
                    <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Moderate Cases</p>
                  <p className="text-2xl font-bold text-warning">{moderateCount}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mild Cases</p>
                  <p className="text-2xl font-bold text-success">{mildCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'severity' ? 'medical' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('severity')}
                >
                  <SortDesc className="h-4 w-4 mr-2" />
                  By Severity
                </Button>
                
                <Button
                  variant={sortBy === 'time' ? 'medical' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('time')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  By Time
                </Button>
              </div>
              
              <div className="flex gap-2">
                {(['all', 'critical', 'moderate', 'mild'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={filterSeverity === filter ? 'medical' : 'outline'}
                    size="sm"
                    onClick={() => setFilterSeverity(filter)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Table */}
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Patient Queue ({filteredAndSortedPatients.length})</span>
              <Badge variant="secondary">
                Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Vitals</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPatients.map((patient, index) => (
                    <TableRow key={patient.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {patient.queuePosition}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="font-medium text-foreground">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                      </TableCell>
                      
                      <TableCell className="text-foreground">{patient.age}</TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-foreground truncate" title={patient.symptoms}>
                            {patient.symptoms}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {patient.vitals || 'Not provided'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(patient.severityScore) as any}>
                            {getSeverityLabel(patient.severityScore)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {patient.severityScore}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-foreground">{formatTime(patient.checkedInAt)}</div>
                          <div className="text-muted-foreground">{getTimeSinceCheckin(patient.checkedInAt)}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-foreground">
                          ~{patient.estimatedWaitTime}m
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="medical">
                            See Now
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredAndSortedPatients.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">No patients match your current filters</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;