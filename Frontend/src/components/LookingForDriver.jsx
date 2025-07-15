import React from "react";
import car2 from "../assets/Car2.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";

const LookingForDriver = (props) => {
  let vehicleImg = car2;
  if (props.vehicleType === "auto") vehicleImg = auto;
  else if (props.vehicleType === "moto" || props.vehicleType === "motorcycle") vehicleImg = bike;
  else if (props.vehicleType === "car") vehicleImg = car2;

  return (
    <div>
      <h5
        onClick={() => {
          props.setVehicleFound(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold ml-2 mb-5 mt-5">
        Looking for a Driver
      </h3>

      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="rounded-2xl flex items-center justify-center mb-2">
          <img
            className={props.vehicleType === "car" ? "h-30" : "h-25"}
            src={vehicleImg}
            alt=""
            style={{
              filter: `
      drop-shadow(0 0 96px rgba(59,130,246,1))
      drop-shadow(0 0 48px rgba(59,130,246,0.8))
      drop-shadow(0 0 24px rgba(59,130,246,0.6))
    `,
              background: "transparent",
              borderRadius: "1rem",
            }}
          />
        </div>

        <div className="w-full mt-5">
          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-2xl ri-map-pin-user-fill ri-user-location-fill"></i>

            <div>
              {/* <h3 className="text-lg font-medium ">{props.pickup}</h3> */}
              <p className="text-base -mt-1 font-medium">
                {props.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
            <i className="text-xl text-red-600 ri-map-pin-fill"></i>

            <div>
              {/* <h3 className="text-lg font-medium ">{props.destination}</h3> */}
              <p className="text-base -mt-1 font-medium">
                {props.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 ">
            <i className="text-xl ri-currency-line"></i>

            <div>
              <h3 className="text-lg font-medium ">₹{props.fare[props.vehicleType]}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
