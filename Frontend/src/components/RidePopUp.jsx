import React from "react";
import profile from "../assets/profile.png";
import userprofile from "../assets/userprofile.png";
import { Link } from "react-router-dom";
import car2 from "../assets/Car2.webp";
import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";

const RidePopUp = (props) => {
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
            className="h-10 w-10 rounded-full object-cover"
            src={userprofile}
            alt=""
          />

          <h2 className="text-lg font-medium">
            {props.ride?.user.fullname.firstname +
              " " +
              props.ride?.user.fullname.lastname}
          </h2>
        </div>

        <h5 className="text-base font-semibold">2.2 KM</h5>
      </div>

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
