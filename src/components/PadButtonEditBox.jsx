import React, { Component } from "react";
import { connect } from "react-redux"

class PadButtonEditBox extends Component {
  render() {
    return (
      <div id="pad-button-edit-box">
        <div>PadButtonEditBox Connected Component</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PadButtonEditBox);