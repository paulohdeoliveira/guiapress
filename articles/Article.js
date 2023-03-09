const Sequelize = require("sequelize");
const conn = require("../database/database");
const Category = require("../categories/Category");

const Article = conn.define("articles", {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
});

Category.hasMany(Article);
Article.belongsTo(Category, {
    constraint: true,
    foreignKey: "categoryId",
});

// Article.sync({ force: true });

module.exports = Article;
