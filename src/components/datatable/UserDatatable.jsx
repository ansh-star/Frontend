import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Button,
  DialogActions,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import Roles from "../../helper/roles";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserDatatable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [gridPage, setGridPage] = useState(0); // For DataGrid pagination
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [adminDialogOpen, setAdminDialogOpen] = useState(false); // State for admin confirmation dialog
  const [deleteId, setDeleteId] = useState(null); // ID of the wholesaler to delete
  const [userId, setUserId] = useState(null); // ID of the user to make admin
  const [totalCount, setTotalCount] = useState(0); // Total count of users
  const token = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    token.current = localStorage.getItem("token");
    if (!token.current) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/api/user?limit=${10}&page=${page}`,
          { headers: { Authorization: `Bearer ${token.current}` } }
        );
        console.log(response);
        if (!response.data.success) {
          throw new Error(response.data.message);
        } else {
          setData((prev) => [...prev, ...(response.data?.users || [])]);
          setTotalCount(response.data?.totalDocuments);
        }
      } catch (error) {
        return;
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);
  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };
  const openMakeAdminDialog = (id) => {
    openAdminDialog(id);
  };
  const openAdminDialog = (id) => {
    setAdminDialogOpen(true);
    setUserId(id);
  };

  const closeAdminDialog = () => {
    setAdminDialogOpen(false);
    setUserId(null);
  };
  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/user/${deleteId}`,
        { headers: { Authorization: `Bearer ${token.current}` } }
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        if (params.row.role != Roles.ADMIN) {
          return (
            <div className="cellAction">
              <Button
                variant="contained"
                color="success"
                style={{
                  fontSize: "0.7em",
                }}
                onClick={() => openMakeAdminDialog(params.row._id)}
              >
                Make Admin
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
        }
      },
    },
  ];
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchValue = e.target[0].value;
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/user/search?mobileNumber=${searchValue}`,
        { headers: { Authorization: `Bearer ${token.current}` } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        setData(response.data?.user || []);
      }
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const makeAdmin = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/user/make-admin`,
        { id: userId },
        { headers: { Authorization: `Bearer ${token.current}` } }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        setData((prev) =>
          prev.map((item) =>
            item._id === userId ? { ...item, role: Roles.ADMIN } : item
          )
        );
        closeAdminDialog();
      }
    } catch (error) {
      return;
    }
  };
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <form onSubmit={handleSearch} className="search">
          <input
            type="text"
            placeholder="Enter mobile number..."
            onChange={(e) => {
              if (!e.target.value.trim()) {
                setPage(1);
                setGridPage(0);
              }
            }}
          />
          <SearchOutlinedIcon />
        </form>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
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
        rowCount={totalCount}
        autoHeight
      />
      {/* Admin Confirmation Dialog */}
      <Dialog open={adminDialogOpen} onClose={closeAdminDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to make this user an admin? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdminDialog} color="primary">
            No
          </Button>
          <Button onClick={makeAdmin} color="error">
            Yes
          </Button>
        </DialogActions>
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

export default UserDatatable;
