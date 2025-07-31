//const { split } = require("postcss/lib/list");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const result = await captainService.registerCaptain(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await captainService.loginCaptain(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const result = await captainService.logoutCaptain(req.captain._id || req.captain.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await captainService.getCaptainProfile(req.captain._id || req.captain.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const result = await captainService.updateCaptainProfile(req.captain._id || req.captain.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const result = await captainService.updateCaptainLocation(req.captain._id || req.captain.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCaptainStatistics = async (req, res) => {
  try {
    const result = await captainService.getCaptainStatistics(req.captain._id || req.captain.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCallHistory = async (req, res) => {
  try {
    const result = await captainService.getCallHistory(req.captain._id || req.captain.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const initiateCall = async (req, res) => {
  try {
    const { userPhoneNumber, rideId } = req.body;
    
    if (!userPhoneNumber) {
      return res.status(400).json({ error: "User phone number is required" });
    }

    // Clean and format the phone number
    let cleanNumber = userPhoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume it's Indian (+91)
    if (!cleanNumber.startsWith('91') && cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }

    // Generate conference name for this call
    const conferenceName = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Here you would integrate with a calling API service
    // For now, we'll simulate the call initiation
    const callResult = await captainService.initiateCallToUser(cleanNumber, rideId, req.captain._id || req.captain.id, conferenceName);
    
    res.status(200).json({
      success: true,
      message: "Call initiated successfully",
      callId: callResult.callId,
      phoneNumber: `+${cleanNumber}`,
      conferenceName: conferenceName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinConference = async (req, res) => {
  try {
    const { conferenceName, captainPhoneNumber } = req.body;
    
    if (!conferenceName || !captainPhoneNumber) {
      return res.status(400).json({ error: "Conference name and captain phone number are required" });
    }

    // Call the captain to join the conference
    const callResult = await captainService.callCaptainToConference(conferenceName, captainPhoneNumber, req.captain._id || req.captain.id);
    
    res.status(200).json({
      success: true,
      message: "Captain called to join conference",
      callId: callResult.callId,
      conferenceName: conferenceName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const callStatusCallback = async (req, res) => {
  try {
    // This endpoint receives webhooks from the calling API service
    // (Twilio, Vonage, Plivo, etc.) with call status updates
    
    const { CallSid, CallStatus, CallDuration, To, From } = req.body;
    
    console.log('Call status callback received:', {
      CallSid,
      CallStatus,
      CallDuration,
      To,
      From
    });

    // Update call record in database
    const result = await captainService.updateCallStatus(CallSid, CallStatus, CallDuration);
    
    res.status(200).json({ success: true, message: "Call status updated" });
  } catch (error) {
    console.error('Error in call status callback:', error);
    res.status(500).json({ error: error.message });
  }
};

const voiceResponse = async (req, res) => {
  try {
    console.log('=== VOICE RESPONSE REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    // Generate unique conference name
    const conferenceName = `ride_${req.body.CallSid}_${Date.now()}`;
    
    // Create TwiML response for conference call
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello! This is your ride captain calling. Please wait while we connect you to the conference.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        You are now joining the conference with your captain.
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
            recordingStatusCallback="${process.env.BASE_URL}/captains/recording-callback"
            recordingStatusCallbackEvent="completed"
            recordingStatusCallbackMethod="POST"
            trim="trim-silence"
            statusCallback="${process.env.BASE_URL}/captains/conference-status"
            statusCallbackEvent="start end join leave mute hold"
            statusCallbackMethod="POST"
        >
            ride_conference_shared
        </Conference>
    </Dial>
</Response>`;
    
    res.send(twiml);
  } catch (error) {
    console.error('Error in voice response:', error);
    res.status(500).send('Error');
  }
};

const voiceHandler = async (req, res) => {
  try {
    console.log('=== VOICE HANDLER REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('Digits:', req.body.Digits);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    const digits = req.body.Digits;
    let twiml = '';
    
    if (digits === '1') {
      // User wants to speak with captain
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Connecting you to your captain. Please wait.
    </Say>
    <Pause length="2"/>
    <Say voice="alice" language="en-IN">
        You are now connected. You can speak with your captain.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        Captain, you can now speak with your passenger.
    </Say>
    <Pause length="30"/>
    <Say voice="alice" language="en-IN">
        Thank you for using our service. Have a safe ride!
    </Say>
</Response>`;
    } else if (digits === '2') {
      // User just wants to confirm pickup
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Pickup location confirmed. Your captain will arrive shortly.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        Thank you for using our ride sharing service!
    </Say>
</Response>`;
    } else {
      // No input or invalid input
      twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Pickup location confirmed. Your captain will arrive shortly.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        Thank you for using our ride sharing service!
    </Say>
</Response>`;
    }
    
    res.send(twiml);
  } catch (error) {
    console.error('Error in voice handler:', error);
    res.status(500).send('Error');
  }
};

const recordingCallback = async (req, res) => {
  try {
    console.log('=== RECORDING CALLBACK RECEIVED ===');
    console.log('CallSid:', req.body.CallSid);
    console.log('RecordingSid:', req.body.RecordingSid);
    console.log('RecordingUrl:', req.body.RecordingUrl);
    console.log('RecordingDuration:', req.body.RecordingDuration);
    console.log('RecordingStatus:', req.body.RecordingStatus);
    console.log('===================================');
    
    // Update call record with recording information
    const result = await captainService.updateCallRecording(
      req.body.CallSid,
      req.body.RecordingSid,
      req.body.RecordingUrl,
      req.body.RecordingDuration
    );
    
    res.status(200).json({ success: true, message: "Recording callback processed" });
  } catch (error) {
    console.error('Error in recording callback:', error);
    res.status(500).json({ error: error.message });
  }
};

const conferenceStatus = async (req, res) => {
  try {
    console.log('=== CONFERENCE STATUS CALLBACK ===');
    console.log('ConferenceSid:', req.body.ConferenceSid);
    console.log('FriendlyName:', req.body.FriendlyName);
    console.log('StatusCallbackEvent:', req.body.StatusCallbackEvent);
    console.log('ParticipantLabel:', req.body.ParticipantLabel);
    console.log('CallSid:', req.body.CallSid);
    console.log('===================================');
    
    // Log conference events
    const event = req.body.StatusCallbackEvent;
    const conferenceSid = req.body.ConferenceSid;
    const participantLabel = req.body.ParticipantLabel;
    
    switch (event) {
      case 'conference-start':
        console.log(`Conference ${conferenceSid} started`);
        break;
      case 'conference-end':
        console.log(`Conference ${conferenceSid} ended`);
        break;
      case 'participant-join':
        console.log(`Participant ${participantLabel} joined conference ${conferenceSid}`);
        break;
      case 'participant-leave':
        console.log(`Participant ${participantLabel} left conference ${conferenceSid}`);
        break;
      default:
        console.log(`Conference event: ${event}`);
    }
    
    res.status(200).json({ success: true, message: "Conference status processed" });
  } catch (error) {
    console.error('Error in conference status callback:', error);
    res.status(500).json({ error: error.message });
  }
};

const captainVoiceResponse = async (req, res) => {
  try {
    console.log('=== CAPTAIN VOICE RESPONSE REQUESTED ===');
    console.log('From:', req.body.From);
    console.log('To:', req.body.To);
    console.log('CallSid:', req.body.CallSid);
    console.log('===============================');
    
    // Set content type to XML for TwiML
    res.set('Content-Type', 'text/xml');
    
    // Create TwiML response for captain to join conference
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello Captain! You have a passenger waiting in the conference. Please join to speak with them.
    </Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-IN">
        You will be connected to the conference now.
    </Say>
    <Pause length="1"/>
    <Dial>
        <Conference 
            startConferenceOnEnter="false"
            endConferenceOnExit="false"
            maxParticipants="2"
            record="true"
            recordingStatusCallback="${process.env.BASE_URL}/captains/recording-callback"
            recordingStatusCallbackEvent="completed"
            recordingStatusCallbackMethod="POST"
            trim="trim-silence"
            statusCallback="${process.env.BASE_URL}/captains/conference-status"
            statusCallbackEvent="start end join leave mute hold"
            statusCallbackMethod="POST"
        >
            ride_conference_shared
        </Conference>
    </Dial>
</Response>`;
    
    res.send(twiml);
  } catch (error) {
    console.error('Error in captain voice response:', error);
    res.status(500).send('Error');
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  updateLocation,
  getCaptainStatistics,
  getCallHistory,
  initiateCall,
  joinConference,
  callStatusCallback,
  voiceResponse,
  voiceHandler,
  recordingCallback,
  conferenceStatus,
  captainVoiceResponse
};
