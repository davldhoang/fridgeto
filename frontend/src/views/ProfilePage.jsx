import React, { Component } from "react";

import ProfileHeader from "../components/ProfileHeader.jsx";
import IndexNavbar from "../components/IndexNavbar.jsx";
import Footer from "../components/Footer.jsx";
import { getSessionCookie } from "../session.js";

import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Modal,
  FormGroup,
  Input,
} from "reactstrap";

class ProfilePage extends Component {
  constructor() {
    super();
    this.state = {
      profile: "",
      recipes: [],
      loginModal: false,
      profileModal: false,
    };
  }
  componentDidMount() {
    let session = getSessionCookie("authenticated");
    fetch("/api/profile/" + session.authenticated, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((profile) => {
        console.log(profile);
        this.setState({ profile });
        // this.setState({ userName: profile.userName });
        // this.setState({ fullName: profile.fullName });
        // this.setState({ email: profile.email });
      });
    fetch("/api/recipeCreator/" + session.authenticated)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((recipes) => {
        console.log(recipes);
        this.setState({ recipes });
      });
  }

  handleInputChange = (e) => {
    const currentProfile = this.state.profile;
    const { value, name } = e.target;
    currentProfile[name] = value;
    this.setState({ profile: currentProfile });
  };

  onSubmit = (event) => {
    event.preventDefault();
    // console.log("Updating...");
    // console.log("fullName: " + this.state.profile.fullName);
    // console.log("email: " + this.state.profile.email);
    // console.log("username: " + this.state.profile.userName);
    var username = this.state.profile.userName;
    fetch("/api/profile/" + username, {
      method: "PUT",
      body: JSON.stringify({
        fullName: this.state.profile.fullName,
        userName: this.state.profile.userName,
        email: this.state.profile.email,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          // this.props.history.push("/");
          this.setState({ profileModal: false });
        } else {
          const error = new Error(res.error);
          throw error;
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
        <ProfileHeader />
        <div className="section section-detail-recipe text-center description">
          <div className="section profile-content">
            <Container>
              <br />
              <br />
              <div className="owner">
                <div className="avatar">
                  <img
                    alt="..."
                    className="img-circle img-no-padding img-responsive"
                    src="https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
                  />
                </div>
                <div className="name">
                  <h4 className="title">
                    {this.state.profile.userName} <br />
                  </h4>
                  <h6 className="description">{this.state.profile.email}</h6>
                </div>
              </div>
              <Row>
                <Col className="ml-auto mr-auto text-center" md="6">
                  <p>{this.state.profile.fullName}</p>
                  <br />
                </Col>
              </Row>
              <br />
              <Button
                color="danger"
                type="button"
                onClick={() => this.setState({ profileModal: true })}
              >
                Edit
              </Button>
              <Modal
                isOpen={this.state.profileModal}
                toggle={() => this.setState({ profileModal: false })}
                modalClassName="modal-register"
              >
                <div className="modal-header no-border-header text-center">
                  <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => this.setState({ profileModal: false })}
                  >
                    <span aria-hidden={true}>×</span>
                  </button>
                  <h6 className="text-muted">Welcome</h6>
                  <h3 className="modal-title text-center">Edit Your Profile</h3>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <label>Username</label>
                      <Input
                        name="userName"
                        defaultValue={this.state.profile.userName}
                        placeholder="user name"
                        type="text"
                        readOnly
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Email</label>
                      <Input
                        defaultValue={this.state.profile.email}
                        placeholder="email"
                        type="text"
                        onChange={this.handleInputChange}
                        name="email"
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Full Name</label>
                      <Input
                        name="fullName"
                        defaultValue={this.state.profile.fullName}
                        placeholder="Full name"
                        type="text"
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <Button block className="btn-round" color="default">
                      Update
                    </Button>
                  </form>
                </div>
              </Modal>
            </Container>
          </div>
        </div>

        <div className="section section-dark text-center">
          <Container>
            <h2 className="title">Your Recipes</h2>
            <Row>
              {this.state.recipes.map((recipe) => (
                <div key={recipe._id}>
                  <Col md="4">
                    <Card style={{ width: "20rem" }}>
                      <a href={"/details/" + recipe._id}>
                        <CardImg
                          width="10rem"
                          height="10rem"
                          top
                          src={require("../../../backend/images/" +
                            recipe.images[0])}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://www.charlotteathleticclub.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png";
                          }}
                          alt="Img Not Found"
                        />
                        <CardBody>
                          <CardTitle>{recipe.recipeName}</CardTitle>
                          <CardText>{recipe.description}</CardText>
                        </CardBody>
                      </a>
                      <a href={"/edit/" + recipe._id}>
                        <Button color="danger" type="button">
                          Edit
                        </Button>
                      </a>
                    </Card>
                  </Col>
                </div>
              ))}
            </Row>
            <Button className="btn-link" color="danger" href="/addrecipe">
              Want to add a new recipe?
            </Button>
          </Container>
        </div>
        <Footer />
      </>
    );
  }
}

export default ProfilePage;
