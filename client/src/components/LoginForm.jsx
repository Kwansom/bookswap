// see SignupForm.js for comments
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { LOGINUSER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import "../../assets/LoginForm.css";

const LoginForm = () => {

  const [loginUser] = useMutation(LOGINUSER)

  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // const response = await loginUser(userFormData);
      const response = await loginUser({
        variables: {
            "email": userFormData.email,
            "password": userFormData.password
        }
      })

      if (!response.data) {
        throw new Error('something went wrong!');
      }

      const token = response.data.login.token

      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>

      <Form
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
        className="custom-form"
      >
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
          className="alert-style"
        >
          Your login failed! Check your credentials and try again.
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email" className="form-label">
            Email
          </Form.Label>

          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
            className="form-control"
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label htmlFor="password" className="form-label">
            Password
          </Form.Label>

          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
            className="form-control"
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={loading || !(userFormData.email && userFormData.password)}
          type="submit"
          variant="success"
          className="submit-btn"
        >
          {loading ? "Loading..." : "Submit"}

        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
