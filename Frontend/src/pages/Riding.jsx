import React, { useState } from "react";
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
import PaymentModal from "../components/PaymentModal";
import Notification from "../components/Notification";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  let vehicleImg = car2;
  if (ride.vehicleType === "auto") vehicleImg = auto;
  else if (ride.vehicleType === "moto" || ride.vehicleType === "motorcycle")
    vehicleImg = bike;
  else if (ride.vehicleType === "car") vehicleImg = car2;

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setNotification({
      show: true,
      message: "Payment completed successfully!",
      type: "success"
    });
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Map Section */}
      <div className="h-3/5 relative">
        <LiveTracking />
      </div>

      {/* Ride Details Section */}
      <div className="h-2/5 bg-white rounded-t-3xl shadow-lg -mt-6 relative z-20 overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Captain and Vehicle Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  className={`${ride.vehicleType === "car" ? "h-12 w-12" : "h-14 w-14"} object-contain`}
                  src={vehicleImg}
                  alt="Vehicle"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 capitalize">
                  {ride?.captain.fullname.firstname + " " + ride?.captain.fullname.lastname}
                </h2>
                <p className="text-xs text-gray-600">{ride?.captain.vehicle.plate}</p>
                <p className="text-xs text-gray-500">Maruti Suzuki Alto</p>
              </div>
            </div>
            
            {/* <div className="text-right">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-phone-fill text-green-600 text-base"></i>
              </div>
            </div> */}
          </div>

          {/* Trip Details */}
          <div className="space-y-2 mb-3 flex-1">
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-map-pin-fill text-blue-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Destination</p>
                <p className="text-xs font-medium text-gray-900">{ride?.destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-currency-line text-green-600 text-xs"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Fare</p>
                <p className="text-sm font-semibold text-gray-900">₹{ride?.fare}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Cash</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => setShowPaymentModal(true)}
            disabled={paymentCompleted}
            className={`w-full font-semibold py-2 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm ${
              paymentCompleted 
                ? "bg-green-500 text-white cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <i className="ri-bank-card-line"></i>
            {paymentCompleted ? "Payment Completed" : "Make Payment"}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        ride={ride}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
};

export default Riding;
