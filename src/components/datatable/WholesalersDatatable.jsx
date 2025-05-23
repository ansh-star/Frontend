import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WholesalersDatatable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = useRef();
  const navigate = useNavigate();
  // Fetch all wholesalers with pagination
  async function getWholesalers(page = 1) {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/user/wholesalers?limit=10&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token.current}` },
        }
      );

      if (response.data.success) {
        setData(response.data.wholesalers || []);
        setTotalPages(response.data.totalPages || 1);
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
    getWholesalers(page);
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage + 1); // Increment by 1 because DataGrid uses 0-based index
  };

  // Define table columns
  const columns = [
    { field: "_id", headerName: "ID", width: 280 },
    { field: "fullName", headerName: "Wholesaler Name", width: 180 },
    { field: "mobileNumber", headerName: "Phone", width: 140 },
    {
      field: "dealershipLicenseNumber",
      headerName: "Dealership License Number",
      width: 180,
    },
    { field: "email", headerName: "Email", width: 270 },
    {
      field: "shopOrHospitalName",
      headerName: "Shop/Hospital Name",
      width: 200,
    },
    { field: "location", headerName: "Location", width: 140 },
  ];
  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        loading={isLoading}
        autoHeight
        pagination
        page={page - 1} // Adjust for zero-based index
        onPageChange={handlePageChange}
        rowCount={totalPages * 10} // Calculate total rows from pages
        paginationMode="server"
      />
    </div>
  );
};
export default WholesalersDatatable;
