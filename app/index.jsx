import React from 'react'
const {Component} = React

import {render} from 'react-dom'
// import {Window} from 'react-photonkit'
import Editor from './editor_quill.jsx'
// import Editor from './editor.jsx'
import path from 'path'
import Toolbar from './toolbar.jsx'
import File from './file'
import Header from './header.jsx'
import Window from './window.jsx'
import Footer from './footer.jsx'
import {showSaveDialogAsync, saveFileAsync} from './fs'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      onboarding: true,
      targetWords: undefined,
      lineCount: undefined,
      filename: null,
      wordCount: 0,
    }
  }


  _handleWordCountInput(evt) {
    let targetWords = evt.target.valueAsNumber
    let onboarding = (this.state.lineCount == undefined) || evt.key != "Enter" || targetWords == 0
    this.setState({targetWords, onboarding})
  }

  _handleEnter(evt) {
    if (evt.key != "Enter") return;
    if (this.state.targetWords && this.state.targetWords > 0 && this.state.lineCount && this.state.lineCount > 0) {
      this.setState({onboarding: false})
    }
  }

  _handleLineCountInput(evt) {
    let lineCount = evt.target.valueAsNumber
    let onboarding = (this.state.targetWords == undefined) || evt.key != "Enter" || lineCount == 0
    this.setState({lineCount, onboarding})
  }

  handleClickSave() {
    if (this.state.onboarding) {
      return;
    }

    let filename = this.state.filename
    let content = this.editor.getContent()
    if (filename) {
      saveFileAsync(
        filename,
        content,
        this.state.targetWords,
        this.state.lineCount,
      ).catch((err) => console.error(err))
      return
    }

    showSaveDialogAsync()
      .then((filename) => {
        return saveFileAsync(
          filename,
          content,
          this.state.targetWords,
          this.state.lineCount,
        )
      })
      .then((filename) => this.setState({filename}))
      .catch((err) => console.error(err))
  }

  updateWordCount(wordCount) {
    this.setState({wordCount})
  }

  handleClickView() {
    let wc = this.state.visibleWordCount + this.state.deletedWordCount
    if (wc < this.state.targetWords) {
      return
    }
    if (this.editor.isRestricted) {
      this.editor.showFull()
    } else {
      this.editor.showRestricted()
    }
  }

  render() {
    let view;
    if (!this.state.onboarding) {
      view = (
        <div style={{height: "100%", flex: 1, display: "flex", flexDirection: "column"}}>
          <Toolbar />
          <Editor
            ref={editor => this.editor = editor}
            file={this.state.file}
            targetWords={this.state.targetWords}
            updateWordCount={this.updateWordCount.bind(this)}
            visibleLineCount={this.state.lineCount} />
       </div>)
    } else {
      view = (
        <div>
          <h1>Enter your target word count:</h1>
          <input type="number" onInput={this._handleWordCountInput.bind(this)} onKeyDown={this._handleEnter.bind(this)} />
          <h1>Enter number of lines visible:</h1>
          <input type="number" onInput={this._handleLineCountInput.bind(this)} onKeyDown={this._handleEnter.bind(this)} />
        </div>
      )
    }

    let footerTitle;
    if (this.state.targetWords) {
      footerTitle = `${this.state.wordCount}/${this.state.targetWords} Words`
    }

    return (
      <Window>
        <Header
          handleClickSave={this.handleClickSave.bind(this)}
          handleClickView={this.handleClickView.bind(this)}
          title={this.state.filename ? path.basename(this.state.filename) : 'Riddle'}>
        </Header>
        <div className="window-content">
            {view}
        </div>
        <Footer title={footerTitle}>
        </Footer>
      </Window>
    )
  }

}

render(<App/>, document.getElementById("app"))

        //  <div className='toolbar-actions'>
     //        <ButtonGroup>
     //          <Button
     //            mini
     //            icon='floppy'
     //            onClick={this.handleClickSave.bind(this)}
     //          />
     //          <Button
     //            mini
     //            icon='folder'
     //            onClick={this.handleClickOpen.bind(this)}
     //          />
     //          <Button
     //            mini
     //            icon='eye'
     //            onClick={this.handleView.bind(this)}
     //          />
     //        </ButtonGroup>
     //        <Button
     //          mini
     //          icon='plus'
     //          class='pull-right'
     //          onClick={this.handleClickNew}
     //        />
     //      </div>
          // <Tab>
          //  hello
          // </Tab>
          //
          //
          //


  // handleClickOpen() {
 //    showOpenDialogAsync()
 //      .then((filenames) => {
 //       let filename = filenames[0];
 //       if (filename === this.state.filename) {
 //         return
 //       }
 //        this.setState({ filename  })
 //        return fs.readFile(filenames[0], 'utf8')
 //      })
 //      .then((content) => this.handleOpeningContent(content))
 //      .catch(console.error)
  // }

  // handleOpeningContent(content) {
  //  let decoded = JSON.parse(content)
  //  this.setState({
  //    onboarding: false,
  //    lineCount: decoded.lineVisibility,
  //    targetWords: decoded.targetWords,
  //    deletedHTML: decoded.deletedHTML,
  //    deletedWordCount: decoded.deletedWordCount,
  //    visibleHTML: decoded.visibleHTML,
  //    visibleWordCount: decoded.visibleWordCount
  //  })
  // }
