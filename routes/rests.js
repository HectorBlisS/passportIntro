const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const multer = require('multer')
const uploader = multer({dest: './public/pics'})

//json api

router.post("/api/new", (req, res) => {
  Restaurant.create(req.body).then(rest => {
    res.status(201).json(rest);
  });
});

router.get("/api/:id", (req, res) => {
  Restaurant.findById(req.params.id).then(rest => {
    res.status(200).json(rest);
  });
});

router.get("/new", (req, res, next) => {
  //res.render("rests/new");
  res.render('rests/image')
});

router.post("/new", 
uploader.fields([
  {name: "images", maxCount:3},
  {name: 'photo', maxCount:1},
  {name: 'file', maxCount:1}
]),
(req, res, next) => {

  console.log(req.files)
  //res.json(req.files)

  const r = {
    name: "prueba",
    location: {
      type: "Point",
      coordinates: [-99, 19]
    }
  };
  if(req.files) {
    r.images = []
    req.files.images.forEach(f=>{
      r.images.push('/pics/' + f.filename)
    })
    r.photo = '/pics/' + req.files.photo[0].filename
    r.file = '/pics/' + req.files.file[0].filename
  }
  Restaurant.create(r).then(rest => {
    //res.redirect("/restaurants/" + rest._id);
    res.json(rest)
  });
});

router.get("/:id", (req, res) => {
  Restaurant.findById(req.params.id).then(rest => {
    res.render("rests/detail", rest);
  });
});

router.get("/", (req, res) => {
  Restaurant.find().then(rests => {
    res.render("rests/list", { restaurants: rests });
  });
});

module.exports = router;
