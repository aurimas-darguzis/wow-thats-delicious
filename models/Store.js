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
 }
})

// before we save schema, we want to prepopulate slug.
// so we take the value from name, pass it slug function that
// we imported and assign to slug property
storeSchema.pre('save', function (next) {
  // `this` - is the store that we are trying to save
  if (!this.isModified('name')) {
    next() // skip it
    return // stop this function from running
  }
  this.slug = slug(this.name)
  next()
  // TODO make more resiliant so slugs are unique
})

module.exports = mongoose.model('Store', storeSchema)
