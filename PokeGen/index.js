const natures = require("./natures");
const cities = require("./cities");
const pokedex = require("./pokedex");
const Pokemon = require("../models/pokemon");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/pokebank", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Open");
  })
  .catch((err) => {
    console.log("Error!!");
    console.log(err);
  });

const randEl = (array) => array[Math.floor(Math.random() * array.length)];

const pokeGen = async () => {
  await Pokemon.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomPoke = randEl(pokedex);
    const randomNature = randEl(natures);
    const randomCity = randEl(cities);
    const poke = new Pokemon({
      Location: `${randomCity.city}, ${randomCity.state}`,
      Name: `${randomPoke.name.english}`,
      Nature: `${randomNature}`,
      DexNum: `${randomPoke.id}`,
      Level: `${Math.floor(Math.random() * 100) + 1}`,
      Sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/${randomPoke.id}.png`,
    });
    await poke.save();
  }
};
pokeGen().then(() => {
  mongoose.connection.close();
});
