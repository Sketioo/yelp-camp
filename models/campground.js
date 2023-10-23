const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } };


const imageSchema = new Schema({
  url: String,
  filename: String
})

imageSchema.virtual("thumbnail").get(function() {
  return this.url.replace("/upload", "/upload/w_200");
})

const campgroundSchema = new Schema({
  title: String,
  images: [
    imageSchema
  ],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  //* One to Many
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts)

campgroundSchema.virtual("properties.popUp").get(function() {
  return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 65)}...</p>
  `
})

campgroundSchema.post('findOneAndDelete', async function(campground) {
  if(campground) {
    const res = await Review.deleteMany({
      //* Setiap instance memiliki ID maka hapus semua review yang terdapat pada campground review
      //* Artinya tidak semua review akan dihapus namun hanya review dari post yang kita hapus
      _id: {$in: campground.reviews}
    })
    console.log(res)
  }
})

module.exports = mongoose.model('Campground', campgroundSchema);