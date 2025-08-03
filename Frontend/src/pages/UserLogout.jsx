import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // Remove token immediately
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .finally(() => {
        navigate("/login");
      });
  }, [navigate, token]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          border: "6px solid #000",
          borderTop: "6px solid #fff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: 24,
        }}
      />
      <h2 style={{ color: "#000", fontWeight: 600, marginBottom: 8 }}>
        Logging Out...
      </h2>
      <p style={{ color: "#222" }}>Please wait while we log you out.</p>
      <style>
        {`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}
      </style>
    </div>
  );
};

export default UserLogout;
