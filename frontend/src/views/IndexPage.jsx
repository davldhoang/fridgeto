import React, { Component } from "react";

// Pages
import IndexHeader from "../components/IndexHeader.jsx";
import IndexNavbar from "../components/IndexNavbar.jsx";
import Footer from "../components/Footer.jsx";

class Index extends Component {
  render() {
    return (
      <>
        <IndexNavbar />
        <IndexHeader />
        <Footer />
      </>
    );
  }
}

export default Index;
