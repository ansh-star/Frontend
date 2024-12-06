import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import WholSalerDatatable from "../../components/datatable/WholSalerDatatable";
import Roles from "../../helper/roles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WholeSalerList = () => {
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
        <WholSalerDatatable />
      </div>
    </div>
  );
};

export default WholeSalerList;
