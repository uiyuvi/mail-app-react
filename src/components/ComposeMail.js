import React from "react";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { storeSentMail } from "../actions/sentMail.js";
import { storeDraftMail, deleteDraftMail } from "../actions/draft.js";

export class ComposeMail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      from: "user@tcs.com",
      to: "",
      subject: "",
      time: "",
      body: "",
      error: false,
      valid: false
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    //this.submitValidation = this.submitValidation.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ error: false });
    if (this.state.to !== "" && this.validateEmail(this.state.to)) {
      this.setState({ valid: true });
    } else {
      this.setState({
        valid: false,
      });
    }
  }
  validateEmail(email) {
    var re = new RegExp("@tcs.com");
    return re.test(String(email).toLowerCase());
  }
  generateId() {
    return Math.random();
  }
  submitValidation() {
    if (this.state.to !== "" && this.validateEmail(this.state.to)) {
      this.handleOnSubmit(this.state);
    } else {
      this.setState({ 
        valid: false ,
        error:true

      });
    }
  }

  handleOnSubmit(composeData) {
    composeData.from = "user@tcs.com";
    composeData.id = this.generateId();
    composeData.time = new Date().toISOString();
    this.props.storeSentMail(composeData);
    if (this.props.compose.data.id) {
      this.props.deleteDraftMail(this.props.compose.data.id);
    }
  }

  handleOnSave() {
    this.submitDraftData(this.state);
  }
  submitDraftData(composeData) {
    composeData.from = "user@tcs.com";
    composeData.id = this.generateId();
    // composeData.time =new Date().toISOString()

    this.props.storeDraftMail(composeData);
  }
  componentDidMount() {
    this.setState({ id: this.props.compose.data.id });
    this.setState({ from: this.props.compose.data.from });
    this.setState({ to: this.props.compose.data.to });
    this.setState({ subject: this.props.compose.data.subject });
    this.setState({ time: this.props.compose.data.time });
    this.setState({ body: this.props.compose.data.body });
    if (
      this.props.compose.data.to !== "" &&
      this.validateEmail(this.props.compose.data.to)
    ) {
      this.setState({ valid: true });
    }
  }

  render() {
    return (
      <div>
        <div className="blur_background" />
        <div className="popup_inner">
          <div className="composemail">
            <form autoComplete="off">
              <div>
                <input
                  type="text"
                  id="to"
                  name="to"
                  placeholder="to.."
                  onChange={this.handleOnChange}
                  value={this.state.to || ""}
                />
              </div>
              <br />
              <div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="subject.."
                  onChange={this.handleOnChange}
                  value={this.state.subject || ""}
                />
              </div>
              <br />
              <div>
                <textarea
                  type="text"
                  id="body"
                  name="body"
                  placeholder="your message.."
                  onChange={this.handleOnChange}
                  value={this.state.body || ""}
                />
              </div>
              <br />
              <div></div>
              <br />
            </form>
            <div>
              <div>
                <NavLink to="/inbox">
                  <button className="closemail">x</button>
                </NavLink>
              </div>

              <NavLink
                className="composebtn"
                onClick = {() => this.submitValidation()}
                to={this.state.valid ? "/sent" : "/composemail"}
              >
                <button
                  type="submit"
                  className="btn-success pull-right composebtn"
                >
                  Send
                </button>
              </NavLink>

              <NavLink className="composebtn " to="/draft" onClick={this.handleOnSave}>
                
                <button
                  type="submit"
                  className="btn-success pull-middle composebtn"
                >
                  Save
                </button>
              </NavLink>
            </div>
            <br />
            <span className={"error " + (this.state.error ? "" : "invisible")}>
              All fields are required
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { storeSentMail, storeDraftMail, deleteDraftMail },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ComposeMail);
