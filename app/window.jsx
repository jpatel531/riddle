import React from 'react'
const {Component} = React

export default class Window extends React.Component {
	render() {
		return (
			<div className="window">
				{this.props.children}
			</div>
		)
	}
}
