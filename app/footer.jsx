import React from 'react'
const {Component} = React

export default class Footer extends Component {
	render() {
		return (
			<footer className="toolbar toolbar-footer">
			  <h1 className="title">{this.props.title}</h1>
			</footer>
		)
	}
}