import React, { Component } from "react";
const Mousetrap = require("mousetrap");
const classnames = require("classnames");

class PadButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false
    };

    this.isKeyPressed = false;
    this.buttonRef = React.createRef();

    this.bindShortcutKey = this.bindShortcutKey.bind(this);
    this.unbindShortcutKey = this.unbindShortcutKey.bind(this);
  }

  componentDidMount() {
    this.bindShortcutKey();
  }

  componentWillUnmount() {
    this.unbindShortcutKey();
  }

  bindShortcutKey() {
    const { shortcutKey } = this.props;

    Mousetrap.bind(shortcutKey, e => {
      e.preventDefault();

      if (this.isKeyPressed) {
        return;
      }

      this.buttonRef.current.click();

      this.setState({
        isActive: true
      });
      this.isKeyPressed = true;

      setTimeout(() => {
        this.setState({
          isActive: false
        });
      }, 100);
    });

    // Prevent auto-repeat keyboard events
    Mousetrap.bind(
      shortcutKey,
      e => {
        e.preventDefault();

        this.isKeyPressed = false;
      },
      "keyup"
    );
  }

  unbindShortcutKey() {
    const { shortcutKey } = this.props;

    Mousetrap.unbind(shortcutKey);
  }

  render() {
    const { display, shortcutKey, color, play } = this.props;

    const colorClassStr = "pad-button " + color;
    const classStrObj = {
      active: this.state.isActive
    };

    classStrObj[colorClassStr] = true;

    const classStr = classnames(classStrObj);

    return (
      <div className={classStr} ref={this.buttonRef} onClick={play}>
        <span className="text-display">{display + " / " + shortcutKey}</span>
      </div>
    );
  }
}

export default PadButton;
