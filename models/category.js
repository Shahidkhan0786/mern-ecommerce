const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const categorySchema = new Schema({
  title: String,
  description: String,
  photo: {
    public_id: {
        type: String,
        // required: [true, 'Photo id is required']
    },
    secure_url: {
        type: String,
        // required: [true, 'Photo secure url is required']
    }
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
 
module.exports = mongoose.model("Category", categorySchema);