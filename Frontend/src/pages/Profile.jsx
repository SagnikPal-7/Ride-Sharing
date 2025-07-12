import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div>
      <div className="mb-3">Profile and Logout User</div>

      <Link
        to="/user/logout"
        className="w-full flex items-center justify-center bg-gray-300 text-gray-700 font-semibold p-2 rounded-lg"
      >
        Logout
      </Link>
    </div>
  );
};

export default Profile;
