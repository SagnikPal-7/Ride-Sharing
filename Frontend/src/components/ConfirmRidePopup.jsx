import React, { useState } from "react";
import profile from "../assets/profile.png";
import userprofile from "../assets/userprofile.png";
import { Link, useNavigate } from "react-router-dom";
import car2 from "../assets/Car2.webp";
import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";
import axios from "axios";

const ConfirmRidePopup = (props) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
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
            className="h-10 w-10 rounded-full object-cover"
            src={userprofile}
            alt=""
          />

          <div className="justify-between flex flex-col">
            <h2 className="text-lg font-medium capitalize">
              {props.ride?.user.fullname.firstname +
                " " +
                props.ride?.user.fullname.lastname}
            </h2>
            <h5 className="text-base font-semibold">2.2 KM</h5>
          </div>
        </div>

        <div className="w-1/3 mt-3 mb-3 right-2 mr-3">
          <div className="justify-start flex">
            <i className="text-2xl ri-currency-line"></i>
            <h3 className="text-xl ml-1 font-bold">₹{props.ride?.fare}</h3>
          </div>

          <div className="ml-10">
            <p className="text-sm -mt-1 ml-3 text-gray-800 font-medium">Cash</p>
          </div>
        </div>
      </div>

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
