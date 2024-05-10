const moongose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const authSchema = moongose.Schema(
  {
    email: { type: String, required: true, unique: true },
    nick: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

authSchema.plugin(uniqueValidator);

const Auth = moongose.model("Auth", authSchema);

module.exports = Auth;
