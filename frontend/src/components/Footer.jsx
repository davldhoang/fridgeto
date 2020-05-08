/*eslint-disable*/
import React, { Component } from "react";

// reactstrap components
import { Row, Container } from "reactstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer footer-black footer-white">
        <Container>
          <Row>
            <div className="credits ml-auto">
              <span className="copyright">
                © {new Date().getFullYear()}, made with{" "}
                <i className="fa fa-heart heart" /> by David Hoang
              </span>
            </div>
          </Row>
        </Container>
      </footer>
    );
  }
}

export default Footer;
