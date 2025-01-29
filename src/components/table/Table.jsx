import "./table.scss";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { ShoppingCart, AttachMoney, Store, LocalShipping, People, Category } from "@mui/icons-material";

const statsConfig = [
  { key: "totalOrders", label: "Total Orders", icon: <ShoppingCart style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
  { key: "totalSales", label: "Total Sales", icon: <AttachMoney style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
  { key: "totalWholesalers", label: "Total Wholesalers", icon: <Store style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
  { key: "DeliveryPartners", label: "Delivery Partners", icon: <LocalShipping style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
  { key: "totalRetailers", label: "Total Retailers", icon: <People style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
  { key: "totalProducts", label: "Total Products", icon: <Category style={{ color: "#007bff", fontSize: "2.5rem" }} /> },
];

const List = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    // <div className="dashboard">
      <Grid container spacing={3} className="statsContainer">
        {statsConfig.map(({ key, label, icon }) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card className="statBox" style={{ backgroundColor: "#f9f6fd", borderRadius: "12px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
              <CardContent style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
                <div>{icon}</div>
                <div style={{ textAlign: "right" }}>
                  <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" component="div" style={{ color: "#007bff", fontWeight: "bold" }}>
                    {stats[key] ?? 0}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    // </div>
  );
};

export default List;
