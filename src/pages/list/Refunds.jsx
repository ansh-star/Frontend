import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import RefundsDatatable from "../../components/datatable/RefundsDatatable";

const Refunds = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <RefundsDatatable/>
      </div>
    </div>
  );
};

export default Refunds;
