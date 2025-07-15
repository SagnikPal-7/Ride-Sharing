import React from "react";

const LocationSearchPanel = (props) => {
  return (
    <div className="overflow-scroll">
      {Array.isArray(props.suggestions) && props.suggestions.length > 0 ? (
        props.suggestions.map((suggestion, idx) => (
          <div
            key={suggestion.place_id || idx}
            onClick={() => {
              if (props.onSuggestionClick) props.onSuggestionClick(suggestion);
            }}
            className="flex top-0 gap-3 border-2 p-3 mb-2 border-gray-50 active:border-black rounded-xl items-center justify-start cursor-pointer"
          >
            <h2 className="bg-[#d3d2d2] flex items-center justify-center h-7 w-12 rounded-full">
              <i className="ri-map-pin-2-fill"></i>
            </h2>
            <h4 className="font-medium">{suggestion.description}</h4>
          </div>
        ))
      ) : (
        <div className="text-gray-400 p-4 text-center">No suggestions found.</div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
