/** @jsx h */
import {h, Component, render} from 'preact'
import { Header, Title, Footer, Button, ButtonGroup, NavGroup } from 'preact-photon'
import Editor from './editor.jsx'
import { remote } from 'electron'
import fs from 'mz/fs'
const { dialog } = remote
import path from 'path'

// Wrap inconvenient APIs with promises
function showSaveDialogAsync (options) {
  return new Promise((resolve, reject) => {
    try {
      const files = dialog.showSaveDialog(options || {
      	filters: {
      		name: 'Riddles', extensions: ['riddle']
      	}
      })
      resolve(files)
    } catch (err) {
      reject(err)
    }
  })
}

function saveFileAsync (fileName, visibleHTML, visibleWordCount, deletedHTML, deletedWordCount, targetWords, lineVisibility) {
  if (typeof fileName !== 'string') throw Error('Filename must be a string')
  return new Promise((resolve, reject) => {
  	let encoded = JSON.stringify({
  		visibleHTML,
  		visibleWordCount,
  		deletedHTML,
  		deletedWordCount,
  		targetWords,
  		lineVisibility
  	})
  	if (!fileName.endsWith(".riddle")) {
  		fileName += ".riddle"
  	}

  	fs.writeFile(fileName, encoded, (err) => {
  		if (err) {
  			reject(err)
  		} else {
  			resolve(fileName)
  		}
  	})
  })
}

function showOpenDialogAsync (options) {
  const htmlDefaults = {
    properties: ['openFile'],
    filters: [
      { name: 'Riddles',
        extensions: ['riddle'],
      },
    ],
  }
  return new Promise((resolve, reject) => {
    try {
      const files = dialog.showOpenDialog(options || htmlDefaults)
      resolve(files)
    } catch (err) {
      reject(err)
    }
  })
}


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			onboarding: true,
			targetWords: null,
			lineCount: null,
			filename: null,
			visibleHTML: "",
			deletedHTML: "",
			visibleWordCount: 0,
			deletedWordCount: 0
		}
	}


	_handleWordCountKeyPress(evt) {
		let targetWords = evt.target.valueAsNumber
		this.setState({targetWords})
		if (evt.key != "Enter" || targetWords == 0) return;
		this.setState({onboarding: this.state.lineCount == null})
	}

	_handleLineCountKeyPress(evt) {
		let lineCount = evt.target.valueAsNumber
		this.setState({lineCount})
		if (evt.key != "Enter" || evt.target.valueAsNumber == 0) return;
		this.setState({onboarding: this.state.targetWords == null})
	}

	handleClickSave() {
		if (this.state.onboarding) {
			return;
		}

    let filename = this.state.filename
    if (filename) {
    	saveFileAsync(
    		filename,
    		this.state.visibleHTML,
    		this.state.visibleWordCount,
    		this.state.deletedHTML,
    		this.state.deletedWordCount,
    		this.state.targetWords,
    		this.state.lineCount,
    	).catch((err) => console.error(err))
      return
    }

    showSaveDialogAsync()
      .then((filename) => {
	    	return saveFileAsync(
	    		filename,
	    		this.state.visibleHTML,
	    		this.state.visibleWordCount,
	    		this.state.deletedHTML,
	    		this.state.deletedWordCount,
	    		this.state.targetWords,
	    		this.state.lineCount,
	    	)
      })
      .then((filename) => this.setState({filename}))
      .catch((err) => console.error(err))
	}

	handleClickOpen() {
    showOpenDialogAsync()
      .then((filenames) => {
      	let filename = filenames[0];
      	if (filename === this.state.filename) {
      		return
      	}
        this.setState({ filename  })
        return fs.readFile(filenames[0], 'utf8')
      })
      .then((content) => this.handleOpeningContent(content))
      .catch(console.error)
	}

	handleOpeningContent(content) {
		let decoded = JSON.parse(content)
		this.setState({
			onboarding: false,
			lineCount: decoded.lineVisibility,
			targetWords: decoded.targetWords,
			deletedHTML: decoded.deletedHTML,
			deletedWordCount: decoded.deletedWordCount,
			visibleHTML: decoded.visibleHTML,
			visibleWordCount: decoded.visibleWordCount
		})
	}

	updateWordCount(wordCount) {
		this.setState({wordCount})
	}

	onContentChanged(visibleHTML, visibleWordCount, deletedHTML = "", deletedWordCount = 0) {
		this.setState({
			visibleHTML,
			visibleWordCount,
			deletedHTML: this.state.deletedHTML + deletedHTML,
			deletedWordCount: this.state.deletedWordCount + deletedWordCount
		})
	}

	render() {
		let view;
		if (!this.state.onboarding) {
			view = <Editor
				ref={editor => this.editor = editor}
				content={this.state.visibleHTML}
				onContentChanged={this.onContentChanged.bind(this)}
				targetWords={this.state.targetWords}
				updateWordCount={this.updateWordCount.bind(this)}
				visibleLineCount={this.state.lineCount} />
		} else {
			view = (
				<div>
					<h1>Enter your target word count:</h1>
					<input type="number" onKeyPress={this._handleWordCountKeyPress.bind(this)}/>
					<h1>Enter number of lines visible:</h1>
					<input type="number" onKeyPress={this._handleLineCountKeyPress.bind(this)}/>
				</div>
			)
		}

		return (
			<div className="window">
				<Header>
					<Title>{this.state.filename ? path.basename(this.state.filename) : 'Riddle'}</Title>
 					<div className='toolbar-actions'>
            <ButtonGroup>
              <Button
                mini
                icon='floppy'
                enabled={false}
                onClick={this.handleClickSave.bind(this)}
              />
              <Button
                mini
                icon='folder'
                onClick={this.handleClickOpen.bind(this)}
              />
            </ButtonGroup>
            <Button
              mini
              icon='plus'
              class='pull-right'
              onClick={this.handleClickNew}
            />
          </div>
				</Header>
				<div className="window-content">
					{view}
				</div>
        <Footer>
          <Title>
            {this.state.visibleWordCount + this.state.deletedWordCount}/{this.state.targetWords} Words
          </Title>
        </Footer>
			</div>
		)
	}

}

render(<App />, document.body)
