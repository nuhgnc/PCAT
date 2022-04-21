## MVC Düzenlemesi

Projemizi incelediğimizde tüm yönlendirmelerimizi ve bu yönlendirmelere karşılık yapılan işlemlerin tamamını app.js dosyası içerisinde yapıyoruz. Açıkcası bizim projemizde şimdiye kadar bir sorun çıkmış değil. Ancak özellikle büyük ölçekli projelerin yönetimi ve hata yakalaması açısında kodu işlevsel açıdan farklı dosyalara bölmek işimizi kolaylaştırır. Burada biz MVC yapısını kullanacağız.

## MVC Nedir?

MVC - Model View Controller - uygulama kodunu Model, View ve Controller olmak üzere birbirine bağlı üç öğeye ayrılmasını içeren bir yazılım mimari yapısıdır.

Bir fotoğrafı sildiğimizde ek olarak bu fotoğrafı fiziksel olarak da ilgili fotoğrafı silmek isteriz. Bunun için yine Node.js çekirdek modülü olan fs modülünden faydalanacağız. İlgili DELETE requeste ait olan yönlendirmeyi aşağıda bulabilirsiniz.

- ### Model

Uygulamanın veri yapısını ve veri tabanı ile ilişkisini tanımlar. Schema "şablon" yapısı sayesinde veri özellikleri belirlenir.

- ### View

Uygulamanın son kullanıcılara görünen bölümünü temsil eder. Son kullanıcıya gösterilecek veri özelleştirilebilir.

- ### Controller

Son kullanıcıdan gelen isteklerin uygun View'e yönlendirilmesi kontrol edilir. İstek, cevap işleyicisi olarak da tanımlanır.



controllers/photoController.js dosyası oluşturup, app.js içerisindeki tüm yönlendirmeleri bu dosyaya taşıyalım. Yapılan tüm işlemlere özel fonksiyon isimleri tanımlanarak oluşturulan photoController.js dosyasının son hali aşağıdaki gibidir

`controllers/photoController.js`

```javascript
const photo = require('../models/Photo'),
  path = require('path'),
  fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const photos = await photo.find({});
  res.render('index', { photos });
};

exports.getPhotoPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('photo', { photo: foundedPhoto });
};

exports.getEditPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('edit', { photo: foundedPhoto });
};

exports.photoUpdate = async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  // Yeni fotoğrafı upload et
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
};

exports.photoUpload = async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err); // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
};

exports.photoDelete = async (req, res) => {
  const foundedPhoto = await photo.findOne({ _id: req.params.photo_id });
  const imagepath = __dirname + '/../public' + foundedPhoto.image;
  fs.unlinkSync(imagepath);
  await photo.findByIdAndDelete(req.params.photo_id);
  res.redirect('/');
};
```

sonrasında bu oluşturulan fonksiyonlar app.js dosyasına çağırılır.

`app.js`
```javascript
const photoController = require('./controllers/photoControllers'); // en yukarıya yazılacak
//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photo/:photo_id', photoController.getPhotoPage);
app.get('/photo/edit/:photo_id', photoController.getEditPage);
app.put('/photo/:photo_id', photoController.photoUpdate);
app.post('/photos', photoController.photoUpload);
app.delete('/photo/:photo_id', photoController.photoDelete);

```

Aynı işlemleri uygulamamızın sayfaları için de uygulayalım.  

`controllers/pageController.js`

```javascript

exports.getAboutPage = (req, res) => {
    res.render('about');
  }

exports.getAddPage = (req, res) => {
    res.render('add');
  }
```  


`app.js`
```javascript
const pageController = require('./controllers/pageController'); // Bu en yukarıya yazılacak

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
```