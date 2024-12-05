const handleOpen = (licenseImages) => {
  // Functionality for opening the modal or viewing images
  console.log("Opening modal for license images:", licenseImages);
};

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
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "Medicine_Name",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.Image_URL || "https://via.placeholder.com/100"}
            alt="avatar"
          />
          {params.row.Medicine_Name}
        </div>
      );
    },
  },
  {
    field: "Side_effects",
    headerName: "Side Effects",
    width: 230,
  },
  {
    field: "Composition",
    headerName: "Composition",
    width: 230,
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
