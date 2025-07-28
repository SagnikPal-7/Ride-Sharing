import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const Profile = () => {
  const { user } = useContext(UserDataContext);
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center pt-8">
      {/* Header */}
      <div className="w-full flex items-center px-6 mb-6">
        <Link to="/home" className="text-2xl text-black mr-4">
          <i className="ri-arrow-left-line"></i>
        </Link>
        <h2 className="text-xl font-semibold">ShareRide Account</h2>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6 px-1">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <i className="ri-user-3-fill text-5xl text-gray-400"></i>
          </div>
          <button className="absolute bottom-2 right-2 bg-gray-300 rounded-full p-2">
            <i className="ri-pencil-fill text-black text-base"></i>
          </button>
        </div>
      </div>

      <div className="">
        {/* Personal Info */}
        <div className="bg-gray-100 rounded-xl p-5" style={{ width: "319px" }}>
          <h3 className="text-lg font-semibold mb-4">Personal info</h3>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Name</div>
            <div className="text-base">
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Email</div>
            <div className="text-base">{user?.email}</div>
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Phone number</div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full bg-gray-200 text-black rounded-lg px-3 py-2 outline-none"
            />
          </div>
        </div>
        {/* Logout Button */}
        <div className="w-full max-w-md mt-8 mx-1">
          <Link
            to="/user/logout"
            className="w-full flex items-center justify-center bg-gray-300 text-black font-semibold p-2 rounded-lg"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
