import JsZip from "jszip";

export const dataURItoBlob = (dataURI, callback) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  // var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var bb = new Blob([ab]);
  return bb;
};

export const base64ToBlob = (data) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(data);

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var bb = new Blob([ab]);
  return bb;
};

export const downloadZipFile = async (files, isEncrypt) => {
  console.log(files);
  var zip = new JsZip();
  zip.file("hello.pdf", new Blob(["Hello World"]));
  zip.file("hello1.pdf", new Blob(["Hello World"]));
  // const blob = await downloadZip(files).blob();
  zip
    .generateAsync({
      type: "blob",
    })
    .then(function (content) {
      window.location.href = "data:application/zip;blob," + content;
    });
};

export const downloadFile = (fileData, fileName, isEncrypt) => {
  const data = window.URL.createObjectURL(fileData);
  const link = document.createElement("a");

  link.href = data;
  link.download =
    isEncrypt == true
      ? "encrypted-" + fileName
      : "decrypted-" + fileName.split("-")[1];

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
};
