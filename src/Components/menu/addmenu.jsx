import React, { useEffect, useState } from "react";
import "./AddMenu.css";
import { useContext } from "react";
import axios from "axios";
import { AdminContext } from "../Contextapi/adminstorcontext";
import { toast } from "react-toastify";

function AddMenu() {
  const [title, setTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [image, setimage] = useState(null);
  const cross = "/cross.jpg";
  const { setMenuVisible } = useContext(AdminContext);
  const [checkitem, setCheckitem] = useState([]);

  const closemenu = () => {
    setMenuVisible(false);
  };

const fetchData = async () => {
      try {
        let result = await fetch(`${import.meta.env.VITE_API_URL}/api/menu/menulist`);
        result = await result.json();
        setCheckitem(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
useEffect(()=>{
  fetchData();
},[])


  const handleAddMenu = async () => {
  const isExist = checkitem.some((item) => item.name === productName);
  if (isExist) {
    toast.error("⚠️ Product already exists!", {
      position: "top-right",
      autoClose: 3000,
    });
    return; 
  }

  if (!title || !productName || !image) {
  toast.error("⚠️ All fields are required!", {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  });
  return; 
}

  const formData = new FormData();
  formData.append("title", title);
  formData.append("name", productName);
  formData.append("image", image);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/menu/menuadd`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status === 200 || res.status === 201) {
      toast.success("Menu Items added successfully!", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
      });
      setTitle("");
      setProductName("");
      setimage(null);
      setMenuVisible(false);
    }
  } catch (error) {
    console.error("Error adding menu:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="addmenu-page">
      <div className="menu-container">
        <div className="menu-form">
          <div className="menu-header">
            <h2>Add Menu</h2>
            <img
              src={cross}
              className="addmenu-crossicon"
              alt="Close"
              onClick={closemenu}
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMenu();
            }}
            encType="multipart/form-data"
          >
            <div className="add-image">
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : "/cloudimage.png"}
                  className="addimage-img"
                  alt="Upload Preview"
                />
              </label>
              <input
                type="file"
                name="productImage"
                id="image"
                onChange={(e) => setimage(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <label htmlFor="menu-title">Menu Title</label>
              <textarea
                id="menu-title"
                className="menu-title-input"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={4} 
              />
            </div>

            <div>
              <label htmlFor="menu-name">Menu Product Name</label>
              <input
                id="menu-name"
                type="text"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <button type="submit" className="menu-btn">
              Add Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMenu;
