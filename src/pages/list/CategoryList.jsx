import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import CategoryDatatable from "../../components/datatable/CategoryDatatable";

const CategoryList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <CategoryDatatable />
      </div>
    </div>
  );
};

export default CategoryList;
