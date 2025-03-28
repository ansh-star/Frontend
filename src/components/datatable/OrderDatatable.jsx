import { useEffect, useState } from "react";
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
  autocompleteClasses,
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
  const navigate = useNavigate();
  let token;
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(ORDER_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    setOrderDetailsModalOpen(true);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setOrderDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleOpenAssignModal = async (order) => {
    try {
      const response = await axios.get(DELIVERY_PARTNERS_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        alert("Delivery Partner Assigned Successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, deliveryPartner: selectedPartner }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error assigning delivery partner:", error);
    } finally {
      handleCloseAssignModal();
    }
  };
  const columns = [
    { field: "_id", headerName: "Order ID", width: 200 },
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
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 10, fontSize: 10 }}
            onClick={() => handleOpenAssignModal(params.row._id)}
          >
            Assign Partner
          </Button>
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
