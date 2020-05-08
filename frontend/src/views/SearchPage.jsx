import React, { Component } from "react";

import ProfileHeader from "../components/ProfileHeader.jsx";
import IndexNavbar from "../components/IndexNavbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "reactstrap/lib/Button";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
  Row,
  Container,
} from "reactstrap";

class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      recipes: [],
      value: "",
      ingredients: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // console.log(e.target.value)
      this.setState({ value: e.target.value });
      this.onAddItem();
    }
  };

  anyIng = (event) => {
    event.preventDefault();
    var path = "/api/findRecipesByAnyIngredients";
    fetch(path, {
      method: "POST",
      body: JSON.stringify({ ingredients: this.state.ingredients }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((recipes) => {
        if (recipes.length < 1) toast("No results", { autoClose: 3000 });
        this.setState({ recipes });
      });
  };

  allIng = (event) => {
    event.preventDefault();
    var path = "/api/findRecipesByAllIngredients";

    fetch(path, {
      method: "POST",
      body: JSON.stringify({ ingredients: this.state.ingredients }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((recipes) => {
        if (recipes.length < 1) toast("No results", { autoClose: 3000 });
        this.setState({ recipes });
      });
  };

  handleSubmit(event) {
    // alert("A name was submitted: " + JSON.stringify(this.state.ingredients));
    console.log(this.state.ingredients, "$$$$");
    event.preventDefault();
  }

  onChangeValue = (event) => {
    this.setState({ value: event.target.value });
  };

  onRemoveItem = (i) => {
    this.setState((state) => {
      const ingredients = state.ingredients.filter((item, j) => i !== j);

      return {
        ingredients,
      };
    });
  };

  onAddItem = () => {
    // not allowed AND not working
    this.setState((state) => {
      const ingredients = state.ingredients.concat(state.value);

      return {
        ingredients,
        value: "",
      };
    });
  };

  render() {
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />

        <div align="center">
          <br />
          <h1>Search by ingredients:</h1>
          <br />
          <table border="0">
            {this.state.ingredients.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    <h3>{item}</h3>
                  </td>
                  <td>
                    <a href="###">
                      {" "}
                      <img
                        src="https://ya-webdesign.com/transparent250_/edit-delete-icon-png-4.png"
                        alt="rem"
                        with="15"
                        height="15"
                        onClick={() => this.onRemoveItem(index)}
                      />
                    </a>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>

          <br />
          <input
            type="text"
            size="20"
            value={this.state.value}
            onChange={this.onChangeValue}
            placeholder="Enter ingredient"
            onKeyDown={this._handleKeyDown}
          />
          <button
            type="button"
            onClick={this.onAddItem}
            disabled={!this.state.value}
          >
            Add
          </button>
        </div>

        <br />
        <div align="center">
          <Button onClick={this.anyIng}>
            Show me recipes with any given ingredient
          </Button>
          <Button onClick={this.allIng}>
            Show me recipes with all given ingredients
          </Button>
        </div>
        <br />
        <div align="center" color="red">
          {" "}
          <ToastContainer />
        </div>

        <div className="section section-dark text-center">
          <Container>
            <Row>
              {this.state.recipes.map((recipe) => (
                <div key={recipe._id}>
                  <a href={"/details/" + recipe._id}>
                    <Col md="4" align="center">
                      <Card style={{ width: "20rem" }}>
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
                      </Card>
                    </Col>
                  </a>
                </div>
              ))}
            </Row>
          </Container>
        </div>

        <Footer />
      </>
    );
  }
}

export default SearchPage;
