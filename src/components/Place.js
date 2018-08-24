import React from "react";

class Place extends React.Component {
  /**
   * Render function of Place
   */
  render() {
    return (
      <li
        role="button"
        className="place"
        tabIndex="0"
        onKeyPress={this.props.populateInfoWindow.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.populateInfoWindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.title}
      </li>
    );
  }
}

export default Place;
