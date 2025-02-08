import "./widget.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(0);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        console.error("No authentication token found");
        return;
      }
  
      let apiUrl = "";
  
      switch (type) {
        case "totalOrders":
          apiUrl = "/api/orders/count"; // Replace with actual orders endpoint
          break;
        case "totalSales":
          apiUrl = "/api/sales/total"; // Replace with actual sales endpoint
          break;
        case "totalWholesalers":
          apiUrl = `${BACKEND_URL}/api/user/wholesalers?limit=1&page=1`; // Wholesalers endpoint
          break;
        case "deliveryPartners":
          apiUrl = "/api/delivery-partners/count"; // Replace with actual delivery partners endpoint
          break;
        case "totalRetailers":
          apiUrl = `${BACKEND_URL}/api/user/retailers?limit=1&page=1`; // Replace with actual retailers endpoint
          break;
        case "totalProducts":
          apiUrl = `${BACKEND_URL}/api/product`; // Replace with actual products endpoint
          break;
        default:
          apiUrl = "";
      }
  
      if (apiUrl) {
        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach the token in headers
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
  
          const data = await response.json();
  
          // Handle different data based on type
          if (type === "totalWholesalers") {
            setAmount(data.totalWholesalers || 0); // For wholesalers
          } else if (type === "totalOrders") {
            setAmount(data.totalOrders || 0); // For orders
          } else if (type === "totalSales") {
            setAmount(data.totalSales || 0); // For sales
          } else if (type === "deliveryPartners") {
            setAmount(data.totalDeliveryPartners || 0); // For delivery partners
          } else if (type === "totalRetailers") {
            setAmount(data.totalRetailers || 0); // For retailers
          } else if (type === "totalProducts") {
            setAmount(data.totalDocuments || 0); // For products
          }
  
          setDiff(data.diff || 0);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };
  
    fetchData();
  }, [type]);
  

  let data;

  switch (type) {
    case "totalOrders":
      data = {
        title: "TOTAL ORDERS",
        isMoney: false,
        link: "/orders",
        linkText: "View all orders",
        icon: <ShoppingCartOutlinedIcon className="icon" style={{ backgroundColor: "rgba(218, 165, 32, 0.2)", color: "goldenrod" }} />,
      };
      break;
    case "totalSales":
      data = {
        title: "TOTAL SALES",
        isMoney: true,
        link: "/sales",
        linkText: "View total sales",
        icon: <MonetizationOnOutlinedIcon className="icon" style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }} />,
      };
      break;
    case "totalWholesalers":
      data = {
        title: "TOTAL WHOLESALERS",
        isMoney: false,
        link: "/wholesalers",
        linkText: "View all wholesalers",
        icon: <StorefrontOutlinedIcon className="icon" style={{ backgroundColor: "rgba(255, 99, 71, 0.2)", color: "tomato" }} />,
      };
      break;
    case "deliveryPartners":
      data = {
        title: "DELIVERY PARTNERS",
        isMoney: false,
        link: "/delivery-partners",
        linkText: "View all delivery partners",
        icon: <LocalShippingOutlinedIcon className="icon" style={{ backgroundColor: "rgba(30, 144, 255, 0.2)", color: "dodgerblue" }} />,
      };
      break;
    case "totalRetailers":
      data = {
        title: "TOTAL RETAILERS",
        isMoney: false,
        link: "/retailers",
        linkText: "View all retailers",
        icon: <PersonOutlinedIcon className="icon" style={{ backgroundColor: "rgba(138, 43, 226, 0.2)", color: "blueviolet" }} />,
      };
      break;
    case "totalProducts":
      data = {
        title: "TOTAL PRODUCTS",
        isMoney: false,
        link: "/products",
        linkText: "View all products",
        icon: <Inventory2OutlinedIcon className="icon" style={{ backgroundColor: "rgba(60, 179, 113, 0.2)", color: "mediumseagreen" }} />,
      };
      break;
    default:
      data = {
        title: "UNKNOWN",
        isMoney: false,
        link: "/",
        linkText: "N/A",
        icon: null,
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={data.link} className="link">
          {data.linkText}
        </Link>
      </div>
      <div className="right">
        <div className={`percentage ${diff >= 0 ? "positive" : "negative"}`}>
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
