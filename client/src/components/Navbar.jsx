import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Tab } from "react-bootstrap";
import SignUpForm from "./SignupForm";
import LoginForm from "./LoginForm";
import "../../assets/css/NavBar.css";

import Auth from "../utils/auth";

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="rounded-pill py-2"
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="text-center">
            {/* BookSwap */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse
            id="navbar"
            className="d-flex justify-content-center"
          >
            <Nav className="d-flex">
              <Nav.Link as={Link} to="/" className="nav-item-pill">
                Search Books
              </Nav.Link>
              {/* if user is logged in show saved books and logout */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/saved" className="nav-item-pill">
                    See Your Books
                  </Nav.Link>
                  <Nav.Link as={Link} to="/swap" className="nav-item-pill">
                    Swap Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout} className="nav-item-pill">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="nav-item-pill"
                >
                  Login/Sign Up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
        style={{ borderRadius: "15px" }}
      >
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey="login">
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "gray",
              padding: "2rem",
            }}
          >
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link
                    eventKey="login"
                    style={{
                      borderRadius: "20px",
                      color: "white",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="signup"
                    style={{
                      borderRadius: "20px",
                      color: "white",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Sign Up
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "2rem",
              backgroundColor: "#ffffff",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
