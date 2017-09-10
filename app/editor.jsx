/** @jsx h */
import {h, Component, render} from 'preact'
import Quill from 'quill'

export default class Editor extends Component {

	componentDidMount() {
    console.log('did mount')
		let toolbarOptions = [
		  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		  ['blockquote'],
		  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
		  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
		  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
		  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
		  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  [{ 'font': [] }],
		]

    this.editor = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write something",
      modules: {
      	toolbar: toolbarOptions
      }
    })

    let lineHeight = window.getComputedStyle(this.editor.root, null).getPropertyValue('line-height')
    let editorHeight = (parseInt(lineHeight, 10) * this.props.visibleLineCount) + 'px'
    this.editor.root.style.height = editorHeight

    this.editor.focus()
    this.editor.on('text-change', (delta, oldDelta, source) => {
    	if (source == "user") {
    		let lines = this.editor.getLines().reverse()
    		let opacity = 1
        let grade = opacity / this.props.visibleLineCount
    		for (let line of lines) {
    			line.domNode.style.opacity = opacity
    			opacity -= grade
    		}
    	}
      let text = this.editor.getText().trim()
      let wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
      this.props.updateWordCount(wordCount)
    })
	}

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

	render() {
		return (
			<div>
				<div id="toolbar"></div>
				<div id="editor"></div>
			</div>
		)
	}
}