import React, { Component } from "react";

// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardText,
} from "reactstrap";

class LastestRecipes extends Component {
  constructor() {
    super();
    this.state = { recipes: [] };
  }
  componentDidMount() {
    fetch("/api/recipes")
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((recipes) => {
        // console.log(recipes);
        this.setState({ recipes });
      });
  }

  render() {
    return (
      <>
        <div className="section section-dark text-center">
          <Container>
            <h2 className="title">Latest Recipes</h2>
            <Row>
              {this.state.recipes.map((recipe) => (
                <div key={recipe._id}>
                  <a href={"/details/" + recipe._id}>
                    <Col md="4">
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
      </>
    );
  }
}

export default LastestRecipes;
