import React, { useState } from "react";
import car2 from "../assets/Car2.webp";
//import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";

const WaitingForDriver = (props) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("");

  let vehicleImg = car2;
  if (props.vehicleType === "auto") vehicleImg = auto;
  else if (props.vehicleType === "moto" || props.vehicleType === "motorcycle")
    vehicleImg = bike;
  else if (props.vehicleType === "car") vehicleImg = car2;

  const handleCallCaptain = async () => {
    if (!props.ride?.captain?.mobile) {
      alert("Captain phone number not available");
      return;
    }

    // Check if user has a phone number
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.mobile) {
      alert("Please update your profile with a phone number before making calls.");
      return;
    }

    setIsCalling(true);
    setCallStatus("Initiating conference call...");

    try {
      const response = await fetch(`/users/initiate-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rideId: props.ride._id,
          captainPhoneNumber: props.ride.captain.mobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.mode === "test") {
          setCallStatus("Test mode: Conference call simulated successfully!");
        } else {
          setCallStatus("Conference call initiated! You and your captain will receive calls to join the conference...");
        }
        setTimeout(() => {
          setCallStatus("");
          setIsCalling(false);
        }, 5000); // Longer timeout for conference calls
      } else {
        setCallStatus(`Error: ${data.error || "Failed to initiate conference call"}`);
        setTimeout(() => {
          setCallStatus("");
          setIsCalling(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error calling captain:", error);
      setCallStatus("Network error. Please try again.");
      setTimeout(() => {
        setCallStatus("");
        setIsCalling(false);
      }, 3000);
    }
  };

  return (
    <div>
      {/* <h5
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5> */}

      <div className="flex items-center justify-between mt-3 mr-2">
        <img
          className={props.vehicleType === "car" ? "h-23" : "h-25"}
          src={vehicleImg}
          alt=""
          // style={{
          //   filter: `
          //   drop-shadow(0 0 96px rgba(59,130,246,1))
          //   drop-shadow(0 0 48px rgba(59,130,246,0.8))
          //   drop-shadow(0 0 24px rgba(59,130,246,0.6))
          // `,
          //   background: "transparent",
          //   borderRadius: "1rem",
          // }}
        />
        <div className="text-right">
          <h2 className="text-lg font-medium">
            {props.ride?.captain.fullname.firstname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {props.ride?.captain.vehicle.plate}
          </h4>
          <p className="text-base font-bold text-gray-700">
            <span className="text-black">OTP :</span> {props.ride?.otp}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-2xl ri-map-pin-user-fill ri-user-location-fill"></i>

            <div>
              {/* <h3 className="text-lg font-medium ">526/11-A</h3> */}
              <p className="text-base font-semibold -mt-1 text-gray-800">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-xl text-red-600 ri-map-pin-fill"></i>

            <div>
              {/* <h3 className="text-lg font-medium ">526/11-A</h3> */}
              <p className="text-base font-semibold -mt-1 text-gray-800">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 ">
            <i className="text-xl ri-currency-line"></i>

            <div>
              <h3 className="text-lg font-medium ">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        {/* Call Captain Button */}
        <div className="w-full mt-4 px-3">
          <button
            onClick={handleCallCaptain}
            disabled={isCalling}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isCalling
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800"
            }`}
          >
            {isCalling ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting to Captain...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="ri-phone-fill text-lg"></i>
                Call Captain
              </div>
            )}
          </button>
          
          {callStatus && (
            <div className={`mt-2 text-center text-sm font-medium ${
              callStatus.includes("Error") || callStatus.includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}>
              {callStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
