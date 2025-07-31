import React, { useState } from "react";
import axios from "axios";
import uberdriver from "../assets/uberdriver.png";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);

  const finishRidePanelRef = useRef(null);

  const location = useLocation();
  const rideDate = location.state?.ride;

  // Function to truncate destination text to first few words
  const truncateDestination = (text) => {
    if (!text) return "";
    const words = text.split(' ');
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(' ') + '...';
  };

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Map Section - Absolute Full Coverage */}
      <div className="absolute inset-0 w-full h-full">
        <LiveTracking />
      </div>

      {/* Ride Control Panel - Minimal Floating Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-20">
        <div className="p-2">
          {/* Swipe Indicator */}
          <div className="flex justify-center mb-1">
            <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Ride Info and Complete Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-map-pin-fill text-blue-600 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Destination</p>
                  <p className="text-xs font-medium text-gray-900">{truncateDestination(rideDate?.destination)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-currency-line text-green-600 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Fare</p>
                  <p className="text-xs font-semibold text-gray-900">₹{rideDate?.fare}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFinishRidePanel(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-xl transition-colors duration-200 flex items-center gap-1 shadow-lg text-xs"
              >
                <i className="ri-check-line text-xs"></i>
                Complete Ride
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-30 bottom-0 translate-y-full px-3 py-3 rounded-t-3xl bg-white shadow-2xl"
      >
        <FinishRide ride={rideDate} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
