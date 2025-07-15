"use client";

import React, { useState } from "react";
import "../../styles/globals.css";

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
    } catch (err) {
      setStatus("❌ An error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-form-container" style={{ border: "2px solid #ccc", padding: 24, borderRadius: 12 }}>
      <h1>Get in touch with us</h1>
      <p>We’d love to hear from you. Please fill out this form.</p>

      {status && <div className="user-message info" style={{ marginBottom: 16 }}>{status}</div>}

      <form onSubmit={handleSubmit} className="contact-grid">
        <div>
          <label>First name <span style={{ color: "red" }}>*</span></label>
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

        <div>
          <label>Last name <span style={{ color: "red" }}>*</span></label>
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

        <div className="contact-grid-full">
          <label>Email <span style={{ color: "red" }}>*</span></label>
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

        <div className="contact-grid-full">
          <label>Contact Number <span style={{ color: "red" }}>*</span></label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              style={{ width: "90px", padding: "8px" }}
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
                style={{ width: 90, padding: "8px" }}
              />
            )}
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              className="contact-form-input"
              value={formData.phone}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>

        <div className="contact-grid-full">
          <label>Message <span style={{ color: "red" }}>*</span></label>
          <textarea
            name="message"
            placeholder="Your message..."
            className="contact-form-textarea"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <div className="form-error">{errors.message}</div>}
        </div>

        <div className="contact-grid-full">
          <label>Why are you reaching out? <span style={{ color: "red" }}>*</span></label>
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

        <div style={{ marginTop: 18 }}>
            <label
                style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.82rem",
                gap: "6px",
                lineHeight: "1.4",
                whiteSpace: "nowrap",
                flexWrap: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                }}
            >

            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              style={{ marginTop: 2 }}
            />
            I agree to the{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline", color: "#0070f3" }}
            >
              Privacy Policy
            </a>{" "}
            and use of my personal data.
          </label>
          {errors.consent && <div className="form-error">{errors.consent}</div>}
        </div>

        <button type="submit" className="contact-form-button" style={{ marginTop: 20 }}>
          Send message
        </button>
      </form>
    </div>
  );
}
