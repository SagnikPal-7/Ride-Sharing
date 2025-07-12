import React, { useState } from "react";
import uberdriver from "../assets/uberdriver.png";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import FinishRide from "../components/FinishRide";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);

  const finishRidePanelRef = useRef(null);

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
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
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
        <h4 className="text-xl font-semibold">4 Km away</h4>
        <button className="bg-green-700 text-white font-semibold p-3 px-10 rounded-xl">
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-3 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
