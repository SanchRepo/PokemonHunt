const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  Id:Number,  
  Name: String,
  Ability: String,
  Level: Number,
  Location: String,
  Sprite: String
});

module.exports = mongoose.model("Pokemon", PokemonSchema);
