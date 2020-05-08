import React, { Component } from "react";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

// core components
import IndexNavbar from "../components/IndexNavbar.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import Footer from "../components/Footer.jsx";
import { getSessionCookie } from "../session.js";

class MyRecipesPage extends Component {
  constructor() {
    super();
    this.state = { recipes: [] };
  }

  componentDidMount() {
    let session = getSessionCookie("authenticated")
    fetch("api/recipeCreator/"+session.authenticated,{
      method:'GET',      
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json",
        }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(recipes => {
        console.log(recipes);
        this.setState({ recipes });
      });
  }

  render() {
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />

        <div className="section profile-content">
          <Container>
            <div className="owner">
              <div className="avatar">
                <img
                  alt="Img not found!"
                  className="img-circle img-no-padding img-responsive"
                  src={require("../assets/img/default-avatar.png")}
                />
              </div>
            </div>
          </Container>
        </div>

        <div className="section section-dark text-center">
          <Container>
            <h2 className="title">Your Recipes</h2>
            <Row>
              {this.state.recipes.map(recipe => (
                <div key={recipe._id}>
                  <Col md="4">
                    <Card style={{ width: "20rem" }}>
                      <CardImg
                        width="10rem"
                        height="10rem"
                        top
                        src={recipe.images[0]}
                        alt="..."
                      />
                      <CardBody>
                        <CardTitle>{recipe.recipeName}</CardTitle>
                        <CardText>{recipe.description}</CardText>
                        <Button color="primary">Show more</Button>
                        <Button color="danger">Edit</Button>
                      </CardBody>
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

export default MyRecipesPage;
