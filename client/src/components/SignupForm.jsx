import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

// import { createUser } from '../utils/API';
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import "../../assets/SignupForm.css";
import Auth from "../utils/auth";

const SignupForm = () => {
  const [createUser] = useMutation(ADD_USER);

  // set initial form state
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  // set state for form validation
  const [validated] = useState(false);
  // set state for alert
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
      // const response = await createUser(userFormData);
      const response = await createUser({
        variables: {
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
          street: userFormData.street,
          city: userFormData.city,
          state: userFormData.state,
          zipCode: userFormData.zipCode,
        },
      });

      if (!response.data) {
        throw new Error("something went wrong!");
      }

      const token = response.data.addUser.token;

      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
        className="signup-form"
      >
        {/* show alert if server response is bad */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
          className="alert-style"
        >
          Something went wrong with your signup!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username" className="form-label">
            Username
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email" className="form-label">
            Email
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password" className="form-label">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="street" className="form-label">
            Street
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your street"
            name="street"
            onChange={handleInputChange}
            value={userFormData.street}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            Street is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="city" className="form-label">
            City
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your city"
            name="city"
            onChange={handleInputChange}
            value={userFormData.city}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            City is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="state" className="form-label">
            State
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your state"
            name="state"
            onChange={handleInputChange}
            value={userFormData.state}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            State is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="zipCode" className="form-label">
            ZIP
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your ZIP Code"
            name="zipCode"
            onChange={handleInputChange}
            value={userFormData.zipCode}
            required
            className="form-control"
          />
          <Form.Control.Feedback type="invalid">
            ZIP Code is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password &&
              userFormData.street &&
              userFormData.city &&
              userFormData.state &&
              userFormData.zipCode
            )
          }
          type="submit"
          variant="success"
          className="submit-btn"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
