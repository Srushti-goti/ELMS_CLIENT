import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";
import "../../index.css";
import { BASE_URL, authHeader } from "../../utils";

const Home = ({user} : any) => {
  const [inputEmployeename, setInputEmployeename] = useState< string | number | string[] | undefined >(user?.name);
  const [inputStartDate, setInputStartDate] = useState(new Date());
  const [inputLastDate, setInputLastDate] = useState(new Date());
  const [inputReason, setInputReason] = useState< string | number | string[] | undefined >("");
  const [username, setUsername] = useState< string | number | string[] | undefined >("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileModalShow, setProfileModalShow] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
      const timer = setTimeout(() => {
        setUsername("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  const handleLogOut = () => {
    localStorage.removeItem("token");
    toast.success("Log Out Successfully");
    navigate("/login");
  };
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      Reason: inputReason,
      StartDate: inputStartDate,
      EndDate: inputLastDate,
    }

    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.post(BASE_URL + "/api/LeaveManagement/Add", body, authHeader2).then((response) => {
      if (response.status === 200) {
        setInputStartDate(new Date());
        setInputLastDate(new Date());
        setInputReason("");
        toast.success("Submitted Successfull");
      } else {
        setShow(true);
      }
    }).catch((error) => {
      console.log(error);
      setShow(true);
    }).finally(() => {
      setLoading(false);
    })
  };

  const fetchLeaveData = async () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.get(BASE_URL + "/api/LeaveManagement/ShowLeaveOfEmp", authHeader2).then((response: any) => {
      setLeaveData(response.data);
      setModalShow(true);
    }).catch((error) => {
      console.log(error);
    })
  };

  const getStatusText = (status: number) => {
    const STATUS = ["Pending", "Approved", "Rejected"]
    return STATUS[status];
  };

  const fetchProfileData = () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.get(BASE_URL + "/api/Employees/Getbyid", authHeader2).then((response) => {
      setProfileData(response.data.data);
      setProfileModalShow(true);
    }).catch((error) => {
      console.log(error);
    })
  };

  const handleSaveProfile = () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.put(BASE_URL + "/api/Employees/Update", profileData, authHeader2).then((response) => {
      if (response.status === 200) {
        setProfileModalShow(true);
        toast.success("Profile Updated Successfuly");
      } 
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setProfileModalShow(false);
    })
  };

  return (
    <div className="signin">  
      <div className="signbackdrop text-white text-center h2 p-4">Employee Leave Form</div>
      <Form
        className="max-w-md mx-auto border border-gray-60 rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        {username && (
          <Alert className="mb-2" variant="success">
            Welcome, {username}!
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">Employee Name : </Form.Label>
          <Form.Control
            type="text"
            value={inputEmployeename}
            placeholder="Employee Name"
            onChange={(e) => setInputEmployeename(e.target.value)}
            required
            disabled
          />
        </Form.Group>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2" controlId="startDate">
                <Form.Label className="text-white">Start Date : </Form.Label>
                <DatePicker
                  selected={inputStartDate}
                  onChange={(date) => {
                    setInputStartDate(date as Date);
                    setInputLastDate(date as Date);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start Date"
                  className="form-control"
                  required
                  minDate={new Date()}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2" controlId="endDate">
                <Form.Label className="text-white">End Date : </Form.Label>
                <DatePicker
                  selected={inputLastDate}
                  onChange={(date) => setInputLastDate(date as Date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  className="form-control"
                  minDate={inputStartDate}
                  required
                />
              </Form.Group>
            </div>
          </div>
        </div>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">Reason : </Form.Label>
          <Form.Control
            type="text"
            value={inputReason}
            placeholder="Reason"
            onChange={(e) => setInputReason(e.target.value)}
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Submitting...
          </Button>
        )}
        <br />
        <br />
        <div className="text-center text-white">
          <Button className="btn btn-primary w-100" onClick={fetchLeaveData}>
            My Leaves
          </Button>
        </div>
        <br />
        <div className="text-center text-white">
          <Button className="btn btn-primary w-100" onClick={fetchProfileData}>
            My Profile
          </Button>
        </div>
        <br />
        <div className="text-center text-white">
          <Button className="btn btn-primary w-100" onClick={handleLogOut}>
            Log Out
          </Button>
        </div>
      </Form>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Leaves</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {leaveData.map((leave: any, index) => (
            <div key={index}>
              <p className="fw-bold">Leave No : {index + 1} </p>

              <div>
                <label className="text-dark">Start Date</label>
                <input
                  type="text"
                  value={new Date(leave.startDate).toLocaleDateString()}
                  disabled
                />
              </div>
              <br />
              <div>
                <label className="text-dark">End Date</label>
                <input
                  type="text"
                  value={new Date(leave.endDate).toLocaleDateString()}
                  disabled
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Reason</label>
                <input type="text" value={leave.reason} disabled />
              </div>
              <br />
              <div>
                <label className="text-dark">Status</label>
                <input
                  type="text"
                  value={getStatusText(leave.status)}
                  disabled
                />
              </div>
              <hr />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={profileModalShow} onHide={() => setProfileModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileData && (
            <div>
              <div>
                <label className="text-dark">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Age</label>
                <input
                  type="text"
                  value={profileData.age}
                  onChange={(e) =>
                    setProfileData({ ...profileData, age: e.target.value })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Birth Date</label>
                <input
                  type="text"
                  value={profileData.birthdate}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      birthdate: e.target.value,
                    })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      department: e.target.value,
                    })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Position</label>
                <input
                  type="text"
                  value={profileData.position}
                  onChange={(e) =>
                    setProfileData({ ...profileData, position: e.target.value })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Email</label>
                <input
                  type="text"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <br />
              <div>
                <label className="text-dark">Contact No</label>
                <input
                  type="text"
                  value={profileData.contactNumber}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      contactNumber: e.target.value,
                    })
                  }
                />
              </div>
              <br />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveProfile}>
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => setProfileModalShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
