# Backend API Documentation

---

## Authentication

All endpoints requiring authentication expect a JWT token in the `Authorization: Bearer <jwt_token>` header or as a `token` cookie.

---

## User Endpoints

### `POST /users/register`

Register a new user.
**Request Body:**

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Response:**
201 Created

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

### `POST /users/login`

Authenticate user and get JWT token.
**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Response:**
200 OK

```json
{
  "token": "<jwt_token>",
  "user": {
    "_id": "<user_id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

### `GET /users/profile`

Get authenticated user's profile.

### `GET /users/logout`

Logout user and blacklist token.

### `PUT /users/update-phone`

Update user phone number.
**Request Body:**

```json
{ "phone": "9876543210" }
```

### `PUT /users/update-profile-image`

Upload/update user profile image (multipart/form-data).

### `POST /users/initiate-call`

Initiate a call to captain.
**Request Body:**

```json
{ "rideId": "<rideId>", "captainPhoneNumber": "<phone>" }
```

---

## Captain Endpoints

### `POST /captains/register`

Register a new captain (driver).
**Request Body:**

```json
{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### `POST /captains/login`

Authenticate captain and get JWT token.

### `GET /captains/profile`

Get authenticated captain's profile.

### `GET /captains/logout`

Logout captain and blacklist token.

### `PUT /captains/location`

Update captain location.

### `PUT /captains/availability`

Update captain availability status.

### `GET /captains/statistics`

Get captain statistics.

### `GET /captains/call-history`

Get captain call history.

### `POST /captains/initiate-call`

Initiate call to user.

### `POST /captains/join-conference`

Join conference call.

---

## Ride Endpoints

### `POST /rides/create`

Create a new ride request.
**Request Body:**

```json
{
  "pickup": "123 Main St",
  "destination": "456 Elm St",
  "vehicleType": "car"
}
```

### `GET /rides/get-fare`

Get fare estimate.
**Query Params:** `pickup`, `destination`

### `POST /rides/confirm`

Captain confirms ride.
**Request Body:**

```json
{ "rideId": "<rideId>" }
```

### `GET /rides/start-ride`

Captain starts ride.
**Query Params:** `rideId`, `otp`

### `POST /rides/end-ride`

Captain ends ride.
**Request Body:**

```json
{ "rideId": "<rideId>" }
```

### `GET /rides/details/:rideId`

Get ride details.

### `GET /rides/route`

Get route between points.
**Query Params:** `origin`, `destination`

---

## Maps Endpoints

### `GET /maps/get-coordinates`

Get coordinates for an address.
**Query Param:** `address`

### `GET /maps/get-distance-time`

Get distance and time between two addresses.
**Query Params:** `origin`, `destination`

### `GET /maps/get-suggestions`

Get address autocomplete suggestions.
**Query Param:** `input`

---

## Payment Endpoints

### `POST /payments/create-payment-intent`

Create Stripe payment intent.
**Request Body:**

```json
{ "rideId": "<rideId>", "amount": 100 }
```

### `POST /payments/process-payment`

Process payment.
**Request Body:**

```json
{ "rideId": "<rideId>", "amount": 100 }
```

### `POST /payments/confirm-payment`

Confirm payment.
**Request Body:**

```json
{ "rideId": "<rideId>", "paymentIntentId": "<intentId>" }
```

### `GET /payments/payment-status/:rideId`

Get payment status for a ride.

---

## User-to-Captain Conference Call Feature

### Overview

Users can initiate conference calls to their ride captains from the "Waiting for Driver" page. Both user and captain are connected to the same conference call with voice prompts.

### How It Works

1. User clicks "Call Captain (Conference)" button
2. Backend calls both captain's and user's phone numbers
3. Voice prompts:
   - Captain: "Hello Captain! You have a passenger calling you. Please wait while we connect you to the conference."
   - User: "Hello! You are being connected to your ride captain. Please wait while we join the conference."
4. Both join the same conference room
5. Call is recorded for safety

### API Endpoints

- `POST /users/initiate-call` - Initiate conference call
- `POST /users/voice` - Twilio webhook for user voice response
- `POST /users/user-voice` - Twilio webhook for user voice response in conference
- `POST /users/captain-voice` - Twilio webhook for captain voice response
- `POST /users/call-status-callback` - Twilio webhook for call status updates
- `POST /users/recording-callback` - Twilio webhook for recording status
- `POST /users/conference-status` - Twilio webhook for conference status

**Request Format:**

```json
{
  "rideId": "ride_id_here",
  "captainPhoneNumber": "captain_phone_number"
}
```

**Response Format:**

```json
{
  "success": true,
  "message": "Conference call initiated successfully",
  "callId": "call_id_here",
  "captainCallSid": "twilio_captain_call_sid",
  "userCallSid": "twilio_user_call_sid",
  "phoneNumber": "+91XXXXXXXXXX",
  "conferenceName": "conference_name",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "mode": "real" // or "test"
}
```

### Voice Prompts

- Captain: "Hello Captain! You have a passenger calling you. Please wait while we connect you to the conference." / "Connecting you to your passenger now."
- User: "Hello! You are being connected to your ride captain. Please wait while we join the conference." / "You are now joining the conference with your captain."

### Frontend Integration

- Single "Call Captain (Conference)" button in `WaitingForDriver` component
- Loading state during call initiation
- Success/error status messages
- Disabled state while calling
- Automatic status clearing after 5 seconds
- Clear indication that it's a conference call
- Message indicating both user and captain will receive calls

### Environment Variables Required

- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `BASE_URL` - Your ngrok or production URL

### Test Mode

If Twilio credentials are not configured, the system simulates conference call initiation without making actual calls.

### Conference Features

- Max Participants: 2 (User + Captain)
- Recording: Enabled for safety
- Beep Sound: Disabled
- Participant Labels: "User" and "Captain"
- Auto End: Conference ends when either party leaves
- Dual Calling: Both user and captain receive phone calls to join the same conference
