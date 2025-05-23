import Roles from "./helper/roles";
import { Link } from "react-router-dom";
export const WholesalerColumn = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "shopOrHospitalName",
    headerName: "Wholesaler",
    width: 230,
  },
  {
    field: "dealershipLicenseNumber",
    headerName: "Dealership License Number",
    width: 230,
  },
];
export const ProductColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 230,
    renderCell: (params) => {
      return (
        <Link
          to={`/products/${params.row._id}/view`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.row._id}
        </Link>
      );
    },
  },
  {
    field: "Medicine Name",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      return (
        <Link
          to={`/products/${params.row._id}/view`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="cellWithImg">
            {params.row.Image_URLS.length !== 0 && (
              <img
                className="cellImg"
                src={params.row.Image_URLS[0]}
                alt="avatar"
              />
            )}
            {params.row.Image_URLS.length === 0 && (
              <img
                className="cellImg"
                src="https://watermarkimage1.s3.ap-south-1.amazonaws.com/watermarkimage.jpg"
                alt="avatar"
              />
            )}
            {params.row.Medicine_Name}
          </div>
        </Link>
      );
    },
  },
  {
    field: "Composition",
    headerName: "Composition",
    width: 230,
  },
  {
    field: "mrp",
    headerName: "Price",
    width: 130,
  },
  {
    field: "total_stock",
    headerName: "Total Stock",
    width: 130,
  },
];

export const categoryColumn = [
  { field: "_id", headerName: "ID", width: 230 },
  {
    field: "category_name",
    headerName: "Category Name",
    renderCell: (params) => (
      <div className="cellWithImg">
        <img className="cellImg" src={params.row.category_icon} alt="avatar" />
        {params.row.category_name}
      </div>
    ),
    width: 300,
  },
];
export const userColumns = [
  {
    field: "_id",
    headerName: "ID",
    width: 230,
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 230,
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    width: 230,
  },
  {
    field: "role",
    headerName: "Role",
    width: 130,
    renderCell: (params) => {
      return (
        <div className="cellRole">
          {params.row.role == Roles.ADMIN && (
            <div className="roleAdmin">Admin</div>
          )}
          {params.row.role == Roles.WHOLESALER && (
            <div className="roleUser">Wholesaler</div>
          )}
          {params.row.role == Roles.RETAILER && (
            <div className="roleUser">Retailer</div>
          )}
          {params.row.role == Roles.DELIVERY_PARTNER && (
            <div className="roleUser">Delivery Partner</div>
          )}
        </div>
      );
    },
  },
];
export const userRows = [
  {
    _id: 1,
    shopOrHospitalName: "MedCare Supplies",
    dealershipLicenseNumber: "DLN-00123",
    licenseImages: [
      "https://via.placeholder.com/150?text=Page1",
      "https://via.placeholder.com/150?text=Page2",
    ],
  },
  {
    _id: 2,
    shopOrHospitalName: "HealthPlus Pharmacy",
    dealershipLicenseNumber: "DLN-00456",
    licenseImages: [
      "https://media.timeout.com/images/106041640/750/562/image.jpg",
      "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg",
    ],
  },
];
