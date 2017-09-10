/** @jsx h */
import {h, Component, render} from 'preact'
import Quill from 'quill'

function getWordCount(text) {
  return text.length > 0 ? text.split(/\s+/).length : 0;
}

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
    this.editor.root.style.maxHeight = editorHeight

    this.editor.on('text-change', (delta, oldDelta, source) => {
  		let lines = this.editor.getLines().reverse()
  		let opacity = 1
      let grade = opacity / this.props.visibleLineCount
  		for (let line of lines) {
        // console.log(line)
  			line.domNode.style.opacity = opacity
  			opacity -= grade
  		}

      let deletedHTML, deletedWordCount;
      if (lines.length > 5) {
        // let line = this.editor.getLine(0);
        // console.log(line)
        // line.remove()
        let firstLine = lines.reverse()[0];
        console.log(firstLine)
        deletedHTML = firstLine.domNode.outerHTML
        deletedWordCount = getWordCount(firstLine.domNode.innerText.trim())
        firstLine.remove()
      }

      let text = this.editor.getText().trim()
      let wordCount = getWordCount(text);
      this.props.updateWordCount(wordCount)
      this.props.onContentChanged(
        this.editor.root.innerHTML, // visible html
        getWordCount(this.editor.getText().trim()), // visible word count
        deletedHTML,
        deletedWordCount
      )
    })

    this.editor.clipboard.dangerouslyPasteHTML(0, this.props.content)
    this.editor.focus()
	}

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.content != this.editor.root.innerHTML) {
      this.editor.clipboard.dangerouslyPasteHTML(0, this.props.content)
    }
  }

	render() {
		return (
			<div id="editor-wrapper">
				<div id="toolbar"></div>
				<div id="editor"></div>
			</div>
		)
	}
}