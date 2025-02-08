import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import RetailersDatatable from "../../components/datatable/RetailersDatatable";
import Roles from "../../helper/roles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Retailer = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role != Roles.ADMIN) {
      navigate("/");
    }
  }, []);
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <RetailersDatatable/>
      </div>
    </div>
  );
};

export default Retailer;
