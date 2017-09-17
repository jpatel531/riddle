import React from 'react'
const {Component} = React

export default class Header extends Component {

  render() {
    return (
      <header className="toolbar toolbar-header">
        <h1 className="title">{this.props.title}</h1>

        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default" onClick={this.props.handleClickSave}>
              <span className="icon icon-floppy"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-folder"></span>
            </button>
            <button className="btn btn-default" onClick={this.props.handleClickView}>
              <span className="icon icon-eye"></span>
            </button>
            <button className="btn btn-default" onClick={this.props.handleClickWordExport}>
              <span className="icon">W</span>
            </button>
          </div>
        </div>
      </header>
    )
  }
}