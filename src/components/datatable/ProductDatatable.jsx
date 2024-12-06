import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { ProductColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ProductDatatable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function getProduct() {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/product?pageNumber=${page}&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setData((prev) => [...prev, ...response.data.products]);
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
    getProduct(page);
  }, [page]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
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
        columns={ProductColumns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row._id}
        pagination
        onPageChange={(newPage) => {
          if ((newPage + 1) % 10 === 0) {
            setPage((prev) => prev + 1);
          }
        }} // Handle page change
        loading={isLoading} // Show spinner while loading
      />
    </div>
  );
};

export default ProductDatatable;
