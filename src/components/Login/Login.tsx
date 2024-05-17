import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {BASE_URL} from '../../utils';

const Login = ({setUser} : any) => {
  const [inputUsername, setInputUsername] = useState< string | number | string[] | undefined >("");
  const [inputPassword, setInputPassword] = useState< string | number | string[] | undefined >("");
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      Email: inputUsername,
      Password: inputPassword,  
    }
    axios.post(BASE_URL + "/api/Auth/login", body).then((response) => {
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user))
        toast.success("Log in Successfuly");
        setUser(response?.data?.user)
        // window.location.reload();
        if (response.data.user.name === "admin") {
          navigate("/admin", { state: { username: inputUsername } });
        } else {
          navigate("/home", { state: { username: inputUsername } });
        }
      } else {
        setShow(true);
      }
    }).catch((error) => {
      toast.error(error.response.data.message);
      setShow(false);
    })
    setLoading(false);      
  };

  return (
    <div className="signin">
      <div className="signbackdrop text-white text-center h2 p-4">
        Employee Leave Management
      </div>

      <Form
        className="max-w-md mx-auto border p-5"
        onSubmit={handleSubmit}
      >
        <div className="h2 mb-2 text-center text-white">Login</div>
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        )}

        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">User Email</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="User Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="password">
          <Form.Label className="text-white">Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
       

        <div>
          <p className="text-center text-white ">
            Not registered ?{" "}
            <Link to="/register" className="button-register">
              Register
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;
