import { BrowserRouter,Navigate,Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Filter from "./pages/Filter";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import Income from "./pages/Income";
import {Toaster} from "react-hot-toast"; 
const App = ()=>{ 


    return (
      <>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Root />} />

            <Route path="/dashboard" element={<Home />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/category" element={<Category />} />
            <Route path="/income" element={<Income />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

const Root=()=>{
  const isAuthenticated=!!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}

export default App;