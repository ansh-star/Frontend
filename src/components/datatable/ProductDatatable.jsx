import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { ProductColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ProductDatatable = () => {
  const [data, setData] = useState(userRows);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function getProduct() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/product?pageNumber=1&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.data.success) {
          setData(response.data.products);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getProduct();
  }, []);

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
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
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
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={ProductColumns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default ProductDatatable;
