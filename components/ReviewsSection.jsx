import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/ReviewsSection.css";

// ✅ SVG icons
const LeftArrow = () => (
  <svg viewBox="0 0 20 20">
    <path d="M13 15l-5-5 5-5v10z" />
  </svg>
);

const RightArrow = () => (
  <svg viewBox="0 0 20 20">
    <path d="M7 5l5 5-5 5V5z" />
  </svg>
);

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const swiperRef = useRef(null);

  const headings = [
    "Trusted by Leading Ad Tech Professionals",
    "Validated by Experts Across the Globe",
    "Join Thousands of Happy Users",
    "Real Feedback from Real Professionals",
  ];
  const [headline, setHeadline] = useState(headings[0]);

  useEffect(() => {
    fetch("/data/reviews.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Failed to load reviews:", err));
  }, []);

  useEffect(() => {
    const section = document.querySelector(".reviewsSection");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % headings.length;
      setHeadline(headings[i]);
    }, 31000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="reviewsSection">
      <h2 className="heading">{headline}</h2>

      {reviews.length > 0 ? (
        <div className="slider">
          <button
            className="custom-arrow left"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <LeftArrow />
          </button>

          <button
            className="custom-arrow right"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <RightArrow />
          </button>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 11000 }}
            loop
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {reviews.map((review, index) => {
              const name = review.name || review.author || "Anonymous";
              const text = review.review || review.text || "";
              const rating = review.rating || review.stars || 5;
              const profilePic =
                review.profilePic || "/images/default-avatar.jpg";

              return (
                <SwiperSlide key={index}>
                  <div className="review-card">
                    <div className="profile">
                      <img
                        src={profilePic}
                        alt={`${name}'s profile`}
                        className="avatar"
                        width={48}
                        height={48}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-avatar.jpg";
                        }}
                      />
                      <h4 className="name">{name}</h4>
                    </div>
                    <ReadMore text={text} limit={180} />
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < rating ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <p>Loading reviews...</p>
      )}
    </section>
  );
}

// Your ReadMore remains unchanged
function ReadMore({ text, limit = 180 }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > limit;
  const preview = isLong ? text.slice(0, limit) + "..." : text;

  return (
    <p className="quote">
      “{expanded || !isLong ? text : preview}”
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} className="readMoreBtn">
          {expanded ? " Read less" : " Read more"}
        </button>
      )}
    </p>
  );
}
