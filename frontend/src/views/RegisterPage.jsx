import React, { Component } from "react";
import IndexNavbar from "../components/IndexNavbar";
import Footer from "../components/Footer";
// import FacebookLogin from "react-facebook-login";
// import GoogleLogin from "react-google-login";

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

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      email: "",
      username: "",
      password: "",
      avatar: "",
    };
    this.responseFacebook = this.responseFacebook(this);
  }

  responseGoogle(res) {
    console.log("responseGoogle", res);
  }

  responseFacebook(res) {
    console.log("responseFacebook", res);
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          this.props.history.push("/");
        } else {
          alert("A user with the given username or email already exists.");
          // const error = new Error(res.error);
          // throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
                    <FacebookLogin
                      appId="268226984346111"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={this.responseFacebook}
                    />
                    <GoogleLogin
                      clientId="1051982037531-ffc8nhrk7ccsmc7e6l2lvlvqm8ln4kvv.apps.googleusercontent.com"
                      buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                    />
                    <Button
                      className="btn-neutral btn-just-icon mt-0 ml-1"
                      color="twitter"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fa fa-twitter" />
                    </Button>
                  </div> */}
                  <Form onSubmit={this.onSubmit}>
                    <label>Full Name</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="text"
                        name="fullName"
                        placeholder="Enter Full Name"
                        value={this.state.fullName}
                        onChange={this.handleInputChange}
                        required
                      />
                    </InputGroup>
                    <label>Email</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="text"
                        name="email"
                        placeholder="Enter Email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </InputGroup>
                    <label>Username</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="text"
                        name="userName"
                        placeholder="Enter Username"
                        value={this.state.userName}
                        onChange={this.handleInputChange}
                        required
                      />
                    </InputGroup>
                    <label>Password</label>
                    <InputGroup className="form-group-no-border">
                      <Input
                        type="password"
                        name="userPassword"
                        placeholder="Enter Password"
                        value={this.state.userPassword}
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
                      Register
                    </Button>
                  </Form>
                </Card>
                <div className="col text-center">
                  Already have an account? &#8205; &#8205;
                  <Button
                    className="btn-round"
                    outline
                    color="neutral"
                    href="/login"
                    size="lg"
                  >
                    Login
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
