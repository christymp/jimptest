import Jimp from "jimp/browser/lib/jimp";

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return blobToFile(new Blob([u8arr], { type: mime }), filename);
}
function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function imageResize(file, cb) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = e => {
    Jimp.read(e.target.result)
      .then(Image => {
        if (Image.bitmap.width > 800) {
          Image.resize(800, Jimp.AUTO, Jimp.RESIZE_BEZIER).quality(60);
        } else if (Image.bitmap.width < 800 && Image.bitmap.height > 800) {
          Image.resize(Jimp.AUTO, 800, Jimp.RESIZE_BEZIER).quality(60);
        }
        return Image.invert();
      })
      .then(Image => {
        Image.getBase64Async(file.type)
          .then(data => {
            let newFile = dataURLtoFile(data, file.name);
            cb(newFile, Image.bitmap.height, Image.bitmap.width, data); // data is uri
          })
          .catch(err => {
            console.log("base64convertion error", err);
          });
      })
      .catch(err => {
        console.log("read && resize error", err);
      });
  };
}
