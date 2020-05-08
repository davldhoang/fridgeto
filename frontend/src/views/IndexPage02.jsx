import React, { Component } from "react";

// Pages
import IndexNavbar from "../components/IndexNavbar.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import Footer from "../components/Footer.jsx";
import LastestRecipes from "../components/LatestRecipes.jsx";

class Index extends Component {
  render() {
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />
        <LastestRecipes />
        <Footer />
      </>
    );
  }
}

export default Index;
