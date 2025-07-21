'use client';

import * as XLSX from 'xlsx';
import { useState, useRef } from 'react';
import '../../../styles/databeautifytools.css';
import { FiExternalLink, FiDownload, FiCopy, FiUpload, FiSmartphone, FiMaximize2 } from 'react-icons/fi';
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";
import MediaModal from './MediaModal';

export default function BulkUrlPanel() {
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingRow, setLoadingRow] = useState(null);
  const [sortKey, setSortKey] = useState('sno');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [expandedColumns, setExpandedColumns] = useState(false);
  const [progress, setProgress] = useState(null);
  const [duplicateUrls, setDuplicateUrls] = useState([]);
  const [userMessage, setUserMessage] = useAutoDismissMessage(null, 5000);
  const [mediaList, setMediaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedMedia, setExpandedMedia] = useState(null);
  const fileInputRef = useRef(null);
  const ITEMS_PER_PAGE = 15;

  const handleChange = (e) => setInput(e.target.value);

  const formatSize = (bytes) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

  const validateImageUrl = (url) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ok: true });
    img.onerror = () => resolve({ ok: false });
    img.src = url;
  });

  const handleValidateUrls = async () => {
    setResults([]);
    setPage(1);
    setProgress(1);

    if (!input.trim()) {
      setUserMessage({ type: 'warning', text: 'Please enter at least one URL before validating.' });
      setProgress(null);
      return;
    }

    const rawUrls = input.split('\n').map(url => url.trim()).filter(Boolean);
    const malformedUrls = rawUrls.filter(url => !/^https?:\/\/.+\..+/.test(url));
    if (malformedUrls.length > 0) {
      setUserMessage({ type: 'error', text: `${malformedUrls.length} invalid URL(s) were skipped.` });
    }

    const filteredUrls = rawUrls.filter(url => /^https?:\/\/.+\..+/.test(url));
    const urlCount = {};
    rawUrls.forEach(url => { urlCount[url] = (urlCount[url] || 0) + 1; });
    const duplicates = Object.keys(urlCount).filter(url => urlCount[url] > 1);
    setDuplicateUrls(duplicates);
    if (duplicates.length > 0) {
      setUserMessage({ type: 'warning', text: `${duplicates.length} duplicate URL(s) detected and skipped.` });
    }

    window.gtag && window.gtag('event', 'detected_duplicates', { count: duplicates.length });

    const uniqueUrls = [...new Set(filteredUrls)];
    const resultsWithDetails = [];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (let index = 0; index < uniqueUrls.length; index++) {
      const url = uniqueUrls[index];
      setLoadingRow(index);
      setProgress(Math.round(((index + 1) / uniqueUrls.length) * 100));

      let status = '❌ Failed';
      let size = 'Unknown';

      try {
        let response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) response = await fetch(url);

        const sizeInBytes = response.headers.get('content-length');
        size = sizeInBytes ? formatSize(parseInt(sizeInBytes)) : 'Unknown';
        status = response.ok ? '✅ Success' : '❌ Failed';
      } catch {
        const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(url);
        if (isImage) {
          const result = await validateImageUrl(url);
          if (result.ok) {
            status = '✅ Success';
            size = 'Unknown';
          }
        } else {
          status = '❌ Failed';
          size = 'Error';
        }
      }

      resultsWithDetails.push({
        sno: index + 1,
        url,
        status,
        size,
      });

      await delay(10);
    }

    setResults(resultsWithDetails);
    setLoadingRow(null);
    setProgress(null);
    setUserMessage({ type: 'success', text: `${resultsWithDetails.length} URL(s) validated successfully.` });
    window.gtag && window.gtag('event', 'validate_urls');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processUploadedFile(file);
  };

  const processUploadedFile = (file) => {
    const allowedExtensions = /\.(txt|csv|xlsx)$/i;
    if (!allowedExtensions.test(file.name)) {
      setUploadedFileName('');
      setUserMessage({ type: 'error', text: `❌ Unsupported file type: ${file.name}` });
      return;
    }

    setUploadedFileName(file.name);
    setUserMessage({ type: 'success', text: `✅ File uploaded: ${file.name}` });

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const handleDragEnter = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processUploadedFile(file);
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const changePage = (newPage) => {
    setPage(newPage);
    const el = document.querySelector('.results-table');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadAllMedia = () => {
    const urls = input.split('\n').map((url) => url.trim()).filter(Boolean);
    const mediaUrls = urls.filter((url) =>
      /\.(jpe?g|png|gif|webp|svg|mp4|webm|mov)$/i.test(url)
    );
    if (mediaUrls.length === 0) {
      setUserMessage({ type: 'warning', text: 'Please enter at least one valid media URL.' });
      return;
    }
    setMediaList(mediaUrls);
    setShowModal(true);
  };

  const filteredResults = results.filter(item => {
    if (filter === 'success') return item.status.includes('Success');
    if (filter === 'failed') return item.status.includes('Failed');
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortAsc ? valA - valB : valB - valA;
  });

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE);
  const paginatedResults = sortedResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const successCount = results.filter(r => r.status.includes('Success')).length;
  const failedCount = results.filter(r => r.status.includes('Failed')).length;

  return (
    <div className={`bulk-url-panel ${mobileView ? 'mobile-preview' : ''} ${expandedColumns ? 'expand-columns' : ''}`}>
      <h1 className="panel-title">🔗 Bulk URL Enhancer</h1>

      <div className="view-toggles">
        <button onClick={() => setMobileView(prev => !prev)}><FiSmartphone /> {mobileView ? '🖥️ Desktop View' : '📱 Mobile Preview'}</button>
        <button onClick={() => setExpandedColumns(prev => !prev)}><FiMaximize2 /> {expandedColumns ? '🔻 Shrink Columns' : '🔺 Expand Columns'}</button>
      </div>

      <div className={`upload-box ${dragActive ? 'active' : ''}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
        <FiUpload size={32} className="upload-icon" />
        <p>Drag & Drop .txt, .csv or .xlsx file</p>
        <span>Or</span>
        <p><button type="button" className="browse-button" onClick={() => fileInputRef.current?.click()}>Browse & Upload</button></p>
        <input ref={fileInputRef} type="file" accept=".txt,.csv,.xlsx" onChange={handleFileSelect} style={{ display: 'none' }} />
        {userMessage && (
        <div className={`user-message ${userMessage.type}`}>
            {userMessage.text}
        </div>
        )}

        {uploadedFileName && (
              <div style={{ marginTop: 11, fontSize: 15, color: '#909' }}>File Name : 📁 <strong>{uploadedFileName}</strong></div>
            )}
      </div>

      <textarea className="panel-textarea" placeholder="Paste your URLs here (one per line)" value={input} onChange={handleChange} />

      <div className="button-group">
            <button onClick={() => {
            setInput('');
            setResults([]);
            setPage(1);
            setUploadedFileName(''); // 🔄 Clear uploaded file name
            setUserMessage({ type: 'info', text: 'Tool reset successfully.' });
            window.gtag && window.gtag('event', 'reset_tool');
            }}>
            🔄 Reset
            </button>

            <button onClick={handleValidateUrls}>🌐 Fetch Status</button>
            <button onClick={handleLoadAllMedia}>🎞️ View All Thumbnails</button>
      </div>

      {userMessage && <div className={`user-message ${userMessage.type} user-message-show`}><span>{getIcon(userMessage.type)} {userMessage.text}</span></div>}

      {(results.length > 0 || progress !== null) && (
        <div className="results-container">
          <div className="radio-pagination-row">
            <div className="radio-filters">
              <label><input type="radio" checked={filter === 'all'} onChange={() => setFilter('all')} /> All ({results.length})</label>
              <label><input type="radio" checked={filter === 'success'} onChange={() => setFilter('success')} /> Success ({successCount})</label>
              <label><input type="radio" checked={filter === 'failed'} onChange={() => setFilter('failed')} /> Failed ({failedCount})</label>
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => changePage(page - 1)}>⬅️ Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>Next ➡️</button>
              </div>
            )}
          </div>

          {duplicateUrls.length > 0 && (
            <div className="warning-duplicates">
              ⚠️ {duplicateUrls.length} duplicate URL(s) detected and ignored during validation process .
            </div>
          )}

          {progress !== null && (
            <div className="progress-bar-wrapper">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
              <div className="progress-label">{progress}%</div>
            </div>
          )}

          <div className={`results-table-wrapper ${expandedColumns ? 'expanded' : ''} ${mobileView ? 'mobile-preview' : ''}`}>
            <table className="results-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('sno')}>S.No {sortKey === 'sno' && (sortAsc ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('url')}>Source URL’s {sortKey === 'url' && (sortAsc ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('status')}>Status {sortKey === 'status' && (sortAsc ? '↑' : '↓')}</th>
                  {/* <th onClick={() => handleSort('size')}>Size {sortKey === 'size' && (sortAsc ? '↑' : '↓')}</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((item, i) => (
                  <tr key={i}>
                    <td>{startIndex + i + 1}</td>
                    <td className={`url-cell ${expandedColumns ? 'expanded' : ''} ${duplicateUrls.includes(item.url) ? 'duplicate' : ''}`}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                    </td>
                    <td className={item.status.includes('Success') ? 'success' : 'failed'}>{loadingRow === i ? '⏳' : item.status}</td>
                    {/* <td>{item.size}</td> */}
                    <td><a href={item.url} target="_blank" rel="noopener noreferrer"><FiExternalLink /></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination bottom">
              <button disabled={page === 1} onClick={() => changePage(page - 1)}>⬅️ Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>Next ➡️</button>
            </div>
          )}
        </div>
      )}
      <MediaModal
        mediaList={mediaList}
        showModal={showModal}
        setShowModal={setShowModal}
        setExpandedMedia={setExpandedMedia}
        isMobilePreview={isMobilePreview} 
      />
      {expandedMedia && (
       <div className="media-zoom-overlay" onClick={() => setExpandedMedia(null)}>
        <div className="zoomed-media" onClick={(e) => e.stopPropagation()}>
            {expandedMedia.type === 'image' ? (
            <img src={expandedMedia.url} alt="Zoomed Media" />
            ) : (
            <video src={expandedMedia.url} controls autoPlay />
            )}
            <button className="zoom-close" onClick={() => setExpandedMedia(null)}>X Close</button>
        </div>
        </div>

        )}

    </div>
  );
}
