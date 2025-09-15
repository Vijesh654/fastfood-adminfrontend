import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Addproduct.css";
import axios from "axios";
import { AdminContext } from "../Contextapi/adminstorcontext";
const AddProduct = () => {
  const [image, setimage] = useState("");
  const [menuitem, setmenuitem] = useState([]);
  const cross = "/cross.jpg";
  const { setProductVisible } = useContext(AdminContext);
  const [updateproduct, setupdtpro] = useState(false);
  const [id, setid] = useState(null);
  const [productData, setProductData] = useState({
    productImage: null,
    productName: "",
    productCategory: "",
    productDescription: "",
    productQuantity: "",
    productPrice: "",
  });
  const [product, setproduct] = useState([]);

  const fetchData = async () => {
    try {
      let result = await fetch(
        `${import.meta.env.VITE_API_URL}/api/menu/menulist`
      );
      result = await result.json();
      setmenuitem(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const checked = localStorage.getItem("Updateproducts");
    setid(checked);
    if (checked) {
      setupdtpro(true);
    }
  }, []);

  useEffect(() => {
    if (updateproduct) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/productapi/singleproduct/${id}`)
        .then((response) => {
          setproduct(response.data);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        });
    }
  }, [updateproduct, id]);
 

  useEffect(() => {
    if (updateproduct && product) {
      setProductData({
        productImage: product.productimage || null,
        productName: product.productname || "",
        productCategory: product.productcategory || "",
        productDescription: product.productdescription || "",
        productQuantity: product.productquantity || "",
        productPrice: product.productprice || "",
      });
    }
  }, [updateproduct, product]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProductData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addhandleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productImage", productData.productImage);
    formData.append("productName", productData.productName);
    formData.append("productCategory", productData.productCategory);
    formData.append("productDescription", productData.productDescription);
    formData.append("productQuantity", productData.productQuantity);
    formData.append("productPrice", productData.productPrice);

    try {
      let result = await fetch(
        `${import.meta.env.VITE_API_URL}/productapi/addproduct`,
        {
          method: "POST",
          body: formData,
        }
      );

      result = await result.json();

      if (result.success) {
        toast(
          <div
            style={{
              backgroundColor: "#fff",
              color: "#28a745",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ✅ Product added successfully!
          </div>,
          {
            icon: false,
            position: "top-right",
            autoClose: 3000,
          }
        );
        setProductVisible(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add product");
    }
  };

  const updthandlesubmit = async (e) => {
    e.preventDefault();
    console.log(productData.productImage);

    const formdata = new FormData();
    formdata.append("productimage", productData.productImage);
    formdata.append("productname", productData.productName);
    formdata.append("productcategory", productData.productCategory);
    formdata.append("productdescription", productData.productDescription);
    formdata.append("productquantity", productData.productQuantity);
    formdata.append("productprice", productData.productPrice);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/productapi/updateproduct/${id}`,
        {
          method: "PUT",
          body: formdata,
        }
      );

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        toast.success("Product updated!", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        
        localStorage.removeItem("Updateproducts");
        setProductVisible(false);
      } catch (err) {
        console.error("Invalid JSON response", err);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="addproduct-page">
      <div className="addproduct">
        {updateproduct ? <h2>Update Products</h2> : <h2>Add New Products</h2>}
        <img
          src={cross}
          className="addproduct-crossicon"
          onClick={() => {
            if (updateproduct) {
              localStorage.removeItem("Updateproducts");
              setProductVisible(false);
            } else {
              setProductVisible(false);
            }
          }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (updateproduct) {
              updthandlesubmit(e);
            } else {
              addhandleSubmit(e);
            }
          }}
          encType="multipart/form-data"
        >
          <div className="addimage">
            {updateproduct ? <p>Update images</p> : <p>Upload image</p>}
            <label htmlFor="image">
              {updateproduct ? (
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : `${import.meta.env.VITE_API_URL}${product.productimage}`
                  }
                  className="addimage-img"
                />
              ) : (
                <img
                  src={image ? URL.createObjectURL(image) : "/cloudimage.png"}
                  className="addimage-img"
                />
              )}
            </label>
            <input
              type="file"
              name="productImage"
              onChange={(e) => {
                setimage(e.target.files[0]);
                handleChange(e);
              }}
              id="image"
              style={{ display: "none" }}
            />
          </div>
          <div className="addproductdetails">
            <div className="in1">
              {updateproduct ? (
                <label htmlFor="productName">Update Product Name</label>
              ) : (
                <label htmlFor="productName">Product Name</label>
              )}
              <input
                className="inp"
                type="text"
                id="productName"
                placeholder="Product Name"
                required
                name="productName"
                value={productData.productName}
                onChange={handleChange}
              />
            </div>
            <div className="in1">
              {updateproduct ? (
                <label htmlFor="productCategory">Update Product Category</label>
              ) : (
                <label htmlFor="productCategory">Product Category</label>
              )}
              <select
                id="productCategory"
                name="productCategory"
                required
                value={productData.productCategory}
                className="select"
                onChange={handleChange}
              >
                {menuitem.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="addproductdetails">
            <div style={{ width: "100%" }}>
              <label htmlFor="productDescription">
                {updateproduct
                  ? "Update Product Description"
                  : "Product Description"}
              </label>
              <textarea
                className="textarea"
                id="productDescription"
                placeholder="Description"
                required
                name="productDescription"
                value={productData.productDescription}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="addproductdetails">
            <div className="in1">
              {updateproduct ? (
                <label htmlFor="productQuantity">Update Quantity</label>
              ) : (
                <label htmlFor="productQuantity">Quantity</label>
              )}
              <input
                type="number"
                id="productQuantity"
                name="productQuantity"
                placeholder="Product Quantity"
                value={productData.productQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="in1">
              {updateproduct ? (
                <label htmlFor="productPrice">Update Product Price</label>
              ) : (
                <label htmlFor="productPrice">Product Price</label>
              )}
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                placeholder="Product Price"
                value={productData.productPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="button" style={{ marginTop: "10px" }}>
            <button type="submit" className="btn">
              {updateproduct ? "Update Products" : "ADD Products"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
