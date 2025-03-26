import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const token = localStorage.getItem("token");
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    getUser();
  }, []);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to="/profile/edit" state={{ user }}>
              <div className="editButton">Edit</div>
            </Link>
            <h1 className="title">Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">{user.fullName}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.mobileNumber}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">{user.location}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Shop/Hospital Name:</span>
                  <span className="itemValue">{user.shopOrHospitalName}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Dealership Number:</span>
                  <span className="itemValue">
                    {user.dealershipLicenseNumber}
                  </span>
                </div>
                <div className="detail-image">
                  <div>Dealership License Image:</div>
                  <div className="detail-image-container">
                    <img
                      src={user.dealershipLicenseImage[0]}
                      alt="First License Image"
                      className="licenseImage"
                    />
                    <img
                      src={user.dealershipLicenseImage[1]}
                      alt="Second License Image"
                      className="licenseImage"
                    />
                  </div>
                </div>
                {/* {role === Roles.ADMIN && (
                  <>
                    
                  </>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
