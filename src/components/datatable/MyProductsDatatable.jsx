import "./MyProductsDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { ProductColumns } from "../../datatablesource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const MyProductsDatatable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [gridPage, setGridPage] = useState(0); // For DataGrid pagination
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  async function getProduct(pageNumber = 1, append = false) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/product/my?pageNumber=${pageNumber}&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setData((prev) =>
          append ? [...prev, ...response.data.products] : response.data.products
        );
        setTotalCount(response.data.totalDocuments);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProduct(page, true);
  }, [page]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/product/${selectedId}/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      } else {
        setData(data.filter((item) => item._id !== selectedId));
        setOpen(false);
      }
    } catch (error) {
      return;
    }
  };

  const handleDialogOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target[0].value.trim();
    if (search) {
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/product/search?search=${search}&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setData(response.data.products);
        setPage(1); // Reset backend pagination
        setGridPage(0); // Reset DataGrid pagination
      } else {
        setData([]);
      }
      setIsLoading(false);
    } else {
      setPage(1);
      setGridPage(0); // Reset to the first page of DataGrid
      getProduct(1, false);
    }
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
              style={{
                fontSize: "0.7em",
                padding: "0.2em 10px",
                minWidth: "30px",
              }}
              onClick={() => navigate(`/products/${params.row._id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDialogOpen(params.row._id)}
              style={{
                fontSize: "0.7em",
                padding: "0.2em 10px",
                minWidth: "30px",
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
      <div className="datatableTitle">
        <form onSubmit={handleSearch} className="search">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              if (!e.target.value.trim()) {
                setPage(1);
                setGridPage(0);
                getProduct(1, false);
              }
            }}
          />
          <SearchOutlinedIcon />
        </form>
        <Link to="/products/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={ProductColumns.concat(actionColumn)}
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

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyProductsDatatable;
