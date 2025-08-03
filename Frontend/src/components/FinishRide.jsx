import React, { useState } from "react";
import userprofile from "../assets/userprofile.png";
import { Link, useNavigate } from "react-router-dom";
// import profile from "../assets/profile.png";

// import car2 from "../assets/Car2.webp";
// import car1 from "../assets/Car1.webp";
// import bike from "../assets/bike.webp";
// import auto from "../assets/Auto.png";

import axios from "axios";

const FinishRide = (props) => {
  const navigate = useNavigate();
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  async function endRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/end-ride`,
        {
          rideId: props.ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        props.setFinishRidePanel(false);
        navigate("/captain-home");
      }
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("Payment not completed")
      ) {
        setShowPaymentAlert(true);
      } else {
        console.error("Error ending ride:", error);
        alert("Failed to end ride. Please try again.");
      }
    }
  }

  return (
    <div>
      <h5
        onClick={() => {
          props.setFinishRidePanel(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold ml-2 mb-1 mt-5">
        {/* mt-3 */}
        Finish this Ride
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

          <div className="justify-between flex flex-col">
            <h2 className="text-lg font-medium capitalize">
              {props.ride?.user.fullname.firstname +
                " " +
                props.ride?.user.fullname.lastname}
            </h2>
          </div>
        </div>

        <div className="w-1/3 mt-3 mb-3 right-2 mr-3">
          <div className="justify-start flex">
            <i className="text-2xl ri-currency-line"></i>
            <h3 className="text-xl font-bold ml-2">₹{props.ride?.fare}</h3>
          </div>

          <div className="ml-10">
            <p className="text-sm -mt-1 text-gray-800 font-medium">Cash</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-3 mb-3 p-3 bg-gray-100 rounded-xl">
        <div className="w-full ml-2 mr-7">
          <div className="h-1/2 mb-1 border-b-2 border-gray-400">
            <i className="text-xl ri-user-location-fill"></i>
            <div>
              {/* <h3 className="text-lg font-medium -mt-1">526/11-A</h3> */}
              <p className="text-[13px] -mt-1 text-gray-800 mb-2 font-medium">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="mt-1 mb-2 h-1/2">
            <i className="text-xl text-red-600 ri-map-pin-fill "></i>

            <div>
              {/* <h3 className="text-lg font-medium -mt-1 ">526/11-A</h3> */}
              <p className="text-[13px] -mt-1 text-gray-800 font-medium">
                {props.ride?.destination}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <div className="flex gap-4 mb-3 mt-2">
          <button
            onClick={endRide}
            className="w-full flex justify-center bg-yellow-400 text-black font-semibold p-2 rounded-lg"
          >
            Finish Ride
          </button>
        </div>
        <p className="text-red-500 text-xs mt-1 mb-1 ml-2 mr-1">
          Click on finish ride button if you have completed the payment.
        </p>
      </div>

      {/* Payment Alert Modal */}
      {showPaymentAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Payment Required</h3>
              <p className="text-gray-600 mb-4">
                The user has not completed the payment yet. Please wait for the
                payment to be completed before finishing the ride.
              </p>
              <button
                onClick={() => setShowPaymentAlert(false)}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishRide;
