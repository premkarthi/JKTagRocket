"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../styles/ReviewsSection.css";
import { motion } from "framer-motion";

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to load reviews:", err));
  }, []);

  // ✅ Inject SEO structured data using JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JK Tag Rocket",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: reviews.length.toString(),
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.stars,
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.text,
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <section className="reviews-section">
        <div className="reviews-header">
          <h2>What Our Users Say</h2>
          <p>Trusted by ad ops and marketing teams worldwide</p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div
              className="review-card"
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="stars">{"★".repeat(review.stars)}</div>
              <p className="review-text">“{review.text}”</p>
              <p className="review-author">— {review.author}</p>
            </motion.div>
          ))}
        </div>

        {/* <div className="reviews-footer">
          <a
            href="https://www.google.com/search?q=tagrocket+google+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="review-button"
          >
            ★ See all reviews on Google
          </a>
        </div> */}
      </section>
    </>
  );
};

export default ReviewsSection;
