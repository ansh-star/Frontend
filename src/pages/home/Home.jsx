import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Roles from "../../helper/roles";

const Home = () => {
  const navigate = useNavigate();
  const token = useRef();
  const [role, setRole] = useState();
  const [stats, setStats] = useState({});
  useEffect(() => {
    async function getUserStats() {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/stats`,
        {
          headers: { Authorization: `Bearer ${token.current}` },
        }
      );
      console.log(response);
      if (response.data.success) {
        setStats(response.data);
      } else {
        console.error(response.data.message);
      }
    }
    token.current = localStorage.getItem("token");
    setRole(localStorage.getItem("role"));
    if (!token.current) {
      navigate("/login");
      return;
    }
    getUserStats();
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="totalOrders" amount={stats.totalOrders} />
          <Widget type="totalSales" amount={stats.totalSales} />
          {role === Roles.ADMIN && (
            <>
              <Widget type="totalWholesalers" amount={stats.totalWholesalers} />
              <Widget
                type="deliveryPartners"
                amount={stats.totalDeliveryPartners}
              />
              <Widget type="totalRetailers" amount={stats.totalRetailers} />
            </>
          )}
          <Widget type="totalProducts" amount={stats.totalProducts} />
        </div>
      </div>
    </div>
  );
};

export default Home;
