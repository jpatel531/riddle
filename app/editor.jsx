/** @jsx h */
import {h, Component, render} from 'preact'
import Quill from 'quill'

function getWordCount(text) {
  return text.length > 0 ? text.split(/\s+/).length : 0;
}

function centreElementInElement(container, inner) {
  var inHeight = inner.offsetHeight;
  container.style.height = window.innerHeight;
  container.style.width = window.innerWidth;
  var conHeight = container.offsetHeight;
  inner.style.marginTop = ((conHeight-inHeight)/2)+'px';
}

export default class Editor extends Component {

	componentDidMount() {

    let fonts = [
      'encode-sans',
      'lora',
      'montserrat',
      'pt-sans',
      'slabo-27px',
      'ubuntu'
    ]

    var Font = Quill.import('formats/font');
    Font.whitelist = fonts;
    Quill.register(Font, true);
    this.editor = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write something",
      modules: {
      	toolbar: '#toolbar'
      }
    })

    let lineHeight = window.getComputedStyle(this.editor.root, null).getPropertyValue('line-height')
    let editorHeight = (parseInt(lineHeight, 10) * (this.props.visibleLineCount+1)) + 'px'
    this.editor.root.style.maxHeight = editorHeight

    let wrapper = document.getElementById('editor-wrapper')
    let totalHeight = window.getComputedStyle(wrapper).getPropertyValue('height')

    centreElementInElement(wrapper, this.editor.root)
    window.onresize = () => centreElementInElement(wrapper, this.editor.root)

    this.editor.on('text-change', (delta, oldDelta, source) => {
  		let lines = this.editor.getLines().reverse()
  		let opacity = 1
      let grade = opacity / this.props.visibleLineCount
  		for (let line of lines) {
  			line.domNode.style.opacity = opacity
  			opacity -= grade
  		}

      let deletedHTML, deletedWordCount;
      if (lines.length > this.props.visibleLineCount) {
        let firstLine = lines.reverse()[0];
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
				<div id="editor"></div>
			</div>
		)
	}
}