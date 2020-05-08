import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Form,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";

import ProfileHeader from "../components/ProfileHeader";
import IndexNavbar from "../components/IndexNavbar";
import { getSessionCookie } from "../session";
import Footer from "../components/Footer";

export default class AddRecipePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeName: "",
      description: "",
      ingredients: [{ ingredientName: "", amount: "" }],
      images: [],
      imagesfile: [null],
      method: "",
      cookingTime: "",
      nutrition: "",
      hardLevel: "",
      createBy: "",
      state: "active",
      toDashboard: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Add createBy
    let session = getSessionCookie("authenticated");
    this.setState({ createBy: session.authenticated });
  }

  addClick() {
    this.setState((prevState) => ({
      ingredients: [
        ...prevState.ingredients,
        { ingredientName: "", amount: "" },
      ],
    }));
  }

  createUI() {
    return this.state.ingredients.map((el, i) => (
      <div key={i}>
        <Row>
          <Col md="6">
            <Input
              placeholder="Ingredient Name"
              name="ingredientName"
              value={el.ingredientName || ""}
              onChange={this.handleChange.bind(this, i)}
              required
            />
          </Col>
          <Col md="4">
            <Input
              placeholder="Ingredient Amount"
              name="amount"
              value={el.amount || ""}
              onChange={this.handleChange.bind(this, i)}
              required
            />
          </Col>
          <Col>
            <a href="#a">
              <img
                src="https://image.flaticon.com/icons/svg/61/61182.svg"
                alt="..."
                width="30"
                height="30"
                onClick={this.removeClick.bind(this, i)}
              />
            </a>
          </Col>
        </Row>
      </div>
    ));
  }

  handleChange(i, e) {
    const { name, value } = e.target;
    let ingredients = [...this.state.ingredients];
    ingredients[i] = { ...ingredients[i], [name]: value.toLowerCase() };
    this.setState({ ingredients });
  }

  removeClick(i) {
    let ingredients = [...this.state.ingredients];
    ingredients.splice(i, 1);
    this.setState({ ingredients });
  }

  handleSubmit(event) {
    // alert("A name was submitted: " + JSON.stringify(this.state.ingredients));
    console.log(this.state, "$$$$");
    event.preventDefault();
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

    let data = new FormData();

    // Change from filelist to list og string
    var time = Date.now();

    for (var i = 0; i < this.state.imagesfile.length; i++) {
      const name =
        time + i + "." + this.state.imagesfile[i].name.split(".").pop();
      // '-' + this.state.imagesfile[i].name
      this.state.images.push(name);

      data.append("file", this.state.imagesfile[i], name);
      data.append("filename", name);
    }

    fetch("/api/recipe", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          axios.post("/api/upload", data).then((res) => {});
          alert("Recipe added.");
          this.setState({ toDashboard: true });
        } else {
          alert("Recipe failed to be saved. Please try again.");
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  onChangeHandler = (event) => {
    this.setState({
      imagesfile: event.target.files,
    });
  };

  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to="/profile" />;
    }
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />
        <ToastContainer />
        <div className="section landing-section">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="8">
                <h2 className="text-center">ADD A RECIPE</h2>
                <Form className="contact-form" onSubmit={this.onSubmit}>
                  {/* <Row>
                    <Col md="6">
                      <label>Created by</label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="createdBy"
                          value={this.state.createBy}
                          readOnly
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col>
                      <label>Recipe Name</label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="recipeName"
                          placeholder="Enter Recipe Name"
                          value={this.state.recipeName}
                          onChange={this.handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <label>Description</label>
                      <InputGroup>
                        <Input
                          type="textarea"
                          rows="6"
                          name="description"
                          placeholder="Enter Description"
                          value={this.state.description}
                          onChange={this.handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="exampleSelect1">Hard Level</Label>
                        <Input
                          type="select"
                          name="hardLevel"
                          value={this.state.hardLevel}
                          onChange={this.handleInputChange}
                          required
                        >
                          <option>Choose Hard Level</option>
                          <option>very-easy</option>
                          <option>easy</option>
                          <option>hard</option>
                          <option>very-hard</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <label>Cooking Time</label>
                      <InputGroup>
                        <Input
                          type="number"
                          name="cookingTime"
                          placeholder="Enter Cooking Time"
                          value={this.state.cookingTime}
                          onChange={this.handleInputChange}
                          required
                          min="3"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <label>Method</label>
                  <Input
                    name="method"
                    type="textarea"
                    rows="6"
                    placeholder="Enter Method"
                    value={this.state.method}
                    onChange={this.handleInputChange}
                    required
                  />
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="exampleSelect1">Images</Label>
                        <Input
                          type="file"
                          className="form-control"
                          multiple
                          onChange={this.onChangeHandler}
                          required
                        ></Input>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <label>Nutrition</label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="nutrition"
                          placeholder="Enter Nutrition"
                          value={this.state.nutrition}
                          onChange={this.handleInputChange}
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <label>Ingredients</label>
                  {this.createUI()}
                  <br />
                  <Input
                    type="button"
                    value="Add More"
                    onClick={this.addClick.bind(this)}
                  />
                  <Row>
                    <Col className="ml-auto mr-auto" align="center">
                      <Button className="btn-fill" color="danger" size="lg">
                        Add recipe
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>

        <form hidden onSubmit={this.handleSubmit}>
          <Input type="submit" value="Submit" />
        </form>

        <Footer />
      </>
    );
  }
}
