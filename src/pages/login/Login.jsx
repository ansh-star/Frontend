import { useRef, useState } from "react";
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
import EyeIcon from "../../components/widget/EyeIcon";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userNotVerified, setUserNotVerified] = useState(false);
  const [loginAllowed, setLoginAllowed] = useState(false);
  const isLoginAllowed = useRef();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loginStatus, setLoginStatus] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      const response = await axios.post(`${BACKEND_URL}/api/user/send-otp`, {
        mobileNumber: phoneNumber,
        role: true,
      });

      if (response.data.success) {
        navigate("/verify-otp", {
          state: { phoneNumber, isLoginAllowed: isLoginAllowed.current },
        });
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
      var response = await axios.post(`${BACKEND_URL}/api/user/login`, {
        mobileNumber: phoneNumber,
        password,
        role: "website",
      });
      if (response.data.success) {
        if (response.data.user_verified) {
          if (response.data.loginAllowed) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user?.role);
            navigate("/");
          } else {
            isLoginAllowed.current = false;
            setLoginAllowed(true);
          }
        } else {
          setUserNotVerified(true);
        }
      } else {
        setMessage(
          response?.data?.message || "Failed to Login. Please try again."
        );
      }
    } catch (error) {
      setMessage(response?.data?.message || "Error occurred while Logging In.");
    } finally {
      setLoginStatus(true);
    }
  };
  const handleDialogClose = () => {
    setUserNotVerified(false);
  };

  return (
    <>
      <form className="login-container">
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
        <div className="form-group password-field">
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <EyeIcon setShowPassword={setShowPassword} />
        </div>
        <button
          onClick={handleLogin}
          type="submit"
          className="submit-button"
          disabled={!loginStatus}
        >
          {loginStatus ? "Login" : "Logging..."}
        </button>
        <p style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>

        {message && <p>{message}</p>}
      </form>
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
      <Dialog open={loginAllowed}>
        <DialogTitle>Please Verify</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have not been verified by the admin yet. Please wait for the
            admin to verify you.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginAllowed(false)} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
