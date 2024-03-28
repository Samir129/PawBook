const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  breed: {
    type: String,
  },
  bio: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  location: {
    type: String,
  },
  interest: {
    type: String,
  },
  socials: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  health: {
    medicalConditions: {
      type: String,
      require: false,
    },
    vaccination: {
      type: String,
      require: false,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
