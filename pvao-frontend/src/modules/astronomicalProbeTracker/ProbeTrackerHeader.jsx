/**
 * Top navigation and control bar for the Probe Tracker.
 * Handles celestial target selection (Earth, Moon, Mars, Sun) and probe search.
 * Props: currentTarget, onSelectTarget, searchQuery, onSearchChange, etc.
 */
import React from "react";

export const ProbeTrackerHeader = ({
    currentTarget,
    onSelectTarget,
    searchQuery,
    onSearchChange,
    searchResults,
    onSelectSearchResult,
}) => {
    const targets = ["earth", "moon", "mars", "sun"];

    return (
        <div className="apt-header-container">
            <div className="apt-title-group">
                <h2 className="apt-title">Astronomical Probe Tracker</h2>
                <span className="apt-subtitle">Live NASA Horizons Telemetry</span>
            </div>

            <div className="apt-controls">
                <div className="apt-search-wrapper">
                    <input
                        type="text"
                        className="apt-search-input"
                        placeholder="Search probes..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />

                    {searchQuery && searchResults && searchResults.length > 0 && (
                        <div className="apt-search-dropdown">
                            {searchResults.map((probe) => (
                                <div
                                    key={probe.id}
                                    className="apt-dropdown-item"
                                    onClick={() => onSelectSearchResult(probe)}
                                >
                                    <span className="apt-item-name">{probe.name}</span>
                                    <span className="apt-item-id">#{probe.id}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="apt-target-tabs">
                    {targets.map((tgt) => (
                        <button
                            key={tgt}
                            className={`apt-tab-btn ${currentTarget === tgt ? "apt-tab-active" : ""
                                }`}
                            onClick={() => onSelectTarget(tgt)}
                        >
                            {tgt.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};