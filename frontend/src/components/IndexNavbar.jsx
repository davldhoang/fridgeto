import React from "react";
// Nodejs library that concatenates strings
import classnames from "classnames";
// Reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
} from "reactstrap";
import { Component } from "react";
import { getSessionCookie } from "../session";

class IndexNavbar extends Component {
  constructor() {
    super();
    this.state = {
      link: "login",
      navbarCollapse: 0,
    };
  }

  toggleNavbarCollapse = () => {
    this.setState({ navbarCollapse: true });
    document.documentElement.classList.toggle("nav-open");
  };

  componentDidMount() {
    let session = getSessionCookie("authenticated");
    if (session.authenticated === undefined) {
      this.setState({ link: "login" });
    } else this.setState({ link: "logout" });
  }
  render() {
    return (
      <Navbar className={classnames("fixed-top")} expand="lg">
        <Container>
          <div className="navbar-translate">
            <NavbarBrand data-placement="bottom" href="/index">
              Fridgeto
            </NavbarBrand>
            <button
              className={classnames("navbar-toggler navbar-toggler", {})}
              onClick={this.toggleNavbarCollapse}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <Collapse className="justify-content-end" navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/index02">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/search">Search</NavLink>
              </NavItem>

              <NavItem>
                <NavLink href="/addrecipe">Add Recipe</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/profile">Profile</NavLink>
              </NavItem>

              <NavItem>
                <NavLink id="lg" href={"/" + this.state.link}>
                  {this.state.link}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default IndexNavbar;
