import React, { Component } from "react";
import { Menu, Item, contextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.min.css";
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
    this.contextMenuId = "context_menu_" + props.idx;

    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.bindShortcutKey = this.bindShortcutKey.bind(this);
    this.unbindShortcutKey = this.unbindShortcutKey.bind(this);
  }

  componentDidMount() {
    this.bindShortcutKey();
  }

  componentWillUnmount() {
    this.unbindShortcutKey();
  }

  PadButtonContextMenu = () => (
    <Menu
      id={this.contextMenuId}
      style={{ fontSize: "14px", lineHeight: "1.4" }}
    >
      <Item disabled>
        {this.props.srcName} / {this.props.shortcutKey}
      </Item>
      <Item onClick={() => this.props.edit()}>Change Sound or Color</Item>
    </Menu>
  );

  handleContextMenu(e) {
    e.preventDefault();
    contextMenu.show({
      id: this.contextMenuId,
      event: e,
      props: {}
    });
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
    const { srcName, shortcutKey, color, play, isEditing } = this.props;

    const colorClassStr = "pad-button " + color;
    const classStrObj = {
      active: this.state.isActive
    };

    classStrObj[colorClassStr] = true;

    const displayStr = srcName.substring(0, srcName.indexOf(" "));
    const classStr = classnames(classStrObj);

    return (
      <div
        onContextMenu={this.handleContextMenu}
        className="pad-button-context-area"
      >
        <div className={classStr} ref={this.buttonRef} onClick={play}>
          <span className="text-display">
            {displayStr + " / " + shortcutKey}
          </span>

          {isEditing && (
            <div className="edit-mode-indicator">
              <span>Editing</span>
              <i className="icon ion-md-arrow-forward" />
            </div>
          )}
        </div>

        <this.PadButtonContextMenu />
      </div>
    );
  }
}

export default PadButton;
