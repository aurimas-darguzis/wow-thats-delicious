const mongoose = require('mongoose')

// set Promise as global variable
mongoose.Promise = global.Promise

// allow to make url friendly name
const slug = require('slugs')

// trim will remove white space before storing data to db
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must suplly an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must suplly an author'
  }
})

// before we save schema, we want to prepopulate slug.
// so we take the value from name, pass it slug function that
// we imported and assign to slug property
storeSchema.pre('save', async function (next) {
  // `this` - is the store that we are trying to save
  if (!this.isModified('name')) {
    next() // skip it
    return // stop this function from running
  }
  this.slug = slug(this.name)
  // find other stores that have a slug of name, name-1, name-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next()
  // TODO make more resiliant so slugs are unique
})

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags'},
    // group everything based on tag field and then
    // create a new field in each of these groups, called count
    { $group: { _id: '$tags', count: { $sum: 1} }},
    { $sort: { count: -1 }}
  ])
}

module.exports = mongoose.model('Store', storeSchema)
