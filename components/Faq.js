import "@styles/DisplayAds.css";

export default function Faq({ title, list }) {
  return (
    <div className="displayAdsFAQSection">
      <h2 className="displayAdsFAQHeader">
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="displayAdsFAQCard">
        <div>
          <div className="displayAdsFAQQuestion">{title}</div>
          <ol className="displayAdsFAQList">
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
