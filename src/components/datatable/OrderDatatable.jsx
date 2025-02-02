import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const ORDER_API_URL = `${BACKEND_URL}/api/order`;
const DELIVERY_PARTNERS_API_URL = `${BACKEND_URL}/api/delivery-partners`;
const ASSIGN_DELIVERY_API_URL = `${BACKEND_URL}/api/order/assign-delivery`;
const token = localStorage.getItem("token");

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");

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

    const fetchDeliveryPartners = async () => {
      try {
        const response = await axios.get(DELIVERY_PARTNERS_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveryPartners(response.data.partners);
      } catch (error) {
        console.error("Error fetching delivery partners:", error);
      }
    };

    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleOpenAssignModal = (order) => {
    setSelectedOrder(order);
    setAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedPartner("");
  };

  const handleAssignPartner = async () => {
    try {
      const response = await axios.post(ASSIGN_DELIVERY_API_URL, {
        orderId: selectedOrder._id,
        partnerId: selectedPartner
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert("Delivery Partner Assigned Successfully");
        setOrders((prevOrders) => prevOrders.map((order) => 
          order._id === selectedOrder._id ? { ...order, deliveryPartner: selectedPartner } : order
        ));
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
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: "products",
      headerName: "Products",
      width: 250,
      renderCell: (params) => (
        <ul>
          {params.row.products.map((item, index) => (
            <li key={index}>{item.productId.name} (x{item.quantity})</li>
          ))}
        </ul>
      ),
    },
    { field: "totalAmount", headerName: "Total Price", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <span style={{ fontWeight: "bold" }}>{params.value}</span>,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <>
          <Button variant="contained" onClick={() => handleViewOrder(params.row)}>View</Button>
          <Button variant="contained" color="primary" style={{ marginLeft: 8 }} onClick={() => handleOpenAssignModal(params.row)}>Assign Partner</Button>
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
      />

      {/* Order Details Modal */}
      <Dialog open={Boolean(selectedOrder)} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Delivery Partner Modal */}
      <Dialog open={assignModalOpen} onClose={handleCloseAssignModal} fullWidth maxWidth="sm">
        <DialogTitle>Assign Delivery Partner</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Partner</InputLabel>
            <Select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)}>
              {deliveryPartners.map((partner) => (
                <MenuItem key={partner._id} value={partner._id}>{partner.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignModal}>Cancel</Button>
          <Button onClick={handleAssignPartner} color="primary" variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderTable;
