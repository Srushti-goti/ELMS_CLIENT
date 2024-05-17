import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Admin from "./components/Admin/Admin";
import LeaveRequest from "./components/Admin/LeaveRequest";
import Employee from "./components/Admin/Employee";
import Home from "./components/Login/Home";
import Register from "./components/Login/Register";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import PublicRoute from "./components/protected-route/PublicRoute";
import { Toaster } from "react-hot-toast";


const App = () => {
    const [user, setUser] = useState<any>(JSON.parse(String(localStorage.getItem("user"))));
    
    return  (
        <>
            <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Login  setUser={setUser}/>} />} />
        <Route path="/login" element={<PublicRoute element={<Login setUser={setUser}/>} />} />
        <Route
          path="/register"
          element={<PublicRoute element={<Register />} />}
        />
        {user?.name !== "admin" &&<Route path="/home" element={<ProtectedRoute element={<Home user = {user}/>} />} />}
        {user?.name === "admin" &&<Route path="/admin" element={<Admin />}>
          <Route path="employee" element={<Employee />} />
          <Route path="leave" element={<LeaveRequest />} />
        </Route>}
        {user?.name === "admin" && <Route path="*" element={<Navigate to={'/admin'}/>} />}
        {user?.name !== "admin" && <Route path="*" element={<Navigate to={'/home'}/>} />}

      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
        </>
    )
}

export default App;