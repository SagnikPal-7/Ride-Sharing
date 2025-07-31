import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LocationSearchPanel = (props) => {
  const panelRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Show suggestions when there are suggestions available
  const shouldShowSuggestions = Array.isArray(props.suggestions) && props.suggestions.length > 0;

  // Debug logging
  useEffect(() => {
    console.log("LocationSearchPanel props:", {
      suggestions: props.suggestions,
      suggestionsLength: props.suggestions?.length,
      shouldShowSuggestions,
      pickup: props.pickup,
      destination: props.destination
    });
  }, [props.suggestions, shouldShowSuggestions, props.pickup, props.destination]);

  useGSAP(() => {
    if (shouldShowSuggestions) {
      // Smooth panel entrance animation
      gsap.fromTo(panelRef.current, 
        { 
          opacity: 0, 
          y: -30,
          scale: 0.9,
          rotationX: -15,
          transformOrigin: "top center"
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );

      // Staggered animation for suggestion items
      if (suggestionsRef.current) {
        const items = suggestionsRef.current.children;
        gsap.fromTo(items,
          {
            opacity: 0,
            x: -20,
            scale: 0.95
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2
          }
        );
      }
    } else {
      // Smooth exit animation
      gsap.to(panelRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [shouldShowSuggestions, props.suggestions]);

  if (!shouldShowSuggestions) {
    return null;
  }

  return (
    <div 
      ref={panelRef}
      className="max-h-48 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 transform-gpu backdrop-blur-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)'
      }}
    >
      {Array.isArray(props.suggestions) && props.suggestions.length > 0 ? (
        <div ref={suggestionsRef}>
          {props.suggestions.map((suggestion, idx) => (
            <div
              key={suggestion.place_id || idx}
              onClick={() => {
                if (props.onSuggestionClick) props.onSuggestionClick(suggestion);
              }}
              className="group flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer last:border-b-0 transform hover:scale-[1.02] hover:shadow-md"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 transform group-hover:scale-110">
                  <i className="ri-map-pin-2-fill text-blue-600 text-sm group-hover:text-blue-700 transition-colors duration-300"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm leading-tight group-hover:text-gray-800 transition-colors duration-300">
                  {suggestion.structured_formatting?.main_text || suggestion.description.split(',')[0]}
                </h4>
                {suggestion.structured_formatting?.secondary_text && (
                  <p className="text-xs text-gray-500 mt-1 leading-tight group-hover:text-gray-600 transition-colors duration-300">
                    {suggestion.structured_formatting.secondary_text}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <i className="ri-arrow-right-s-line text-gray-400 transition-all duration-300 group-hover:text-blue-500 group-hover:translate-x-1 transform"></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <i className="ri-search-line text-gray-400 text-lg"></i>
          </div>
          <p className="text-gray-500 text-sm">No suggestions found</p>
          <p className="text-gray-400 text-xs mt-1">Try typing a different location</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearchPanel;
