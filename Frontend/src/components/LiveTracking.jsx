import React, { useState, useEffect, useRef } from "react";
import { LoadScript, GoogleMap, Marker, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = ({ pickupCoords, destinationCoords }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(15); // Higher zoom for detailed view
  const mapRef = useRef(null);

  // Effect to get and update current location marker with high accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          
          // Pan to current location with smooth animation
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
            mapRef.current.setZoom(16); // High zoom for detailed view
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 20000, 
          maximumAge: 1000 
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  // Effect to pan map to new pickup or destination location
  useEffect(() => {
    if (mapRef.current) {
      if (pickupCoords) {
        mapRef.current.panTo(pickupCoords);
        mapRef.current.setZoom(16);
      } else if (destinationCoords) {
        mapRef.current.panTo(destinationCoords);
        mapRef.current.setZoom(16);
      }
    }
  }, [pickupCoords, destinationCoords]);

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;

    // Set initial center and zoom when the map loads
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    const initialCenter = pickupCoords || destinationCoords || currentLocation || defaultCenter;
    const initialZoom = (pickupCoords || destinationCoords) ? 16 : 15; // Higher zoom for detailed view

    mapInstance.setCenter(initialCenter);
    mapInstance.setZoom(initialZoom);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  // Custom marker icon for current location
  const currentLocationIcon = {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer glow circle -->
        <circle cx="20" cy="20" r="18" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2"/>
        
        <!-- Inner pulse circle -->
        <circle cx="20" cy="20" r="12" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.6)" stroke-width="2">
          <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Main location pin -->
        <circle cx="20" cy="20" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
        
        <!-- Center dot -->
        <circle cx="20" cy="20" r="3" fill="white"/>
        
        <!-- Direction indicator -->
        <circle cx="20" cy="20" r="1.5" fill="#3B82F6"/>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 }
  };

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return <div>Error: Google Maps API key is not set.</div>;
  }

  return (
    <div className="live-tracking-container w-full h-full">
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            draggable: true,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
              },
              {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
              }
            ]
          }}
        >
          {/* Current location marker with detailed styling */}
          {currentLocation && (
            <>
              {/* Accuracy circle */}
              <Circle
                center={currentLocation}
                radius={20} // 20 meters radius
                options={{
                  fillColor: "#3B82F6",
                  fillOpacity: 0.1,
                  strokeColor: "#3B82F6",
                  strokeOpacity: 0.3,
                  strokeWeight: 2,
                }}
              />
              
              {/* Main current location marker */}
              <Marker 
                position={currentLocation}
                icon={currentLocationIcon}
                title="Your Current Location"
                animation={window.google?.maps?.Animation?.DROP}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LiveTracking;
