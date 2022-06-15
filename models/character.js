const mongoose = require("mongoose")

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate(image) {
        // TODO: inser validation funcion for image url
    }
  },
  categories: [String],
  isTwitchSafe: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true
  }
})

// example custom method of a schema
characterSchema.methods.sayHi = function () {
  console.log(`ciao mi chiamo ${this.name}`)
}

module.exports =  mongoose.model("Character", characterSchema)