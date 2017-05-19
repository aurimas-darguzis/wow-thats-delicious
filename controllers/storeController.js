const mongoose = require('mongoose')
const Store = mongoose.model('Store')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter (req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/')
    if (isPhoto) {
      next(null, true)
    } else {
      next({ message: 'That filetype is not allowed!'}, false)
    }
  }
}

exports.homePage = (req, res) => {
  res.render('index')
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' })
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next() // skip to the next middleware
    return
  }
  const extension = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${extension}`
  // now we resize
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800, jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  // once we have written the photo to our file system, keep going!
  next()
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save()
  // show  a message. flash(type of:[success, warning, info], message)
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)
}

exports.getStores = async (req, res) => {
  //  1. Query the database for a list of all stores
  const stores = await Store.find()
  res.render('stores', { title: 'Stores', stores })
}

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id })
  // 2. confirm they are the owner of the store
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store})
}

exports.updateStore = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point'
  // find and update the store
  const q = {_id: req.params.id }
  const data = req.body
  const options = {
    new: true, // return the new store instead of the old one
    runValidators: true
  }
  console.log('hola')
  const store = await Store.findOneAndUpdate(q, data, options).exec()
  // Redirect them the store and tell them it worked
  req.flash('success', `Successfully updated <strong>${store.name}</strong> 
          <a href="/stores/${store.slug}">View Store</a>`)

  res.redirect(`/stores/${store._id}/edit`)
}

exports.deleteStore = async (req, res) => {
  const store = await Store.findOneAndRemove({ _id: req.params.id })
}
