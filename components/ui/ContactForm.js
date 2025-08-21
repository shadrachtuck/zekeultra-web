"use client";
import { useState } from 'react';
import Button from './Button';

export default function ContactForm({ 
  contactName = 'Your Name',
  contactEmail = 'Your Email', 
  contactMessage = 'Your Message',
  subject = 'Subject',
  submitText = 'Send Message',
  successMessage = 'Message sent successfully!',
  failureMessage = 'Failed to send message. Please try again.'
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || successMessage);
        // Clear form on success
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || failureMessage);
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || failureMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-transparent border-main mb-8 flex flex-col gap-6 text-black" autoComplete="off">
      <div>
        <label className="block mb-2 font-medium text-black" htmlFor="name">
          {contactName}
        </label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          required 
          maxLength={100}
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-2 py-2 bg-transparent text-black border-b border-black focus:outline-none focus:border-black transition-colors duration-200" 
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium text-black" htmlFor="email">
          Email
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          maxLength={254}
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-2 py-2 bg-transparent text-black border-b border-black focus:outline-none focus:border-black transition-colors duration-200" 
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium text-black" htmlFor="subject">
          {subject}
        </label>
        <input 
          id="subject" 
          name="subject" 
          type="text" 
          required 
          maxLength={200}
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-2 py-2 bg-transparent text-black border-b border-black focus:outline-none focus:border-black transition-colors duration-200" 
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium text-black" htmlFor="message">
          {contactMessage}
        </label>
        <textarea 
          id="message" 
          name="message" 
          rows={5} 
          required 
          maxLength={2000}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-2 py-2 bg-transparent text-black border-b border-black focus:outline-none focus:border-black transition-colors duration-200" 
        />
      </div>
      
      {/* Status Messages */}
      {submitStatus && (
        <div className={`p-2 rounded ${
          submitStatus === 'success' 
            ? 'bg-green-900 text-green-100 border border-green-700' 
            : 'bg-red-900 text-red-100 border border-red-700'
        }`}>
          {submitMessage}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-3"
      >
        {isSubmitting ? 'Sending...' : submitText}
      </Button>
    </form>
  );
} 