import React from "react";
import logo from "../assets/logo.png";
import bg from "../assets/home.jpg";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div
      className="bg-cover bg-center h-screen pt-8 flex justify-between flex-col w-full"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Link to="/">
        <img className="w-16 ml-8" src={logo} alt="" />
      </Link>
      <div className="bg-white pb-7 py-4 px-4">
        <h2 className="text-[22px] font-semibold">
          Get Started with QuickRide
        </h2>
        <Link
          to="/login"
          className="flex items-center justify-center w-full bg-black text-white py-3 mt-3 rounded-lg"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Start;
