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
    dealershipLicenseImages: [], // Array to store Base64 strings of images
    role: Roles.WHOLESALER,
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
    const files = e.target.files;
    if (files.length !== 2) {
      alert("Please upload exactly two images.");
      return;
    }

    const fileReaders = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Resolve with Base64
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((images) => {
        setFormData({
          ...formData,
          dealershipLicenseImages: images, // Store both Base64 images
        });
      })
      .catch(() => {
        alert("Failed to read files. Please try again.");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.dealershipLicenseImages.length !== 2) {
      alert("Please upload both dealership license images.");
      return;
    }

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
          <label className="form-label">Dealership License Images (2):</label>
          <input
            type="file"
            name="dealershipLicenseImages"
            onChange={handleFileChange}
            className="form-input"
            accept="image/*"
            multiple
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
