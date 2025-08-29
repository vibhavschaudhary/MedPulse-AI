import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Clock, 
  Users, 
  TrendingUp, 
  Heart,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Triage",
      description: "Advanced algorithms analyze symptoms and vitals to provide accurate severity scoring."
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live queue management with dynamic wait time estimates for optimal patient flow."
    },
    {
      icon: Users,
      title: "Multi-User Dashboard",
      description: "Separate interfaces for patients, doctors, and administrative staff."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Track wait times, patient satisfaction, and system efficiency metrics."
    }
  ];

  const stats = [
    { value: "30%", label: "Reduction in Wait Times" },
    { value: "95%", label: "Accuracy in Triage" },
    { value: "24/7", label: "System Availability" },
    { value: "500+", label: "Hospitals Using MedPulse" }
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="mb-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                <Heart className="w-4 h-4 mr-1" />
                Next-Generation Healthcare
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              MedPulse – Smart Hospital Triage & Queue Management
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              AI-driven patient prioritization for faster and fairer care. 
              Transform your emergency department with intelligent triage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/check-in">
                <Button size="lg" variant="hero" className="text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Revolutionary Healthcare Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              MedPulse combines artificial intelligence with healthcare expertise to create 
              the most advanced triage system available.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="gradient-medical p-3 rounded-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transform Your Emergency Department
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                MedPulse delivers measurable improvements in patient care and operational efficiency.
              </p>
              
              <div className="space-y-4">
                {[
                  "Reduce patient wait times by up to 30%",
                  "Improve emergency response for critical cases",
                  "Increase staff efficiency and satisfaction",
                  "Enhanced patient experience and outcomes",
                  "Real-time visibility into department operations"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with healthcare privacy regulations
                </p>
              </Card>
              
              <Card className="text-center p-6">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Sub-second triage decisions and queue updates
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-medical">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Delivery?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of hospitals already using MedPulse to improve patient care and reduce wait times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-in">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 px-8 py-4">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;