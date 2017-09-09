/** @jsx h */
import {h, Component, render} from 'preact'
import Quill from 'quill'

class App extends Component {

	componentDidMount() {
    this.editor = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write something",
    })
	}

	render() {
		return (
			<div id="editor">
			</div>
		)
	}

}

render(<App />, document.body)
