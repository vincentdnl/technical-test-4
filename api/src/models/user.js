const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Date } = require("mongoose");

const MODELNAME = "user";

const Schema = new mongoose.Schema({
  name: { type: String, trim: true, unique: true },

  email: { type: String, trim: true },

  avatar: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },
  banner: { type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" },

  password: { type: String },

  last_login_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },

  costPerDay: { type: Number, default: 100 },
  sellPerDay: { type: Number, default: 200 },

  days_worked: { type: Number, default: 23 },

  description: { type: String },
  job_title: { type: String },

  organisation: { type: String, trim: true, unique: true },
  status: { type: String, default: "active" },
  availability: { type: String, default: "available" },
  address: { type: String },
});

Schema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt.hash(this.password, 10, (e, hash) => {
      this.password = hash;
      return next();
    });
  } else {
    return next();
  }
});

Schema.methods.comparePassword = function (p) {
  return bcrypt.compare(p, this.password || "");
};
const OBJ = mongoose.model(MODELNAME, Schema);
module.exports = OBJ;
