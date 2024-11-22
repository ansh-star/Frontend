import { createContext, useState } from "react";

const INITIAL_STATE = {
  _id: "",
  username: "",
  fullName: "",
  shopOrHospitalName: "",
  wholesalerRequests: [],
  retailerRequests: [],
  productList: [],
  mobileNumber: "",
  setUserData: () => {},
  role: 0,
};

export const AdminContext = createContext(INITIAL_STATE);

export const AdminContextProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const data = { ...userData, setUserData };
  return (
    <AdminContext.Provider value={{ ...data }}>
      {children}
    </AdminContext.Provider>
  );
};
