import React, { useState, useEffect, useRef } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const LiveTracking = ({ pickupCoords, destinationCoords }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null); // Ref to hold the map instance

  // Effect to get and update current location marker ONLY
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
  }, []); // This effect runs only once on mount

  // Effect to pan map to new pickup or destination location (one-time pan)
  useEffect(() => {
    if (mapRef.current) {
      if (pickupCoords) {
        mapRef.current.panTo(pickupCoords);
        mapRef.current.setZoom(10);
      } else if (destinationCoords) {
        mapRef.current.panTo(destinationCoords);
        mapRef.current.setZoom(10);
      }
    }
  }, [pickupCoords, destinationCoords]); // Only re-run when pickupCoords or destinationCoords change

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance; // Store map instance in ref

    // Set initial center and zoom when the map loads for the very first time
    // This should only happen once.
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    const initialCenter = pickupCoords || destinationCoords || currentLocation || defaultCenter; // Use currentLocation if available initially
    const initialZoom = (pickupCoords || destinationCoords) ? 10 : 5;

    mapInstance.setCenter(initialCenter);
    mapInstance.setZoom(initialZoom);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return <div>Error: Google Maps API key is not set.</div>;
  }

  return (
    <div className="live-tracking-container">
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            draggable: true, // Explicitly enable dragging
            disableDefaultUI: false, // Keep default UI like zoom controls
          }}
        >
          {currentLocation && <Marker position={currentLocation} />}
          {pickupCoords && <Marker position={pickupCoords} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />}
          {destinationCoords && <Marker position={destinationCoords} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LiveTracking;
