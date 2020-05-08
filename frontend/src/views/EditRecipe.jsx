import React, { Component } from "react";
// Pages
import ProfileHeader from "../components/ProfileHeader";
import IndexNavbar from "../components/IndexNavbar.jsx";
import Footer from "../components/Footer.jsx";
import { getSessionCookie } from "../session";
import axios from "axios";

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

class EditRecipe extends Component {
  constructor() {
    super();
    this.state = {
      recipe: "",
      profile: "",
      ingredients: [{ ingredientName: "", amount: "" }],
      imagesfile: [],
    };
  }

  onChangeHandler = (event) => {
    this.setState({
      imagesfile: event.target.files,
    });
  };

  componentDidMount() {
    getSessionCookie("authenticated");
    var id = this.props.match.params.id;
    var path = "/api/recipe/" + id;
    fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((recipe) => {
        this.setState({ recipe: recipe[0] });
        this.setState({ ingredients: recipe[0].ingredients });
        console.log(this.state.recipe);
        // this.setState({ userName: profile.userName });
        // this.setState({ fullName: profile.fullName });
        // this.setState({ email: profile.email });
      });
  }

  addClick() {
    this.setState((prevState) => ({
      ingredients: [
        ...prevState.ingredients,
        { ingredientName: "", amount: "" },
      ],
    }));
  }

  handleChange(i, e) {
    const { name, value } = e.target;
    let ingredients = [...this.state.ingredients];
    ingredients[i] = { ...ingredients[i], [name]: value.toLowerCase() };
    this.setState({ ingredients });
  }

  removeClick(i) {
    let ingredients = [...this.state.recipe.ingredients];
    ingredients.splice(i, 1);
    this.setState({ ingredients });
  }

  handleSubmit(event) {
    // alert("A name was submitted: " + JSON.stringify(this.state.ingredients));
    console.log(this.state, "$$$$");
    event.preventDefault();
  }

  handleInputChange = (e) => {
    const currentRecipe = this.state.recipe;
    const { value, name } = e.target;
    this.setState({ recipe: currentRecipe });
    currentRecipe[name] = value;
  };

  onSubmit = (event) => {
    const currentRecipe = this.state.recipe;
    currentRecipe.ingredients = this.state.ingredients;
    this.setState({ recipe: currentRecipe });

    event.preventDefault();
    let session = getSessionCookie("authenticated");
    var id = this.props.match.params.id;
    console.log("Updating...");

    let data = new FormData();

    console.log(this.state.imagesfile);
    // console.log(this.state.imagef)

    if (this.state.imagesfile.length === 0) {
      // No new photos selected
    } else {
      // Delete old photos
      currentRecipe.images = [];
      // Add new photos
      // Change from filelist to list og string
      var time = Date.now();

      for (var i = 0; i < this.state.imagesfile.length; i++) {
        const name =
          time + i + "." + this.state.imagesfile[i].name.split(".").pop();
        // '-' + this.state.imagesfile[i].name

        currentRecipe.images.push(name);

        data.append("file", this.state.imagesfile[i], name);
        data.append("filename", name);
      }
      this.setState({ recipe: currentRecipe });
    }

    fetch("/api/recipe/" + id, {
      method: "PUT",
      body: JSON.stringify({
        hardLevel: this.state.recipe.hardLevel,
        description: this.state.recipe.description,
        recipeName: this.state.recipe.recipeName,
        method: this.state.recipe.method,
        cookingTime: this.state.recipe.cookingTime,
        nutrition: this.state.recipe.nutrition,
        createBy: session.authenticated,
        images: this.state.recipe.images || "",
        ingredients: this.state.recipe.ingredients || "",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          if (this.state.imagesfile.length !== 0) {
            console.log("Uploading photos");
            axios.post("/api/upload", data).then((res) => {});
          }
          alert("Recipe updated.");
          this.props.history.push("/profile");
        } else {
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

  deleteRecipe = (event) => {
    event.preventDefault();
    var id = this.props.match.params.id;
    if (
      window.confirm(
        `Do you want to delete the recipe ${this.state.recipe.recipeName} permanently?`
      )
    ) {
      fetch("/api/recipe/" + id, {
        method: "DELETE",
      })
        .then((res) => res.text()) // or res.json()
        .then((res) => console.log(res));
      // window.location.reload();
      this.props.history.push("/profile");
    }
  };

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
                alt="Rem"
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
  render() {
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />

        <div className="section landing-section">
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" md="8">
                <h2 className="text-center">EDIT A RECIPE</h2>
                <Form className="contact-form" onSubmit={this.onSubmit}>
                  <Row>
                    <Col md="6">
                      <label>Recipe Name</label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="recipeName"
                          placeholder="Enter Recipe Name"
                          defaultValue={this.state.recipe.recipeName}
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col md="6">
                      <label>Description</label>
                      <InputGroup>
                        <Input
                          type="text"
                          name="description"
                          placeholder="Enter Description"
                          defaultValue={this.state.recipe.description}
                          onChange={this.handleInputChange}
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
                          defaultValue={this.state.recipe.hardLevel}
                          onChange={this.handleInputChange}
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
                          defaultValue={this.state.recipe.cookingTime}
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <label>Method</label>
                  <Input
                    name="method"
                    type="textarea"
                    rows="4"
                    placeholder="Enter Method"
                    defaultValue={this.state.recipe.method}
                    onChange={this.handleInputChange}
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
                          defaultValue={this.state.recipe.nutrition}
                          onChange={this.handleInputChange}
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
                    <Col className="ml-auto mr-auto" md="2">
                      <Button className="btn-fill" color="danger" size="lg">
                        Update
                      </Button>
                      <Button
                        className="btn-fill"
                        color="danger"
                        size="lg"
                        onClick={this.deleteRecipe}
                      >
                        Delete
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

export default EditRecipe;
