"use client";

import * as XLSX from 'xlsx';
import { useState, useRef } from 'react';
import '../../../styles/Bulkurlvalidation.css';
import "../../../styles/Usemessages.css";
import "../../../styles/Customtooltip.css";
import "../../../styles/TooltipcopyButton.css";
import "../../../styles/TooltipOpenNewTabButton.css";
import Customtooltip from "components/Customtooltip";
import TooltipcopyButton from "components/TooltipcopyButton"; 
import TooltipOpenNewTabButton from "components/TooltipOpenNewTabButton";
import { FiExternalLink, FiDownload, FiCopy, FiUpload, FiSmartphone, FiMaximize2 } from 'react-icons/fi';
import { useAutoDismissMessage, UserMessage } from "../../Usemessages";
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
  const [message, setMessage] = useAutoDismissMessage(null, 5000);
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
  const handleSort = (key) => {
  if (sortKey === key) {
    setSortAsc(!sortAsc); // toggle order if already sorting by this key
  } else {
    setSortKey(key); // sort by new key
    setSortAsc(true);
  }
};

  const handleValidateUrls = async () => {
    setResults([]);
    setPage(1);
    setProgress(1);

    if (!input.trim()) {
      setMessage({ type: 'warning', text: 'Please enter at least one URL before validating.' });
      setProgress(null);
      return;
    }

    const rawUrls = input.split('\n').map(url => url.trim()).filter(Boolean);
    const malformedUrls = rawUrls.filter(url => !/^https?:\/\/.+\..+/.test(url));
    if (malformedUrls.length > 0) {
      setMessage({ type: 'error', text: `${malformedUrls.length} invalid URL(s) were skipped.` });
    }

    const filteredUrls = rawUrls.filter(url => /^https?:\/\/.+\..+/.test(url));
    const urlCount = {};
    rawUrls.forEach(url => { urlCount[url] = (urlCount[url] || 0) + 1; });
    const duplicates = Object.keys(urlCount).filter(url => urlCount[url] > 1);
    setDuplicateUrls(duplicates);
    if (duplicates.length > 0) {
      setMessage({ type: 'warning', text: `${duplicates.length} duplicate URL(s) detected and skipped.` });
    }

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
    setMessage({ type: 'success', text: `${resultsWithDetails.length} URL(s) validated successfully.` });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processUploadedFile(file);
  };

  const processUploadedFile = (file) => {
    const allowedExtensions = /\.(txt|csv|xlsx)$/i;
    if (!allowedExtensions.test(file.name)) {
      setUploadedFileName('');
      setMessage({
        type: 'error',
        text: `Unsupported file type: ${file.name}. Please upload a .txt, .csv, or .xlsx file.`,
      });
      return;
    }

    setUploadedFileName(file.name);
    setMessage({
      type: 'success',
      text: `File uploaded: ${file.name} — supported file types: .txt, .csv, .xlsx`,
    });

    const normalizeUrls = (text) => {
      return text
        .split(/[\n,]+/)
        .map(line => line.trim())
        .filter(line => /^https?:\/\/.+\..+/.test(line))
        .join('\n');
    };

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      reader.onload = (e) => {
        const content = e.target.result;
        setInput(prev => (prev ? prev + '\n' : '') + normalizeUrls(content));
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx')) {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const urls = jsonData
          .flat()
          .filter(cell => typeof cell === 'string' && cell.trim().startsWith('http'))
          .map(cell => cell.trim());
        setInput(prev => (prev ? prev + '\n' : '') + urls.join('\n'));
      };
      reader.readAsArrayBuffer(file);
    }
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
      setMessage({ type: 'warning', text: 'Please enter at least one valid media URL.' });
      return;
    }
    setMediaList(mediaUrls);
    setShowModal(true);
  };

  const filteredResults = Array.isArray(results)
  ? results.map((item, index) => ({
      ...item,
      originalIndex: index + 1,
    }))
  : [];

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
      {/* <h1 className="panel-title">🔗 Bulk URL Enhancer</h1> */}
      <span className="base64PanelTitleIcon">
        <img src="/images/bulkurlvalidation.png" alt="Base64 Icon" width="33" height="33" />
       Bulk URL Validation </span>
      <div className="view-toggles">
        <button onClick={() => setMobileView(prev => !prev)}><FiSmartphone /> {mobileView ? '🖥️ Desktop View' : '📱 Mobile Preview'}</button>
        <button onClick={() => setExpandedColumns(prev => !prev)}><FiMaximize2 /> {expandedColumns ? '🔻 Shrink Columns' : '🔺 Expand Columns'}</button>
      </div>

      <div className="upload-box">
        <FiUpload size={32} className="upload-icon" />
        <p>Drag & Drop .txt, .csv or .xlsx file</p>
        <span>Or</span>
        <p>
          <button type="button" className="browse-button" onClick={() => fileInputRef.current?.click()}>
            Browse & Upload
          </button>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,.xlsx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="upload-filename">
          {uploadedFileName ? (
            <><b>File Name :</b> 📁 <strong>{uploadedFileName}</strong></>
          ) : (
            <span style={{ visibility: 'hidden' }}>File Name placeholder</span>
          )}
        </div>
      </div>

      <textarea
        className="urlpanel-textarea"
        placeholder="Paste your URLs here (one per line)"
        value={input}
        onChange={handleChange}
      />

      <div className="button-group">
        <button onClick={() => {
          setInput('');
          setResults([]);
          setPage(1);
          setUploadedFileName('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          setMessage({ type: 'info', text: 'All inputs cleared. Ready for a fresh start..!' });
        }}>
          🔄 Reset
        </button>
        <button onClick={handleValidateUrls}>🌐 Fetch Status</button>
        <button onClick={handleLoadAllMedia}>🎞️ View All Thumbnails</button>
      </div>
         
      {/* ✅ Show messages */}
      <UserMessage message={message} setMessage={setMessage} />


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
              ⚠️ {duplicateUrls.length} Duplicate URL(s) detected and ignored during validation process .
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
                    <th className="center-column sortable" onClick={() => handleSort('sno')}>
                      S.No
                      <span className={`sort-icon ${sortKey === 'sno' ? 'sort-active' : ''}`}>
                        {sortKey === 'sno' ? (sortAsc ? '▲' : '▼') : '▼'}
                      </span>
                    </th>

                    <th className="sortable" onClick={() => handleSort('url')}>
                      Source URLs
                      <span className={`sort-icon ${sortKey === 'url' ? 'sort-active' : ''}`}>
                        {sortKey === 'url' ? (sortAsc ? '▲' : '▼') : '▼'}
                      </span>
                    </th>

                    <th className="center-column sortable" onClick={() => handleSort('status')}>
                      Status
                      <span className={`sort-icon ${sortKey === 'status' ? 'sort-active' : ''}`}>
                        {sortKey === 'status' ? (sortAsc ? '▲' : '▼') : '▼'}
                      </span>
                    </th>
                    <th className="center-column">Action</th>
                  </tr>
                </thead>

                <tbody>
                {paginatedResults.map((item, i) => (
                  <tr key={i}>
                    <td className="center-column">{item.originalIndex}</td>
                    <td className={`url-cell ${expandedColumns ? 'expanded' : ''} ${duplicateUrls.includes(item.url) ? 'duplicate' : ''}`}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                    </td>
                    <td className={`center-column ${item.status.includes('Success') ? 'success' : 'failed'}`}>
                      {loadingRow === i ? '⏳' : item.status}
                    </td>
                    <td className="center-column">
                      <Customtooltip text="Open New Tab" variant="animated">
                        <TooltipOpenNewTabButton url={item.url} />
                      </Customtooltip>
                    </td>
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
