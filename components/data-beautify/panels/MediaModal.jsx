'use client';

import { useEffect, useState } from 'react';
const fallbackImage = "/fallback-image-1.png";
const fallbackVideo = "/fallback-video-1.png";

export default function MediaModal({ mediaList, showModal, setShowModal, setExpandedMedia, isMobilePreview }) {
  const [isThumbnail, setIsThumbnail] = useState(true);
  const [failedMedia, setFailedMedia] = useState([]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setShowModal]);

  if (!showModal) return null;

  return (
    <div className="media-modal-overlay" onClick={() => setShowModal(false)}>
      {/* <div className="media-modal-content full-screen" onClick={(e) => e.stopPropagation()}> */}
      <div className={`media-modal-content full-screen ${isMobilePreview ? 'mobile-preview' : ''}`} onClick={(e) => e.stopPropagation()}>
       <div className="modal-header sticky-top">
        <button className="toggle-view" onClick={() => setIsThumbnail(!isThumbnail)}>
            {isThumbnail ? '🔍 Full View' : '🔲 Thumbnail View'}
        </button>

        <span className="modal-info-text">
            📌 Click a thumbnail to expand it fullscreen...🖥️
        </span>

        <button className="modal-close" onClick={() => setShowModal(false)}>
            ✖ Close
        </button>
        </div>


        <div className={`media-scroll-container ${isThumbnail ? 'thumbnail-grid' : 'full-preview'}`}>
          {mediaList.map((url, i) => {
            const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(url);
            const isVideo = /\.(mp4|webm|mov)$/i.test(url);
            const hasFailed = failedMedia.includes(url);

            return (
              <div key={i} className={isThumbnail ? 'media-item' : 'full-media-wrapper'}>
  {hasFailed ? (
    <img
      src={isImage ? fallbackImage : fallbackVideo}
      alt="Fallback"
      className="media-box"
    />
  ) : isImage ? (
    <img
      src={url}
      alt={`media-${i}`}
      onError={() => setFailedMedia((prev) => [...prev, url])}
      className="full-media"
      onClick={() => setExpandedMedia({ type: 'image', url })}
    />
  ) : isVideo ? (
    <video
      controls
      className="full-media"
      onError={() => setFailedMedia((prev) => [...prev, url])}
      onClick={() => setExpandedMedia({ type: 'video', url })}
    >
      <source src={url} />
    </video>
  ) : (
    <div className="media-box error-box">❌ Unsupported format</div>
  )}
</div>

            );
          })}
        </div>
      </div>
    </div>
  );
}
