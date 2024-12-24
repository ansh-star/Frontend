import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userNotVerified, setUserNotVerified] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      const response = await axios.post(`${BACKEND_URL}/api/user/send-otp`, {
        mobileNumber: phoneNumber,
        role: true,
      });

      if (response.data.success) {
        navigate("/verify-otp", { state: { phoneNumber } });
      } else {
        setMessage("Failed to Send OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };
  const handleLogin = async () => {
    try {
      setLoginStatus(false);
      const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
        mobileNumber: phoneNumber,
        password,
      });
      if (response.data.success) {
        if (response.data.user_verified) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.user?.role);
          navigate("/");
        } else {
          setUserNotVerified(true);
        }
      } else {
        setMessage("Failed to Login. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred while Logging In.");
      console.error(error);
    } finally {
      setLoginStatus(true);
    }
  };
  const handleDialogClose = () => {
    setUserNotVerified(false);
  };

  return (
    <>
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
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          onClick={handleLogin}
          className="submit-button"
          disabled={!loginStatus}
        >
          {loginStatus ? "Login" : "Logging..."}
        </button>
        <p style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

        {message && <p>{message}</p>}
      </div>
      <Dialog open={userNotVerified}>
        <DialogTitle>Please Verify</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your mobile number is not verified. Please verify your mobile number
            to login.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendOtp} color="error" disabled={sendingOtp}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
