export function uploadFile(file) {
  return { type: "UPLOAD_FILE", filetype: "", file };
}
// TODO: Get filetype from the extension
