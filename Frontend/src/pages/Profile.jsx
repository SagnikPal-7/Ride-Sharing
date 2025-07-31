import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [phone, setPhone] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Function to fetch fresh user data from backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const freshUserData = response.data;
      console.log("Fresh user data from backend:", freshUserData);
      
      // Update context and localStorage with fresh data
      if (setUser) {
        setUser(freshUserData);
      }
      localStorage.setItem("user", JSON.stringify(freshUserData));
      
      // Set phone state based on fresh data
      if (freshUserData.mobile) {
        setPhone(freshUserData.mobile);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Debug: Log what's in localStorage and user context
  useEffect(() => {
    console.log("User from context:", user);
    console.log("User from localStorage:", localStorage.getItem("user"));
    console.log("User mobile from context:", user?.mobile);
    
    // Fetch fresh user data on component mount
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        "/users/update-phone",
        { phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("API Response:", response.data);
      
      // Create updated user object with the new mobile number
      const updatedUser = { ...user, mobile: phone };
      console.log("Updated user object:", updatedUser);
      
      // Update the user context
      if (setUser) {
        setUser(updatedUser);
      }
      
      // Update localStorage with the new user data
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("Updated localStorage:", localStorage.getItem("user"));
      
      setIsSaved(true);
      alert("Phone number saved successfully!");
    } catch (err) {
      console.error("Error saving phone number:", err);
      if (err.message === "No authentication token found") {
        alert("Please login again to continue.");
      } else {
        alert("Failed to save phone number. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setImageLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.put(
        "/users/update-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image upload response:", response.data);

      // Update user context with new image
      const updatedUser = { ...user, profileImage: response.data.imageUrl };
      if (setUser) {
        setUser(updatedUser);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onLoad={() => console.log("Image loaded successfully:", user.profileImage)}
                onError={(e) => {
                  console.error("Image failed to load:", user.profileImage);
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <i 
              className={`ri-user-3-fill text-5xl text-gray-400 ${user?.profileImage ? 'hidden' : ''}`}
            ></i>
          </div>
          <button 
            onClick={triggerFileInput}
            disabled={imageLoading}
            className={`absolute bottom-0 right-0 rounded-full p-1 w-6 h-6 flex items-center justify-center ${
              imageLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {imageLoading ? (
              <i className="ri-loader-4-line text-black text-sm animate-spin"></i>
            ) : (
              <i className="ri-pencil-fill text-black text-sm"></i>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
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
            {!isSaved ? (
              <>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-gray-200 text-black rounded-lg px-3 py-2 outline-none"
                />
                <button
                  onClick={handleSave}
                  disabled={loading || !phone}
                  className={`mt-2 px-4 py-1 rounded font-medium ${
                    loading || !phone
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <div className="text-base text-black">
                {phone}
              </div>
            )}
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
