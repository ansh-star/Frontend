import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { WholesalerColumn, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WholeSalerDatatable = () => {
  const [data, setData] = useState(userRows); // Wholesaler data
  const [page, setPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedImages, setSelectedImages] = useState([]); // License images array
  const [tabIndex, setTabIndex] = useState(0); // Tab index for page navigation

  async function getWholesalers() {
    try {
      const token = Cookies.get("token");
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/user/wholesaler?pageNumber=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setData(response.data.wholesalerRequests);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching wholesalers:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getWholesalers(); // Fetch data whenever the page changes
  }, [page]);

  const handleOpen = (images) => {
    setSelectedImages(images);
    setOpen(true);
    setTabIndex(0); // Default to the first image
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item._id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/users/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      {/* <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div> */}
      <DataGrid
        className="datagrid"
        rows={data}
        columns={WholesalerColumn.concat([
          {
            field: "licenseImages",
            headerName: "License Images",
            width: 230,
            renderCell: (params) => (
              <div
                style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                onClick={() => handleOpen(params.row.licenseImages)}
              >
                {params.row.licenseImages.slice(0, 2).map((image, index) => (
                  <img
                    key={index}
                    src={image || "https://via.placeholder.com/150"}
                    alt={`License ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                ))}
                {params.row.licenseImages.length > 2 && <span>+ More</span>}
              </div>
            ),
          },
        ])}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        pagination
        onPageChange={(newPage) => setPage(newPage + 1)} // Handle page change
        loading={isLoading} // Show spinner while loading
      />

      {/* Modal to show license images */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogContent style={{ textAlign: "center" }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            {selectedImages.map((_, index) => (
              <Tab key={index} label={`Page ${index + 1}`} />
            ))}
          </Tabs>
          <div style={{ marginTop: "20px" }}>
            {selectedImages[tabIndex] ? (
              <img
                src={selectedImages[tabIndex]}
                alt={`License Page ${tabIndex + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WholeSalerDatatable;
