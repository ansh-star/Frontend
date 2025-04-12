import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ORDER_API_URL = `${BACKEND_URL}/api/order`;
const DELIVERY_PARTNERS_API_URL = `${BACKEND_URL}/api/delivery-partners`;
const ASSIGN_DELIVERY_API_URL = `${BACKEND_URL}/api/order/assign`;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [gridPage, setGridPage] = useState(0); // For DataGrid pagination
  const [totalCount, setTotalCount] = useState(0); // Total count of orders

  const navigate = useNavigate();
  const token = useRef();
  useEffect(() => {
    token.current = localStorage.getItem("token");
    if (!token.current) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${ORDER_API_URL}?limit=${10}&page=${page}`,
          {
            headers: { Authorization: `Bearer ${token.current}` },
          }
        );

        console.log(response.data);
        if (response.data.success) {
          setOrders((prev) => [...prev, ...response.data.orders]);
          setTotalCount(response.data.totalOrdersCount);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [page]);
  const handleViewOrder = (order) => {
    setOrderDetailsModalOpen(true);
    setSelectedOrder(order);
  };
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  const handleCloseModal = () => {
    setOrderDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenAssignModal = async (order) => {
    try {
      const response = await axios.get(DELIVERY_PARTNERS_API_URL, {
        headers: { Authorization: `Bearer ${token.current}` },
      });
      setDeliveryPartners(response?.data?.partners);
      setAssignModalOpen(true);
      setSelectedOrder(order);
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
    }
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedPartner("");
  };

  const handleAssignPartner = async () => {
    try {
      const response = await axios.post(
        ASSIGN_DELIVERY_API_URL,
        {
          order_id: selectedOrder,
          deliveryPartner: selectedPartner,
        },
        {
          headers: { Authorization: `Bearer ${token.current}` },
        }
      );
      if (response.data.success) {
        alert("Delivery Partner Assigned Successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder
              ? {
                  ...order,
                  assigned: selectedPartner,
                  order_status: "Assigned",
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error assigning delivery partner:", error);
    } finally {
      handleCloseAssignModal();
      console.log(orders);
    }
  };
  const columns = [
    {
      field: "_id",
      headerName: "Order ID",
      width: 200,
    },
    {
      field: "user_id",
      headerName: "Full Name",
      width: 200,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold" }}>
          {params.row.user_id.fullName}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      valueGetter: (params) => new Date(params.row.order_date).toLocaleString(),
    },
    {
      headerName: "Products",
      width: 250,
      renderCell: (params) => (
        <ul>
          {params.row.products.map((item) => (
            <li key={item._id}>
              {`${item.productId.Medicine_Name} x${item.quantity}`}
            </li>
          ))}
        </ul>
      ),
    },
    { field: "order_amount", headerName: "Total Price", width: 150 },
    {
      field: "order_status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold" }}>{params.value}</span>
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
            style={{ fontSize: 10 }}
            onClick={() => handleViewOrder(params.row)}
          >
            View
          </Button>
          {(!params.row.assigned || params.row.assigned === "") && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: 10, fontSize: 10 }}
              onClick={() => handleOpenAssignModal(params.row._id)}
            >
              Assign Partner
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="datatable">
      <h2>Orders</h2>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        loading={isLoading}
        autoHeight
        getRowHeight={() => "auto"}
        getRowSpacing={(params) => ({
          top: 8, // Top margin
          bottom: 8, // Bottom margin
        })}
        pagination
        page={gridPage} // Controlled pagination state
        onPageChange={(newPage) => {
          setGridPage(newPage);
          if ((newPage + 1) * 10 >= orders.length) {
            setPage((prev) => prev + 1);
          }
        }}
        rowCount={totalCount}
      />

      {/* Order Details Modal */}
      <Dialog
        open={orderDetailsModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order ID :</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Date : </strong>
                {new Date(selectedOrder.order_date).toLocaleString()}
              </p>
              <p>
                <strong>Total Amount : </strong> ₹{selectedOrder.order_amount}
              </p>
              <p>
                <strong>Status : </strong> {selectedOrder.order_status}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Delivery Partner Modal */}
      <Dialog
        open={assignModalOpen}
        onClose={handleCloseAssignModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assign Delivery Partner</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Partner</InputLabel>
            <Select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
            >
              {deliveryPartners.map((partner) => (
                <MenuItem key={partner._id} value={partner._id}>
                  {partner.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignModal}>Cancel</Button>
          <Button
            onClick={handleAssignPartner}
            color="primary"
            variant="contained"
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderTable;
