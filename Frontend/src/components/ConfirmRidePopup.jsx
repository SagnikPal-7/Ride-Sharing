import React, { useState } from "react";
import axios from "axios";
import userprofile from "../assets/userprofile.png";
import car2 from "../assets/Car2.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";
import { Link, useNavigate } from "react-router-dom";
// import profile from "../assets/profile.png";
// import car1 from "../assets/Car1.webp";

const ConfirmRidePopup = (props) => {
  const [otp, setOtp] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const navigate = useNavigate();

  // Function to get vehicle image based on vehicle type
  const getVehicleImage = (vehicleType) => {
    if (vehicleType === "auto") return auto;
    else if (vehicleType === "moto" || vehicleType === "motorcycle")
      return bike;
    else if (vehicleType === "car") return car2;
    return car2; // default to car
  };

  // Function to handle calling the user via API
  const handleCallUser = async () => {
    const phoneNumber = props.ride?.user?.mobile;
    if (!phoneNumber) {
      alert("Phone number not available");
      return;
    }

    setIsCalling(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/captains/initiate-call`,
        {
          userPhoneNumber: phoneNumber,
          rideId: props.ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Show success message
        alert(`Call initiated to ${response.data.phoneNumber}`);

        // In a real implementation, you might want to:
        // 1. Show a call status indicator
        // 2. Handle call events (ringing, answered, completed)
        // 3. Update UI based on call status

        console.log("Call initiated:", response.data);
      }
    } catch (error) {
      console.error("Error initiating call:", error);
      alert("Failed to initiate call. Please try again.");
    } finally {
      setIsCalling(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/rides/start-ride`,
      {
        params: {
          rideId: props.ride._id,
          otp: otp,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };

  return (
    <div>
      {/* <h5
        onClick={() => {
          props.setConfirmRidePopupPanel(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5> */}

      <h3 className="text-2xl font-semibold ml-2 mb-1 mt-3">
        {/* mt-3 */}
        Confirm this ride to Start
      </h3>

      <div className="flex items-center justify-between p-3 bg-gray-200 rounded-lg mt-3">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
            src={props.ride?.user?.profileImage || userprofile}
            alt="User Profile"
            onError={(e) => {
              e.target.src = userprofile;
            }}
          />

          <div className="justify-between flex flex-col">
            <h2 className="text-lg font-medium capitalize">
              {props.ride?.user.fullname.firstname +
                " " +
                props.ride?.user.fullname.lastname}
            </h2>
            <p className="text-sm text-gray-600">
              {props.ride?.user?.mobile || "No phone number"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCallUser}
            disabled={!props.ride?.user?.mobile || isCalling}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              props.ride?.user?.mobile && !isCalling
                ? "bg-green-100 hover:bg-green-200 cursor-pointer"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            title={
              props.ride?.user?.mobile
                ? isCalling
                  ? "Calling..."
                  : "Call User"
                : "Phone number not available"
            }
          >
            <i
              className={`ri-phone-fill text-sm ${
                props.ride?.user?.mobile && !isCalling
                  ? "text-green-600"
                  : "text-gray-400"
              } ${isCalling ? "animate-pulse" : ""}`}
            ></i>
          </button>

          <div className="w-1/3 mt-3 mb-3 right-2 mr-3">
            <div className="justify-start flex">
              <i className="text-2xl ri-currency-line"></i>
              <h3 className="text-xl ml-1 font-bold">₹{props.ride?.fare}</h3>
            </div>

            <div className="ml-10">
              <p className="text-sm -mt-1 text-gray-800 font-medium">Cash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Image Display */}
      {/* <div className="flex justify-center my-3">
        <img
          className="h-16 object-contain"
          src={getVehicleImage(props.ride?.vehicleType)}
          alt="Vehicle"
          style={{
            filter: `
              drop-shadow(0 0 8px rgba(59,130,246,0.6))
            `,
          }}
        />
      </div> */}

      <div className="flex gap-4 mt-3 mb-3 p-3 bg-gray-200 rounded-xl">
        <div className="w-full flex flex-col ml-2 mr-7">
          <div className="h-1/2 mb-1 p-1 border-b-2 border-gray-400">
            <i className="text-xl ri-user-location-fill"></i>
            <div>
              {/* <h3 className="text-lg font-medium -mt-1">526/11-A</h3> */}
              <p className="text-sm -mt-1 text-gray-800 font-medium mb-5">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="mt-1 mb-1 h-1/2">
            <i className="text-xl text-red-600 ri-map-pin-fill "></i>

            <div className="">
              {/* <h3 className="text-lg font-medium -mt-1 ">526/11-A</h3> */}
              <p className="text-sm -mt-1 text-gray-800 font-medium">
                {props.ride?.destination}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <form onSubmit={submitHandler}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="number"
            className="bg-[#eee] px-6 py-3 font-mono text-lg rounded-xl w-full -mt-1 mb-2 required"
            placeholder="Enter OTP"
          />

          <div className="flex gap-4 mb-3 mt-2">
            <button
              onClick={() => {
                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
              }}
              className="w-1/2 bg-red-700 text-white font-semibold p-2 rounded-lg"
            >
              Cancel
            </button>

            <button className="w-1/2 flex justify-center bg-yellow-400 text-black font-semibold p-2 rounded-lg">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopup;
