import React, { Component } from "react";

class PadButton extends Component {
  render() {
    console.log(this.props);
    const { display, keyboard, color } = this.props;
    console.log("display=" + display + ", keyboard=" + keyboard);
    const classStr = "pad-button " + color;

    return (
      <div className={classStr}>
        <span className="text-display">{display + " / " + keyboard}</span>
      </div>
    );
  }
}

export default PadButton;
