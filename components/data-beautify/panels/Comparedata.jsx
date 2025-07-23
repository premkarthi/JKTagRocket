"use client";
import React, { useRef, useState, useEffect } from "react";
import "../../../styles/Comparedata.css";
import "../../../styles/Usemessages.css";
import { useAutoDismissMessage, UserMessage } from "../../Usemessages";

export default function ComparePanel() {
  const [primaryText, setPrimaryText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(true);
  const [differences, setDifferences] = useState([]);
  const [message, setMessage] = useAutoDismissMessage(null, 5000);
  const resultRef = useRef(null); // ⬅️ Ref to scroll
  const [triggerCompareAfterSample, setTriggerCompareAfterSample] = useState(false);


  const highlightDiffChars = (source, compareTo) => {
    const maxLen = Math.max(source.length, compareTo.length);
    let result = "";
    for (let i = 0; i < maxLen; i++) {
      const a = source[i] || "";
      const b = compareTo[i] || "";
      result += a !== b ? `<span class="diff-char">${a || " "}</span>` : a;
    }
    return result;
  };

  const handleCompare = () => {
    setDifferences([]);
    if (!primaryText.trim() || !secondaryText.trim()) {
      setMessage({ type: "warning", text: "Please enter both Primary and Secondary inputs." });
      return;
    }

    const normalizeText = (text) =>
      text
        .split("\n")
        .map(line => line.replace(/\s+/g, " ").trim()) // normalize spaces
        .filter(line => line.length > 0); // remove empty lines

    const primaryLines = normalizeText(primaryText);
    const secondaryLines = normalizeText(secondaryText);

    const maxLength = Math.max(primaryLines.length, secondaryLines.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
      const a = primaryLines[i] || "";
      const b = secondaryLines[i] || "";
      if (a !== b) {
        const diffPrimary = highlightDiffChars(a, b);
        const diffSecondary = highlightDiffChars(b, a);
        result.push({ line: i + 1, primary: diffPrimary, secondary: diffSecondary });
      }
    }

    if (result.length === 0) {
      setMessage({ type: "success", text: " Both Primary and Secondary inputs are identical." });
    } else {
      setDifferences(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      setMessage({ type: "error", text: ` Found ${result.length} difference(s).` });
    }
  };

  const handleReset = () => {
    setPrimaryText("");
    setSecondaryText("");
    setDifferences([]);
    setMessage({ type: "info", text: " All Inputs and results are cleared." });
  };

  // ⬇️ Auto-scroll to table when differences appear
  useEffect(() => {
    if (differences.length > 0 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [differences]);

    const loadExampleData = () => {
      setMessage({ type: "success", text: "📦 Sample data loaded. Comparison results will appear shortly..." });

      setPrimaryText(`Name, Age, City
    Alice, 25, New York
    Bob, 30, Los Angeles
    Charlie, 22, Chicago`);

      setSecondaryText(`Name, Age, City
    Alice, 25, New York
    Bob, 31, Los Angeles
    Charlie, 22, Boston`);

      // Set flag after state update
      setTriggerCompareAfterSample(true);
    };
    useEffect(() => {
    if (triggerCompareAfterSample) {
      const timeout = setTimeout(() => {
        handleCompare();
        setTriggerCompareAfterSample(false); // reset the flag
      }, 2000);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [triggerCompareAfterSample]);



  return (
    <div className="dataBeautifyPanel">
      <div className="dataBeautifyPanelTitle">
        <span className="dataBeautifyPanelTitleIcon">
          <img src="/images/comparedata.png" alt="Data Icon" width="33" height="33" />
          </span> Compare Data :
      </div>

      <textarea
        className="dataBeautifyTextarea"
        placeholder="Paste your primary data ....!!!"
        rows={7}
        value={primaryText}
        onChange={(e) => setPrimaryText(e.target.value)}
      />
      <textarea
        className="dataBeautifyTextarea"
        placeholder="Paste your secondary data ....!!!"
        rows={7}
        value={secondaryText}
        onChange={(e) => setSecondaryText(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button className="compare-reset-btn" onClick={handleReset}>🔄 Reset</button>
        <button className="compare-action-btn" onClick={loadExampleData}>📦 Sample Data</button>
        <button className="compare-action-btn" onClick={handleCompare}>🔁 Compare Data</button>
      </div>

      {/* ✅ UserMessage */}
      <UserMessage message={message} setMessage={setMessage} />

      {/* ✅ Toggle */}
      {differences.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
            <input
              type="checkbox"
              id="toggleDifferences"
              checked={showOnlyDifferences}
              onChange={(e) => setShowOnlyDifferences(e.target.checked)}
            />
            <label htmlFor="toggleDifferences">Show Only Differences</label>
          </div>

          <div ref={resultRef} className="compare-results" >
            <h3>🔍 Differences</h3>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Primary</th>
                  <th>Secondary</th>
                  <th>Copy</th> {/* ✅ NEW column */}
                </tr>
              </thead>
              <tbody>
              {Array.from(
                { length: Math.max(primaryText.trim().split("\n").length, secondaryText.trim().split("\n").length) },
                (_, i) => {
                  const a = primaryText.trim().split("\n")[i] || "";
                  const b = secondaryText.trim().split("\n")[i] || "";
                  const isDiff = a !== b;
                  if (showOnlyDifferences && !isDiff) return null;

                  const copyToClipboard = () => {
                    const plainA = a.replace(/<[^>]+>/g, "");
                    const plainB = b.replace(/<[^>]+>/g, "");
                    navigator.clipboard.writeText(`Line ${i + 1}:\nPrimary: ${plainA}\nSecondary: ${plainB}`);
                  };

                  return (
                    <tr key={i} className={!isDiff ? "faded-row" : ""}>
                      <td>{i + 1}</td>
                      <td dangerouslySetInnerHTML={{ __html: isDiff ? highlightDiffChars(a, b) : a }} />
                      <td dangerouslySetInnerHTML={{ __html: isDiff ? highlightDiffChars(b, a) : b }} />
                      <td>
                        <button onClick={copyToClipboard} title="Copy this row">📋</button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>

            </table>
          </div>
        </>
      )}
    </div>
  );
}
