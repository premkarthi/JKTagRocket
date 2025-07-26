import React, { useState } from "react";
import "../../../styles/Datamanipulation.css";
import "../../../styles/Usemessages.css";
import { useAutoDismissMessage, UserMessage } from "../../Usemessages";
import "../../../styles/Customtooltip.css";
import "../../../styles/TooltipcopyButton.css";
import "../../../styles/TooltipOpenNewTabButton.css";
import Customtooltip from "components/Customtooltip";
import TooltipcopyButton from "components/TooltipcopyButton"; 
export default function ManipulatePanel() {
  const [result, setResult] = useState([]);
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [message, setMessage] = useAutoDismissMessage();
  const [selectedDelimiter, setSelectedDelimiter] = useState("comma");
  const [customDelimiter, setCustomDelimiter] = useState("");
  const [leftDelimiter, setLeftDelimiter] = useState("\n");
  const [rightDelimiter, setRightDelimiter] = useState(",");
  const showMessage = (type, text) => setMessage({ type, text });
  const clearMessage = () => setMessage(null);
  const resolveDelimiter = (value) => {
    switch (value) {
      case "_newline_":
        return "\n";
      case "_pipeline_":
        return "|";
      default:
        return value;
    }
  };
  const handleReset = () => {
    setLeftText("");
    setRightText("");
    setResult([]);
    showMessage("info", "Inputs and Output cleared successfully");
  };
  const handleCopy = (text) => {
    if (!text.trim()) {
      showMessage("warning", "Nothing to copy!");
      return;
    }
    navigator.clipboard.writeText(text);
    showMessage("success", "Copied to clipboard");
  };
  const handleUnique = () => {
    const unique = [...new Set(leftText.split("\n"))].join("\n");
    setLeftText(unique);
    showMessage("success", "Removed duplicate lines");
  };
  const handleConvertLeftToRight = () => {
    if (!leftText.trim()) {
      showMessage("error", "Left input is empty");
      return;
    }
    const lines = leftText
      .split(resolveDelimiter(leftDelimiter))
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      showMessage("error", "No valid lines to convert");
      return;
    }
    const delimiter = resolveDelimiter(rightDelimiter);
    const result = lines.join(delimiter);
    setRightText(result);

    showMessage("success", "Converted Left ➔ Right successfully!");
  };
  const handleConvertRightToLeft = () => {
    if (!rightText.trim()) {
      showMessage("error", "Right input is empty");
      return;
    }
    const parts = rightText
      .split(resolveDelimiter(rightDelimiter))
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length === 0) {
      showMessage("error", "No valid parts to convert");
      return;
    }
    const delimiter = resolveDelimiter(leftDelimiter);
    const result = parts.join(delimiter);
    setLeftText(result);
    showMessage("success", "Converted Right ➔ Left successfully!");
  };
  const handleRemoveSingleQuotes = () => {
    setLeftText(leftText.replace(/'/g, ""));
    setRightText(rightText.replace(/'/g, ""));
    showMessage("success", "Removed single quotes from both inputs.");
  };
  const handleRemoveDoubleQuotes = () => {
    setLeftText(leftText.replace(/"/g, ""));
    setRightText(rightText.replace(/"/g, ""));
    showMessage("success", "Removed double quotes from both inputs.");
  };
  return (
    <>
      {message && (
        <div className="message-wrapper">
          <UserMessage message={message} setMessage={clearMessage} />
        </div>
      )}
      <div className="manipulate-panel-wrapper">
          <div className="panel-section">
            <label>Left Side Text</label>
            <div className="textarea-with-copy">
              <textarea
                className="datamanipulationpanel-textarea"
                placeholder="Enter left-side text here..."
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
              />
              <div className="copy-button-wrapper">
                <Customtooltip text="Copy left-side data" variant="copy">
                  <TooltipcopyButton value={leftText} />
                  
                </Customtooltip>
              </div>
            </div>
          </div>
        <div className="panel-controls">
          <div className="target-group">
            <label>Left Input Delimiter:</label>
            <div className="delimiter-select">
              <select value={leftDelimiter} onChange={(e) => setLeftDelimiter(e.target.value)}>
                <option value="">Empty ( )</option>
                <option value="_newline_">New Line ( \n )</option>
                <option value=",">Comma ( , )</option>
                <option value="-">Hyphen ( - )</option>
                <option value="_">UnderScore ( _ )</option>
                <option value=";">Semi Colon ( ; )</option>
                <option value="_pipeline_">Pipeline ( | )</option>
              </select>
            </div>
          </div>
            <div className="action-buttons">
              <div style={{ display: "flex", gap: "8px" }}>
                <Customtooltip text="Convert Left to Right" variant="animated">
                  <button className="btn-action" onClick={handleConvertLeftToRight} style={{ unicodeBidi: "plaintext", direction: "ltr" }}>
                    Left to Right ▶
                  </button>
                </Customtooltip>
                <Customtooltip text="Convert Right to Left" variant="animated"><button className="btn-action reverse" onClick={handleConvertRightToLeft} style={{ unicodeBidi: "plaintext", direction: "ltr" }}>
                    Right to Left ◀
                  </button>
                </Customtooltip>
              </div>
            </div>
          <div className="target-group">
            <label>Right Input Delimiter:</label>
            <div className="delimiter-select">
              <select value={rightDelimiter} onChange={(e) => setRightDelimiter(e.target.value)}>
                <option value="">Empty ( )</option>
                <option value="_newline_">New Line ( \n )</option>
                <option value=",">Comma ( , )</option>
                <option value="-">Hyphen ( - )</option>
                <option value="_">UnderScore ( _ )</option>
                <option value=";">Semi Colon ( ; )</option>
                <option value="_pipeline_">Pipeline ( | )</option>
              </select>
            </div>
          </div>
          <div>
            <Customtooltip text="Remove unitque values" variant="animated"><button className="btn-utility" onClick={handleUnique}>✘ Unique</button> </Customtooltip>
            <Customtooltip text="Remove single quotes" variant="animated"><button className="btn-utility" onClick={handleRemoveSingleQuotes}>✘ Remove '</button> </Customtooltip>
            <Customtooltip text="Remove double quotes" variant="animated"><button className="btn-utility" onClick={handleRemoveDoubleQuotes}>✘ Remove "</button> </Customtooltip>
          </div>
            <div className="button-container">
              <Customtooltip text="Rest the all fields" variant="animated">
                <button className="btn-reset" onClick={handleReset}>🔄 Reset</button>
              </Customtooltip>
            </div>

        </div>
        <div className="panel-section">
          <label>Right Side Text</label>
          <div className="textarea-with-copy">
            <textarea
              className="datamanipulationpanel-textarea"
              placeholder="Enter right-side text here..."
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
            />
            <div className="copy-button-wrapper">
              <Customtooltip text="Copy right-side data" variant="copy">
                <TooltipcopyButton value={rightText} />
              </Customtooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}