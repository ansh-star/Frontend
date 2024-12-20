import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VerifyOTP = () => {
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/send-otp`, {
        mobileNumber: phoneNumber,
        role: true,
      });

      if (response.data.success) {
        setTimer(60);
        setMessage("OTP Resend successfully.");
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while sending OTP.");
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const handleVerifyOtp = async () => {
    try {
      setVerifyingOtp(true);
      const response = await axios.post(`${BACKEND_URL}/api/user/verify-otp`, {
        mobileNumber: phoneNumber,
        otp,
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        navigate("/");
      } else {
        setMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while verifying OTP.");
      console.error(error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Verify OTP</h2>
      <div className="form-group">
        <label>OTP:</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter your OTP"
          required
        />
      </div>
      <button
        onClick={handleVerifyOtp}
        className="submit-button"
        disabled={verifyingOtp}
      >
        {verifyingOtp ? "Verifying OTP..." : "Verify OTP"}
      </button>
      <p style={{ textAlign: "center", color: "blue" }}>
        Didn't Get the OTP?{" "}
        <Button disabled={timer > 0} onClick={handleSendOtp}>
          Resend
        </Button>
        {timer !== 0 && timer}
      </p>
      <p style={{ textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>

      {message && <p style={{ textAlign: "center" }}>{message}</p>}
    </div>
  );
};

export default VerifyOTP;
