export default class Tab {

	constructor(onbording, filename = "untitled") {
		this.filename = filename
	}

	get header() {
		return <Tab>{this.filename}</Tab>
	}

	get content() {

	}

}