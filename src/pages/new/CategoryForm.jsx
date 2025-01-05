import "./ProductForm.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryInputs as inputs } from "../../formSource";
import axios from "axios";
import { Button } from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CategoryForm = () => {
  const { categoryId } = useParams();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      const token = localStorage.getItem("token");
      axios
        .get(`${BACKEND_URL}/api/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setFormData(response.data.category))
        .catch((error) => console.error("Error fetching Category data"));
    }
  }, [categoryId]);

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
          category_icon: base64Image,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    formData.category_slug = formData.category_name.split(" ").join("_");
    if (categoryId) {
      response = await axios.put(`${BACKEND_URL}/api/category`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } else {
      response = await axios.post(`${BACKEND_URL}/api/category`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    }
    console.log(response);
    if (response.data.success) {
      navigate("/category");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="bottom">
          <div className="left">
            {formData.category_icon ? (
              <div>
                <img src={formData.category_icon} alt="Category Icon" />
              </div>
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
                  <p style={{ margin: 0 }}></p>
                </div>
              ))}

              <div className="buttons-container">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/category")}
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

export default CategoryForm;
