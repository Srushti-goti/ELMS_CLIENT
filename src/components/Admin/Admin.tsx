import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import EmployeeComponent from "./Employee";
import LeaveRequestComponent from "./LeaveRequest";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';


const AdminPanel = () => {
  const navigation = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigation("/login");
    }
  }, [navigation]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigation("/login");
  };

  return (
    <div className="sign-in__wrapper">
      <div className="admin_page pt-3">
        <Button className="logout_btn" onClick={logoutUser}>Logout</Button>
        <Tabs
          defaultActiveKey="employee"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="employee" title="Employee">
            <EmployeeComponent />
          </Tab>
          <Tab className="text-white" eventKey="leave" title="Leave">
            <LeaveRequestComponent />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
export default AdminPanel;
