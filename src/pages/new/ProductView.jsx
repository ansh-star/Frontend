import "./ProductForm.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productInputs as inputs } from "../../formSource";
import axios from "axios";
import { Button } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const ProductView = () => {
  const { productId } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
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

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>View Product Details</h1>
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
              </Carousel>
            ) : (
              <div>
                <img
                  src={
                    "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="No Product"
                />
              </div>
            )}
          </div>
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    value={formData[input.id] || ""}
                    disabled
                  />
                </div>
              ))}

              {/* City Field */}
              <div className="formInput">
                <label>City</label>
                <input
                  type="text"
                  value={formData?.city || ""}
                  disabled
                />
              </div>

              {/* Category Field */}
              <div className="formInput">
                <label>Category</label>
                <input
                  type="text"
                  value={formData?.category_name || ""}
                  disabled
                />
              </div>

              <div className="buttons-container">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/products")}
                  className="button"
                >
                  Go Back
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
