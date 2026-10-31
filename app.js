require("reflect-metadata");
require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const postgres = require("./app-data-source");

// GET request to /
app.get('/', (req, res) => {
  res.render("index", { title: "Dashboard" });
});

postgres.initialize().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})