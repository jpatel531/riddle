import { remote } from 'electron'
import fs from 'mz/fs'
const { dialog } = remote

// Wrap inconvenient APIs with promises
export function showSaveDialogAsync (options) {
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

export function saveFileAsync (fileName, content, targetWords, lineVisibility) {
  if (typeof fileName !== 'string') throw Error('Filename must be a string')
  return new Promise((resolve, reject) => {
  	let encoded = JSON.stringify(
  		{targetWords, lineVisibility, content}
  	)

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

export function showOpenDialogAsync (options) {
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