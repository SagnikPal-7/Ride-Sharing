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

### **Notes**

- The `token` returned can be used for authenticated requests.
- All required fields must be present and valid for successful
