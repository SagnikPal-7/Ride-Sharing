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
