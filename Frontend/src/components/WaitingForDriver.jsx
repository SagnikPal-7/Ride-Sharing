import React from "react";
import car2 from "../assets/Car2.webp";
import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";


const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setWaitingForDriver(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <div className="flex items-center justify-between mt-4 mr-2">
        <img
          className="h-20"
          src={car2}
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
          <h2 className="text-lg font-medium">Sagnik</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">MP04 AB 1234</h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-2xl ri-map-pin-user-fill ri-user-location-fill"></i>

            <div>
              <h3 className="text-lg font-medium ">526/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-xl text-red-600 ri-map-pin-fill"></i>

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
    </div>
  );
};

export default WaitingForDriver;
