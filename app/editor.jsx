import React, {Component} from 'react'
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

  constructor(props) {
    super(props)
    this.isRestricted = true
  }

  onTextChange(delta, oldDelta, source) {
    this.restrictView()
    let text = this.editor.getText().trim()
    let wordCount = getWordCount(text)
    this.props.updateWordCount(wordCount)
  }

  getContent() {
    return this.editor.root.innerHTML
  }

  restrictView() {
    let opacity = 1
    let grade = opacity / this.props.visibleLineCount
    let lines = this.editor.getLines().reverse()
    for (let index in lines) {
      let line = lines[index]

      if (index >= this.props.visibleLineCount) {
        line.domNode.style.opacity = null
        line.domNode.style.display = "none"
      } else {
        line.domNode.style.opacity = opacity
        opacity -= grade
      }
    }
  }

  showRestricted() {
    this.restrictView()
    if (!this.isRestricted) {
      this.resizeEditorToRestriction()
      this.isRestricted = true
    }
  }

  showFull() {
    let lines = this.editor.getLines()
    for (let line of lines) {
      line.domNode.style.opacity = 1
      line.domNode.style.display = null
    }

    if (this.isRestricted) {
      this.editor.root.style.maxHeight = this.editor.root.style.height = "100%"
      this.editor.root.style.marginTop = "12px"
      window.onresize = null
      this.isRestricted = false
    }
  }

  componentDidMount() {
    let fonts = [
      'encode-sans',
      'lora',
      'montserrat',
      'pt-sans',
      'slabo-27px',
      'ubuntu'
    ]

    const Font = Quill.import('formats/font');
    Font.whitelist = fonts;
    Quill.register(Font, true);
    this.editor = new Quill("#editor", {
      theme: "snow",
      placeholder: "Write something",
      modules: {
        toolbar: '#toolbar',
        clipboard: {
          matchVisual: false
        }
      }
    })

    this.resizeEditorToRestriction()
    this.editor.on('text-change', this.onTextChange.bind(this))
    this.editor.focus()
  }

  resizeEditorToRestriction() {
    let lineHeight = window.getComputedStyle(this.editor.root, null).getPropertyValue('line-height')
    let editorHeight = (parseInt(lineHeight, 10) * (this.props.visibleLineCount+1)) + 'px'
    this.editor.root.style.maxHeight = this.editor.root.style.height = editorHeight

    let wrapper = document.getElementById('editor-wrapper')
    let totalHeight = window.getComputedStyle(wrapper).getPropertyValue('height')

    centreElementInElement(wrapper, this.editor.root)
    window.onresize = () => centreElementInElement(wrapper, this.editor.root)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    return (
      <div id="editor-wrapper">
        <div id="editor"></div>
      </div>
    )
  }
}