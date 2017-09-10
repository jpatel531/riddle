/** @jsx h */
import {h, Component} from 'preact'

export default class Toolbar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return false
	}

	render() {
		return (
		 	<div id="toolbar">
		    <span class="ql-formats">
		      <select class="ql-font">
		        <option selected>Ubuntu</option>
		        <option value="encode-sans">Encode Sans</option>
		        <option value="montserrat">Montserrat</option>
		        <option value="pt-sans">PT Sans</option>
						<option value="slabo-27px">Slabo 27px</option>
		      	<option value="lora">Lora</option>
		      </select>
		      <select class="ql-size"></select>
		    </span>
		    <span class="ql-formats">
		      <button class="ql-bold"></button>
		      <button class="ql-italic"></button>
		      <button class="ql-underline"></button>
		      <button class="ql-strike"></button>
		    </span>
		    <span class="ql-formats">
		      <button class="ql-blockquote"></button>
		      <button class="ql-link"></button>
		    </span>
		    <span class="ql-formats">
		      <button class="ql-header" value="1"></button>
		      <button class="ql-header" value="2"></button>
		      <button class="ql-header" value="3"></button>
		      <button class="ql-header" value="4"></button>
		      <button class="ql-header" value="5"></button>
		      <button class="ql-header" value="6"></button>
		    </span>
		    <span class="ql-formats">
		      <button class="ql-list" value="ordered"></button>
		      <button class="ql-list" value="bullet"></button>
		      <button class="ql-indent" value="-1"></button>
		      <button class="ql-indent" value="+1"></button>
		    </span>
		  </div>
		)
	}
}