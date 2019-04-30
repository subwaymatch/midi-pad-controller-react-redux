import React, { Component } from "react";

class PadButton extends Component {
  render() {
    const { display, keyboard, color, onClick } = this.props;
    const classStr = "pad-button " + color;

    return (
      <div className={classStr} onClick={onClick}>
        <span className="text-display">{display + " / " + keyboard}</span>
      </div>
    );
  }
}

export default PadButton;
