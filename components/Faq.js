import styles from "../app/tools/display-ads/DisplayAds.module.css";
export default function Faq({ title, list }) {
    return (
        <div className={styles.displayAdsFAQSection}>
            <h2 className={styles.displayAdsFAQHeader}>
                Frequently Asked Questions (FAQ)
            </h2>
            <div className={styles.displayAdsFAQCard}>
                <div>
                    <div className={styles.displayAdsFAQQuestion}>
                        {title}
                    </div>
                    <ol className={styles.displayAdsFAQList}>
                        {
                            list.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        }
                    </ol>
                </div>
            </div>
        </div>
    );
}