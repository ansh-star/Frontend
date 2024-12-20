import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import UserDatatable from "../../components/datatable/UserDatatable";

const UserList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <UserDatatable />
      </div>
    </div>
  );
};

export default UserList;
