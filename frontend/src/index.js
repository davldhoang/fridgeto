import React, { useContext, useEffect } from "react";

import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// Styles
import "./assets/css/bootstrap.min.css";
import "./assets/css/paper-kit.css";
import "./assets/demo/demo.css";

// Pages
import IndexPage from "./views/IndexPage.jsx";
import IndexPage02 from "./views/IndexPage02.jsx";
import LoginPage from "./views/LoginPage.jsx";
import ProfilePage from "./views/ProfilePage.jsx";
import RegisterPage from "./views/RegisterPage";
import DetailsPage from "./views/DetailsPage";
import SearchPage from "./views/SearchPage";
import AddRecipePage from "./views/AddRecipePage";
import { SessionContext } from "./session";
import Cookies from "js-cookie";
import E401 from "./errors/e401";
import EditRecipe from "./views/EditRecipe";

const ProtectedHandlerIndexPage02 = ({ history }) => {
  // const session = useContext(SessionContext);
  const session = useContext(SessionContext);
  if (session.authenticated === undefined) {
    history.push("/login");
  }
  return <IndexPage02></IndexPage02>;
};

const ProtectedHandlerSearch = ({ history }) => {
  // const session = useContext(SessionContext);
  const session = useContext(SessionContext);
  if (session.authenticated === undefined) {
    history.push("/login");
  }
  return <SearchPage></SearchPage>;
};

const ProtectedHandlerAddRecipe = ({ history }) => {
  // const session = useContext(SessionContext);
  const session = useContext(SessionContext);
  if (session.authenticated === undefined) {
    history.push("/login");
  }
  return <AddRecipePage></AddRecipePage>;
};

const LogoutHandler = ({ history }: any) => {
  useEffect(() => {
    Cookies.remove("session");
    history.push("/");
  }, [history]);

  return <div>Logging out!</div>;
};

const ProtectedHandlerProfile = ({ history }) => {
  const session = useContext(SessionContext);
  if (session.authenticated === undefined) {
    history.push("/login");
  }
  return <ProfilePage></ProfilePage>;
};

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/index" render={(props) => <IndexPage {...props} />} />
      <Route path="/index02" component={ProtectedHandlerIndexPage02} />
      <Route path="/login" render={(props) => <LoginPage {...props} />} />
      <Route path="/logout" component={LogoutHandler} />
      <Route path="/register" render={(props) => <RegisterPage {...props} />} />
      <Route path="/profile" component={ProtectedHandlerProfile} />
      <Route
        path="/details/:id"
        render={(props) => <DetailsPage {...props} />}
      />
      <Route path="/edit/:id" render={(props) => <EditRecipe {...props} />} />
      <Route path="/search" component={ProtectedHandlerSearch} />
      <Route path="/addrecipe" component={ProtectedHandlerAddRecipe} />
      <Route path="/e401" render={(props) => <E401 {...props} />} />
      <Redirect to="/index" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
