const captainModel = require("../models/captain.model");
const callModel = require("../models/call.model");
const rideModel = require("../models/ride.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const registerCaptain = async (captainData) => {
  const existingCaptain = await captainModel.findOne({ email: captainData.email });
  if (existingCaptain) {
    throw new Error("Captain already exists");
  }

  const hashedPassword = await bcrypt.hash(captainData.password, 10);
  const captain = new captainModel({
    ...captainData,
    password: hashedPassword,
  });

  await captain.save();
  const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    captain: {
      id: captain._id,
      email: captain.email,
      fullname: captain.fullname,
      vehicle: captain.vehicle,
      statistics: captain.statistics,
    },
    token,
  };
};

const loginCaptain = async (loginData) => {
  // Include password field in the query since it's excluded by default
  const captain = await captainModel.findOne({ email: loginData.email }).select("+password");
  if (!captain) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, captain.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    captain: {
      id: captain._id,
      email: captain.email,
      fullname: captain.fullname,
      vehicle: captain.vehicle,
      statistics: captain.statistics,
    },
    token,
  };
};

const getCaptainProfile = async (captainId) => {
  const captain = await captainModel.findById(captainId).select("-password");
  if (!captain) {
    throw new Error("Captain not found");
  }
  return captain;
};

const updateCaptainProfile = async (captainId, updateData) => {
  const captain = await captainModel.findByIdAndUpdate(
    captainId,
    { $set: updateData },
    { new: true }
  ).select("-password");
  
  if (!captain) {
    throw new Error("Captain not found");
  }
  return captain;
};

const updateCaptainLocation = async (captainId, locationData) => {
  const captain = await captainModel.findByIdAndUpdate(
    captainId,
    { 
      $set: { 
        currentLocation: locationData,
        "statistics.lastOnlineTime": new Date()
      } 
    },
    { new: true }
  ).select("-password");
  
  if (!captain) {
    throw new Error("Captain not found");
  }
  return captain;
};

const getCaptainStatistics = async (captainId) => {
  const captain = await captainModel.findById(captainId).select("statistics fullname email");
  if (!captain) {
    throw new Error("Captain not found");
  }
  return captain;
};

const getCallHistory = async (captainId) => {
  const calls = await callModel.find({ captainId })
    .populate('userId', 'fullname mobile')
    .populate('rideId', 'pickup destination fare')
    .sort({ createdAt: -1 })
    .limit(20);
  
  return calls;
};

const logoutCaptain = async (captainId) => {
  // Update last online time when logging out
  await captainModel.findByIdAndUpdate(
    captainId,
    { "statistics.lastOnlineTime": new Date() }
  );
  return { message: "Logout successful" };
};

const initiateCallToUser = async (phoneNumber, rideId, captainId, conferenceName = null) => {
  try {
    // Get ride details to find user
    const ride = await rideModel.findById(rideId).populate('user');
    if (!ride) {
      throw new Error('Ride not found');
    }

    // Get captain details to find captain's phone number
    const captain = await captainModel.findById(captainId);
    if (!captain) {
      throw new Error('Captain not found');
    }

    // Generate unique call ID
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create call record in database
    const callRecord = new callModel({
      captainId,
      userId: ride.user._id,
      rideId,
      phoneNumber: `+${phoneNumber}`,
      callId,
      status: "initiated",
      startTime: new Date(),
      apiProvider: "twilio",
      conferenceName: conferenceName
    });

    await callRecord.save();

    // Check if Twilio credentials are available
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio credentials not found, using test mode');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`TEST MODE: Call initiated to ${phoneNumber} for ride ${rideId} by captain ${captainId}`);
      
      return {
        callId: callRecord._id,
        status: "initiated",
        phoneNumber: `+${phoneNumber}`,
        timestamp: new Date().toISOString(),
        message: "Test call initiated successfully"
      };
    }

        // Real Twilio integration
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Generate a unique conference name for this call
      const generatedConferenceName = `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`🎯 Generated conference name: ${generatedConferenceName}`);
      
      console.log(`Initiating real call from ${process.env.TWILIO_PHONE_NUMBER} to ${phoneNumber}`);
      console.log(`Using BASE_URL: ${process.env.BASE_URL}`);
      console.log(`Voice URL: ${process.env.BASE_URL}/captains/voice`);
      
      const call = await client.calls.create({
        url: `${process.env.BASE_URL}/captains/voice?conferenceName=${encodeURIComponent(generatedConferenceName)}`,
        to: `+${phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
         record: true, // Enable call recording
         recordingStatusCallback: `${process.env.BASE_URL}/captains/recording-callback`,
         recordingStatusCallbackEvent: ['completed'],
         recordingStatusCallbackMethod: 'POST',
         statusCallback: `${process.env.BASE_URL}/captains/call-status-callback`,
         statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
         statusCallbackMethod: 'POST'
       });
      
      console.log('=== TWILIO RESPONSE ===');
      console.log('Call SID:', call.sid);
      console.log('Call Status:', call.status);
      console.log('Call Direction:', call.direction);
      console.log('Call Price:', call.price);
      console.log('Call Error:', call.errorCode, call.errorMessage);
      console.log('From Number:', call.from);
      console.log('To Number:', call.to);
      console.log('Call Duration:', call.duration);
      console.log('Call Price Unit:', call.priceUnit);
      console.log('Call Subresource URIs:', call.subresourceUris);
      console.log('======================');
      
      // Update call record with Twilio response (extract only needed fields to avoid circular reference)
      const twilioResponse = {
        sid: call.sid,
        status: call.status,
        direction: call.direction,
        from: call.from,
        to: call.to,
        duration: call.duration,
        price: call.price,
        priceUnit: call.priceUnit,
        accountSid: call.accountSid,
        apiVersion: call.apiVersion,
        uri: call.uri
      };
      
      await callModel.findByIdAndUpdate(callRecord._id, {
        apiResponse: twilioResponse,
        callId: call.sid
      });
      
             console.log(`Real call initiated with SID: ${call.sid}`);
       
               // After user call is initiated, call the captain to join conference
        if (captain.mobile) {
          console.log(`Calling captain ${captain.mobile} to join conference ${generatedConferenceName}`);
          
          // Format captain's phone number with country code
          let captainPhoneNumber = captain.mobile.replace(/\D/g, '');
          
          // Add country code if not present (assuming India +91)
          if (!captainPhoneNumber.startsWith('91') && captainPhoneNumber.length === 10) {
            captainPhoneNumber = '91' + captainPhoneNumber;
          }
          
          console.log(`Formatted captain phone number: +${captainPhoneNumber}`);
          
          // Call captain to join conference with custom TwiML
          const captainCall = await client.calls.create({
            url: `${process.env.BASE_URL}/captains/captain-voice?conferenceName=${encodeURIComponent(generatedConferenceName)}`,
            to: `+${captainPhoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            statusCallback: `${process.env.BASE_URL}/captains/call-status-callback`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST'
          });
          
          console.log(`Captain call initiated with SID: ${captainCall.sid}`);
        }
       
               return {
          callId: call.sid,
          status: call.status,
          phoneNumber: `+${phoneNumber}`,
          captainPhoneNumber: captain.mobile,
          conferenceName: generatedConferenceName,
          timestamp: new Date().toISOString(),
          message: "Real call initiated successfully via Twilio"
        };
      
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      // Fallback to test mode if Twilio fails
      console.log('Falling back to test mode due to Twilio error');
      
      return {
        callId: callRecord._id,
        status: "initiated",
        phoneNumber: `+${phoneNumber}`,
        timestamp: new Date().toISOString(),
        message: "Call initiated (test mode due to Twilio error)"
      };
    }
    
  } catch (error) {
    console.error('Error initiating call:', error);
    throw new Error('Failed to initiate call: ' + error.message);
  }
};

const updateCallStatus = async (callSid, callStatus, callDuration) => {
  try {
    // Find call record by callSid (from API provider)
    const callRecord = await callModel.findOne({ callId: callSid });
    if (!callRecord) {
      console.log(`Call record not found for callSid: ${callSid}`);
      return null;
    }

    // Map API status to our status enum
    const statusMap = {
      'initiated': 'initiated',
      'ringing': 'ringing',
      'answered': 'answered',
      'completed': 'completed',
      'failed': 'failed',
      'busy': 'busy',
      'no-answer': 'no-answer',
      'canceled': 'failed'
    };

    const mappedStatus = statusMap[callStatus] || 'failed';
    
    // Update call record
    const updateData = {
      status: mappedStatus,
      duration: callDuration || 0
    };

    // If call is completed or failed, set end time
    if (['completed', 'failed', 'busy', 'no-answer'].includes(mappedStatus)) {
      updateData.endTime = new Date();
    }

    const updatedCall = await callModel.findByIdAndUpdate(
      callRecord._id,
      updateData,
      { new: true }
    );

    console.log(`Call status updated: ${callSid} -> ${mappedStatus}`);
    
    return updatedCall;
  } catch (error) {
    console.error('Error updating call status:', error);
    throw new Error('Failed to update call status: ' + error.message);
  }
};

const updateCallRecording = async (callSid, recordingSid, recordingUrl, recordingDuration) => {
  try {
    // Find call record by callSid
    const callRecord = await callModel.findOne({ callId: callSid });
    if (!callRecord) {
      console.log(`Call record not found for callSid: ${callSid}`);
      return null;
    }

    // Update call record with recording information
    const updatedCall = await callModel.findByIdAndUpdate(
      callRecord._id,
      {
        recordingSid,
        recordingUrl,
        recordingDuration: recordingDuration || 0
      },
      { new: true }
    );

    console.log(`Call recording updated: ${callSid} -> ${recordingSid}`);
    console.log(`Recording URL: ${recordingUrl}`);
    console.log(`Recording Duration: ${recordingDuration} seconds`);
    
    return updatedCall;
  } catch (error) {
    console.error('Error updating call recording:', error);
    throw new Error('Failed to update call recording: ' + error.message);
  }
};

const callCaptainToConference = async (conferenceName, captainPhoneNumber, captainId) => {
  try {
    console.log(`Calling captain ${captainPhoneNumber} to join conference ${conferenceName}`);
    
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio credentials not found, using test mode');
      return {
        callId: `test_${Date.now()}`,
        status: "initiated",
        conferenceName: conferenceName,
        message: "Test call to captain initiated"
      };
    }

    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Create TwiML for captain to join conference
    const captainTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice" language="en-IN">
        Hello Captain! You have a passenger waiting in the conference. Please join to speak with them.
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
            ${conferenceName}
        </Conference>
    </Dial>
</Response>`;

    // Call the captain
    const call = await client.calls.create({
      url: `${process.env.BASE_URL}/captains/captain-voice`,
      to: `+${captainPhoneNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      statusCallback: `${process.env.BASE_URL}/captains/call-status-callback`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST'
    });

    console.log(`Captain call initiated with SID: ${call.sid}`);
    
    return {
      callId: call.sid,
      status: call.status,
      conferenceName: conferenceName,
      message: "Captain called to join conference"
    };
    
  } catch (error) {
    console.error('Error calling captain to conference:', error);
    throw new Error('Failed to call captain to conference: ' + error.message);
  }
};

module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  updateCaptainProfile,
  updateCaptainLocation,
  getCaptainStatistics,
  getCallHistory,
  logoutCaptain,
  initiateCallToUser,
  updateCallStatus,
  updateCallRecording,
  callCaptainToConference
};
