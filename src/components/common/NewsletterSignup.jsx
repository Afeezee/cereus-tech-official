
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterSubscriber } from "@/entities/NewsletterSubscriber";
import { CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSignup({ className = "" }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await NewsletterSubscriber.create({
        email,
        first_name: firstName,
        source: window.location.pathname,
        interests: ["Product Updates", "Monthly Insights"]
      });
      
      setSuccess(true);
      setEmail("");
      setFirstName("");
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center space-x-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm">Thanks! Please check your email to confirm.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <Input
        type="text"
        placeholder="First name (optional)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
      />
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-green-500"
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
      
      <p className="text-xs text-gray-400">
        We respect your privacy. You can unsubscribe at any time.
      </p>
    </form>
  );
}
