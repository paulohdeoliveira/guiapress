const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const conn = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

// View Engine
app.set("view engine", "ejs");

// Static
app.use(express.static("public"));

// Body Parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Database
conn.authenticate()
    .then(() => {
        console.log("Conected to database");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    Article.findAll().then((articles) => {
        res.render("index", { articles: articles });
    });
});

app.listen(8080, () => {
    console.log("Server is running");
});
