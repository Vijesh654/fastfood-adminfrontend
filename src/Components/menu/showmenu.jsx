import React, { useContext, useEffect, useState } from "react";
import './showmenu.css';
import { AdminContext } from "../Contextapi/adminstorcontext";
import { toast } from "react-toastify";
function AllMenu() {
  const {addMenuVisible, setMenuVisible } = useContext(AdminContext);
  const [menuitem, setmenuitem] = useState([]);

  const next = () => {
    setMenuVisible(true);
  };

  const fetchData = async () => {
      try {
        let result = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/menulist`);
        result = await result.json();
        setmenuitem(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  useEffect(() => {
    fetchData();
  }, [addMenuVisible]);

  const handleDelete = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/deletemenuitem/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
       toast.error("Menu Items deleted successfully!", {
              position: "top-right",
              autoClose: 2500,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
       });
       fetchData();
    } else {
      console.error("Delete failed:", data.error || data.message);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

  return (
    <>
     <div className="menu-containerdata">
      <div className="menu-header">
        <h2>All Menu Items</h2>
        <button onClick={next} className="addmenu-btn">Add Menu</button>
      </div>

      <div className="menu-grid">
        {menuitem.map((item) => (
          <div className="menu-card" key={item._id}>
            <img src={`${import.meta.env.VITE_API_URL}${item.image}`} alt={item.name} className="menu-img" />
            <h3>{item.name}</h3>
            <p>{item.title}</p>
            <button onClick={() => handleDelete(item._id)} className="delete-btn">🗑 Delete</button>
          </div>
        ))}
      </div>
    </div>

    </>
  );
}

export default AllMenu;
