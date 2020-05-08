/*eslint-disable*/
import React, { Component } from "react";

// reactstrap components
import { Container } from "reactstrap";

class IndexHeader extends Component {
  render() {
    return (
      <>
        <div
          className="page-header section-dark"
          style={{
            backgroundImage:
              "url(" + require("../assets/img/antoine-barres.jpg") + ")",
          }}
        >
          <div className="filter" />
          <div className="content-center">
            <Container>
              <div className="title-brand">
                <h1>Welcome To Fridgeto</h1>
              </div>
              <h2 className="presentation-subtitle text-center">
                The best place to find out how to cook.
              </h2>
            </Container>
          </div>
        </div>
      </>
    );
  }
}

export default IndexHeader;
