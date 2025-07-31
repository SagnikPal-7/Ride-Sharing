import React, { useContext, useState, useEffect } from "react";
import profile from "../assets/profile.png";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);
  const [statistics, setStatistics] = useState({
    hoursOnline: 0,
    distanceTravelled: 0,
    bookingsDone: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/captains/statistics", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
      } catch (error) {
        console.error("Error fetching captain statistics:", error);
      }
    };

    fetchStatistics();
    
    // Refresh statistics every 30 seconds
    const interval = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex item-center justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={profile}
            alt=""
          />
          <h4 className="text-lg font-medium mt-2 capitalize">
            {captain?.fullname?.firstname + " " + captain?.fullname?.lastname}
          </h4>
        </div>

        <div>
          <h4 className="text-xl font-semibold">₹{statistics.totalEarned}</h4>
          <p className="text-sm text-gray-600 ml-3">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-line"></i>
          <h5 className="text-lg font-medium">{statistics.hoursOnline.toFixed(1)}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>

        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-fill"></i>
          <h5 className="text-lg font-medium">{statistics.distanceTravelled.toFixed(1)}</h5>
          <p className="text-sm text-gray-600">Distance (km)</p>
        </div>

        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{statistics.bookingsDone}</h5>
          <p className="text-sm text-gray-600">Bookings Done</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
