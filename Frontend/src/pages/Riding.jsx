import React from "react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import car2 from "../assets/Car2.webp";
import car1 from "../assets/Car1.webp";
import bike from "../assets/bike.webp";
import auto from "../assets/Auto.png";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  let vehicleImg = car2;
  if (ride.vehicleType === "auto") vehicleImg = auto;
  else if (ride.vehicleType === "moto" || ride.vehicleType === "motorcycle")
    vehicleImg = bike;
  else if (ride.vehicleType === "car") vehicleImg = car2;

  socket.on("ride-ended", () => {
    navigate("/home");
  });

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
        <LiveTracking />
      </div>

      <div className="h-1/2 p-4 rounded-xl">
        <div className="flex items-center justify-between mt-1">
          <img
            className={ride.vehicleType === "car" ? "h-20" : "h-30"}
            src={vehicleImg}
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

          {/* {props.ride?.captain.fullname.firstname+" "+props.ride?.captain.fullname.lastname} */}
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain.fullname.firstname +
                " " +
                ride?.captain.fullname.lastname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="w-full mt-3">
            <div className="flex items-center gap-4 p-3 border-b-2 border-gray-400">
              <i className="text-xl text-gray-800 ri-map-pin-fill"></i>

              <div>
                {/* <h3 className="text-lg font-medium ">526/11-A</h3> */}
                <p className="text-[14px] -mt-1 text-gray-800 font-semibold">
                  {ride?.destination}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 ">
              <i className="text-2xl ri-currency-line"></i>

              <div>
                <h3 className="text-lg font-medium ">₹{ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash</p>
              </div>
            </div>
          </div>
        </div>
        {/* {ride && (
          <div>
            <h2>Ride ID: {ride.id}</h2>
            <p>Pickup Location: {ride.pickup}</p>
            <p>Destination: {ride.destination}</p>
          </div>
        )} */}

        <button className="w-full mt-1 bg-green-600 text-white font-semibold p-2 rounded-lg">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
