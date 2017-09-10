/** @jsx h */
import {h, Component, render} from 'preact'
import { Header, Title, Footer, Button, ButtonGroup, NavGroup } from 'preact-photon'
import Editor from './editor.jsx'

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			onboarding: true,
			targetWords: null,
			lineCount: null,
			wordCount: 0
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

	updateWordCount(wordCount) {
		this.setState({wordCount})
	}

	render() {
		let view;
		if (!this.state.onboarding) {
			console.log(this.state)
			view = <Editor
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
					<Title>Riddle</Title>
				</Header>
				<div className="window-content">
					{view}
				</div>
        <Footer>
          <Title>
            {this.state.wordCount}/{this.state.targetWords} Words
          </Title>
        </Footer>
			</div>
		)
	}

}

render(<App />, document.body)
