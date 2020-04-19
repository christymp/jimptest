import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";

import "./App.css";
import { imageResize, dataURLtoFile } from "./image-process";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { fileInfo: {} };
  }

  // Handle image upload.
  imgUpload = event => {
    // if (
    //   event.target.files.length > 0 &&
    //   this.state.fileInfo.hasOwnProperty("file") &&
    //   this.state.fileInfo.file
    // ) {
    //   return console.log("You can uplaod only one file at a time");
    // }

    let file = event.target.files[0];
    if (!file) {
      return;
    }

    // Only allow jpg, jpeg, png file types.
    let imageReg = /(.*?)\/(jpg|jpeg|png)$/;

    if (imageReg.test(file.type)) {
      if ((file.size / (1024 * 1024)).toFixed(2) > 10) {
        return console.log("File Size should be smaller than 10MB");
      }

      imageResize(file, (newFile, height, width, preview) => {
        try {
          this.setFileInfo(
            newFile,
            newFile.type.split("/")[1],
            newFile.type,
            height,
            width,
            preview
          );
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      return console.log("Choose valid file type");
    }
  };

  // Update file information.
  setFileInfo = (
    file,
    extension,
    contentType,
    height,
    width,
    preview
  ) => {
    if (!file) {
      if (this.state.isWaitForPostFeed) return;
      this.setState({ fileInfo: {} });
    } else {
      let fileInfo = {
        ...this.state.fileInfo,
        file: file,
        extension: extension,
        contentType: contentType,
        preview
      };

      if (height && width) {
        fileInfo.height = height;
        fileInfo.width = width;
      }

      this.setState({ fileInfo: fileInfo });
    }
  };

  // Render app html.
  render() {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <input type="file" onChange={this.imgUpload} />
        {this.state.fileInfo.hasOwnProperty("preview") ? (
          <img src={this.state.fileInfo.preview} />
        ) : (
          false
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
