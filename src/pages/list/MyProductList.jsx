import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import MyProductsDatatable from "../../components/datatable/MyProductsDatatable";

const MyProductList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <MyProductsDatatable />
      </div>
    </div>
  );
};

export default MyProductList;
