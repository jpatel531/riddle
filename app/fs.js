import { remote } from 'electron'
import fs from 'mz/fs'
// import fs from 'fs'
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

export function saveBlob(filename, blob) {
  let reader = new FileReader()
  reader.onload = function() {
    if (reader.readyState == 2) {
      console.log(reader.result)
      var buffer = new Buffer(reader.result)
      console.log(`Saving ${JSON.stringify({ filename, size: blob.size })}`)
      saveFileAsync(filename, buffer)
      // fs.writeFile("test.txt", b,  "binary",function(err) { });
    }
  }
  reader.readAsArrayBuffer(blob)
}

export function saveFileAsync (fileName, encoded) {
  if (typeof fileName !== 'string') throw Error('Filename must be a string')
  return new Promise((resolve, reject) => {
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