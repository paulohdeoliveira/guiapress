const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const conn = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

// View Engine
app.set("view engine", "ejs");

// Sessions
app.use(
    session({
        secret: "qualquercoisa",
        cookie: { maxAge: 30000000 },
    })
);

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
app.use("/", usersController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [["id", "desc"]],
        limit: 4,
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug,
        },
    })
        .then((article) => {
            if (article != undefined) {
                Category.findAll().then((categories) => {
                    res.render("article", {
                        article: article,
                        categories: categories,
                    });
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.redirect("/");
        });
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug,
        },
        include: [{ model: Article }],
    })
        .then((category) => {
            if (category != undefined) {
                Category.findAll().then((categories) => {
                    res.render("index", {
                        articles: category.articles,
                        categories: categories,
                    });
                });
            } else {
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.redirect("/");
        });
});

app.listen(8080, () => {
    console.log("Server is running");
});
