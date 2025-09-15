import AdminProvider from './Components/Contextapi/adminstorcontext';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminLogin from './Components/adminlogin/login';
import Adminpage from './Components/adminpage/Adminpage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <AdminProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/adminpage/*" element={<Adminpage />} />
    </Routes>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
    </BrowserRouter>
    </AdminProvider>
      );
}

export default App;
