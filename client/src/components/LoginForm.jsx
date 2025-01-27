import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { LOGINUSER } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import "../../assets/images/css/css/LoginForm.css";

const LoginForm = () => {
  const [loginUser] = useMutation(LOGINUSER);

  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Step 1: Add `loading` state to handle loading state
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Step 2: Set loading state to true when starting the async operation
      setLoading(true);

      // Call the login mutation
      const response = await loginUser({
        variables: {
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      if (!response.data) {
        throw new Error("Something went wrong!");
      }

      const token = response.data.login.token;

      // Handle the token and login
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    } finally {
      // Step 3: Set loading state to false once the async operation is done
      setLoading(false);
    }

    // Reset the form data after submission
    setUserFormData({
      email: "",
      password: "",
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
            type="text"
            placeholder="Your email"
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

        {/* Button with loading state */}
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
