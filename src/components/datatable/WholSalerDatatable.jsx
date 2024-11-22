import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { WholesalerColumn, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const WholeSalerDatatable = () => {
  const [data, setData] = useState(userRows);

  useEffect(() => {
    const token = Cookies.get("token");
    async function getWholesalers() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/wholesaler`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.data.success) {
          setData(response.data.wholesalerRequests);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    // getWholesalers();
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
        columns={WholesalerColumn.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default WholeSalerDatatable;
