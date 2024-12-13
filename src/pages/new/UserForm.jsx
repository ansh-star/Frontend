import "./UserForm.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { userInputs as inputs } from "../../formSource";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
const token = localStorage.getItem("token");
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const UserForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(location.state?.user || {});
  const navigate = useNavigate();
  // Handle form input changes
  const handleInputChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`${BACKEND_URL}/api/user`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(e, input.id)}
                  />
                </div>
              ))}
              <div className="buttons-container">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/products")}
                  className="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  type="Submit"
                  className="button"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
