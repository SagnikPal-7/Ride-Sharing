# Ride-Sharing Frontend Documentation

This document provides a professional overview of the main React components, context, and routing structure used in the Ride-Sharing frontend application. It describes the purpose, usage, and expected props or state for each file, as well as the authentication and protection logic for both users and captains.

---

## Table of Contents

- [App.jsx](#appjsx)
- [Start.jsx](#startjsx)
- [Home.jsx](#homexjsx)
- [UserSignup.jsx](#usersignupjsx)
- [UserLogin.jsx](#userloginjsx)
- [UserLogout.jsx](#userlogoutjsx)
- [UserProtectWrapper.jsx](#userprotectwrapperjsx)
- [CaptainSignup.jsx](#captainsignupjsx)
- [Captainlogin.jsx](#captainloginjsx)
- [CaptainLogout.jsx](#captainlogoutjsx)
- [CaptainHome.jsx](#captainhomexjsx)
- [CaptainProtectWrapper.jsx](#captainprotectwrapperjsx)
- [UserContext.jsx](#usercontextjsx)
- [CaptainContext.jsx](#captaincontextjsx)

---

## `App.jsx`

**Purpose:**  
Defines the main routing structure for the application using React Router.

**Routes:**

- `/` → `Start` (Landing page)
- `/login` → `UserLogin` (User login form)
- `/signup` → `UserSignup` (User registration form)
- `/user/logout` → `UserLogout` (User logout, protected)
- `/home` → `Home` (User home, protected)
- `/captain-login` → `Captainlogin` (Captain/driver login form)
- `/captain-signup` → `CaptainSignup` (Captain/driver registration form)
- `/captain/logout` → `CaptainLogout` (Captain logout, protected)
- `/captain-home` → `CaptainHome` (Captain home, protected)

**Usage:**  
No props required. Used as the root component in `index.js`.

---

## `Start.jsx`

**Purpose:**  
Landing page with branding and a "Continue" button to start the login process.

**Features:**

- Displays the app logo and a background image.
- "Continue" button navigates to `/login`.

**Usage:**  
No props required.

---

## `Home.jsx`

**Purpose:**  
User home page after successful login.

**Features:**

- Placeholder for user dashboard or main user features.

**Usage:**  
Protected by `UserProtectWrapper`.

---

## `UserSignup.jsx`

**Purpose:**  
User registration form.

**Features:**

- Collects first name, last name, email, and password.
- Validates required fields.
- On submit, sends a POST request to `/users/register` and stores the user and token in context and localStorage.
- Navigates to `/home` on success.

**Request Body Example:**

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

**Usage:**  
No props required.

---

## `UserLogin.jsx`

**Purpose:**  
User login form.

**Features:**

- Collects email and password.
- On submit, sends a POST request to `/users/login` and stores the user and token in context and localStorage.
- Navigates to `/home` on success.

**Request Body Example:**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Usage:**  
No props required.

---

## `UserLogout.jsx`

**Purpose:**  
Logs out the authenticated user.

**Features:**

- Sends a GET request to `/users/logout` with the JWT token.
- Removes the token from localStorage and navigates to `/login` on success.
- Shows a loading spinner and logout message.

**Usage:**  
Protected by `UserProtectWrapper`.

---

## `UserProtectWrapper.jsx`

**Purpose:**  
Protects user routes by verifying authentication.

**Features:**

- Checks for a valid JWT token in localStorage.
- Fetches user profile from `/users/profile` and sets user context.
- Redirects to `/login` if not authenticated or on error.
- Shows a loading message while verifying.

**Usage:**  
Wraps protected user routes (e.g., `/home`, `/user/logout`).

---

## `CaptainSignup.jsx`

**Purpose:**  
Captain (driver) registration form.

**Features:**

- Collects name, email, password, and vehicle details.
- Validates required fields.
- On submit, sends a POST request to `/captains/register` and stores the captain and token in context and localStorage.
- Navigates to `/captain-home` on success.

**Request Body Example:**

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "securepassword",
  "vehicle": {
    "color": "Blue",
    "plate": "XYZ789",
    "capacity": 3,
    "vehicleType": "auto"
  }
}
```

**Usage:**  
No props required.

---

## `Captainlogin.jsx`

**Purpose:**  
Captain (driver) login form.

**Features:**

- Collects email and password.
- On submit, sends a POST request to `/captains/login` and stores the captain and token in context and localStorage.
- Navigates to `/captain-home` on success.

**Request Body Example:**

```json
{
  "email": "jane.smith@example.com",
  "password": "securepassword"
}
```

**Usage:**  
No props required.

---

## `CaptainLogout.jsx`

**Purpose:**  
Logs out the authenticated captain.

**Features:**

- Sends a GET request to `/captains/logout` with the JWT token.
- Removes the token from localStorage and navigates to `/captain-login` on success.
- Shows a loading spinner and logout message.

**Usage:**  
Protected by `CaptainProtectWrapper`.

---

## `CaptainHome.jsx`

**Purpose:**  
Captain home page after successful login.

**Features:**

- Placeholder for captain dashboard or main captain features.

**Usage:**  
Protected by `CaptainProtectWrapper`.

---

## `CaptainProtectWrapper.jsx`

**Purpose:**  
Protects captain routes by verifying authentication.

**Features:**

- Checks for a valid JWT token in localStorage.
- Fetches captain profile from `/captains/profile` and sets captain context.
- Redirects to `/captain-login` if not authenticated or on error.
- Shows a loading message while verifying.

**Usage:**  
Wraps protected captain routes (e.g., `/captain-home`, `/captain/logout`).

---

## `UserContext.jsx`

**Purpose:**  
Provides a React Context for user data across the application.

**Features:**

- Exports `UserDataContext` for use with `useContext`.
- Stores user information (`email`, `fullname`) and provides a setter.

**Usage Example:**

```jsx
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const { user, setUser } = useContext(UserDataContext);
```

Wrap your app in `UserContext` to provide access to user data throughout the component tree.

---

## `CaptainContext.jsx`

**Purpose:**  
Provides a React Context for captain data across the application.

**Features:**

- Exports `CaptainDataContext` for use with `useContext`.
- Stores captain information and provides a setter.

**Usage Example:**

```jsx
import { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";

const { captain, setCaptain } = useContext(CaptainDataContext);
```

Wrap your app in `CaptainContext` to provide access to captain data throughout the component tree.

---

## General Notes

- All forms use controlled components and local state.
- Images are imported at the top of each file and used as React assets.
- Navigation between user and captain flows is handled via React Router `<Link>` components.
- To connect forms to your backend, use `axios` in the submit handlers.
- Protected routes use context and wrappers to ensure only authenticated users/captains can access certain pages.
- Logout components remove the token and redirect to the appropriate login page.
