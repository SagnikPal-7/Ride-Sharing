import React, { useState } from "react";
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
    <div className="h-screen relative">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img className="w-16 absolute left-3 top-2" src={uberdriver} alt="" />
        <Link
          to="/captain-home"
          className="fixed top-3 right-4 h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-home-4-fill"></i>
        </Link>
      </div>

      <div className="h-4/5">
      <LiveTracking/>

      </div>

      <div
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-500"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <h5 className="p-1 text-center w-[90%] absolute top-0">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <div className="flex">
          <div className="w-2/3">
            <i className="text-base text-black ri-map-pin-fill "></i>
            <h4 className="text-[12px] font-semibold">{rideDate?.destination}</h4>
          </div>

          <div className="w-1/3 mt-6 mr-4 h-15 flex">
            <button className="bg-green-700 text-white text-xs font-base p-3 px-10 rounded-xl">
              Complete Ride
            </button>
          </div>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-3 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <FinishRide ride={rideDate} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
