import React, { Component } from "react";
import IndexNavbar from "../components/IndexNavbar";
import Footer from "../components/Footer";
import { setSessionCookie, getSessionCookie } from "../session";

import {
  Button,
  Card,
  Form,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    // alert('Authentication coming soon!'+ this.state.username+":"+this.state.password);

    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          let url = res.url;
          let id = url.substring(url.indexOf("=") + 1);

          // Save session
          setSessionCookie({ authenticated: id });
          console.log("logged with " + id);
          this.props.history.push("/");
        } else {
          alert("Wrong username or password.");
          // this.props.history.push("/e401");
          // const error = new Error(res.error);
          // throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  componentDidMount() {
    let session = getSessionCookie("authenticated");
    if (session.authenticated !== undefined) {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <>
        <IndexNavbar />
        <div
          className="section section-image section-login"
          style={{
            backgroundImage:
              "url(" + require("../assets/img/login-image.jpg") + ")",
          }}
        >
          <Container>
            <Row>
              <Col className="mx-auto" lg="4" md="6">
                <Card className="card-register">
                  <h3 className="title mx-auto">Welcome</h3>
                  {/* <div className="social-line text-center">
                    <Button
                      className="btn-neutral btn-just-icon mt-0"
                      color="facebook"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button
                      className="btn-neutral btn-just-icon mt-0 ml-1"
                      color="google"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa fa-google-plus" />
                    </Button>
                    <Button
                      className="btn-neutral btn-just-icon mt-0 ml-1"
                      color="twitter"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa fa-twitter" />
                    </Button>
                  </div> */}
                  <Form className="register-form" onSubmit={this.onSubmit}>
                    <label>Username</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                        required
                      />
                    </InputGroup>
                    <label>Password</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                        required
                      />
                    </InputGroup>
                    <Button
                      block
                      className="btn-round"
                      color="danger"
                      type="submit"
                    >
                      Login
                    </Button>
                  </Form>
                  {/* <div className="forgot">
                    <Button
                      className="btn-link"
                      color="danger"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </Button>
                  </div> */}
                </Card>
                <div className="col text-center">
                  Don't have an account? &#8205; &#8205;
                  <Button
                    className="btn-round"
                    outline
                    color="neutral"
                    href="/register"
                    size="lg"
                  >
                    Sign up
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>{" "}
        <Footer />
      </>
    );
  }
}

export default LoginPage;
