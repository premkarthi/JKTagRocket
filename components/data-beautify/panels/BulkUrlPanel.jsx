'use client';

import * as XLSX from 'xlsx';
import { useState, useRef } from 'react';
import '../../../styles/databeautifytools.css';
import { FiExternalLink, FiDownload, FiCopy, FiUpload, FiSmartphone, FiMaximize2 } from 'react-icons/fi';
import { useAutoDismissMessage, getIcon } from "../../../components/useMessages";

export default function BulkUrlPanel() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingRow, setLoadingRow] = useState(null);
  const [sortKey, setSortKey] = useState('sno');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [expandedColumns, setExpandedColumns] = useState(false);
  const [progress, setProgress] = useState(null);
  const [duplicateUrls, setDuplicateUrls] = useState([]);
  const [userMessage, setUserMessage] = useAutoDismissMessage(null, 5000);
  const fileInputRef = useRef(null);
  const ITEMS_PER_PAGE = 15;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleChange = (e) => setInput(e.target.value);

  const formatSize = (bytes) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };

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

    for (let index = 0; index < uniqueUrls.length; index++) {
      const url = uniqueUrls[index];
      setLoadingRow(index);
      setProgress(Math.round(((index + 1) / uniqueUrls.length) * 100));

      try {
        const response = await fetch(url, { method: 'HEAD' });
        const sizeInBytes = response.headers.get('content-length');
        const size = sizeInBytes ? formatSize(sizeInBytes) : 'Unknown';

        resultsWithDetails.push({
          sno: index + 1,
          url,
          status: response.ok ? '✅ Success' : '❌ Failed',
          size,
        });
      } catch {
        resultsWithDetails.push({
          sno: index + 1,
          url,
          status: '❌ Failed',
          size: 'Error',
        });
      }
      await delay(10);
    }

    setResults(resultsWithDetails);
    setLoadingRow(null);
    setProgress(null);
    setUserMessage({ type: 'success', text: `${resultsWithDetails.length} URL(s) validated successfully.` });
    window.gtag && window.gtag('event', 'validate_urls');
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const changePage = (newPage) => {
    setPage(newPage);
    const el = document.querySelector('.results-table');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopy = () => {
    const text = results.map(r => `${r.url}\t${r.status}\t${r.size}`).join('\n');
    navigator.clipboard.writeText(text);
    window.gtag && window.gtag('event', 'copy_results');
  };

  const handleExport = () => {
    const header = 'S.No,URL,Status,Size';
    const rows = results.map(r => `${r.sno},${r.url},${r.status},${r.size}`);
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bulk-url-results.csv';
    link.click();
    window.gtag && window.gtag('event', 'download_csv');
  };

  const handleOpenAll = () => {
    const urls = input.split('\n').map(url => url.trim()).filter(Boolean);
    let index = 0;
    const openNext = () => {
      if (index >= urls.length) return;
      window.open(urls[index], '_blank');
      index++;
      setTimeout(openNext, 1000);
    };
    openNext();
    window.gtag && window.gtag('event', 'open_all_urls');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    else {
        alert('Only .txt, .csv, or .xlsx files are supported.');
        setUserMessage({ type: 'error', text: 'Only .txt, .csv, or .xlsx files are supported.' });
    }

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();
    const isTextOrCsv = fileName.endsWith('.txt') || fileName.endsWith('.csv');
    const isXlsx = fileName.endsWith('.xlsx');

    reader.onload = (event) => {
      let urls = [];
      if (isTextOrCsv) {
        const text = event.target.result;
        const lines = text.split(/\r?\n/);
        urls = lines.map(line => line.trim()).filter(line => line.startsWith('http'));
      } else if (isXlsx) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        urls = jsonData.flat().filter(cell => typeof cell === 'string' && cell.trim().startsWith('http'));
      }
      setInput(prev => (prev ? prev + '\n' + urls.join('\n') : urls.join('\n')));
      window.gtag && window.gtag('event', 'browse_file_upload');
    };

    if (isTextOrCsv) reader.readAsText(file);
    else if (isXlsx) reader.readAsArrayBuffer(file);
    else alert('Only .txt, .csv, or .xlsx files are supported.');
  };

  const handleDragEnter = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    else {
        alert('Only .txt, .csv, or .xlsx files are supported.');
        setUserMessage({ type: 'error', text: 'Only .txt, .csv, or .xlsx files are supported.' });
    }

    handleFileSelect({ target: { files: [file] } });
    
  };

  const filteredResults = results.filter((item) => {
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

  const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
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
        <p>
        <button type="button" className="browse-button" onClick={() => fileInputRef.current?.click()}>Browse & Upload</button></p>
        <input ref={fileInputRef} type="file" accept=".txt,.csv,.xlsx" onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>

      <textarea className="panel-textarea" placeholder="Paste your URLs here (one per line)" value={input} onChange={handleChange} />

      <div className="button-group">
        <button onClick={handleValidateUrls}>✅ Validate All URLs</button>
        {/* <button onClick={handleOpenAll}>🔗 Open All URLs</button>
        <button disabled>❌ Close Tabs</button>
        <button disabled>✏️ Test URLs</button>
        <button disabled>📤 Load All Here</button> */}
        <button onClick={() => { setInput(''); setResults([]); setPage(1); setUserMessage({ type: 'info', text: 'Tool reset successfully.' }); window.gtag && window.gtag('event', 'reset_tool'); }}>🔄 Reset</button>
        {/* <button onClick={handleExport}><FiDownload /> Export</button>
        <button onClick={handleCopy}><FiCopy /> Copy</button> */}
    
      </div>
        {userMessage && (
            <div className={`user-message ${userMessage.type} user-message-show`}>
                <span>{getIcon(userMessage.type)} {userMessage.text}</span>
            </div>
        )}

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
              ⚠️ {duplicateUrls.length} duplicate URL(s) detected and ignored from validation.
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
                  <th onClick={() => handleSort('size')}>Size {sortKey === 'size' && (sortAsc ? '↑' : '↓')}</th>
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
                    <td className={item.status.includes('Success') ? 'success' : 'failed'}>
                      {loadingRow === i ? '⏳' : item.status}
                    </td>
                    <td>{item.size}</td>
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
    </div>
  );
}
