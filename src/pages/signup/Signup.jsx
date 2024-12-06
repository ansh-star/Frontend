import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import Roles from "../../helper/roles";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    shopOrHospitalName: "",
    mobileNumber: "",
    location: "",
    dealershipLicenseNumber: "",
    dealershipLicenseImage: "", // Base64 string
    role: Roles.WHOLESALER, // Fixed role for this form
  });
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [signupStatus, setSignUpStatus] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          dealershipLicenseImage: reader.result, // Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSignUpStatus(false);
      const response = await axios.post(
        `${BACKEND_URL}/api/user/signup`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        setMessage("Signup successful. Please Enter your OTP.");
        setOtpSent(true);
      } else {
        setMessage("Failed to sign up. Please try again.");
        setOtpSent(false);
      }
    } catch (error) {
      console.error("Error signing up user:", error.response?.data || error);
      alert("Failed to sign up. Please try again.");
    } finally {
      setSignUpStatus(true);
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/verify-otp`, {
        mobileNumber: formData.mobileNumber,
        otp,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", Roles.WHOLESALER);
        navigate("/");
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
    <div className="signup-container">
      <h2 className="signup-title">Signup as Wholesaler</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Shop/Hospital Name:</label>
          <input
            type="text"
            name="shopOrHospitalName"
            value={formData.shopOrHospitalName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Dealership License Number:</label>
          <input
            type="text"
            name="dealershipLicenseNumber"
            value={formData.dealershipLicenseNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Dealership License Image:</label>
          <input
            type="file"
            name="dealershipLicenseImage"
            onChange={handleFileChange}
            className="form-input"
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
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={!signupStatus}
          >
            {signupStatus ? "Signup" : "Sending OTP..."}
          </button>
        )}
        <p style={{ textAlign: "center" }}>
          Already have an account? <Link to="/login"> Login</Link>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
