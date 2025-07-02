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

- `user` (object):
  - `fullname` (object).
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
        "msg": "First name must be atleast 3 characters long",
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

---

## `/users/login` Endpoint

### Description

Authenticates a user and returns a JWT token if the credentials are valid.

### HTTP Method

`POST`

---

### **Request Body**

Send a JSON object with the following structure:

- `email` (string, required):User's email address (must be a valid email).
- `password` (string,required): User's password (minimum 6 characters).

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### **Field Requirements**

- `user` (object):
  - `fullname` (object).
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).
  - `email` (string): User's email address (must be a valid email).
  - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token

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

---

## `/users/profile` Endpoint

### Description

Retrieves the profile information of the currently authenticated user.
**Requires authentication via JWT token.**

### HTTP Method

`GET`

---

### **Authentication**

Requires a valid JWT token in the Authorization header: `Authorization: Bearer <jwt_token>`

---

### **Responses**

- `user` (object):
  - `fullname` (object).
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).
  - `email` (string): User's email address (must be a valid email).

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

---

## `/users/logout` Endpoint

### Description

Logout the current user and blacklist the token provided in cookie or headers
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

---

## `/captains/register` Endpoint

### Description

Registers a new captain (driver) with vehicle information in the Ride-Sharing application.

### HTTP Method

`POST`

---

### **Request Body**

The request body should be in JSON format and include the following fields:

- `fullname` (object):
  - `firstname` (string, required): Captain's first name (minimum 3 characters).
  - `lastname` (string, optional): Captain's last name (minimum 3 characters).
- `email` (string, required): Captain's email address (must be a valid email).
- `password` (string, required): Captain's password (minimum 6 characters).
- `vehicle` (object):
  - `color` (string, required): Vehicle color (minimum 3 characters).
  - `plate` (string, required): Vehicle plate number (minimum 3 characters).
  - `capacity` (number, required): Vehicle passenger capacity (minimum 1).
  - `vehicleType` (string, required): Type of vehicle (must be 'car', 'motorcycle', or 'auto').

Send a JSON object with the following structure:

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

- `captain` (object):
  - `fullname` (object).
    - `firstname` (string): Captain's first name (minimum 3 characters).
    - `lastname` (string): Captain's last name (minimum 3 characters).
  - `email` (string): Captain's email address (must be a valid email).
  - `password` (string): Captain's password (minimum 6 characters).
  - `vehicle` (object):
    - `color` (string): Vehicle color.
    - `plate` (string): Vehicle plate number.
    - `capacity` (number): Vehicle passenger capacity.
    - `vehicleType` (string): Type of vehicle.
- `token` (String): JWT Token

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
  "email": "john.doe@example.com", // string, required, must be a valid email
  "password": "yourpassword" // string, required, min 6 chars
}
```

---

### **Responses**

- `captain` (object):
  - `fullname` (object).
    - `firstname` (string): Captain's first name (minimum 3 characters).
    - `lastname` (string): Captain's last name (minimum 3 characters).
  - `email` (string): Captain's email address (must be a valid email).
  - `password` (string): Captain's password (minimum 6 characters).
  - `vehicle` (object):
    - `color` (string): Vehicle color.
    - `plate` (string): Vehicle plate number.
    - `capacity` (number): Vehicle passenger capacity.
    - `vehicleType` (string): Type of vehicle.
- `token` (String): JWT Token

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

- `captain` (object):
  - `fullname` (object).
    - `firstname` (string): Captain's first name (minimum 3 characters).
    - `lastname` (string): Captain's last name (minimum 3 characters).
  - `email` (string): Captain's email address (must be a valid email).
  - `vehicle` (object):
    - `color` (string): Vehicle color.
    - `plate` (string): Vehicle plate number.
    - `capacity` (number): Vehicle passenger capacity.
    - `vehicleType` (string): Type of vehicle.

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

- `message` (string): Logout successfully.

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

---
