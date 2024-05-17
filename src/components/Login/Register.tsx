import React, { useState } from "react";
import { Form , Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "../../index.css"
import { BASE_URL } from "../../utils";
import toast from "react-hot-toast";
import * as yup from 'yup';
import {Formik, Form as FForm, ErrorMessage} from 'formik';

function getDate18YearsAgo() {
  const currentDate = new Date(); 
  const pastDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate()); 
  return pastDate.toLocaleDateString(); 
}

const initialValue: any = { Name: "",
Age: "",
Birthdate: "",
Department: "",
Position: "",
Password: "",
ContactNumber: "",
Email: "",
IsActive: "",
PreviousLeave: "",}


const registerSchema = yup.object().shape({
  Name: yup.string().required(),
  Age: yup.number().required().min(18).max(100),
  Birthdate: yup.string().required(),
  Department: yup.string().required(),
  Position: yup.string().required(),
  Password: yup.string().required(),
  ContactNumber: yup.string().required() ,
  Email: yup.string().required()
})
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

const Register = () => {
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit =  (value: any) => {
    setLoading(true);
    const body = {
      ...value,
      IsActive: true,
      PreviousLeave: "",
    }
    axios.post(BASE_URL + "/api/Auth/Register", body).then((response) => {
      if (response.status === 200) {
        toast.success("Register successfully");
        navigate("/login");
      } else {
        setShow(true);
      }
    }).catch((error) => {
      console.log(error);
      
      toast.error(error.response.data.message);
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <div className="signin">
      <div className="signbackdrop text-white text-center h2 p-4">Register</div>
      <Formik initialValues={initialValue}
      validationSchema={registerSchema}
      onSubmit={handleSubmit}
      >
{
  ({setFieldValue, values, errors}: any) => {
    return <FForm         className="max-w-md mx-auto border border-gray-60 rounded-lg p-5">
      
        {showError && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShowError(false)}
            dismissible
          >
            Error registering new user.
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="employeeName">
          <Form.Label className="text-white">Employee Name:</Form.Label>
          <Form.Control
            type="text"
            value={values.Name}
            placeholder="Employee Name"
            onChange={(e) => setFieldValue("Name",e.target.value)} 
          />
          <p className="text-danger"><ErrorMessage  name="Name" /></p>
        </Form.Group>

        <Form.Group className="mb-2" controlId="email">
          <Form.Label className="text-white">E-Mail:</Form.Label>
          <Form.Control
            type="text"
            value={values?.Email}
            placeholder="E-Mail " 
            onChange={(e) => setFieldValue("Email",e.target.value)}
          />
          <p className="text-danger"><ErrorMessage  name="Email" /></p>
        </Form.Group>
        <Form.Group className="mb-2" controlId="dob">
          <Form.Label className="text-white">Date of Birth:</Form.Label> <br />
          <DatePicker
            selected={values?.Birthdate}
            onChange={(date: Date) => {
              setFieldValue("Birthdate",date);
              setFieldValue("Age", calculateAge(date))
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Date of Birth"
            className="form-control"  
            maxDate={new Date(getDate18YearsAgo())}
          />
          <p className="text-danger"><ErrorMessage  name="Birthdate" /></p>
        </Form.Group>
        <Form.Group className="mb-2" controlId="age">
          <Form.Label className="text-white">Age:</Form.Label>
          <Form.Control
            type="number"
            value={values.Age}
            placeholder="Age"
            onChange={(e) => setFieldValue("Age", e.target.value)}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="department">
          <Form.Label className="text-white">Department:</Form.Label>
          <Form.Control
            type="text"
            value={values.Department}
            placeholder="Department"
            onChange={(e) => setFieldValue( "Department",e.target.value)}
            
          />
          <p className="text-danger"><ErrorMessage  name="Department" /></p>
        </Form.Group>
        <Form.Group className="mb-2" controlId="position">
          <Form.Label className="text-white">Position:</Form.Label>
          <Form.Control
            type="text"
            value={values?.Position}
            placeholder="Position"
            onChange={(e) => setFieldValue("Position",e.target.value)}
          />
          <p className="text-danger"><ErrorMessage  name="Position" /></p>
        </Form.Group>
        <Form.Group className="mb-2" controlId="contactNo">
          <Form.Label className="text-white">Contact Number:</Form.Label>
          <Form.Control
            type="number"
            value={values?.ContactNumber}
            placeholder="Contact Number"
            onChange={(e) => setFieldValue("ContactNumber",e.target.value)}
            
          />
          <p className="text-danger"><ErrorMessage  name="ContactNumber" /></p>
        </Form.Group>
        
        <Form.Group className="mb-2" controlId="password">
          <Form.Label className="text-white">Password:</Form.Label>
          <Form.Control
            type="password"
            value={values?.Password}
            placeholder="Password"
            onChange={(e) => setFieldValue("Password",e.target.value)}
          />
          <p className="text-danger"><ErrorMessage  name="Password" /></p>
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Register
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Registering...
          </Button>
        )}
        
        <div>
          <p className="text-center text-white">
            Already registered?{" "}
            <Link to="/login" className="button-login">
              Login
            </Link>
          </p>
        </div>
      

    </FForm>
  }
}
      </Formik>
      
    </div>
  );
};

export default Register;
