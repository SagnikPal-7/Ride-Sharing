import React,{useContext} from "react";
import profile from "../assets/profile.png";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext);
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
            {captain?.fullname?.firstname+" "+captain?.fullname?.lastname}
          </h4>
        </div>

        <div>
          <h4 className="text-xl font-semibold">₹{captain?.totalEarnings ?? 0}</h4>
          <p className="text-sm text-gray-600 ml-3">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin  ri-timer-line"></i>
          <h5 className="text-lg font-medium">{captain?.totalHoursOnline ?? 0}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>

        <div className="text-center">
          <i className="text-3xl mb-2 font-thin  ri-speed-up-fill"></i>
          <h5 className="text-lg font-medium">{captain?.totalHoursDriving ?? 0}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>

        <div className="text-center">
          <i className="text-3xl mb-2 font-thin  ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{captain?.totalRides ?? 0}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
