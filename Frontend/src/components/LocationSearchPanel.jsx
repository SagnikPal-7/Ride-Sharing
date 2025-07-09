import React from "react";

const LocationSearchPanel = (props) => {
  const locations = [
    "24B, Near Kapoor's cafe, Benachity Sheryains Coding School, Bhopal",
    "22C, Near Malhotra's cafe, Benachity Sheryains Coding School, Bhopal",
    "20B, Near Singhania's cafe, Benachity Sheryains Coding School, Bhopal",
    "18A, Near Sharma's cafe, Benachity Sheryains Coding School, Bhopal",
  ];

  return (
    <div className="overflow-scroll">
      {locations.map(function (elem, idx) {
        return (
          <div
            key={idx}
            onClick={() => {
              props.setVehiclePanel(true);
              props.setPanelOpen(false);
            }}
            className="flex top-0 gap-3 border-2 p-3 mb-2 border-gray-50 active:border-black rounded-xl items-center justify-start"
          >
            <h2 className="bg-[#d3d2d2] flex items-center justify-center h-7 w-12 rounded-full">
              <i className="ri-map-pin-2-fill"></i>
            </h2>
            <h4 className="font-medium">{elem}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
