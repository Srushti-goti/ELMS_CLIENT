import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { BASE_URL, authHeader } from "../../utils";
import Table from 'react-bootstrap/Table';
import "../../index.css";
import moment from "moment";
interface LeaveRequestData {
  leaveId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: number | string;
  employee: any
}
  const statusOptions = ["Pending", "Approved", "Rejected"];
  const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedFields, setEditedFields] = useState<any>({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailsFields, setDetailsFields] = useState<any>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFields, setDeleteFields] = useState<any>({});

  const fetchData = () => {
    setLoading(true);
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.get(BASE_URL + "/api/LeaveManagement/Getall", authHeader2).then((response) => {
      setLeaveRequests(response.data.data);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (leaveId: string) => {
    const selectedLeave: any = leaveRequests.find(
      (request: LeaveRequestData) => request.leaveId === leaveId,
    );  

    setEditedFields(selectedLeave);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditedFields({});
  };
  const handleSave =  () => {
    const body = {
    leaveId: editedFields.leaveId,
    employeeId: editedFields.employeeId,
    startDate: editedFields.startDate,
    endDate: editedFields.endDate,
    reason: editedFields.reason,
    status: parseInt(editedFields.status),
    previousLeave: ""
    }
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.put(BASE_URL + "/api/LeaveManagement/Update", body, authHeader2).then((response) => {
      fetchData();
      handleEditModalClose();
    }).catch((error) => {
      console.log("Error", error);
    });
  };

    const handleDelete = (leaveId: string) => {
    const selectedLeave : any = leaveRequests.find(
      (request: LeaveRequestData) => request.leaveId === leaveId,
    );  const temp = {...selectedLeave};
    temp.startDate = moment(temp.startDate).format("MM/DD/YYYY");
    temp.endDate = moment(temp.endDate).format("MM/DD/YYYY");
    setDeleteFields(temp);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteFields({});
  };

  const handleDeleteLeaveRequest = () => {
    const authHeader2 = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
  }
    axios.delete(BASE_URL + `/api/LeaveManagement/Delete?id=${deleteFields.leaveId}`, authHeader2).then((response) => {
      fetchData();
      handleDeleteModalClose();
    }).catch((error) => {
      console.error("Error Deleting leave request:", error);
    })
  };

  const handleDetails = (leaveId: string) => {
    const selectedLeave : any = leaveRequests.find(
      (request: LeaveRequestData) => request.leaveId === leaveId,
    );
    const temp = {...selectedLeave};
    temp.startDate = moment(temp.startDate).format("MM/DD/YYYY");
    temp.endDate = moment(temp.endDate).format("MM/DD/YYYY");
    setDetailsFields(temp);
    setDetailModalOpen(true);
  };
  const handleDetailsModalClose = () => {
    setDetailModalOpen(false);
    setDetailsFields({});
  };



  return (
    <div className="max-w-md mx-auto border  p-2">
      <div className="employees-list-container ">
        <h2 className="text-white">Leave Requests List</h2>
         <Table striped bordered hover >
          <thead>
            <tr>
              <th>Leave ID</th>
              <th>Employee Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>Loading...</td>
              </tr>
            ) : leaveRequests.length > 0 ? (
              leaveRequests.map((request: LeaveRequestData) => (
                <tr key={request.leaveId}>
                  <td>{request.leaveId}</td>
                  <td>{request.employee.name}</td>
                  <td>{moment(request.startDate).format("MM/DD/YYYY")}</td>
                  <td>{moment(request.endDate).format("MM/DD/YYYY")}</td>
                  <td>{request.reason}</td>
                  <td>{statusOptions[request.status as number]}</td>
                  <td
                  >
                    <MdModeEdit onClick={() => handleEdit(request.leaveId)} />
                    <RiDeleteBin6Line  onClick={() => handleDelete(request.leaveId)} />
                    <HiOutlineInformationCircle 
                      onClick={() => handleDetails(request.leaveId)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr >
                <td colSpan={6}>No data available</td>
              </tr>
            )}
          </tbody>
          </Table>
     

        {editModalOpen && (
          <div className="edit-modal">
            <h2 className="text-primary text-center">Edit Leave Request</h2>
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={editedFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={editedFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={moment(editedFields.endDate).format("MM/DD/YYY")} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={moment(editedFields.endDate).format("MM/DD/YYY")} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input
                type="text"
                value={editedFields.reason}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, reason: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={editedFields.status}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, status: e.target.value })
                }
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
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
            <h2 className="text-dark">Leave Request Details</h2>
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={detailsFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={detailsFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={detailsFields.startDate} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={detailsFields.endDate} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input type="text" value={detailsFields.reason} disabled />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={deleteFields.status}
                onChange={(e) =>
                  setEditedFields({ ...deleteFields, status: e.target.value })
                }
                disabled
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-3">
              <button onClick={handleDetailsModalClose}>Close</button>
            </div>
          </div>
        )}

        {deleteModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Leave Request Delete</h2>
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={deleteFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={deleteFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={deleteFields.startDate} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={deleteFields.endDate} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input type="text" value={deleteFields.reason} disabled />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={deleteFields.status}
                onChange={(e) =>
                  setEditedFields({ ...deleteFields, status: e.target.value })
                }
                disabled
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
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

export default LeaveRequest;
