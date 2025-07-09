import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import car2 from "../assets/Car2.webp";
import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";

const Riding = () => {
  return (
    <div className="h-screen">
      <div>
        <img className="w-16 absolute left-5 top-5" src={logo} alt="" />
      </div>

      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      <div className="h-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>

      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between mt-2">
          <img
            className="h-20"
            src={car2}
            alt=""
            // style={{
            //   filter: `
            //     drop-shadow(0 0 96px rgba(59,130,246,1))
            //     drop-shadow(0 0 48px rgba(59,130,246,0.8))
            //     drop-shadow(0 0 24px rgba(59,130,246,0.6))
            //   `,
            //   background: "transparent",
            //   borderRadius: "1rem",
            // }}
          />
          <div className="text-right">
            <h2 className="text-lg font-medium">Sagnik</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">MP04 AB 1234</h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
              <i className="text-xl text-gray-800 ri-map-pin-fill"></i>

              <div>
                <h3 className="text-lg font-medium ">526/11-A</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  Kankariya Talab, Bhopal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 ">
              <i className="text-xl ri-currency-line"></i>

              <div>
                <h3 className="text-lg font-medium ">₹193.20</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
