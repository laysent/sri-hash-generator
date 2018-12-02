import React from 'react';
import classnames from 'classnames';
import './DragNDrop.css';

class DragNDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
    };
  }
  onDragEnter = () => {
    this.setState({ dragging: true });
  }
  onDragOver = (e) => {
    e.preventDefault();
  }
  onDragLeave = (e) => {
    if (e.target !== this.div) return;
    this.setState({ dragging: false });
  }
  onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    if (typeof this.props.onDrop === 'function') {
      this.props.onDrop(e);
    }
  }
  render() {
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        className={classnames(this.props.className, this.state.dragging && 'dragging')}
        ref={(div) => { this.div = div; }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default DragNDrop;
