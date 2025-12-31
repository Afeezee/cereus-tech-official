
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Clock, 
  Users, 
  Briefcase,
  Heart,
  Zap,
  Target,
  Send,
  CheckCircle,
  Loader2
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    role_applying_for: "",
    linkedin_profile: "",
    cover_note: ""
  });
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await base44.entities.Career.filter({ active: true }, "-created_date");
      setJobs(data);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationData(prev => ({ ...prev, role_applying_for: job.title }));
    setShowApplicationForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let cvUrl = "";
      if (cvFile) {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: cvFile });
        cvUrl = uploadResult.file_url;
      }

      await base44.entities.CareerApplication.create({
        ...applicationData,
        cv_url: cvUrl,
        consent_given: true
      });

      await base44.integrations.Core.SendEmail({
        to: applicationData.email,
        subject: "Application Received - Cereus Technologies",
        body: `Dear ${applicationData.name},\n\nThank you for applying for the ${applicationData.role_applying_for} position at Cereus Technologies.\n\nWe've received your application and will review it carefully. If your qualifications match our requirements, we'll be in touch to schedule an interview.\n\nBest regards,\nCereus Technologies HR Team`
      });

      setSuccess(true);
      setTimeout(() => {
        setShowApplicationForm(false);
        setSuccess(false);
        setApplicationData({
          name: "",
          email: "",
          phone: "",
          role_applying_for: "",
          linkedin_profile: "",
          cover_note: ""
        });
        setCvFile(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 to-blue-600/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">Join Our Team</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Be part of a dynamic team building innovative technology solutions that make a real impact
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-xl text-gray-600">
              We offer more than just a job - we offer a career and a community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Great Culture</h3>
                <p className="text-gray-600">
                  Collaborative environment where innovation and creativity thrive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Continuous learning and career development programs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                <p className="text-gray-600">
                  Build solutions that positively impact communities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">
              Find your next opportunity and apply today
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {job.department}
                          </span>
                        </div>
                      </div>
                      <Button onClick={() => handleApply(job)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{job.summary}</p>
                    
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Responsibilities:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
                <p className="text-gray-600 mb-6">
                  We don't have any open positions at the moment, but we're always interested in meeting talented people.
                </p>
                <Button onClick={() => setShowApplicationForm(true)}>
                  Send Us Your Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedJob ? `Apply for ${selectedJob.title}` : "Submit Your Application"}
            </DialogTitle>
          </DialogHeader>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600">
                Thank you for your interest. We'll review your application and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    value={applicationData.name}
                    onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                  <Input
                    type="url"
                    value={applicationData.linkedin_profile}
                    onChange={(e) => setApplicationData({ ...applicationData, linkedin_profile: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position Applying For *</label>
                <Input
                  value={applicationData.role_applying_for}
                  onChange={(e) => setApplicationData({ ...applicationData, role_applying_for: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Note *</label>
                <Textarea
                  value={applicationData.cover_note}
                  onChange={(e) => setApplicationData({ ...applicationData, cover_note: e.target.value })}
                  rows={5}
                  required
                  placeholder="Tell us why you'd be a great fit for this role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload CV/Resume (PDF) *</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    required
                    className="flex-1"
                  />
                  {cvFile && (
                    <span className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {cvFile.name}
                    </span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
