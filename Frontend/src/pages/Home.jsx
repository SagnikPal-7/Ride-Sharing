import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import LiveTracking from "../components/LiveTracking";


const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRide, setConfirmRide] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null); // 'pickup' or 'destination'
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null); // New state for pickup coordinates
  const [destinationCoords, setDestinationCoords] = useState(null); // New state for destination coordinates

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const rideComfirm = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingfordriverRef = useRef(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    //console.log(user);

    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingForDriver(false);
    navigate("/riding", { state: { ride } });
  });

  // Fetch suggestions from backend
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await (
        await import("axios")
      ).default.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/maps/get-suggestions?input=${encodeURIComponent(input)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      let data = res.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  // Handle input change for pickup/destination
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "pickup") {
      setPickup(value);
    } else {
      setDestination(value);
    }
    setActiveField(field);
    setPanelOpen(true);
    if (value.length >= 3) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion.description);
      setPickupCoords(suggestion.location); // Assuming suggestion.location contains { lat, lng }
    } else if (activeField === "destination") {
      setDestination(suggestion.description);
      setDestinationCoords(suggestion.location); // Assuming suggestion.location contains { lat, lng }
    }
    setSuggestions([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "45%",
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
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.in",
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
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(rideComfirm.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.in",
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
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingfordriverRef.current, {
          transform: "translateY(-5%)",
          duration: 0.8,
          ease: "power2.out",
        });
      } else {
        gsap.to(waitingfordriverRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.in",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    if (!pickup || pickup.length < 3) {
      alert("Please enter a valid pick-up location (at least 3 characters).");
      return;
    }
    if (!destination || destination.length < 3) {
      alert("Please enter a valid destination (at least 3 characters).");
      return;
    }

    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data); // This should show { auto: ..., car: ..., moto: ... }
      setFare(response.data); // Optionally store it in state
    } catch (error) {
      console.error(error);
    }
  }

  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType: vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <div>
        <img className="w-16 absolute left-5 top-15 z-50" src={logo} alt="" />
      </div>

      <Link
        to="/profile"
        className="fixed right-3 top-15 h-9 w-9 bg-white flex items-center justify-center rounded-full z-50"
      >
        <i className="text-xl font-medium ri-user-3-fill"></i>
      </Link>

      <div className="h-screen w-screen">
        <LiveTracking
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />
      </div>

      <div className=" flex flex-col justify-end w-full absolute bottom-0">
        <div className="h-[37%] p-6 bg-white rounded-tl-3xl rounded-tr-3xl relative">
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
            <div className="line absolute h-13 w-1 top-[36%] left-10 bg-gray-800"></div>
            <div className="line absolute h-3 w-3 rounded-2xl top-[35%] left-9 bg-gray-800"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
                if (pickup.length >= 3) fetchSuggestions(pickup);
              }}
              value={pickup}
              onChange={(e) => handleInputChange(e, "pickup")}
              className="bg-[#dad6d6] px-12 py-2 text-base rounded-xl w-full mt-3"
              type="text"
              placeholder="Add a pick-up location"
            />
            <div className="line absolute h-3 w-3 top-[55%] left-8">
              <i className="ri-map-pin-fill text-xl text-gray-800"></i>
            </div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
                if (destination.length >= 3) fetchSuggestions(destination);
              }}
              value={destination}
              onChange={(e) => handleInputChange(e, "destination")}
              className="bg-[#dad6d6] px-12 py-2 text-base rounded-xl w-full mt-5"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-xl mt-4 w-full"
          >
            Find Trip
          </button>
        </div>

        <div
          ref={panelRef}
          className=" bg-white text-sm h-0 opacity-0 overflow-scroll"
        >
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      </div>

      {!panelOpen && (
        <>
          <div
            ref={vehiclePanelRef}
            style={{ willChange: "transform" }}
            className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-5 rounded-tl-3xl rounded-tr-3xl bg-white"
          >
            <VehiclePanel
              isActive={vehiclePanel}
              selectVehicle={setVehicleType}
              fare={fare}
              setConfirmRide={setConfirmRide}
              setVehiclePanel={setVehiclePanel}
            />
          </div>

          <div
            ref={rideComfirm}
            style={{ willChange: "transform" }}
            className="fixed w-full z-10 bottom-3 translate-y-full px-3 py-6 rounded-tl-3xl rounded-tr-3xl bg-white"
          >
            <ConfirmRide
              createRide={createRide}
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              setConfirmRide={setConfirmRide}
              setVehicleFound={setVehicleFound}
            />
          </div>

          <div
            ref={vehicleFoundRef}
            style={{ willChange: "transform" }}
            className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-4 rounded-tl-3xl rounded-tr-3xl bg-white"
          >
            <LookingForDriver
              createRide={createRide}
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicleType={vehicleType}
              setVehicleFound={setVehicleFound}
            />
          </div>

          <div
            ref={waitingfordriverRef}
            className="fixed w-full z-10 bottom-0 translate-y-full  px-3 py-2 rounded-tl-3xl rounded-tr-3xl bg-white"
          >
            <WaitingForDriver
              ride={ride}
              setWaitingForDriver={setWaitingForDriver}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
