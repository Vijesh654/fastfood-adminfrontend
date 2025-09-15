import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../Contextapi/adminstorcontext";
function AllProduct() {
  const [product, setProduct] = useState([]);
  const {addProductVisible,setProductVisible}=useContext(AdminContext);
  const fetchData = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/productapi/findallproduct`);
      res = await res.json();
      setProduct(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

   useEffect(() => {
    fetchData();
  }, [addProductVisible,]);

  const deletepro = async (id) => {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/productapi/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await res.json();
    if (result) {
      toast.error("Product deleted successfully!", {
        position: "top-right",
        autoClose: 2500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      fetchData();
    }
  };
 

  const editproduct = (e) => {
    localStorage.setItem("Updateproducts",e)
    setProductVisible(true)
  };

  const handleSearch = (e) => {
    const searchTerm=e.toLowerCase();
    if(searchTerm ===""){
      fetchData();
      return;
    }

    const filteredProducts=product.filter((item)=>{
   return(
      item.productname.toLowerCase().includes(searchTerm) ||
      item.productcategory.toLowerCase().includes(searchTerm)
   )
    })
     setProduct(filteredProducts);    
  }


  return (
    <>
    <div className="search-bar">
      <input type="search" className="search-input" onChange={(e) => handleSearch(e.target.value)} placeholder="🔍Search product..." /> 
    </div> 
    <div className="add-product-div">
     <button className="add-product-btn" onClick={() =>{ setProductVisible(true) }}>Add Product</button>
    </div>

    {product.length === 0 ? (
      <div className="no-orders">
        <h1>No Products Found</h1>
      </div>
    ) : (
      <div className="product" style={{ marginTop: "20px" }}>
        <table className="teb">
          <thead>
            <tr className="t1rhead">
              <th>Productimage</th>
              <th>Productname</th>
              <th>ProductsCategory</th>
              <th>ProductsQuantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {product.length > 0 ? (
              product.map((item, index) => (
                <tr key={index} className="tr">
                  <th>
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL}${item.productimage}`}
                      alt={item.productname}
                      width="70"
                      height="50"
                      border="2px"
                    />
                  </th>

                  <th>
                    <p>{item.productname}</p>
                  </th>
                  <th>
                    {" "}
                    <p>{item.productcategory}</p>
                  </th>
                  <th>{item.productquantity}</th>
                  <th>
                    <button
                      className="bt1"
                      onClick={() => editproduct(item._id)}
                    >
                      Edit
                    </button>
                  </th>
                  <th>
                    <button className="bt2" onClick={() => deletepro(item._id)}>
                      Delete
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <th>Loading products...</th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
    </>
  );
}

export default AllProduct;
