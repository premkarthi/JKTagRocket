import React, { useState, useEffect } from "react";
import "@styles/ToolUpdatesBanner.css";

const updates = [
  {
    title: 'Tool Update: Launched - 30/07/2025',
    messageParts: [
      '🎉 Native Ads tool fully redesigned with ',
      {
        text: 'Here to go Newchanges',
        href: 'https://jktagrocket.com/tools/native-ads/'
      },
      ' and preview improvements!'
    ]
  },
  {
    title: 'Tool Update: Upcoming - ASAP',
    messageParts: [
      '🧪 ',
      {
        text: 'Here to go Newchanges',
        href: '/tools/ab-comparison'
      },
      ' – A/B Comparison tool launching soon with inline diff highlights and export support.'
    ]
  }
];

export default function ToolUpdatesBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % updates.length);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  const { title, messageParts } = updates[activeIndex];

  return (
    <div className="banner-wrapper">
      <div className="banner-content" key={activeIndex}>
        <h4 className="banner-title">{title}</h4>
        <p className="banner-message">
          {messageParts.map((part, i) =>
            typeof part === "string" ? (
              part
            ) : (
              <a
                key={i}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link-with-icon"
              >
                {part.text}
                <img
                  src="/images/open-new-tab.jpeg"
                  alt="open"
                  className="link-icon"
                />
              </a>
            )
          )}
        </p>
      </div>
    </div>
  );
}
