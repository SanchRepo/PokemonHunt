const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Pokemon = require("./models/pokemon");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makepokemon", async (req,res)=>{
    const poke = await new Pokemon({Name: "Bulbasaur", Level: 100})
    await poke.save();
    res.send(poke)

})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
