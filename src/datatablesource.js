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
    field: "Medicine Name",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.Image_URL} alt="avatar" />
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
  },
  {
    _id: 2,
    shopOrHospitalName: "HealthPlus Pharmacy",
    dealershipLicenseNumber: "DLN-00456",
  },
  {
    _id: 3,
    shopOrHospitalName: "Wellness Distributors",
    dealershipLicenseNumber: "DLN-00789",
  },
  {
    _id: 4,
    shopOrHospitalName: "LifeLine Medicals",
    dealershipLicenseNumber: "DLN-01012",
  },
  {
    _id: 5,
    shopOrHospitalName: "CarePoint Wholesale",
    dealershipLicenseNumber: "DLN-01345",
  },
  {
    _id: 6,
    shopOrHospitalName: "VitalPharm Supplies",
    dealershipLicenseNumber: "DLN-01678",
  },
  {
    _id: 7,
    shopOrHospitalName: "Prime Medical Depot",
    dealershipLicenseNumber: "DLN-01901",
  },
  {
    _id: 8,
    shopOrHospitalName: "Global Health Mart",
    dealershipLicenseNumber: "DLN-02234",
  },
  {
    _id: 9,
    shopOrHospitalName: "PharmaHub Distributors",
    dealershipLicenseNumber: "DLN-02567",
  },
  {
    _id: 10,
    shopOrHospitalName: "Elite Medical Suppliers",
    dealershipLicenseNumber: "DLN-02890",
  },
  {
    _id: 11,
    shopOrHospitalName: "Metro Pharmacy Wholesale",
    dealershipLicenseNumber: "DLN-03213",
  },
  {
    _id: 12,
    shopOrHospitalName: "Pioneer Pharma Supplies",
    dealershipLicenseNumber: "DLN-03546",
  },
  {
    _id: 13,
    shopOrHospitalName: "Reliable Medical Depot",
    dealershipLicenseNumber: "DLN-03879",
  },
  {
    _id: 14,
    shopOrHospitalName: "OmniCare Distributors",
    dealershipLicenseNumber: "DLN-04202",
  },
  {
    _id: 15,
    shopOrHospitalName: "Nova Medical Wholesale",
    dealershipLicenseNumber: "DLN-04535",
  },
];
