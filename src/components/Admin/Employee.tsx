import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import {BASE_URL, authHeader} from "./../../utils"
import Table from "react-bootstrap/esm/Table";
import "../../index.css";
import moment from "moment";

function getDate18YearsAgo() {
  const currentDate = new Date(); 
  const pastDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate()); 
  return pastDate.toLocaleDateString(); 
}

function calculateAge(birthdate:any) {
  const birthDate = new Date(birthdate);
  const today = new Date(); 
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }

  return age;
}

interface LeaveRequestData {
  leaveId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number | string;
}
interface EmployeeData {
  employeeId: string;
  name: string;
  age: number | string;
  birthdate: string;
  department: string;
  position: string;
  previousLeave: string;
  password: string;
  email: string;
  address: string;
  role: number | string;
  status: number | string;
  contactNumber: string;
}

const Employee = () => {
  const [employees, setEmployees] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedFields, setEditedFields] = useState<any>({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailsFields, setDetailsFields] = useState<any>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFields, setDeleteFields] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
   const  authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.get(BASE_URL + "/api/Employees/Getall", authHeader2).then((response) => {
      setEmployees(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetails = (employeeId: string) => {
    const selectedLeave = employees.find(
      (request: LeaveRequestData) => request.employeeId === employeeId,
    );
    setDetailsFields(selectedLeave);
    setDetailModalOpen(true);
  };
  const handleDetailsModalClose = () => {
    setDetailModalOpen(false);
    setDetailsFields({});
  };

  const handleEdit = (employeeId: string) => {
    const selectedLeave : any= employees.find(
      (request: LeaveRequestData) => request.employeeId === employeeId,
    );
    const temp = {...selectedLeave};
    temp.birthdate = moment(temp.birthdate).format("YYYY-MM-DD");
    setEditedFields(temp);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditedFields({});
  };
  const handleSave = () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    const body = {
      employeeId: editedFields.employeeId,
      Name: editedFields.name,
      age: parseInt(editedFields.age),
      Birthdate: editedFields.birthdate,
      Department: editedFields.department,
      Position: editedFields.position,
      Email: editedFields.email,
      Password: editedFields.password,
      ContactNumber: editedFields.contactNumber,
      previousLeave: ""
    }
    axios.put(BASE_URL + "/api/Employees/Update",body, authHeader2 ).then((response) => {
      fetchData();
      handleEditModalClose();
    }).catch((error) => {
      console.log(error)  
    })
  };

  const handleDelete = (employeeId: string) => {
    const selectedLeave = employees.find(
      (request: LeaveRequestData) => request.employeeId === employeeId,
    );
    setDeleteFields(selectedLeave);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteFields({});
  };

  const handleDeleteLeaveRequest = async () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.delete(BASE_URL + `/api/Employees/Delete?id=${deleteFields.employeeId}`, authHeader2).then((response) => {
      fetchData();
      handleDeleteModalClose();
    }).catch((error) => {
      console.log(error);
    })
  };

    return (
      <div className="max-w-md mx-auto border p-2">
        <div className="employees-list-container ">
        <h2 className="text-white">Employee List</h2>
         <Table striped bordered hover >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>DateOfBirth</th>
              <th>Contact Number</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            ) : (
              employees.map((employee: EmployeeData) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.age}</td>
                  <td>{moment(employee.birthdate).format("MM/DD/YYYY")}</td>
                  <td>{employee.contactNumber}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td
                  >
                    <MdModeEdit onClick={() => handleEdit(employee.employeeId)} />
                    <RiDeleteBin6Line onClick={() => handleDelete(employee.employeeId)}/>
                    <HiOutlineInformationCircle 
                      onClick={() => handleDetails(employee.employeeId)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        

        {editModalOpen && (
          <div className="edit-modal">
            <h2 className="text-primary text-center">Edit Employee</h2>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input type="text" value={editedFields.employeeId} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input
                    type="text"
                    value={editedFields.name}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Email</label>
                  <input
                    type="text"
                    value={editedFields.email}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Age</label>
                  <input
                    type="text"
                    value={editedFields.age}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, age: e.target.value })
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input
                    type="date"
                    value={editedFields.birthdate}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        birthdate: e.target.value,
                        age: calculateAge(e.target.value)
                      })
                    }
                    max={moment(getDate18YearsAgo()).format("YYYY-MM-DD")}
                  />
                </div>
                
              </div><div className="col-md-6">
                <div>
                  <label className="text-dark">Department</label>
                  <input
                    type="text"
                    value={editedFields.department}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
                    
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Position</label>
                  <input
                    type="text"
                    value={editedFields.position}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        position: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Contact No.</label>
                  <input
                    type="text"
                    value={editedFields.contactNumber}
                    onChange={(e) =>
                      setEditedFields({
                        ...editedFields,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button className=" me-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {detailModalOpen && (
          <div className="details-modal">
            <h2 className="text-primary text-center">Employee Details</h2>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input
                    type="text"
                    value={detailsFields.employeeId}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input type="text" value={detailsFields.name} disabled />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Email</label>
                  <input type="text" value={detailsFields.email} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Age</label>
                  <input type="text" value={detailsFields.age} disabled />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input type="text" value={detailsFields.birthdate} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Conteact No.</label>
                  <input
                    type="text"
                    value={detailsFields.contactNumber}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Position</label>
                  <input type="text" value={detailsFields.position} disabled />
                </div>
              </div>
            
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Department</label>
                  <input
                    type="text"
                    value={detailsFields.department}
                    disabled
                  />
                </div>
              </div>
              </div>
            <div className="text-center mt-3">
              <button onClick={handleDetailsModalClose}>Close</button>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Employee Delete</h2>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input type="text" value={deleteFields.employeeId} disabled />
                </div>
                <div>
                  <label className="text-dark">Email</label>
                  <input type="text" value={deleteFields.email} disabled />
                </div>
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input type="text" value={deleteFields.birthdate} disabled />
                </div>
                <div>
                  <label className="text-dark">Position</label>
                  <input type="text" value={deleteFields.position} disabled />
                </div>
                
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input type="text" value={deleteFields.name} disabled />
                </div>
                <div>
                  <label className="text-dark">Age</label>
                  <input type="text" value={deleteFields.age} disabled />
                </div>
              
                <div>
                  <label className="text-dark">Conteact No.</label>
                  <input
                    type="text"
                    value={deleteFields.contactNumber}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-dark">Department</label>
                  <input type="text" value={deleteFields.department} disabled />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteLeaveRequest}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                {" "}
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
