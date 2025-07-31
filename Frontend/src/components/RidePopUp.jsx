import React, { useState } from "react";
import axios from "axios";
import userprofile from "../assets/userprofile.png";
import car2 from "../assets/Car2.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";
import { Link } from "react-router-dom";
// import profile from "../assets/profile.png";
// import car1 from "../assets/Car1.webp";

const RidePopUp = (props) => {
  const [isCalling, setIsCalling] = useState(false);

  // Function to get vehicle image based on vehicle type
  const getVehicleImage = (vehicleType) => {
    if (vehicleType === "auto") return auto;
    else if (vehicleType === "moto" || vehicleType === "motorcycle") return bike;
    else if (vehicleType === "car") return car2;
    return car2; // default to car
  };

  // Function to handle calling the user via API
  const handleCallUser = async () => {
    const phoneNumber = props.ride?.user?.mobile;
    if (!phoneNumber) {
      alert('Phone number not available');
      return;
    }

    setIsCalling(true);
    
    try {
      const response = await axios.post(
        '/captains/initiate-call',
        {
          userPhoneNumber: phoneNumber,
          rideId: props.ride._id
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
        
        console.log('Call initiated:', response.data);
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call. Please try again.');
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div>
      {/* <h5
        onClick={() => {
          props.setRidePopupPanel(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5> */}

      <h3 className="text-2xl font-semibold ml-2 mb-1 mt-3">
        {/* mt-3 */}
        New Ride Available
      </h3>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-3">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
            src={props.ride?.user?.profileImage || userprofile}
            alt="User Profile"
            onError={(e) => {
              e.target.src = userprofile;
            }}
          />

          <div className="flex flex-col">
            <h2 className="text-lg font-medium">
              {props.ride?.user.fullname.firstname +
                " " +
                props.ride?.user.fullname.lastname}
            </h2>
            <p className="text-sm text-gray-600">
              {props.ride?.user?.mobile || "No phone number"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleCallUser}
            disabled={!props.ride?.user?.mobile || isCalling}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              props.ride?.user?.mobile && !isCalling
                ? 'bg-green-100 hover:bg-green-200 cursor-pointer' 
                : 'bg-gray-100 cursor-not-allowed'
            }`}
            title={props.ride?.user?.mobile ? (isCalling ? 'Calling...' : 'Call User') : 'Phone number not available'}
          >
            <i className={`ri-phone-fill text-sm ${
              props.ride?.user?.mobile && !isCalling ? 'text-green-600' : 'text-gray-400'
            } ${isCalling ? 'animate-pulse' : ''}`}></i>
          </button>
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

      <div className="flex gap-4 mt-3 mb-3 p-3 bg-gray-100 rounded-xl">
        <div className="w-2/3 ml-2 mr-7">
          <div className="border-b-2 border-gray-400">
            <i className="text-lg ri-user-location-fill"></i>
            <div>
              {/* <h3 className="text-base font-medium -mt-1">526/11-A</h3> */}
              <p className="text-xs -mt-0.5 text-gray-800 mb-2 font-medium">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="mt-1 mb-1">
            <i className="text-base text-red-600 ri-map-pin-fill "></i>

            <div>
              {/* <h3 className="text-base font-medium -mt-1 ">526/11-A</h3> */}
              <p className="text-xs -mt-0.5 text-gray-800 font-medium">
                {props.ride?.destination}
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/3 mt-6 right-2">
          <i className="text-xl ri-currency-line"></i>

          <div>
            <h3 className="text-lg font-bold">₹{props.ride?.fare}</h3>
            <p className="text-sm -mt-1 text-gray-800 font-medium">Cash</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-3 mt-2">
        <button
          onClick={() => {
            props.setRidePopupPanel(false);
          }}
          className="w-1/2 bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg"
        >
          Ignore
        </button>

        <button
          onClick={() => {
            props.setConfirmRidePopupPanel(true);
            props.setRidePopupPanel(false);
            props.confirmRide();
          }}
          className="w-1/2 bg-yellow-400 text-black font-semibold p-2 rounded-lg"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
