
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  GraduationCap,
  Award,
  Globe,
  TrendingUp,
  Users,
  Code,
  Brain,
  Smartphone,
  Database,
  Shield,
  Cloud,
  Palette,
  CheckCircle,
  Send,
  Loader2,
  Target,
  Zap,
  Phone,
  Mail,
  Brush,
  Film
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Academy() {
  const [activeTab, setActiveTab] = useState("student");
  const [studentData, setStudentData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    location: "",
    education_level: "",
    courses_interested: [],
    experience_level: "Beginner",
    learning_goals: "",
    how_heard: ""
  });
  const [instructorData, setInstructorData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    expertise_areas: [],
    years_experience: "",
    qualifications: "",
    linkedin_profile: "",
    portfolio_url: "",
    teaching_experience: "",
    why_teach: "",
    availability: ""
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const courses = [
    { icon: Brain, name: "Artificial Intelligence", color: "from-purple-500 to-pink-500" },
    { icon: Code, name: "Web Development", color: "from-blue-500 to-cyan-500" },
    { icon: Smartphone, name: "Mobile Development", color: "from-green-500 to-teal-500" },
    { icon: Database, name: "Data Analytics", color: "from-orange-500 to-red-500" },
    { icon: Database, name: "Data Science", color: "from-indigo-500 to-purple-500" },
    { icon: Shield, name: "Cybersecurity", color: "from-red-500 to-pink-500" },
    { icon: Cloud, name: "Cloud Computing", color: "from-cyan-500 to-blue-500" },
    { icon: Palette, name: "UI/UX Design", color: "from-pink-500 to-rose-500" },
    { icon: Brush, name: "Graphics Design", color: "from-yellow-500 to-orange-500" },
    { icon: Film, name: "Animation & Video Editing", color: "from-purple-600 to-indigo-600" },
    { icon: CheckCircle, name: "Quality Assurance", color: "from-emerald-500 to-green-500" },
    { icon: Code, name: "DevOps", color: "from-violet-500 to-purple-500" },
    { icon: Target, name: "Project Management", color: "from-amber-500 to-orange-500" },
    { icon: Zap, name: "Robotics & Automation", color: "from-teal-500 to-cyan-500" }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Globally Recognized Certificates",
      description: "Earn industry-standard certifications accepted worldwide, opening doors to international opportunities."
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from seasoned professionals with years of real-world experience in their fields."
    },
    {
      icon: Globe,
      title: "International Opportunities",
      description: "Access to global job markets and freelance platforms with skills that are in high demand."
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
      description: "Build a strong foundation for career growth in the rapidly evolving digital economy."
    }
  ];

  const handleStudentInputChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstructorInputChange = (field, value) => {
    setInstructorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourseSelection = (course) => {
    const currentCourses = activeTab === "student" ?
      studentData.courses_interested :
      instructorData.expertise_areas;

    const isSelected = currentCourses.includes(course);

    if (activeTab === "student") {
      setStudentData((prev) => ({
        ...prev,
        courses_interested: isSelected ?
          prev.courses_interested.filter((c) => c !== course) :
          [...prev.courses_interested, course]
      }));
    } else {
      setInstructorData((prev) => ({
        ...prev,
        expertise_areas: isSelected ?
          prev.expertise_areas.filter((c) => c !== course) :
          [...prev.expertise_areas, course]
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      setCvFile(file);
      setError("");
    } else {
      setError("Please upload a PDF or Word document");
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await base44.entities.StudentRegistration.create(studentData);

      await base44.integrations.Core.SendEmail({
        to: studentData.email,
        subject: "Welcome to Cereus Academy!",
        body: `Dear ${studentData.full_name},\n\nThank you for registering with Cereus Academy. We've received your application and will review it shortly.\n\nWe'll contact you within 2-3 business days with next steps.\n\nBest regards,\nCereus Academy Team`
      });

      setSuccess(true);
      setStudentData({
        full_name: "",
        email: "",
        phone: "",
        age: "",
        location: "",
        education_level: "",
        courses_interested: [],
        experience_level: "Beginner",
        learning_goals: "",
        how_heard: ""
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let cvUrl = "";

      if (cvFile) {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: cvFile });
        cvUrl = uploadResult.file_url;
      }

      await base44.entities.InstructorRegistration.create({
        ...instructorData,
        cv_url: cvUrl
      });

      await base44.integrations.Core.SendEmail({
        to: instructorData.email,
        subject: "Thank You for Your Interest in Teaching at Cereus Academy",
        body: `Dear ${instructorData.full_name},\n\nThank you for your interest in becoming an instructor at Cereus Academy. We've received your application and will review it carefully.\n\nOur team will be in touch within 5-7 business days.\n\nBest regards,\nCereus Academy Team`
      });

      setSuccess(true);
      setInstructorData({
        full_name: "",
        email: "",
        phone: "",
        location: "",
        expertise_areas: [],
        years_experience: "",
        qualifications: "",
        linkedin_profile: "",
        portfolio_url: "",
        teaching_experience: "",
        why_teach: "",
        availability: ""
      });
      setCvFile(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-white" />
          <h1 className="text-5xl font-bold mb-6 text-white">Welcome to Cereus Academy</h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Empowering the next generation of technology professionals with world-class training
            and globally recognized certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}>
              Enroll as a Student
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600"
              onClick={() => {
                setActiveTab("instructor");
                document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
              }}>
              Become an Instructor
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Cereus Academy?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who have transformed their careers through our comprehensive programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) =>
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) =>
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <course.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {course.name}
                  </h3>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-600">
              Choose your path and begin your journey with Cereus Academy
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student">Student Registration</TabsTrigger>
              <TabsTrigger value="instructor">Instructor Application</TabsTrigger>
            </TabsList>

            {/* Student Registration */}
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>Student Registration Form</CardTitle>
                </CardHeader>
                <CardContent>
                  {success ?
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                      <p className="text-gray-600">
                        Thank you for registering. We'll be in touch soon!
                      </p>
                    </div> :

                    <form onSubmit={handleStudentSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input
                            value={studentData.full_name}
                            onChange={(e) => handleStudentInputChange("full_name", e.target.value)}
                            required />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            type="email"
                            value={studentData.email}
                            onChange={(e) => handleStudentInputChange("email", e.target.value)}
                            required />

                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone *</label>
                          <Input
                            type="tel"
                            value={studentData.phone}
                            onChange={(e) => handleStudentInputChange("phone", e.target.value)}
                            required />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Age</label>
                          <Input
                            type="number"
                            value={studentData.age}
                            onChange={(e) => handleStudentInputChange("age", e.target.value)} />

                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Location</label>
                          <Input
                            value={studentData.location}
                            onChange={(e) => handleStudentInputChange("location", e.target.value)}
                            placeholder="City, Country" />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Education Level</label>
                          <Select
                            value={studentData.education_level}
                            onValueChange={(value) => handleStudentInputChange("education_level", value)}>

                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High School">High School</SelectItem>
                              <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                              <SelectItem value="Graduate">Graduate</SelectItem>
                              <SelectItem value="Professional">Professional</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Courses Interested In *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {courses.map((course) =>
                            <Button
                              key={course.name}
                              type="button"
                              variant={studentData.courses_interested.includes(course.name) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleCourseSelection(course.name)}
                              className="justify-start">

                              {course.name}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Experience Level</label>
                        <Select
                          value={studentData.experience_level}
                          onValueChange={(value) => handleStudentInputChange("experience_level", value)}>

                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Learning Goals *</label>
                        <Textarea
                          value={studentData.learning_goals}
                          onChange={(e) => handleStudentInputChange("learning_goals", e.target.value)}
                          rows={4}
                          required
                          placeholder="Tell us what you hope to achieve..." />

                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                        <Input
                          value={studentData.how_heard}
                          onChange={(e) => handleStudentInputChange("how_heard", e.target.value)} />

                      </div>

                      {error &&
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                          {error}
                        </div>
                      }

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ?
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </> :

                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        }
                      </Button>
                    </form>
                  }
                </CardContent>
              </Card>
            </TabsContent>

            {/* Instructor Application */}
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>Instructor Application Form</CardTitle>
                </CardHeader>
                <CardContent>
                  {success ?
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                      <p className="text-gray-600">
                        Thank you for your interest. We'll review your application and get back to you soon!
                      </p>
                    </div> :

                    <form onSubmit={handleInstructorSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input
                            value={instructorData.full_name}
                            onChange={(e) => handleInstructorInputChange("full_name", e.target.value)}
                            required />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email *</label>
                          <Input
                            type="email"
                            value={instructorData.email}
                            onChange={(e) => handleInstructorInputChange("email", e.target.value)}
                            required />

                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone *</label>
                          <Input
                            type="tel"
                            value={instructorData.phone}
                            onChange={(e) => handleInstructorInputChange("phone", e.target.value)}
                            required />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Location *</label>
                          <Input
                            value={instructorData.location}
                            onChange={(e) => handleInstructorInputChange("location", e.target.value)}
                            placeholder="City, Country"
                            required />

                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Areas of Expertise *</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {courses.map((course) =>
                            <Button
                              key={course.name}
                              type="button"
                              variant={instructorData.expertise_areas.includes(course.name) ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleCourseSelection(course.name)}
                              className="justify-start">

                              {course.name}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                          <Input
                            type="number"
                            value={instructorData.years_experience}
                            onChange={(e) => handleInstructorInputChange("years_experience", e.target.value)}
                            required />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Availability</label>
                          <Select
                            value={instructorData.availability}
                            onValueChange={(value) => handleInstructorInputChange("availability", value)}>

                            <SelectTrigger>
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Weekends">Weekends</SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Qualifications *</label>
                        <Textarea
                          value={instructorData.qualifications}
                          onChange={(e) => handleInstructorInputChange("qualifications", e.target.value)}
                          rows={3}
                          required
                          placeholder="List your educational qualifications and certifications..." />

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                          <Input
                            type="url"
                            value={instructorData.linkedin_profile}
                            onChange={(e) => handleInstructorInputChange("linkedin_profile", e.target.value)}
                            placeholder="https://linkedin.com/in/..." />

                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Portfolio/Website</label>
                          <Input
                            type="url"
                            value={instructorData.portfolio_url}
                            onChange={(e) => handleInstructorInputChange("portfolio_url", e.target.value)}
                            placeholder="https://..." />

                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Teaching Experience</label>
                        <Textarea
                          value={instructorData.teaching_experience}
                          onChange={(e) => handleInstructorInputChange("teaching_experience", e.target.value)}
                          rows={3}
                          placeholder="Describe your previous teaching experience..." />

                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Why do you want to teach at Cereus Academy? *</label>
                        <Textarea
                          value={instructorData.why_teach}
                          onChange={(e) => handleInstructorInputChange("why_teach", e.target.value)}
                          rows={4}
                          required
                          placeholder="Tell us your motivation..." />

                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Upload CV/Resume</label>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="flex-1" />

                          {cvFile &&
                            <span className="text-sm text-green-600 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {cvFile.name}
                            </span>
                          }
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Accepted formats: PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>

                      {error &&
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                          {error}
                        </div>
                      }

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ?
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </> :

                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        }
                      </Button>
                    </form>
                  }
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542382156909-9ae1f927cc7f?q=80&w=1600)', // Another suitable image
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 to-blue-600/90"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Have Questions?</h2>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8">
            Our admissions team is here to help you get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700">
              <Phone className="w-5 h-5 mr-2" />
              +234 701 462 3270
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700">
              <Mail className="w-5 h-5 mr-2" />
              info@cereustechnologies.com
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
