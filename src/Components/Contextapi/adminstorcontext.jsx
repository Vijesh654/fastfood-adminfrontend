import React, { createContext, useState } from "react";
export const AdminContext = createContext();
const AdminProvider = ({ children }) => {
  const [addProductVisible, setProductVisible] = useState(false);
  const [addMenuVisible, setMenuVisible]=useState(false);
  return (
    <AdminContext.Provider value={{ addProductVisible, setProductVisible,addMenuVisible, setMenuVisible }}>
      {children}
    </AdminContext.Provider>
  );
};
export default AdminProvider;
