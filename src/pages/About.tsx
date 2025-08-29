import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  Heart,
  Users,
  Clock,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze symptoms, medical history, and vital signs to provide accurate triage decisions in real-time."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Built with healthcare privacy and security at its core. All patient data is encrypted and handled according to strict medical privacy standards."
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant triage assessments and queue updates ensure no delays in critical care decisions and optimal patient flow management."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive dashboards track wait times, patient satisfaction, and department efficiency to drive continuous improvement."
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Hospitals Served" },
    { icon: Clock, value: "30%", label: "Wait Time Reduction" },
    { icon: Heart, value: "95%", label: "Triage Accuracy" },
    { icon: Award, value: "24/7", label: "System Uptime" }
  ];

  const benefits = [
    "Reduce patient wait times by up to 30%",
    "Improve emergency response for critical cases",
    "Increase staff efficiency and job satisfaction",
    "Enhanced patient experience and outcomes",
    "Real-time visibility into department operations",
    "Predictive analytics for capacity planning",
    "Seamless integration with existing hospital systems",
    "Scalable solution for hospitals of all sizes"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-medical py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About MedPulse
          </h1>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Transforming emergency healthcare through intelligent triage and queue management. 
            Our AI-powered platform ensures every patient receives the right care at the right time.
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
            Trusted by 500+ Healthcare Facilities Worldwide
          </Badge>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At MedPulse, we believe that healthcare should be both efficient and compassionate. 
            Our mission is to eliminate unnecessary wait times while ensuring critical patients 
            receive immediate attention. Through cutting-edge AI technology, we're making 
            healthcare delivery faster, fairer, and more effective for everyone.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Proven Impact Across Healthcare Systems
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real results from hospitals and clinics using MedPulse to improve patient care
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How MedPulse Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines artificial intelligence with healthcare best practices 
              to create the most advanced triage system available.
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
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transform Your Healthcare Delivery
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                MedPulse delivers measurable improvements across every aspect of emergency care, 
                from patient satisfaction to operational efficiency.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6">
                <div className="text-center">
                  <div className="gradient-success p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">30% Wait Time Reduction</h3>
                  <p className="text-muted-foreground">
                    Average improvement in patient wait times across all severity levels
                  </p>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="text-center">
                  <div className="gradient-medical p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Improved Patient Outcomes</h3>
                  <p className="text-muted-foreground">
                    Critical cases identified and treated 40% faster than traditional triage
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-medical p-8 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Our Impact Statement</h2>
            <p className="text-xl mb-6 leading-relaxed">
              "Reduce wait times by 30%, improve emergency response, and transform 
              patient experience through intelligent healthcare technology."
            </p>
            <div className="flex justify-center space-x-8">
              <div>
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-white/80">Patients Served</div>
              </div>
              <div>
                <div className="text-2xl font-bold">15min</div>
                <div className="text-white/80">Avg. Wait Reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-white/80">System Reliability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Emergency Department?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the healthcare revolution and provide better patient care with MedPulse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-in">
              <Button size="lg" variant="hero" className="px-8 py-4">
                Try MedPulse Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;