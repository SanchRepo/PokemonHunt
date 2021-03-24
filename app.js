const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Pokemon = require("./models/pokemon");
const natures = require("./PokeGen/natures");
const pokedex = require("./PokeGen/pokedex");

const app = express();

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/pokemon", async (req, res) => {
  const wildPokemon = await Pokemon.find();
  res.render("wildPokemon/index", { wildPokemon });
});

app.get("/pokemon/new", (req, res) => {
  res.render("wildPokemon/new", { natures, pokedex });
});

app.post("/pokemon", async (req, res) => {
  res.send(req.body);
});

app.get("/pokemon/:id", async (req, res) => {
  const pokemon = await Pokemon.findById(req.params.id);
  res.render("wildPokemon/show", { pokemon });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
