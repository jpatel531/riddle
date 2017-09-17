import React, {Component} from 'react'

export default class Toolbar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false
	}

	render() {
		return (
		 	<div id="toolbar">
		    <span className="ql-formats">
		      <select className="ql-font">
		        <option selected>Ubuntu</option>
		        <option value="encode-sans">Encode Sans</option>
		        <option value="montserrat">Montserrat</option>
		        <option value="pt-sans">PT Sans</option>
						<option value="slabo-27px">Slabo 27px</option>
		      	<option value="lora">Lora</option>
		      </select>
		      <select className="ql-size"></select>
		    </span>
		    <span className="ql-formats">
		      <button className="ql-bold"></button>
		      <button className="ql-italic"></button>
		      <button className="ql-underline"></button>
		      <button className="ql-strike"></button>
		    </span>
		    <span className="ql-formats">
		      <button className="ql-blockquote"></button>
		      <button className="ql-link"></button>
		    </span>
		    <span className="ql-formats">
		      <button className="ql-header" value="1"></button>
		      <button className="ql-header" value="2"></button>
		      <button className="ql-header" value="3"></button>
		      <button className="ql-header" value="4"></button>
		      <button className="ql-header" value="5"></button>
		      <button className="ql-header" value="6"></button>
		    </span>
		    <span className="ql-formats">
		      <button className="ql-list" value="ordered"></button>
		      <button className="ql-list" value="bullet"></button>
		      <button className="ql-indent" value="-1"></button>
		      <button className="ql-indent" value="+1"></button>
		    </span>
		  </div>
		)
	}
}