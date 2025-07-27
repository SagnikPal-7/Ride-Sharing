import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LiveTracking = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  const onLoad = () => {
    // setMap(mapInstance); // Removed as map state is not used
  };

  const onUnmount = () => {
    // setMap(null); // Removed as map state is not used
  };

  // WARNING: Hardcoding API keys is not recommended for production environments.
  // It's better to use environment variables as previously discussed.

  //const googleMapsApiKey = import.meta.env.GOOGLE_MAPS_API;

  const googleMapsApiKey = "AIzaSyCDHpbpRGnOkGmMkt_akjIQSK_GqzUElIM";

  if (!googleMapsApiKey) {
    return <div>Error: Google Maps API key is not set.</div>;
  }

  return (
    <div className="live-tracking-container">
      {currentLocation ? (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker position={currentLocation} />
          </GoogleMap>
        </LoadScript>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default LiveTracking;
