import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [adminKey, setAdminKey] = useState(''); // New state for admin key
  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        'http://54.198.216.159:3000/api/admin/login',
        { mobileNumber: phoneNumber, adminKey: adminKey }
      );

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
      const response = await axios.post(
        'http://54.198.216.159:3000/api/admin/verify-otp',
        { mobileNumber: phoneNumber, otp: otp, adminKey: adminKey }
      );
      console.log(response);
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
    <div className='login-container'>
      <h2>Admin Login</h2>
      <div className='form-group'>
        <label>Phone Number:</label>
        <input
          type='text'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder='Enter your phone number'
          required
        />
      </div>
      <div className='form-group'>
        <label>Admin Key:</label>
        <input
          type='text'
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder='Enter admin key'
          required
        />
      </div>

      {otpSent ? (
        <div className='form-group'>
          <label>OTP:</label>
          <input
            type='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder='Enter the OTP'
            required
          />

          <button onClick={handleVerifyOtp} className='verify-button'>
            Verify OTP
          </button>
        </div>
      ) : (
        <button onClick={handleSendOtp}>Send OTP</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
