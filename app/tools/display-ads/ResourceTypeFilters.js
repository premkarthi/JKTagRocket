import { RESOURCE_TYPE_FILTERS } from "./utils";

export default function ResourceTypeFilters({ filterState, setFilterState }) {
    const handleToggle = (label) => {
        setFilterState({ ...filterState, [label]: !filterState[label] });
    };

    return (
        <div style={{ margin: "12px 0", display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {RESOURCE_TYPE_FILTERS.map(({ label }) => (
                <label key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                        type="checkbox"
                        checked={filterState[label] || false}
                        onChange={() => handleToggle(label)}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
}