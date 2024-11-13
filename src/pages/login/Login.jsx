import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://54.196.117.245:3001/send-otp', { phone: phoneNumber });
      if (response.data) {
        setOtpSent(true);
        setMessage('OTP sent successfully.');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while sending OTP.');
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://54.196.117.245:3001/verify-otp', { phone: phoneNumber, otp });
      if (response.data) {
        setMessage('Login successful!');
        // Additional login success handling can go here
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while verifying OTP.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      ) : (
        <button onClick={handleSendOtp}>Send OTP</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
