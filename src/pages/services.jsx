
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Users,
  Lightbulb,
  Settings,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  BrainCircuit
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      icon: Code,
      title: "Custom Software Development",
      description: "End-to-end software development services tailored to your specific business needs.",
      features: [
        "Web & Mobile Applications",
        "Enterprise Solutions",
        "API Development & Integration",
        "Cloud-Native Applications"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BrainCircuit,
      title: "AI & Machine Learning Solutions",
      description: "Leverage the power of AI to automate processes and gain insights from your data.",
      features: [
        "Predictive Analytics",
        "Natural Language Processing",
        "Computer Vision",
        "Intelligent Automation"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Digital Transformation Consulting",
      description: "Strategic guidance to help organizations navigate their digital transformation journey.",
      features: [
        "Technology Strategy",
        "Process Optimization",
        "Change Management",
        "Digital Roadmap Planning"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Settings,
      title: "IT Support & Maintenance",
      description: "Comprehensive support services to keep your systems running smoothly.",
      features: [
        "24/7 Technical Support",
        "System Monitoring",
        "Regular Updates & Patches",
        "Performance Optimization"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Lightbulb,
      title: "Product Innovation",
      description: "From concept to launch, we help you build innovative products that users love.",
      features: [
        "Product Strategy",
        "UX/UI Design",
        "MVP Development",
        "Market Testing"
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Technology Training",
      description: "Empower your team with the skills they need to succeed in the digital age.",
      features: [
        "Custom Training Programs",
        "Workshops & Bootcamps",
        "Online Courses",
        "Certification Programs"
      ],
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Discovery",
      description: "We start by understanding your business, challenges, and goals through detailed consultations."
    },
    {
      step: "2",
      title: "Planning",
      description: "We develop a comprehensive strategy and roadmap tailored to your specific needs."
    },
    {
      step: "3",
      title: "Execution",
      description: "Our expert team brings your solution to life using agile methodologies and best practices."
    },
    {
      step: "4",
      title: "Delivery",
      description: "We deploy your solution, provide training, and ensure smooth adoption."
    },
    {
      step: "5",
      title: "Support",
      description: "Ongoing maintenance, updates, and optimization to ensure long-term success."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">Our Services</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Comprehensive technology solutions to help your business thrive in the digital age
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Services?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fast Turnaround</h3>
                    <p className="text-gray-600">Agile development process ensures quick delivery without compromising quality.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Results-Driven</h3>
                    <p className="text-gray-600">We focus on measurable outcomes that align with your business objectives.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
                    <p className="text-gray-600">Work with experienced professionals who understand your industry.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                alt="Our Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how our services can help transform your business
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
