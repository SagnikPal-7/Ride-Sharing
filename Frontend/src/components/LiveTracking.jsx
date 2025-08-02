import React, { useState, useEffect, useRef, useContext } from "react";
import { LoadScript, GoogleMap, Marker, Circle, Polyline } from "@react-google-maps/api";
import { SocketContext } from "../context/SocketContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = ({ 
  pickupCoords: initialPickupCoords, 
  destinationCoords: initialDestinationCoords, 
  rideId, 
  isActiveRide = false,
  userType = "user" // "user" or "captain"
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(15);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(initialPickupCoords);
  const [destinationCoords, setDestinationCoords] = useState(initialDestinationCoords);
  const mapRef = useRef(null);
  const { socket } = useContext(SocketContext);

  // Debug logging
  useEffect(() => {
    console.log("LiveTracking Debug:", {
      pickupCoords,
      destinationCoords,
      isActiveRide,
      rideId,
      userType
    });
  }, [pickupCoords, destinationCoords, isActiveRide, rideId, userType]);

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
          
          // Update user/captain location in ride if active
          if (isActiveRide && rideId) {
            if (userType === "user") {
              setUserLocation(newLocation);
              socket.emit("update-user-location", {
                rideId,
                location: newLocation,
              });
            } else if (userType === "captain") {
              setCaptainLocation(newLocation);
              socket.emit("update-captain-location", {
                rideId,
                location: newLocation,
              });
            }
          }
          
          // Pan to current location with smooth animation
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
            mapRef.current.setZoom(16);
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
  }, [isActiveRide, rideId, userType, socket]);

  // Effect to handle real-time location updates
  useEffect(() => {
    if (!isActiveRide || !rideId) return;

    // Listen for captain location updates (for users)
    if (userType === "user") {
      socket.on("captain-location-updated", (data) => {
        if (data.rideId === rideId) {
          setCaptainLocation(data.location);
        }
      });
    }

    // Listen for user location updates (for captains)
    if (userType === "captain") {
      socket.on("user-location-updated", (data) => {
        if (data.rideId === rideId) {
          setUserLocation(data.location);
        }
      });
    }

    return () => {
      socket.off("captain-location-updated");
      socket.off("user-location-updated");
    };
  }, [isActiveRide, rideId, userType, socket]);

  // Effect to fetch ride details and set initial coordinates
  useEffect(() => {
    if (isActiveRide && rideId) {
      fetchRideDetails();
    }
  }, [isActiveRide, rideId]);

  // Effect to update coordinates when props change
  useEffect(() => {
    if (initialPickupCoords) {
      setPickupCoords(initialPickupCoords);
    }
    if (initialDestinationCoords) {
      setDestinationCoords(initialDestinationCoords);
    }
  }, [initialPickupCoords, initialDestinationCoords]);

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

  const fetchRideDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/rides/details/${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setRideDetails(data);
      
      // Set initial locations from ride details
      if (data.pickupCoords) {
        setPickupCoords(data.pickupCoords);
      }
      if (data.destinationCoords) {
        setDestinationCoords(data.destinationCoords);
      }
      if (data.captainLocation) {
        setCaptainLocation(data.captainLocation);
      }
      if (data.userLocation) {
        setUserLocation(data.userLocation);
      }
      
    } catch (error) {
      console.error("Error fetching ride details:", error);
    }
  };

  const onLoad = (mapInstance) => {
    mapRef.current = mapInstance;

    // Set initial center and zoom when the map loads
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India
    const initialCenter = pickupCoords || destinationCoords || currentLocation || defaultCenter;
    const initialZoom = (pickupCoords || destinationCoords) ? 16 : 15;

    mapInstance.setCenter(initialCenter);
    mapInstance.setZoom(initialZoom);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  // Custom marker icons with better visibility
  const currentLocationIcon = {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="2"/>
        <circle cx="20" cy="20" r="12" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.6)" stroke-width="2">
          <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="20" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
        <circle cx="20" cy="20" r="1.5" fill="#3B82F6"/>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 }
  };

  const pickupIcon = {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 0.4)" stroke-width="2"/>
        <circle cx="20" cy="20" r="12" fill="#22C55E" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="white"/>
        <circle cx="20" cy="20" r="3" fill="#22C55E"/>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 }
  };

  const destinationIcon = {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.4)" stroke-width="2"/>
        <circle cx="20" cy="20" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="white"/>
        <circle cx="20" cy="20" r="3" fill="#EF4444"/>
      </svg>
    `),
    scaledSize: { width: 40, height: 40 },
    anchor: { x: 20, y: 20 }
  };

  const captainIcon = {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="rgba(249, 115, 22, 0.2)" stroke="rgba(249, 115, 22, 0.4)" stroke-width="2"/>
        <circle cx="20" cy="20" r="12" fill="#F97316" stroke="white" stroke-width="2"/>
        <circle cx="20" cy="20" r="6" fill="white"/>
        <circle cx="20" cy="20" r="3" fill="#F97316"/>
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
    <div className="live-tracking-container w-full h-full relative">
      
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
          {/* Pickup marker - Green */}
          {pickupCoords && (
            <Marker 
              position={pickupCoords}
              icon={pickupIcon}
              title="Pickup Location"
              animation={window.google?.maps?.Animation?.DROP}
            />
          )}

          {/* Destination marker - Red */}
          {destinationCoords && (
            <Marker 
              position={destinationCoords}
              icon={destinationIcon}
              title="Destination"
              animation={window.google?.maps?.Animation?.DROP}
            />
          )}

          {/* Captain location marker - Purple (for users) */}
          {userType === "user" && captainLocation && (
            <Marker 
              position={captainLocation}
              icon={captainIcon}
              title="Captain Location"
              animation={window.google?.maps?.Animation?.BOUNCE}
            />
          )}

          {/* User location marker - Blue (for captains) */}
          {userType === "captain" && userLocation && (
            <Marker 
              position={userLocation}
              icon={currentLocationIcon}
              title="User Location"
              animation={window.google?.maps?.Animation?.BOUNCE}
            />
          )}

          {/* Current location marker - Blue */}
          {currentLocation && (
            <>
              <Circle
                center={currentLocation}
                radius={20}
                options={{
                  fillColor: "#3B82F6",
                  fillOpacity: 0.1,
                  strokeColor: "#3B82F6",
                  strokeOpacity: 0.3,
                  strokeWeight: 2,
                }}
              />
              <Marker 
                position={currentLocation}
                icon={currentLocationIcon}
                title="Your Current Location"
                animation={window.google?.maps?.Animation?.DROP}
              />
            </>
          )}

          {/* Route line - Blue (Google Maps style) */}
          {/* Removed route line as requested - only showing markers */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LiveTracking;
