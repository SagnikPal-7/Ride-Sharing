import React from "react";
import car2 from "../assets/Car2.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";

const VehiclePanel = (props) => {
  return (
    <div>
      <h5
        onClick={() => {
          props.setVehiclePanel(false);
        }}
        className="p-1 w-[93%] text-center absolute top-0"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-fill"></i>
      </h5>

      <h3 className="text-2xl font-semibold ml-2 mb-5 mt-4">Choose a Vehicle..</h3>

      <div
        onClick={() => {
          props.setConfirmRide(true);
          props.setVehiclePanel(false);
          props.selectVehicle("car");
        }}
        className="flex border-2 border-gray-200 active:border-black mb-4 rounded-2xl w-full p-2 items-center justify-between"
      >
        <img className="h-18" src={car2} alt="" />

        <div className=" w-1/2 ml-2">
          <h4 className="font-bold text-base">
            ShareRide Go
            <span className="ml-1 text-xs">
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-sm mb-0.5">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable, Compact rides
          </p>
        </div>

        <h2 className="text-lg font-bold mr-2">₹{props.fare?.car ?? '-'}</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRide(true);
          props.setVehiclePanel(false);
          props.selectVehicle("motorcycle");
        }}
        className="flex border-2 border-gray-200 active:border-black mb-4 rounded-2xl w-full p-2 items-center justify-between"
      >
        <img className="h-17" src={bike} alt="" />

        <div className=" w-1/2 ml-3">
          <h4 className="font-bold text-base">
            Moto
            <span className="ml-1 text-xs">
              <i className="ri-user-3-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-sm mb-0.5">3 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable motocycle rides
          </p>
        </div>

        <h2 className="text-lg font-bold mr-2">₹{props.fare?.motorcycle ?? '-'}</h2>
      </div>

      <div
        onClick={() => {
          props.setConfirmRide(true);
          props.setVehiclePanel(false);
          props.selectVehicle("auto");
        }}
        className="flex border-2 border-gray-200 active:border-black mb-2 rounded-2xl w-full p-2 items-center justify-between"
      >
        <img className="h-15" src={auto} alt="" />

        <div className=" w-1/2 ml-5 mb-2">
          <h4 className="font-bold text-base">
            QucikRide Auto
            <span className="ml-1 text-xs">
              <i className="ri-user-3-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-sm mb-0.5">2 mins away</h5>
          <p className="font-normal text-xs text-gray-600">
            Affordable auto rides
          </p>
        </div>

        <h2 className="text-lg font-bold mr-2">₹{props.fare?.auto ?? '-'}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
