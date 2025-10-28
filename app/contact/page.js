"use client";

import React, { useState } from "react";
import "../../styles/globals.css";
import "../../styles/ContactForm.css";
import Customtooltip from "components/Customtooltip";
import TooltipcopyButton from "components/TooltipcopyButton";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    message: "",
    reason: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    if (!formData.reason.trim()) newErrors.reason = "Please select a reason.";
    if (!formData.consent) newErrors.consent = "You must accept the privacy policy.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      countryCode: "+91",
      message: "",
      reason: "",
      consent: false,
    });
    setErrors({});
    setStatus("🧹 All fields have been cleared.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed.");
      setStatus("✅ Message sent successfully!");
      handleReset();
    } catch (err) {
      setStatus("❌ An error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-form-container">
      <h1>Get in touch with us</h1>
      <p>We’d love to hear from you. Please fill out this form.</p>

      {status && <div className="user-message info">{status}</div>}

      <form onSubmit={handleSubmit} className="contact-grid">
        {/* First Name */}
        <div>
          <label>
            First name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            className="contact-form-input"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="form-error">{errors.firstName}</div>}
        </div>

        {/* Last Name */}
        <div>
          <label>
            Last name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            className="contact-form-input"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <div className="form-error">{errors.lastName}</div>}
        </div>

        {/* Email */}
        <div className="contact-grid-full">
          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            className="contact-form-input"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        {/* Phone */}
        <div className="contact-grid-full">
          <label>
            Contact Number <span className="required">*</span>
          </label>
          <div className="phone-input-wrapper">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+880">🇧🇩 +880</option>
              <option value="+92">🇵🇰 +92</option>
              <option value="other">🌐 Other</option>
            </select>
            {formData.countryCode === "other" && (
              <input
                type="text"
                name="customCode"
                placeholder="+XXX"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, countryCode: e.target.value }))
                }
              />
            )}
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              className="contact-form-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>

        {/* Message */}
        <div className="contact-grid-full">
          <label>
            Message <span className="required">*</span>
          </label>
          <textarea
            name="message"
            placeholder="Your message..."
            className="contact-form-textarea"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <div className="form-error">{errors.message}</div>}
        </div>

        {/* Reason */}
        <div className="contact-grid-full">
          <label>
            Why are you reaching out? <span className="required">*</span>
          </label>
          <select
            name="reason"
            className="contact-form-input"
            onChange={handleChange}
            value={formData.reason}
          >
            <option value="">-- Select reason --</option>
            <option value="technical">Technical Help</option>
            <option value="support">Billing or Support</option>
            <option value="business">Partnership or Business</option>
            <option value="feedback">Product Feedback</option>
            <option value="other">Other</option>
          </select>
          {errors.reason && <div className="form-error">{errors.reason}</div>}
        </div>

        {/* Consent */}
        <div className="consent-container">
          <label className="consent-label">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            I agree to the{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            and use of my personal data.
          </label>
          {errors.consent && <div className="form-error">{errors.consent}</div>}
        </div>

        {/* Buttons (new line, centered) */}
        <div className="contact-buttons">
          <button type="submit" className="submit-btn">
            Send message
          </button>

          <Customtooltip text="Clear all fields" variant="copy" delay={800}>
            <span onClick={handleReset} className="refresh-icon">
              🔄
            </span>
          </Customtooltip>
        </div>
      </form>
    </div>
  );
}
