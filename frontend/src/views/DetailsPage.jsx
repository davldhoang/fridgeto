import React, { Component } from "react";

import ProfileHeader from "../components/ProfileHeader.jsx";
import IndexNavbar from "../components/IndexNavbar.jsx";
import Footer from "../components/Footer.jsx";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  UncontrolledCarousel,
} from "reactstrap";
import { getSessionCookie } from "../session.js";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class DetailsPage extends Component {
  constructor() {
    super();
    this.state = {
      recipe: [],
      comments: [],
      username: "",
      loading: false,
      numcomments: 0,
      carouselItems: [
        {
          src:
            "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1692f925835%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1692f925835%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.45%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
        },
      ],
    };
  }

  componentDidMount() {
    let session = getSessionCookie("authenticated");
    var id = this.props.match.params.id;
    this.setState({ id: id });

    this.setState({ loading: true });

    var path = "/api/recipe/" + id;

    fetch(path)
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((recipe) => {
        this.setState({ recipe });
      });

    var pathComment = "/api/comment/" + id;

    fetch(pathComment)
      .then((res) => {
        // console.log(res, "####");
        return res.json();
      })
      .then((comments) => {
        this.setState({ comments: comments });
        console.log(this.state.comments);
        // console.log(comments[0].comments.length);
        this.setState({ numcomments: comments[0].comments.length });
        console.log(this.state.numcomments);
      });

    fetch("/api/profile/" + session.authenticated, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((profile) => {
        // console.log(profile);
        // this.setState({ profile });
        this.setState({ userName: profile.userName });
        // this.setState({ fullName: profile.fullName });
        // this.setState({ email: profile.email });
      });
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  isFormValid() {
    // console.log(this.state.content)
    return this.state.content !== "";
  }

  onSubmit = (event) => {
    event.preventDefault();

    if (!this.isFormValid()) {
      // this.setState({ error: "All fields are required." });
      toast("All fields are required.", { autoClose: 3000 });
      return;
    }

    var id = this.props.match.params.id;
    // console.log(id)
    // alert('Authentication coming soon!'+ this.state.username+":"+this.state.password);

    fetch("/api/comment/" + id, {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // this.props.history.push("/");
          toast("Your comment was saved", { autoClose: 3000 });
          window.location.reload();
        } else {
          toast("Your comment could NOT be saved.", { autoClose: 3000 });
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <>
        <IndexNavbar />
        <ProfileHeader />
        <div className="section section-dark text-center description">
          {this.state.recipe.map((data) => (
            <div key={data._id}>
              <Container>
                <h1>{data.recipeName}</h1>

                <UncontrolledCarousel items={this.state.carouselItems} />

                {data.images.map((img) => (
                  <img
                    key={img}
                    width="250rem"
                    height="220rem"
                    src={require("../../../backend/images/" + img)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://www.charlotteathleticclub.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png";
                    }}
                    alt="Img Not Found"
                  />
                ))}

                <h4>{data.description}</h4>

                <br></br>
                <p style={{ textAlign: "justify" }}>{data.method}</p>
                <br></br>
                <ListGroup flush className="section-nude">
                  <ListGroupItem>Nutrition: {data.nutrition}</ListGroupItem>
                  <ListGroupItem>Hard Level: {data.hardLevel}</ListGroupItem>
                  <ListGroupItem>
                    Cooking Time (min): {data.cookingTime}
                  </ListGroupItem>
                </ListGroup>
                <br />
                <h4>Ingredients</h4>
                <br />
                {data.ingredients.map((ing) => (
                  <ListGroup flush className="section-nude" key={ing._id + "x"}>
                    <ListGroupItem
                      key={ing._id}
                      style={{ textAlign: "center" }}
                    >
                      <Row>
                        <Col>{ing.ingredientName}</Col>
                        <Col>{ing.amount}</Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                ))}
                <br />
              </Container>
            </div>
          ))}
        </div>
        <form method="post" onSubmit={this.onSubmit}>
          <div className="col-8  pt-5">
            <h6>Say something about our recipes</h6>
            <div className="form-group"></div>
            <div className="form-group">
              <textarea
                onChange={this.handleInputChange}
                value={this.state.content}
                className="form-control"
                placeholder="Enter your comment"
                rows="6"
                name="content"
                required
              />
            </div>
            <input type="submit" value="Add Comment" />
          </div>
          <ToastContainer />
          <br />
          <div className="commentList">
            <h5 className="text-muted mb-4">
              <span className="badge badge-success">
                {this.state.numcomments}
              </span>{" "}
              Comment{this.state.numcomments > 0 ? "s" : ""}
            </h5>
            {/* && !this.state.loading ? */}
            {this.state.numcomments === 0 ? (
              <div className="alert text-center alert-info">
                Be the first to comment
              </div>
            ) : null}

            {this.state.comments.map((comment) => (
              <>
                {comment.comments.map((com, idx) => (
                  <div className="media mb-3" key={idx}>
                    <img
                      className="mr-3 bg-light rounded"
                      width="48"
                      height="48"
                      src={`https://cdn0.iconfinder.com/data/icons/free-daily-icon-set/512/Comments-512.png`}
                      alt="{name}"
                    />

                    <div className="media-body p-2 shadow-sm rounded bg-light border">
                      <small className="float-right text-muted">
                        {com.commentDate}
                      </small>
                      <h6 className="mt-0 mb-1 text-muted">{com.userName}</h6>
                      {com.content}
                    </div>
                  </div>
                ))}
              </>
            ))}
          </div>
        </form>
        <Footer />
      </>
    );
  }
}

export default DetailsPage;
