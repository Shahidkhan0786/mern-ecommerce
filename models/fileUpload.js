const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const fileSchema = new Schema({
  Filename: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("FileUpload", fileSchema);