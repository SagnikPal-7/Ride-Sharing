const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and Destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }
      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distanceand time");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const predictions = response.data.predictions;

      const suggestionsWithCoords = await Promise.all(
        predictions.map(async (prediction) => {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${apiKey}`;
          const detailsResponse = await axios.get(detailsUrl);
          if (detailsResponse.data.status === "OK") {
            const location = detailsResponse.data.result.geometry.location;
            return { ...prediction, location };
          } else {
            console.warn(
              `Could not fetch details for place_id ${prediction.place_id}`
            );
            return prediction; // Return prediction without location if details fetch fails
          }
        })
      );

      return suggestionsWithCoords;
    } else {
      throw new Error("Unable to feth suggestions");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType = null) => {
  //in Km
  const query = {
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  };

  // Add vehicle type filter if specified
  if (vehicleType) {
    query["vehicle.vehicleType"] = vehicleType;
  }

  const captains = await captainModel.find(query);

  return captains;
};

module.exports.getRouteBetweenPoints = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  // Use driving mode to get the shortest route following roads
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    `${origin.lat},${origin.lng}`
  )}&destination=${encodeURIComponent(
    `${destination.lat},${destination.lng}`
  )}&mode=driving&optimize=true&key=${apiKey}`;

  console.log("Calling Google Directions API for shortest route:", url);

  try {
    const response = await axios.get(url);
    console.log("Google Directions API response status:", response.data.status);
    
    if (response.data.status === "OK") {
      const route = response.data.routes[0];
      if (route && route.legs && route.legs.length > 0) {
        // Get detailed polyline from the first leg for shortest path
        const leg = route.legs[0];
        if (leg.steps && leg.steps.length > 0) {
          // Build route from individual steps for most accurate road-following path
          const detailedPath = [];
          
          // Add start point
          detailedPath.push({
            lat: parseFloat(leg.start_location.lat),
            lng: parseFloat(leg.start_location.lng)
          });
          
          // Add points from each step to follow roads exactly
          leg.steps.forEach((step, index) => {
            if (step.polyline && step.polyline.points) {
              const stepPoints = decodePolyline(step.polyline.points);
              // Add all points from this step to follow the road exactly
              detailedPath.push(...stepPoints);
            }
          });
          
          // Add end point
          detailedPath.push({
            lat: parseFloat(leg.end_location.lat),
            lng: parseFloat(leg.end_location.lng)
          });
          
          console.log("Created shortest route with", detailedPath.length, "points following roads");
          return detailedPath;
        } else if (route.overview_polyline) {
          // Fallback to overview polyline
          const points = decodePolyline(route.overview_polyline.points);
          console.log("Using overview polyline with", points.length, "points");
          return points;
        }
      }
      
      console.warn("No detailed route found in Google Directions response");
      throw new Error("No route found");
    } else {
      console.error("Google Directions API error:", response.data.status, response.data.error_message);
      throw new Error(`Unable to fetch route: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error fetching route from Google Directions API:", error);
    throw error;
  }
};

// Helper function to decode Google's polyline format
function decodePolyline(encoded) {
  const poly = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let shift = 0, result = 0;

    do {
      let b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (result >= 0x20);

    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      let b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (result >= 0x20);

    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return poly;
}
