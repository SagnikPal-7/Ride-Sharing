# Ride-Sharing Frontend Documentation

This document provides an overview of the main React components and context used in the Ride-Sharing frontend application. It describes the purpose, usage, and expected props or state for each file.

---

## Table of Contents

- [App.jsx](#appjsx)
- [Home.jsx](#homexjsx)
- [UserSignup.jsx](#usersignupjsx)
- [UserLogin.jsx](#userloginjsx)
- [CaptainSignup.jsx](#captainsignupjsx)
- [Captainlogin.jsx](#captainloginjsx)
- [UserContext.jsx](#usercontextjsx)

---

## `App.jsx`

**Purpose:**  
Defines the main routing structure for the application using React Router.

**Routes:**

- `/` → `Home` (Landing page)
- `/login` → `UserLogin` (User login form)
- `/signup` → `UserSignup` (User registration form)
- `/captain-login` → `Captainlogin` (Captain/driver login form)
- `/captain-signup` → `CaptainSignup` (Captain/driver registration form)

**Usage:**  
No props required. Used as the root component in `index.js`.

---

## `Home.jsx`

**Purpose:**  
Landing page with branding and a "Continue" button to start the login process.

**Features:**

- Displays the app logo and a background image.
- "Continue" button navigates to `/login`.

**Usage:**  
No props required.

---

## `UserSignup.jsx`

**Purpose:**  
User registration form.

**Features:**

- Collects first name, last name, email, and password.
- Validates required fields.
- On submit, resets the form and stores the data in local state (`userData`).

**Request Body Example:**

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Usage:**  
No props required.  
**Note:** To actually register a user, you should send the collected data to your backend API.

---

## `UserLogin.jsx`

**Purpose:**  
User login form.

**Features:**

- Collects email and password.
- On submit, resets the form and stores the data in local state (`userData`).

**Request Body Example:**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Usage:**  
No props required.  
**Note:** To authenticate, send the collected data to your backend API.

---

## `CaptainSignup.jsx`

**Purpose:**  
Captain (driver) registration form.

**Features:**

- Collects first name, last name, email, and password.
- On submit, resets the form and stores the data in local state (`captainData`).

**Request Body Example:**

```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "securepassword"
}
```

**Usage:**  
No props required.  
**Note:** Extend this form to collect vehicle details if required by your backend.

---

## `Captainlogin.jsx`

**Purpose:**  
Captain (driver) login form.

**Features:**

- Collects email and password.
- On submit, resets the form and stores the data in local state (`captainData`).

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

## `UserContext.jsx`

**Purpose:**  
Provides a React Context for user data across the application.

**Features:**

- Exports `UserDataContext` for use with `useContext`.
- Stores user information (`email`, `fullName`) and provides a setter.

**Usage Example:**

```jsx
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const [user, setUser] = useContext(UserDataContext);
```

Wrap your app in `UserContext` to provide access to user data throughout the component tree.

---

## General Notes

- All forms use controlled components and local state.
- Images are imported at the top of each file and used as React assets.
- Navigation between user and captain flows is handled via React Router `<Link>` components.
- To connect forms to your backend, use `fetch` or `axios` in the submit handlers.

---
