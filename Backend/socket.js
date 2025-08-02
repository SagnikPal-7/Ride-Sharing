const socketIO = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io = null;

function initializeSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "*", // Adjust as needed for security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      console.log(`User ${userId} joined as ${userType}`);

      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await captainModel.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });

    // New event for updating captain location during active ride
    socket.on("update-captain-location", async (data) => {
      const { rideId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        const ride = await rideModel.findById(rideId).populate("user");
        if (!ride) {
          return socket.emit("error", { message: "Ride not found" });
        }

        // Update captain location in ride
        await rideModel.findByIdAndUpdate(rideId, {
          captainLocation: {
            lat: location.lat,
            lng: location.lng,
          },
        });

        // Send updated location to user
        if (ride.user && ride.user.socketId) {
          sendMessageToSocketId(ride.user.socketId, {
            event: "captain-location-updated",
            data: {
              rideId,
              location,
            },
          });
        }
      } catch (error) {
        console.error("Error updating captain location:", error);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    // New event for updating user location during active ride
    socket.on("update-user-location", async (data) => {
      const { rideId, location } = data;

      if (!location || !location.lat || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        const ride = await rideModel.findById(rideId).populate("captain");
        if (!ride) {
          return socket.emit("error", { message: "Ride not found" });
        }

        // Update user location in ride
        await rideModel.findByIdAndUpdate(rideId, {
          userLocation: {
            lat: location.lat,
            lng: location.lng,
          },
        });

        // Send updated location to captain
        if (ride.captain && ride.captain.socketId) {
          sendMessageToSocketId(ride.captain.socketId, {
            event: "user-location-updated",
            data: {
              rideId,
              location,
            },
          });
        }
      } catch (error) {
        console.error("Error updating user location:", error);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    // You can add more event listeners here
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

function sendMessageToSocketId(socketId, messageObject) {
  console.log(`Sending message to ${socketId}`, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error("Socket.io not initialized");
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
