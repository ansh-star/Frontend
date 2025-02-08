import "./widget.scss";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const Widget = ({ type }) => {
  let data;

  // Temporary values
  const amount = 100;
  const diff = 20;

  switch (type) {
    case "totalOrders":
      data = {
        title: "TOTAL ORDERS",
        isMoney: false,
        link: "/orders",
        linkText: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(218, 165, 32, 0.2)", color: "goldenrod" }}
          />
        ),
      };
      break;
    case "totalSales":
      data = {
        title: "TOTAL SALES",
        isMoney: true,
        link: "/sales",
        linkText: "View total sales",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "totalWholesalers":
      data = {
        title: "TOTAL WHOLESALERS",
        isMoney: false,
        link: "/wholesalers",
        linkText: "View all wholesalers",
        icon: (
          <StorefrontOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(255, 99, 71, 0.2)", color: "tomato" }}
          />
        ),
      };
      break;
    case "deliveryPartners":
      data = {
        title: "DELIVERY PARTNERS",
        isMoney: false,
        link: "/delivery-partners",
        linkText: "View all delivery partners",
        icon: (
          <LocalShippingOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(30, 144, 255, 0.2)", color: "dodgerblue" }}
          />
        ),
      };
      break;
    case "totalRetailers":
      data = {
        title: "TOTAL RETAILERS",
        isMoney: false,
        link: "/retailers",
        linkText: "View all retailers",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(138, 43, 226, 0.2)", color: "blueviolet" }}
          />
        ),
      };
      break;
    case "totalProducts":
      data = {
        title: "TOTAL PRODUCTS",
        isMoney: false,
        link: "/products",
        linkText: "View all products",
        icon: (
          <Inventory2OutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(60, 179, 113, 0.2)", color: "mediumseagreen" }}
          />
        ),
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
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
