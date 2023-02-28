const express = require("express");
const router = express.Router();
const request = require("../req/request");
const DB = require("../my database/mysql");
const { check, validationResult } = require("express-validator");
const mkdirp = require("mkdirp");
const fs = require("fs-extra");

const bodyParser = require("body-parser");
const { render } = require("ejs");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const access = require("./access");
const forUSER = access.forUsers;

router.get("", forUSER, (req, res) => {
  var get = "select * from products";
  DB.con.query(get, function (err, result1) {
    if (err) throw err;
    res.render("../views/admin/products.ejs", { result1 });
  });
});
router.get("/add-products", forUSER, (req, res) => {
  var get2 = "select * from catagory";
  DB.con.query(get2, function (err, result) {
    if (err) throw err;
    res.render("../views/admin/add-products.ejs", { result, result1: "" });
  });
});

router.post(
  "/add-products",
  forUSER,
  urlencodedParser,
  [
    check("name", "Name cant be less than 2").exists().isLength({ min: 2 }),
    check("description", "Description cant be less than 2 ")
      .exists()
      .isLength({ min: 2 }),
    check("price", "price could not be empty !! ")
      .exists()
      .isLength({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("../views/admin/add-products.ejs", { alert });
      // return res.status(422).json(errors.array())
    } else {
      var title = req.body.name;
      var description = req.body.description;
      var catagory = req.body.catagory;
      var price = req.body.price;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("no file were uploaded");
      }
      var img = req.files.img;
      var uploadpath =
        __dirname + "/" + "../" + "views" + "/" + "admin" + "/" + img.name;
      img.mv(uploadpath, function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          var products =
            "INSERT INTO products values(null,'" +
            title +
            "', '" +
            description +
            "', '" +
            catagory +
            "', '" +
            price +
            "',  '" +
            img.name +
            "')";
          DB.con.query(products, function (err, result1) {
            res.render("../views/admin/products.ejs", { result1 });
          });
        }
      });
    }
  }
);
router.get("/load", forUSER, (req, res) => {
  var get = "select * from products";
  DB.con.query(get, function (err, result1) {
    if (err) throw err;
    res.render("../views/admin/products.ejs", { result1 });
  });
});
router.get("/edit-products/:id", forUSER, (req, res) => {
  const id = req.params.id;
  var edit = `select * from products where id="${id}"`;
  DB.con.query(edit, function (err, result1) {
    if (err) throw err;
    res.render("../views/admin/edit-products.ejs", { result1 });
  });
});
router.post("/edit-products/:id", forUSER, (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const catagory = req.body.catagory;
  const price = req.body.price;
  const description = req.body.description;
  var updates = `UPDATE products SET title= '${title}',description = '${description}', catagory = '${catagory}', price = '${price}' where id = '${id}'`;
  DB.con.query(updates, function (err, result1) {
    if (err) throw err;
    res.render("../views/admin/products.ejs", { result1 });
  });
});
router.get("/delete-products/:id", forUSER, (req, res) => {
  const id = req.params.id;
  var deletee = `delete from products where id="${id}"`;
  DB.con.query(deletee, function (err, result1) {
    if (err) throw err;
    res.render("../views/admin/products.ejs", { result1 });
  });
});
module.exports = router;
