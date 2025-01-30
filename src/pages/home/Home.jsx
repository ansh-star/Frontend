import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="totalOrders" />
          <Widget type="totalSales" />
          <Widget type="totalWholesalers" />
          <Widget type="deliveryPartners" />
          <Widget type="totalRetailers" />
          <Widget type="totalProducts" />
        </div>
      </div>
    </div>
  );
};

export default Home;
