# Backend API Documentation

## `/users/register` Endpoint

### Description

Registers a new user by creating a user account with the provided information in the Ride-Sharing application.

### HTTP Method

`POST`

---

### **Request Body**

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### **Field Requirements**

- `fullname` (object):
  - `firstname` (string): User's first name (minimum 3 characters).
  - `lastname` (string): User's last name (minimum 3 characters).
- `email` (string): User's email address (must be a valid email).
- `password` (string): User's password (minimum 6 characters).

---

### **Responses**

#### **201 Created**

- **Description:** User registered successfully.
- **Body:**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```

#### **400 Bad Request**

- **Description:** Validation failed (e.g., missing fields, invalid email, short password).
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      }
      // ...other errors
    ]
  }
  ```

---

### **Example Request**

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Jane", "lastname": "Smith" },
    "email": "jane.smith@example.com",
    "password": "securepassword"
  }'
```

---

## `/users/login` Endpoint

### Description

Authenticates a user and returns a JWT token if the credentials are valid.

### HTTP Method

`POST`

---

### **Request Body**

Send a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### **Field Requirements**

- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).

---

### **Responses**

#### **200 OK**

- **Description:** User authenticated successfully.
- **Body:**
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketId": null
    }
  }
  ```

#### **400 Bad Request**

- **Description:** Validation failed (e.g., missing fields, invalid email, short password).
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      }
      // ...other errors
    ]
  }
  ```

#### **401 Unauthorized**

- **Description:** Invalid email or password.
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### **Example Request**

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "securepassword"
  }'
```

---

## `/users/profile` Endpoint

### Description

Retrieves the profile information of the currently authenticated user.
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Authentication**

Requires a valid JWT token in the Authorization header: `Authorization: Bearer <jwt_token>` or as a `token` cookie.

---

### **Responses**

#### **200 OK**

- **Description:** Returns the user's profile.
- **Body:**
  ```json
  {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
  ```

#### **401 Unauthorized**

- **Description:** Missing or invalid token.
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### **Example Request**

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## `/users/logout` Endpoint

### Description

Logout the current user and blacklist the token provided in cookie or headers.
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Headers**

Requires a valid JWT token in the Authorization header or cookie:

- `Authorization: Bearer <jwt_token>`

---

#### **200 OK**

- **Description:** User logged out successfully.
- **Body:**
  ```json
  {
    "message": "Logged Out"
  }
  ```

#### **401 Unauthorized**

- **Description:** Missing or invalid token.
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### **Example Request**

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

## `/captains/register` Endpoint

### Description

Registers a new captain (driver) with vehicle information in the Ride-Sharing application.

### HTTP Method

`POST`

---

### **Request Body**

The request body should be in JSON format and include the following fields:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
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

#### **Field Requirements**

- `fullname.firstname` (string, required): Minimum 3 characters.
- `fullname.lastname` (string, optional): Minimum 3 characters if provided.
- `email` (string, required): Must be a valid email address.
- `password` (string, required): Minimum 6 characters.
- `vehicle.color` (string, required): Minimum 3 characters.
- `vehicle.plate` (string, required): Minimum 3 characters.
- `vehicle.capacity` (integer, required): Minimum 1.
- `vehicle.vehicleType` (string, required): Must be one of `"car"`, `"motorcycle"`, or `"auto"`.

---

### **Responses**

#### **201 Created**

- **Description:** Captain registered successfully.
- **Body:**
  ```json
  {
    "token": "<jwt_token>",
    "captain": {
      "_id": "<captain_id>",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "ABC123",
        "capacity": 4,
        "vehicleType": "car"
      },
      "status": "inactive",
      "socketId": null
    }
  }
  ```

#### **400 Bad Request**

- **Description:** Validation failed (e.g., missing fields, invalid email, short password, invalid vehicle info).
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "First name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      }
      // ...other errors
    ]
  }
  ```

---

### **Example Request**

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "Jane", "lastname": "Smith" },
    "email": "jane.smith@example.com",
    "password": "securepassword",
    "vehicle": {
      "color": "Blue",
      "plate": "XYZ789",
      "capacity": 3,
      "vehicleType": "auto"
    }
  }'
```

---

## `/captains/login` Endpoint

### Description

Authenticates a captain and returns a JWT token if the credentials are valid.

### HTTP Method

`POST`

---

### **Request Body**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

---

### **Responses**

#### **200 OK**

```json
{
  "token": "<jwt_token>",
  "captain": {
    "_id": "<captain_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null
  }
}
```

#### **400 Bad Request**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
    // ...other errors
  ]
}
```

#### **401 Unauthorized**

```json
{
  "message": "Invalid email or password"
}
```

---

### **Example Request**

```bash
curl -X POST http://localhost:3000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "securepassword"
  }'
```

---

## `/captains/profile` Endpoint

### Description

Retrieves the profile information of the currently authenticated captain.  
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Headers**

- `Authorization: Bearer <jwt_token>`

---

### **Responses**

#### **200 OK**

```json
{
  "captain": {
    "_id": "<captain_id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null
  }
}
```

#### **401 Unauthorized**

```json
{
  "message": "Unauthorized"
}
```

---

### **Example Request**

```bash
curl -X GET http://localhost:3000/captains/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## `/captains/logout` Endpoint

### Description

Logs out the authenticated captain by blacklisting their JWT token for 24 hours.  
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Headers**

- `Authorization: Bearer <jwt_token>`

---

### **Responses**

#### **200 OK**

```json
{
  "message": "Logout Successfully"
}
```

#### **401 Unauthorized**

```json
{
  "message": "Unauthorized"
}
```

---

### **Example Request**

```bash
curl -X GET http://localhost:3000/captains/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

## `/rides/create` Endpoint

### Description

Creates a new ride request for an authenticated user.

### HTTP Method

`POST`

---

### **Authentication**

Requires a valid JWT token in the Authorization header: `Authorization: Bearer <jwt_token>` or as a `token` cookie.

---

### **Request Body**

Send a JSON object with the following structure:

```json
{
  "pickup": "123 Main St",
  "destination": "456 Elm St",
  "vehicleType": "car"
}
```

#### **Field Requirements**

- `pickup` (string, required): Pickup address (minimum 3 characters).
- `destination` (string, required): Destination address (minimum 3 characters).
- `vehicleType` (string, required): Must be one of `"auto"`, `"car"`, `"motorcycle"`.

---

### **Responses**

#### **201 Created**

- **Description:** Ride created successfully.
- **Body:**
  ```json
  {
    "_id": "<ride_id>",
    "user": "<user_id>",
    "pickup": "123 Main St",
    "destination": "456 Elm St",
    "otp": "123456",
    "fare": 120.5,
    "status": "pending"
    // ...other ride fields
  }
  ```

#### **400 Bad Request**

- **Description:** Validation failed (e.g., missing fields, invalid vehicle type).
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid pickup address",
        "param": "pickup",
        "location": "body"
      }
      // ...other errors
    ]
  }
  ```

#### **401 Unauthorized**

- **Description:** Missing or invalid token.
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

---

### **Example Request**

```bash
curl -X POST http://localhost:3000/rides/create \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": "123 Main St",
    "destination": "456 Elm St",
    "vehicleType": "car"
  }'
```

---

## `/maps/get-coordinates`, `/maps/get-distance-time`, `/maps/get-suggestions` Endpoints

### Description

These endpoints provide geolocation, distance, and autocomplete services using Google Maps API.  
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Authentication**

Requires a valid JWT token in the Authorization header: `Authorization: Bearer <jwt_token>` or as a `token` cookie.

---

### **Endpoints and Query Parameters**

- `/maps/get-coordinates?address=...`

  - `address` (string, required): The address to geocode.

- `/maps/get-distance-time?origin=...&destination=...`

  - `origin` (string, required): Origin address.
  - `destination` (string, required): Destination address.

- `/maps/get-suggestions?input=...`
  - `input` (string, required): Input string for autocomplete.

---

### **Responses**

#### **200 OK**

- **/maps/get-coordinates**

  ```json
  {
    "ltd": 12.9716,
    "lng": 77.5946
  }
  ```

- **/maps/get-distance-time**

  ```json
  {
    "distance": { "text": "5.1 km", "value": 5100 },
    "duration": { "text": "12 mins", "value": 720 }
    // ...other fields
  }
  ```

- **/maps/get-suggestions**
  ```json
  [
    {
      "description": "123 Main St, City, Country",
      "place_id": "abc123"
      // ...other fields
    }
    // ...more suggestions
  ]
  ```

#### **400 Bad Request**

- **Description:** Validation failed (e.g., missing or invalid query parameters).
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid address",
        "param": "address",
        "location": "query"
      }
      // ...other errors
    ]
  }
  ```

#### **401 Unauthorized**

- **Description:** Missing or invalid token.
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

#### **404 Not Found** (for `/maps/get-coordinates`)

```json
{
  "message": "coordinates not found"
}
```

#### **500 Internal Server Error**

```json
{
  "message": "Internal server error"
}
```

---

### **Example Request**

```bash
curl -X GET "http://localhost:3000/maps/get-coordinates?address=123+Main+St" \
  -H "Authorization: Bearer <jwt_token>"
```

---

---

## `/rides/get-fare` Endpoint

### Description

Retrieves the fare estimate for a ride between the provided pickup and destination addresses.

### HTTP Method

`GET`

### Authentication

Requires a valid JWT token in the Authorization header:
`Authorization: Bearer <token>`

### Request Parameters

- `pickup` (string, required): The pickup address (minimum 3 characters).
- `destination` (string, required): The destination address (minimum 3 characters).

### Example Request

```
GET /rides/get-fare?pickup=1600+Amphitheatre+Parkway,+Mountain+View,+CA&destination=1+Infinite+Loop,+Cupertino,+CA
```

### Example Response

```json
{
  "auto": 50.0,
  "car": 75.0,
  "moto": 40.0
}
```

### Error Response

- `400 Bad Request`: If any required parameter is missing or invalid.
- `500 Internal Server Error`: If there is an error calculating the fare.

## **General Notes**

- All endpoints that require authentication accept the JWT token via the `Authorization: Bearer <jwt_token>` header or as a `token` cookie.
- All error responses follow a consistent structure with either an `errors` array or a `message` field.
- All time and distance calculations use Google Maps API under the hood.

---
