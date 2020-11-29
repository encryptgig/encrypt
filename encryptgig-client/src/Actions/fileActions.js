export function uploadFile(file) {
  return { type: "UPLOAD_FILE", filetype: "", file };
}
export function shareFile(emailList) {
  return { type: "SHARE_FILE", emailList };
}
// TODO: Get filetype from the extension
