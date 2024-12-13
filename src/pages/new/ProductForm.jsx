import "./ProductForm.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productInputs as inputs } from "../../formSource";
import axios from "axios";
import { Button, TextField, MenuItem } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const city = [
  { _id: "inoie", name: "Mumbai" },
  { _id: "inoie", name: "Delhi" },
  { _id: "inoie", name: "Bangalore" },
  { _id: "inoie", name: "Hyderabad" },
  { _id: "inoie", name: "Ahmedabad" },
  { _id: "inoie", name: "Chennai" },
  { _id: "inoie", name: "Kolkata" },
  { _id: "inoie", name: "Surat" },
  { _id: "inoie", name: "Pune" },
  { _id: "inoie", name: "Jaipur" },
  { _id: "inoie", name: "Lucknow" },
  { _id: "inoie", name: "Kanpur" },
  { _id: "inoie", name: "Nagpur" },
  { _id: "inoie", name: "Visakhapatnam" },
  { _id: "inoie", name: "Thane" },
  { _id: "inoie", name: "Bhopal" },
  { _id: "inoie", name: "Patna" },
  { _id: "inoie", name: "Vadodara" },
  { _id: "inoie", name: "Ghaziabad" },
  { _id: "inoie", name: "Ludhiana" },
  { _id: "inoie", name: "Agra" },
  { _id: "inoie", name: "Nashik" },
  { _id: "inoie", name: "Faridabad" },
  { _id: "inoie", name: "Meerut" },
  { _id: "inoie", name: "Rajkot" },
  { _id: "inoie", name: "Kalyan-Dombivali" },
  { _id: "inoie", name: "Vasai-Virar" },
  { _id: "inoie", name: "Varanasi" },
  { _id: "inoie", name: "Srinagar" },
  { _id: "inoie", name: "Aurangabad" },
  { _id: "inoie", name: "Dhanbad" },
  { _id: "inoie", name: "Amritsar" },
  { _id: "inoie", name: "Navi Mumbai" },
  { _id: "inoie", name: "Allahabad" },
  { _id: "inoie", name: "Ranchi" },
  { _id: "inoie", name: "Haora" },
  { _id: "inoie", name: "Coimbatore" },
  { _id: "inoie", name: "Jabalpur" },
  { _id: "inoie", name: "Gwalior" },
  { _id: "inoie", name: "Vijayawada" },
  { _id: "inoie", name: "Jodhpur" },
  { _id: "inoie", name: "Madurai" },
  { _id: "inoie", name: "Raipur" },
  { _id: "inoie", name: "Kota" },
];
const ProductForm = () => {
  const { productId } = useParams();
  const [file, setFile] = useState("");
  const [formData, setFormData] = useState({});
  const [cities, setCities] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${BACKEND_URL}/api/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setFormData(response.data.product))
        .catch((error) => console.error("Error fetching product data:", error));
    }
  }, [productId]);

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

  const handleInputChange = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setFormData((prevData) => ({
          ...prevData,
          Image_URLS: [...(prevData.Image_URLS || []), base64Image],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    if (productId) {
      response = await axios.put(`${BACKEND_URL}/api/product`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } else {
      response = await axios.post(`${BACKEND_URL}/api/product`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    }
    if (response.data.success) {
      navigate("/products");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {formData.Image_URLS && formData.Image_URLS.length > 0 ? (
              <Carousel showThumbs={false} infiniteLoop>
                {formData.Image_URLS.map((url, index) => (
                  <div key={index}>
                    <img src={url} alt={`Product Image ${index + 1}`} />
                  </div>
                ))}
                <div className="image-upload-container">
                  <label htmlFor="imageUpload">
                    <DriveFolderUploadOutlinedIcon
                      style={{
                        fontSize: "4em",
                        color: "#555",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </Carousel>
            ) : (
              <div>
                <img
                  src={
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="No Product"
                />
                <div>
                  <label htmlFor="imageUpload">
                    <DriveFolderUploadOutlinedIcon
                      style={{
                        fontSize: "4em",
                        color: "#555",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}
          </div>
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

              {/* City Field */}
              <div className="formInput">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Type to search cities..."
                  value={formData?.city || ""}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    setFormData({ ...formData, city: e.target.value });
                  }}
                />
                {cities.length > 0 && (
                  <ul className="cityDropdown">
                    {cities.map((city) => (
                      <li
                        key={city._id}
                        onClick={() => {
                          setFormData({ ...formData, city: city.city });
                          setCityQuery("");
                        }}
                      >
                        {city.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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

export default ProductForm;
