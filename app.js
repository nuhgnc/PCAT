const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose')
const photo = require('./models/Photo') // oluşturduğum schemayı aldım


const app = express();


//Database connect
mongoose.connect('mongodb://localhost/pcat-test-db')

//VİEW ENGİNE
app.set('view engine', 'ejs');

//MİDDLEWARE
app.use(express.static('public')); // Static dosyaları koyacağımız klasörü seçtik
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(express.json()); // Body parser

//ROUTES
app.get('/', async (req, res) => {
  const photos = await photo.find({});
  res.render('index', { photos });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

  app.get('/photo/:photo_id', async (req,res) =>{
  const foundedPhoto = await photo.findById(req.params.photo_id)
  res.render('photo', {photo:foundedPhoto})
})  

/*  app.get('/photo', (req,res) =>{
  res.render('photo',{photo: {
    title: 'nuh',
    description: 'deneme',
    image: 'asdasd.jps'
  }})
})  */


app.post('/photos', async (req, res) => {
  await photo.create(req.body)
  res.redirect('/');
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda dinleniyor`);
});
