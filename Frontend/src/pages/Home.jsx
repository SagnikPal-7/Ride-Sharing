import React, { useRef, useState } from "react";
import logo from "../assets/logo.png";

import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRide, setConfirmRide] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const rideComfirm = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingfordriverRef = useRef(null);

  // const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "55%",
          opacity: 1,
          padding: 24,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          opacity: 0,
          padding: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRide) {
        gsap.to(rideComfirm.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(rideComfirm.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRide]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingfordriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingfordriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <div>
        <img className="w-16 absolute left-5 top-5" src={logo} alt="" />
      </div>

      <Link
        to="/profile"
        className="fixed right-3 top-3 h-9 w-9 bg-white flex items-center justify-center rounded-full z-50"
      >
        <i className="text-xl font-medium ri-user-3-fill"></i>
      </Link>

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>

      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white rounded-tl-3xl rounded-tr-3xl relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 top-6 right-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-3xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-13 w-1 top-[45%] left-10 bg-gray-800"></div>
            <div className="line absolute h-3 w-3 rounded-2xl top-[43%] left-9 bg-gray-800"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
              className="bg-[#dad6d6] px-12 py-2 text-base rounded-xl w-full mt-3"
              type="text"
              placeholder="Add a pick-up location"
            />
            <div className="line absolute h-3 w-3 top-[68%] left-8">
              <i className="ri-map-pin-fill text-xl text-gray-800"></i>
            </div>
            <input
              onClick={() => {
                setPanelOpen(true);
              }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
              className="bg-[#dad6d6] px-12 py-2 text-base rounded-xl w-full mt-5"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
        </div>

        <div
          ref={panelRef}
          className=" bg-white text-sm h-0 opacity-0 overflow-scroll"
        >
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <VehiclePanel
          setConfirmRide={setConfirmRide}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div
        ref={rideComfirm}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <ConfirmRide
          setConfirmRide={setConfirmRide}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-6 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>

      <div
        ref={waitingfordriverRef}
        className="fixed w-full z-10 bottom-0 translate-y-full  px-3 py-6 rounded-tl-3xl rounded-tr-3xl bg-white"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
