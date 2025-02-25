import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button } from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PAYMENT_API = process.env.REFUND_API;
const ORDER_API_URL = `${BACKEND_URL}/api/order/refund-order`; // Refunds API
const PROCESS_REFUND_API_URL = `http://54.85.104.173:3000/api/pay`; // API to process refund
const token = localStorage.getItem("token");

const RefundsTable = () => {
  const [refundOrders, setRefundOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchRefundOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(ORDER_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setRefundOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching refund orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRefundOrders();
  }, []);

  // Handle Refund Process
  const handleProcessRefund = async (orderId) => {
    try {
      console.log(PROCESS_REFUND_API_URL);
      const response = await axios.post(
        PROCESS_REFUND_API_URL,
        { orderId, amount: 100 }, // Hardcoded amount for now
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      if (response.data.success) {
        alert("Refund processed successfully!");
        window.location.href =
          response.data.data.data.instrumentResponse.redirectInfo.url;
        setRefundOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Refunded" } : order
          )
        );
      } else {
        alert("Refund failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing refund:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "products",
      headerName: "Products",
      width: 250,
      renderCell: (params) => (
        <ul>
          {params.row.products.map((item, index) => (
            <li key={index}>
              {item.productId.name} (x{item.quantity})
            </li>
          ))}
        </ul>
      ),
    },
    { field: "totalAmount", headerName: "Total Price", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span
          style={{
            fontWeight: "bold",
            color: params.value === "Refunded" ? "green" : "red",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleProcessRefund(params.row._id)}
            disabled={params.row.status === "Refunded"} // Disable if already refunded
          >
            {params.row.status === "Refunded" ? "Refunded" : "Process Refund"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="datatable">
      <h2>Refund Dashboard</h2>
      <DataGrid
        rows={refundOrders}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        loading={isLoading}
        autoHeight
      />
    </div>
  );
};

export default RefundsTable;
