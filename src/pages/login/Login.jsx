import { useContext, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/adminContext";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const ctx = useContext(AdminContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/login`, {
        mobileNumber: phoneNumber,
      });

      if (response.data) {
        setOtpSent(true);
        setMessage("OTP sent successfully.");
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while sending OTP.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/verify-otp`, {
        mobileNumber: phoneNumber,
        otp,
      });

      ctx.setUserData(response.data?.user);
      navigate("/");

      if (response.data) {
        setMessage("Login successful!");
        // Additional login success handling can go here
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while verifying OTP.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <div className="form-group">
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          required
        />
      </div>
      {otpSent ? (
        <div className="form-group">
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
            required
          />

          <button onClick={handleVerifyOtp} className="verify-button">
            Verify OTP
          </button>
        </div>
      ) : (
        <button onClick={handleSendOtp}>Send OTP</button>
      )}
      <p style={{ textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
