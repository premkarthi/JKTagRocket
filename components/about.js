import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">About JKTagRocket</h2>
        <p className="text-lg leading-relaxed mb-5">
          <strong>JKTagRocket</strong> is a smart, user-friendly tag validation and troubleshooting tool designed
          for digital marketers, QA engineers, and AdOps professionals.
        </p>
        <p className="text-lg leading-relaxed mb-5">
          With increasing complexity in ad tech and privacy compliance, validating tracking pixels, beacons, and tags
          across platforms can be a challenge. JKTagRocket simplifies this process — allowing you to verify, debug,
          and optimize tags in real-time without digging through browser dev tools.
        </p>
        <p className="text-lg leading-relaxed mb-5">
          Whether you're launching a new campaign or onboarding a new client, TagRocket ensures your tags are firing
          accurately, data is being captured correctly, and your tracking is compliant with global standards like
          <strong> GDPR </strong> and <strong> CCPA</strong>.
        </p>
        <p className="text-lg leading-relaxed">
          Built by QA experts who understand the stakes, TagRocket helps teams avoid data loss, reduce campaign
          escalations, and improve time-to-market.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;

