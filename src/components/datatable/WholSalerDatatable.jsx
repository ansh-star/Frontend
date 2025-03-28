import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { WholesalerColumn } from "../../datatablesource";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Button,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WholeSalerDatatable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [gridPage, setGridPage] = useState(0); // For DataGrid pagination
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // ID of the wholesaler to delete
  const token = useRef();
  const navigate = useNavigate();
  async function getWholesalers() {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/user/wholesaler?pageNumber=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    token.current = localStorage.getItem("token");
    if (!token.current) {
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    getWholesalers();
  }, [page]);

  const handleOpen = (images) => {
    setSelectedImages(images);
    setOpen(true);
    setTabIndex(0);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/user/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        setData(data.filter((item) => item._id !== deleteId));
        closeDeleteDialog();
      }
    } catch (error) {
      return;
    }
  };
  const verifyUser = async (id) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/user/verify-user`,
        {
          userId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setData(data.filter((item) => item._id !== id));
      }
    } catch (error) {}
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Button
              variant="contained"
              color="success"
              style={{
                fontSize: "0.7em",
              }}
              onClick={() => verifyUser(params.row._id)}
            >
              Verify User
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => openDeleteDialog(params.row._id)}
              style={{
                fontSize: "0.7em",
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={data}
        columns={WholesalerColumn.concat(
          [
            {
              field: "licenseImages",
              headerName: "License Images",
              width: 230,
              renderCell: (params) => (
                <div
                  style={{ display: "flex", gap: "10px", cursor: "pointer" }}
                  onClick={() => handleOpen(params.row.delaershipLicenseImage)}
                >
                  {params.row.delaershipLicenseImage
                    ?.slice(0, 2)
                    .map((image, index) => (
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
                  {params.row.delaershipLicenseImage?.length > 2 && (
                    <span>+ More</span>
                  )}
                </div>
              ),
            },
          ].concat(actionColumn)
        )}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        pagination
        page={gridPage} // Controlled pagination state
        onPageChange={(newPage) => {
          setGridPage(newPage);
          if ((newPage + 1) * 10 >= data.length) {
            setPage((prev) => prev + 1);
          }
        }}
        loading={isLoading}
        autoHeight
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this wholesaler? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WholeSalerDatatable;
