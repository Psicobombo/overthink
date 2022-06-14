const mongoose = require("mongoose")

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
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

characterSchema.methods.sayHi = function () {
  console.log(`ciao mi chiamo ${this.name}`)
}

module.exports =  mongoose.model("Character", characterSchema)