'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot bot protection check
    if (formData.honeypot) {
      console.warn('Bot submission caught by honeypot.');
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to deliver message. Please try again.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center border-b border-seafoam/20 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brass/10 border border-brass/30 text-brass font-mono text-xs uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" />
          <span>Press & Event Desk</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-fog font-normal">
          Inquiries & Correspondence
        </h1>
        <p className="font-body text-lg text-fog/80 max-w-xl mx-auto">
          For literary festival bookings, interview requests, press copies, or reader letters.
        </p>
      </div>

      {/* Form Card */}
      <div className="gothic-card p-8 lg:p-12 rounded-xl border border-seafoam/20 space-y-6">
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-brass mx-auto" />
            <h3 className="font-display text-2xl text-fog">Message Received</h3>
            <p className="font-body text-base text-fog/80 max-w-md mx-auto">
              Thank you for reaching out. Your message has been dispatched to Arthur Milton's press desk at Lizard Point.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded text-red-200 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Hidden Honeypot Field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website_check">Leave this empty</label>
              <input
                id="website_check"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-mono text-xs text-brass uppercase tracking-wider">
                  Your Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-storm text-fog placeholder-seafoam/40 text-sm p-3 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block font-mono text-xs text-brass uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. eleanor@vanceliterary.com"
                  className="w-full bg-storm text-fog placeholder-seafoam/40 text-sm p-3 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="organization" className="block font-mono text-xs text-seafoam uppercase tracking-wider">
                Publication / Organization (Optional)
              </label>
              <input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. London Review of Books / Falmouth Book Festival"
                className="w-full bg-storm text-fog placeholder-seafoam/40 text-sm p-3 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block font-mono text-xs text-seafoam uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +44 7700 900123"
                className="w-full bg-storm text-fog placeholder-seafoam/40 text-sm p-3 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block font-mono text-xs text-brass uppercase tracking-wider">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please state the details of your inquiry..."
                className="w-full bg-storm text-fog placeholder-seafoam/40 text-sm p-3 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-brass hover:bg-brass-hover text-abyssal font-mono text-sm font-semibold px-8 py-3.5 rounded shadow transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Inquiry...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
