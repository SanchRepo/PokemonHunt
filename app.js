const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate")

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

app.engine('ejs',engine)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
  req.body.pokemon.Name = pokedex[req.body.pokemon.DexNum - 1].name.english;
  const newPoke = new Pokemon(req.body.pokemon);
  await newPoke.save();
  res.redirect(`pokemon/${newPoke._id}`);
});

app.get("/pokemon/:id", async (req, res) => {
  const pokemon = await Pokemon.findById(req.params.id);
  res.render("wildPokemon/show", { pokemon });
});

app.get("/pokemon/:id/edit", async (req, res) => {
  const oldPoke = await Pokemon.findById(req.params.id);
  res.render("wildPokemon/edit", { oldPoke, natures, pokedex });
});

app.put("/pokemon/:id", async (req, res) => {
  req.body.pokemon.Name = pokedex[req.body.pokemon.DexNum - 1].name.english;
  const { id } = req.params;
  console.log(req.body.pokemon.DexNum);
  const updatePoke = await Pokemon.findByIdAndUpdate(id, {
    ...req.body.pokemon,
  });
  res.redirect(`/pokemon/${updatePoke._id}`);
});

app.delete("/pokemon/:id", async (req, res) => {
  const { id } = req.params;

  await Pokemon.findByIdAndDelete(id);
  res.redirect("/pokemon");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
