const mongoose = require("mongoose")

const modifierSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
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
modifierSchema.methods.sayHi = function () {
  console.log(`ciao mi chiamo ${this.label}`)
}

module.exports =  mongoose.model("Modifier", modifierSchema)