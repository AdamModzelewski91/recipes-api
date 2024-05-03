class PerpPhotoFiles {
  constructor(files) {
    this.files = files;
  }

  toArray() {
    const files = [];
    for (let file of this.files) {
      files.push({
        buffer: file.buffer,
        mimetype: file.mimetype,
        size: file.size,
        originalname: file.originalname,
        encoding: file.encoding,
      });
    }
    return files;
  }

  encodeFiles() {
    const newPhotos = [];
    for (let file of this.files) {
      newPhotos.push({
        mimetype: file.mimetype,
        buffer: Buffer.from(file.buffer).toString("base64"),
        originalname: file.originalname,
        id: file._id,
      });
    }
    return newPhotos;
  }
}

module.exports = PerpPhotoFiles;
