
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  Linkedin,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const teamMembers = [
    {
      name: "Afeez A. Olagunju",
      role: "Founder & CEO",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/cb8d32d4b_IMG_1187.jpg",
      linkedin: "https://www.linkedin.com/in/afeez-olagunju-35b811a6/",
      email: "olagunjuafeez@gmail.com"
    },
    {
      name: "Abe Enoch A.",
      role: "Chief Technology Officer",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/8169d3f7d_AbePassport1.jpg",
      linkedin: "https://www.linkedin.com/in/enoch-abe-b223a118b/",
      email: "abeaboluwarin@gmail.com"
    },
    {
      name: "Akanfe Abidemi M.",
      role: "R&D Director",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c5f7011e8a4a27675b0091/0dec60d3c_Passport1.jpg",
      email: "Akanfe.am.bm@gmail.com"
    }
  ];

  const milestones = [
    { year: "2016", event: "Company Founded", description: "Started with a vision to transform African tech in Lagos, Nigeria" },
    { year: "2019", event: "First Product Launch", description: "Launched our flagship health technology solution" },
    { year: "2021", event: "50+ Clients", description: "Reached milestone of serving 50+ organizations across 12 countries" },
    { year: "2023", event: "International Expansion", description: "Expanded operations to multiple African countries" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Purple gradient background with image */}
      <section 
        className="relative py-32 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Cereus Technologies
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto font-medium">
            We're on a mission to build reliable technology solutions that drive positive change
            in health, education, and environmental sectors across Africa.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4 font-medium">
                Founded in 2016 in Lagos, Nigeria, Cereus Technologies began with a simple yet powerful vision: 
                to create technology solutions that address real challenges in African markets.
              </p>
              <p className="text-lg text-gray-700 mb-4 font-medium">
                What started as a small team of passionate technologists has grown into a 
                leading technology company serving 50+ institutional clients across 12 countries.
              </p>
              <p className="text-lg text-gray-700 font-medium">
                Today, we're proud to have delivered over 50 successful projects, helping 
                organizations leverage technology to achieve their goals and make a positive impact.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
                alt="Our Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-purple-900 hover:shadow-lg transition-all">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
                <p className="text-gray-700 font-medium">
                  To build reliable technology solutions that drive measurable impact in health, 
                  education, and environmental sectors across African markets.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-green-600 hover:shadow-lg transition-all">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h3>
                <p className="text-gray-700 font-medium">
                  To be the leading technology partner for organizations seeking to leverage 
                  digital innovation for sustainable growth and social impact.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-purple-900 hover:shadow-lg transition-all">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Values</h3>
                <p className="text-gray-700 font-medium">
                  Excellence, Innovation, Integrity, Collaboration, and Customer Success guide 
                  everything we do as we build solutions that matter.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-2xl font-bold text-purple-900">{milestone.year}</div>
                </div>
                <Card className="flex-1 border-2 hover:border-purple-900 hover:shadow-lg transition-all">
                  <CardContent className="py-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{milestone.event}</h3>
                    <p className="text-gray-700 font-medium">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-700 font-medium">
              Experienced professionals driving innovation and excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center border-2 hover:border-purple-900 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-gray-700 mb-4 font-medium">{member.role}</p>
                  <div className="flex justify-center gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                    <a href={`mailto:${member.email}`}>
                      <Button size="sm" variant="outline" className="border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Want to Join Our Team?
          </h2>
          <p className="text-xl text-white mb-8 font-medium">
            We're always looking for talented individuals who share our passion for innovation
          </p>
          <Link to="/careers">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              View Open Positions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
