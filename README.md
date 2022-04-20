## Fotoğraf Bilgilerini Güncellemek
Bu bölümde yüklediğimiz fotoğraflara ait bilgileri nasıl güncelleyeceğimiz üzerine konuşacağız. Senaryomuz şu şekilde Update Details butonuna tıklandığında bir GET reguest sonucunda edit sayfası açılacak bu sayfada bulunan formda formlara ait olan önceki bilgiler bulunacak, bilgilerde bir değişiklik yaptığımızda sonrasında POST request yardımıyla güncellenmiş bilgilerle tekil fotoğraf sayfasına yöneleceğiz.



Update butonuna tıkladığımız zaman açılacak edit.ejs template'i add.ejs den faydalanarak oluşturacağız. Güncellenek Fotoğraf bilgisine ait olan _id yi de photo.ejs deki Update Details linkine `href="/photos/edit/<%= post._id %>"` de yakalıyoruz. İlgili yönlendirme de aşağıdaki gibi olacaktır.



```javascript
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});
```  

Edit template sayfasına ulaştığımızda ise ilgili photo bilgisinin hali hazırda görünmesini istiyoruz. Bunun için form alanlarındaki value değerlerini görmemiz gerekir. Bunun için aşağıdaki kodları yazacağız edit template içerisindeki ilgili form alanlarına.



```html
<%= photo.title %>
<%= photo.description %>
```  

Böylelikle "GET" request aşaması tamamlanmış oldu. Şimdi ise yapmamız gereken değişen bu bilgileri "POST" request ile göndemek ancak değişen bilgileri göndermek için biz http PUT request kullanacağız. Tarayıcılar bu PUT requesti desteklemedikleri için yapacağımız PUT requesti tarayıcının anlayacağı POST request şeklinde simüle edeceğiz. Bunun için ise method-override modülünü kullanacağız.



```console
 npm i method-override
```
Bu metodu çağıracağız ve middleware olarak kayıt edeceğiz.



```javascript
 const methodOverride = require('method-override'); // Projemize dahil edelim
```  
```javascript
app.use(methodOverride('_method')); // MiddleWare olarak tanımlayalım
```  

edit template içerisindeki formumuzda POST requesti PUT requeste dönüştürmek için aşağıdaki düzenlemeyi yapacağız.



```html
form method="POST" action="/photos/<%= photo._id %>?_method=PUT"
```
Şimdi app.js içerisindeki bu PUT request yönlendirmesini yapacağız.


```javascript
app.put('/photo/:photo_id', async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  // Yeni fotoğrafı upload et
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
});
```

![site](https://i.ibb.co/fNT6381/Gif-Maker-20220420161615163.gif)
