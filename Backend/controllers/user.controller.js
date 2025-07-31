const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
// Parse the CLOUDINARY_URL: cloudinary://874352292645437:nBCcPIH63jxo_av0UBSaIz2mJa0@djtgsywb6
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  const urlParts = cloudinaryUrl.replace('cloudinary://', '').split('@');
  const credentials = urlParts[0].split(':');
  
  cloudinary.config({
    cloud_name: urlParts[1],
    api_key: credentials[0],
    api_secret: credentials[1],
  });
}

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  // re.cookie("token", token, {
  //   httpOnly: true,
  //   srcure: process.env.NODE_ENV === "production",
  //   maxAge: 3600000,
  // });

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");

  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged Out" });
};

module.exports.updatePhoneNumber = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { mobile: phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Phone number updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const userId = req.user._id;

    // Convert buffer to base64 string for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'profile-images',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Update user with Cloudinary URL
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Profile image updated successfully", 
      user: updatedUser,
      imageUrl: result.secure_url
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.initiateCallToCaptain = async (req, res, next) => {
  try {
    const { rideId, captainPhoneNumber } = req.body;
    const userId = req.user._id;

    if (!rideId) {
      return res.status(400).json({ error: "Ride ID is required" });
    }

    if (!captainPhoneNumber) {
      return res.status(400).json({ error: "Captain phone number is required" });
    }

    // Clean and format the phone number
    let cleanNumber = captainPhoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume it's Indian (+91)
    if (!cleanNumber.startsWith('91') && cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }

    // Generate unique conference name for this call
    const conferenceName = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Import the call model
    const callModel = require("../models/call.model");
    
    // Generate unique call ID
    const callId = `user_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create call record in database
    const callRecord = new callModel({
      captainId: null, // Will be updated when captain joins
      userId,
      rideId,
      phoneNumber: `+${cleanNumber}`,
      callId,
      status: "initiated",
      startTime: new Date(),
      apiProvider: "twilio",
      conferenceName: conferenceName,
      initiatedBy: "user"
    });

    await callRecord.save();

    // Check if Twilio credentials are available
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio credentials not found, using test mode');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`TEST MODE: User ${userId} initiated conference call to captain ${cleanNumber} for ride ${rideId}`);
      
      return res.status(200).json({
        success: true,
        message: "Conference call initiated successfully",
        callId: callRecord._id,
        phoneNumber: `+${cleanNumber}`,
        conferenceName: conferenceName,
        timestamp: new Date().toISOString(),
        mode: "test"
      });
    }

    // Real Twilio integration
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      console.log(`Initiating conference call to captain ${cleanNumber}`);
      
      // Get user's phone number
      const userPhoneNumber = req.user.mobile;
      if (!userPhoneNumber) {
        return res.status(400).json({ error: "User phone number not found. Please update your profile with a phone number." });
      }
      
      // Clean and format user's phone number
      let cleanUserNumber = userPhoneNumber.replace(/\D/g, '');
      if (!cleanUserNumber.startsWith('91') && cleanUserNumber.length === 10) {
        cleanUserNumber = '91' + cleanUserNumber;
      }
      
      console.log(`User phone number: ${cleanUserNumber}, Captain phone number: ${cleanNumber}`);
      
      // Call the captain to join the conference
      const captainCall = await client.calls.create({
        url: `${process.env.BASE_URL}/users/captain-voice?conference=${conferenceName}`,
        to: `+${cleanNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        record: true,
        recordingStatusCallback: `${process.env.BASE_URL}/users/recording-callback`,
        recordingStatusCallbackEvent: ['completed'],
        recordingStatusCallbackMethod: 'POST',
        statusCallback: `${process.env.BASE_URL}/users/call-status-callback`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST'
      });

      console.log(`Captain call initiated with SID: ${captainCall.sid}`);
      
      // Now call the user to join the same conference
      const userCall = await client.calls.create({
        url: `${process.env.BASE_URL}/users/user-voice?conference=${conferenceName}`,
        to: `+${cleanUserNumber}`, // Call the user's phone number
        from: process.env.TWILIO_PHONE_NUMBER,
        record: true,
        recordingStatusCallback: `${process.env.BASE_URL}/users/recording-callback`,
        recordingStatusCallbackEvent: ['completed'],
        recordingStatusCallbackMethod: 'POST',
        statusCallback: `${process.env.BASE_URL}/users/call-status-callback`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST'
      });

      console.log(`User call initiated with SID: ${userCall.sid}`);
      
      // Update call record with both call details
      await callModel.findByIdAndUpdate(callRecord._id, {
        $set: {
          captainCallSid: captainCall.sid,
          userCallSid: userCall.sid,
          status: "connecting",
          conferenceName: conferenceName
        }
      });

      return res.status(200).json({
        success: true,
        message: "Conference call initiated successfully",
        callId: callRecord._id,
        captainCallSid: captainCall.sid,
        userCallSid: userCall.sid,
        phoneNumber: `+${cleanNumber}`,
        userPhoneNumber: `+${cleanUserNumber}`,
        conferenceName: conferenceName,
        timestamp: new Date().toISOString(),
        mode: "real"
      });

    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      // Update call record with error
      await callModel.findByIdAndUpdate(callRecord._id, {
        $set: {
          status: "failed",
          error: twilioError.message
        }
      });
      
      return res.status(200).json({
        success: true,
        message: "Call initiated (test mode due to Twilio error)",
        callId: callRecord._id,
        phoneNumber: `+${cleanNumber}`,
        conferenceName: conferenceName,
        timestamp: new Date().toISOString(),
        mode: "test",
        error: twilioError.message
      });
    }

  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add endpoint for user to join conference via web
module.exports.joinConference = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const userId = req.user._id;

    // Find the call record
    const callModel = require("../models/call.model");
    const callRecord = await callModel.findOne({ 
      callId: callId,
      userId: userId,
      status: { $in: ["initiated", "connecting"] }
    });

    if (!callRecord) {
      return res.status(404).json({ error: "Call not found or not available" });
    }

    // Generate Twilio Client token for web-based conference
    const twilio = require('twilio');
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    // Create access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity: `user_${userId}` }
    );

    // Create voice grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    return res.status(200).json({
      success: true,
      token: token.toJwt(),
      conferenceName: callRecord.conferenceName,
      callId: callRecord.callId
    });

  } catch (error) {
    console.error('Error joining conference:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.userVoiceResponse = async (req, res) => {
  try {
    console.log('=== USER VOICE RESPONSE REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    // Create TwiML response for user to join conference
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello! You are calling your ride captain. Please wait while we connect you to the conference.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        Connecting you to your captain now.
    </Say>
    <Pause length="1"/>
    <Dial>
        <Conference 
            startConferenceOnEnter="true"
            endConferenceOnExit="true"
            waitUrl=""
            waitMethod="POST"
            maxParticipants="2"
            record="true"
            recordingStatusCallback="${process.env.BASE_URL}/users/recording-callback"
            recordingStatusCallbackEvent="completed"
            recordingStatusCallbackMethod="POST"
            trim="trim-silence"
            statusCallback="${process.env.BASE_URL}/users/conference-status"
            statusCallbackEvent="start end join leave mute hold"
            statusCallbackMethod="POST"
            beep="false"
            participantLabel="User"
        >
            ride_conference_shared
        </Conference>
    </Dial>
</Response>`;
    
    res.send(twiml);
  } catch (error) {
    console.error('Error in user voice response:', error);
    res.status(500).send('Error');
  }
};

module.exports.userVoiceResponseForConference = async (req, res) => {
  try {
    console.log('=== USER VOICE RESPONSE FOR CONFERENCE REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('Conference:', req.query.conference);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    const conferenceName = req.query.conference || 'ride_conference_shared';
    console.log('User joining conference:', conferenceName);
    
    // Create TwiML response for user to join conference
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello! You are being connected to your ride captain. Please wait while we join the conference.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        You are now joining the conference with your captain.
    </Say>
    <Pause length="1"/>
    <Dial>
        <Conference 
            startConferenceOnEnter="true"
            endConferenceOnExit="false"
            maxParticipants="2"
            record="true"
            recordingStatusCallback="${process.env.BASE_URL}/users/recording-callback"
            recordingStatusCallbackEvent="completed"
            recordingStatusCallbackMethod="POST"
            trim="trim-silence"
            statusCallback="${process.env.BASE_URL}/users/conference-status"
            statusCallbackEvent="start end join leave mute hold"
            statusCallbackMethod="POST"
            beep="false"
            participantLabel="User"
            waitUrl=""
            waitMethod="POST"
        >
            ${conferenceName}
        </Conference>
    </Dial>
</Response>`;
    
    console.log('User TwiML generated for conference:', conferenceName);
    res.send(twiml);
  } catch (error) {
    console.error('Error in user voice response for conference:', error);
    res.status(500).send('Error');
  }
};

module.exports.captainVoiceResponse = async (req, res) => {
  try {
    console.log('=== CAPTAIN VOICE RESPONSE REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('Conference:', req.query.conference);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    const conferenceName = req.query.conference || 'ride_conference_shared';
    console.log('Captain joining conference:', conferenceName);
    
    // Create TwiML response for captain to join conference
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello Captain! You have a passenger calling you. Please wait while we connect you to the conference.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        Connecting you to your passenger now.
    </Say>
    <Pause length="1"/>
    <Dial>
        <Conference 
            startConferenceOnEnter="false"
            endConferenceOnExit="false"
            maxParticipants="2"
            record="true"
            recordingStatusCallback="${process.env.BASE_URL}/users/recording-callback"
            recordingStatusCallbackEvent="completed"
            recordingStatusCallbackMethod="POST"
            trim="trim-silence"
            statusCallback="${process.env.BASE_URL}/users/conference-status"
            statusCallbackEvent="start end join leave mute hold"
            statusCallbackMethod="POST"
            beep="false"
            participantLabel="Captain"
            waitUrl=""
            waitMethod="POST"
        >
            ${conferenceName}
        </Conference>
    </Dial>
</Response>`;
    
    console.log('Captain TwiML generated for conference:', conferenceName);
    res.send(twiml);
  } catch (error) {
    console.error('Error in captain voice response:', error);
    res.status(500).send('Error');
  }
};

module.exports.userCallStatusCallback = async (req, res) => {
  try {
    console.log('=== USER CALL STATUS CALLBACK ===');
    console.log('CallSid:', req.body.CallSid);
    console.log('CallStatus:', req.body.CallStatus);
    console.log('CallDuration:', req.body.CallDuration);
    console.log('===============================');
    
    // Update call status in database
    const callModel = require("../models/call.model");
    await callModel.findOneAndUpdate(
      { 
        $or: [
          { callId: req.body.CallSid },
          { captainCallSid: req.body.CallSid },
          { userCallSid: req.body.CallSid }
        ]
      },
      {
        $set: {
          status: req.body.CallStatus,
          duration: req.body.CallDuration || 0,
          endTime: req.body.CallStatus === 'completed' ? new Date() : null
        }
      }
    );
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in user call status callback:', error);
    res.status(500).send('Error');
  }
};

module.exports.userRecordingCallback = async (req, res) => {
  try {
    console.log('=== USER RECORDING CALLBACK ===');
    console.log('RecordingSid:', req.body.RecordingSid);
    console.log('RecordingUrl:', req.body.RecordingUrl);
    console.log('RecordingStatus:', req.body.RecordingStatus);
    console.log('===============================');
    
    // Update call record with recording information
    const callModel = require("../models/call.model");
    await callModel.findOneAndUpdate(
      { 
        $or: [
          { callId: req.body.CallSid },
          { captainCallSid: req.body.CallSid },
          { userCallSid: req.body.CallSid }
        ]
      },
      {
        $set: {
          recordingSid: req.body.RecordingSid,
          recordingUrl: req.body.RecordingUrl,
          recordingStatus: req.body.RecordingStatus
        }
      }
    );
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in user recording callback:', error);
    res.status(500).send('Error');
  }
};

module.exports.userConferenceStatus = async (req, res) => {
  try {
    console.log('=== USER CONFERENCE STATUS ===');
    console.log('ConferenceSid:', req.body.ConferenceSid);
    console.log('FriendlyName:', req.body.FriendlyName);
    console.log('StatusCallbackEvent:', req.body.StatusCallbackEvent);
    console.log('ParticipantLabel:', req.body.ParticipantLabel);
    console.log('ParticipantSid:', req.body.ParticipantSid);
    console.log('CallSid:', req.body.CallSid);
    console.log('===============================');
    
    // Update call record with conference status
    const callModel = require("../models/call.model");
    if (req.body.StatusCallbackEvent === 'participant-join') {
      console.log(`Participant joined conference: ${req.body.FriendlyName}, Label: ${req.body.ParticipantLabel}`);
      await callModel.findOneAndUpdate(
        { conferenceName: req.body.FriendlyName },
        {
          $set: {
            status: "connected",
            conferenceSid: req.body.ConferenceSid
          }
        }
      );
    } else if (req.body.StatusCallbackEvent === 'participant-leave') {
      console.log(`Participant left conference: ${req.body.FriendlyName}, Label: ${req.body.ParticipantLabel}`);
    } else if (req.body.StatusCallbackEvent === 'conference-start') {
      console.log(`Conference started: ${req.body.FriendlyName}`);
    } else if (req.body.StatusCallbackEvent === 'conference-end') {
      console.log(`Conference ended: ${req.body.FriendlyName}`);
      await callModel.findOneAndUpdate(
        { conferenceName: req.body.FriendlyName },
        {
          $set: {
            status: "completed",
            endTime: new Date()
          }
        }
      );
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in user conference status:', error);
    res.status(500).send('Error');
  }
};
