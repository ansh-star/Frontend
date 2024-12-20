import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const [cities, setCities] = useState([]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    shopOrHospitalName: "",
    mobileNumber: "",
    location: "",
    dealershipLicenseNumber: "",
    dealershipLicenseImages: [], // Array to store Base64 strings of images
    role: 1,
  });
  const [message, setMessage] = useState("");
  const [signupStatus, setSignUpStatus] = useState(true);
  const [cityQuery, setCityQuery] = useState("");
  // Fetch cities from the backend
  useEffect(() => {
    if (cityQuery.length > 0) {
      axios
        .get(`${BACKEND_URL}/api/cities?prefix=${cityQuery}`)
        .then((response) => {
          if (response.data.success) setCities(response.data.cities);
          else throw new Error("Error fetching cities");
        })
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  }, [cityQuery]);
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
      setMessage("Please upload both dealership license images.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
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
        navigate("/verify-otp", {
          state: { phoneNumber: formData.mobileNumber },
        });
      } else {
        setMessage("Failed to sign up. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to sign up. Please try again.");
    } finally {
      setSignUpStatus(true);
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
          <label className="form-label">Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password:</label>
          <input
            type="text"
            name="confirmPassword"
            value={formData.confirmPassword}
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
            onChange={(e) => {
              setCityQuery(e.target.value);
              handleChange(e);
            }}
            className="form-input"
            required
          />
          {cities.length > 0 && (
            <ul className="cityDropdown">
              {cities.map((city) => (
                <li
                  key={city._id}
                  onClick={() => {
                    setFormData({ ...formData, location: city.city });
                    setCityQuery("");
                  }}
                >
                  {city.city}
                </li>
              ))}
            </ul>
          )}
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
        <button
          onClick={handleSubmit}
          className="submit-button"
          disabled={!signupStatus}
        >
          {signupStatus ? "Signup" : "Sending OTP..."}
        </button>
        <p style={{ textAlign: "center" }}>
          Already have an account? <Link to="/login"> Login</Link>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
