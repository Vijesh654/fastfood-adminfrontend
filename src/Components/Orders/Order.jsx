import React, { useEffect, useState } from "react";
import "./order.css";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";   
function Order() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderPerPage, setOrderPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const totalPages = Math.ceil(data.length / orderPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);
  const indexOfLastOrder = currentPage * orderPerPage;
  const indexOfFirstOrder = indexOfLastOrder - orderPerPage;
  const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

  const orders = async () => {
    setLoading(true);
    try {
      let result = await fetch(`${import.meta.env.VITE_API_URL}/api/orderdata`);
      result = await result.json();
      const reversedData = result.reverse();
      setData(reversedData);
      setOriginalData(reversedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    orders();
  }, []);

  const option = async (id, value) => {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/parsalupdate/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parsal: value }),
    });
    response = await response.json();
    if (response) orders();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    term = term.toLowerCase();
    if (term === "") {
      setData(originalData);
      return;
    }
    const filtered = originalData.filter((item) => {
      return (
        item.username.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term) ||
        item.city.toLowerCase().includes(term) ||
        item.state.toLowerCase().includes(term) ||
        item.pincode.toString().includes(term) ||
        (item.email && item.email.toLowerCase().includes(term))
      );
    });
    setData(filtered);
    setCurrentPage(1)
  };

  const exportToCSV = () => {
    const csv = [
      ["Username", "Email", "Phone", "Address", "Amount", "Status"],
      ...data.map((d) => [d.username, d.email, d.phone, (`${d.address} | ${d.city} | ${d.state}`).replace(',', ' | '), d.amount, d.parsal]),
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "orders.csv");
  };

  const sortData = (key) => {
    const sorted = [...data].sort((a, b) => {
      if (key === "status") return sortOrder === "asc" ? a.parsal.localeCompare(b.parsal) : b.parsal.localeCompare(a.parsal);
      return 0;
    });
    setData(sorted);
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

const deleteOrder=async(id)=>{
  let res=await fetch(`${import.meta.env.VITE_API_URL}/api/deleteorder/${id}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json" 
  }
})
  res=await res.json();
  if(res){
    toast.error("Order deleted successfully!", {
      position: "top-right",
      autoClose: 2500
    });
    orders();
  }

};

  return (
    <div className="order-container">
      <div className="search-bar">
        <input
          type="search"
          className="search-input"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 Search by name, email, address..."
          value={searchTerm}
        />
        </div>
       
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : data.length === 0 ? (
        <div className="no-orders"><h1>No Orders Found</h1></div>
      ) : (
        <>
       
        <div className="order-list">
          <div className="sort-btn">
             <button className="sort-csv" onClick={exportToCSV}>📤 Export CSV</button>
        <button className="sort-status" onClick={() => sortData("status")}>Sort by Status</button>
   </div>    
          <h2 className="order-heading">📦 User Order Details</h2>

          {currentOrders.map((items, index) => {
            const itemKeys = Object.keys(items?.items || {});
            return (
              <div className="order-card" key={index}>
                <div className="order-icon">🛒</div>
                <div className="order-details">
                  <h4 className="user-name">👤 {highlight(items.username)}</h4>
                  <p className="user-email">📧 {highlight(items.email)}</p>
                  <p className="user-phone">📞 {items.phone}</p>
                  <p className="user-address">🏠 {highlight(`${items.address}, ${items.city}, ${items.state} - ${items.pincode}`)}</p>
                  <div className="item-list">
                    <h5>🧾 Ordered Items:</h5>
                    {itemKeys.map((key) => (
                      <p key={key} className="order-item">
                        <strong>{key}</strong>: {items.items[key]}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="order-meta">
                  <p>💰 <strong>Total:</strong> ₹{items.amount}</p>
                  <p>📦 <strong>Items:</strong> {itemKeys.length}</p>
                  <select
                    className="status-dropdown"
                    value={items.parsal}
                    onChange={(e) => option(items._id, e.target.value)}
                  >
                    <option value="Food Processing">🍳 Food Processing</option>
                    <option value="Out For Delivery">🚚 Out For Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                  <button className="delete-order" onClick={() => deleteOrder(items._id)}>Delete Order</button>
                </div>
              </div>
            );
          })}

          <div className="pagination">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className="page-button"
            >⬅ Prev</button>

            {pageNumbers.map((num) => (
              <button
                key={num}
                className={`page-button ${currentPage === num ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
              >{num}</button>
            ))}

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              className="page-button"
            >Next ➡</button>

            <select
              value={orderPerPage}
              onChange={(e) => {
                setOrderPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="limit-select"
            >
              <option value="5">Limit: 5</option>
              <option value="10">Limit: 10</option>
              <option value="15">Limit: 15</option>
            </select>
          </div>
        </div>
        </>
      )}
    </div>
  );

  function highlight(text) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, '<mark>$1</mark>') }} />;
  }
}

export default Order;
