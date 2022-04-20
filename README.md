## Görsel Yüklemek
Şimdiye kadar fotoğraların yalnızca ismini va açıklamalarını gönderdik, bu çalışma da ise fotoğrafın kendisini nasıl göndereceğimiz üzerine konuşacağız. Bunun için express-fileupload modülünü kullanacağız. Bu modülü indirelim.


```console
npm i express-fileupload
```  

Görseli göndermek için formumuzda ilgili input alanının, name="image" ve type="file" olduğuna dikkat ediniz. Ayrıca görsel göndermemiz için encType="multipart/form-data" eklememiz gerekir. Bundan sonra express-fileupload modülün de yardımıyla bundan sonra req.files.image nesnesi yardımıyla gönderilen görsel özelliklerine ulaşabiliriz. express-fileupload modülünü kullanmak için aşağıdaki işlemleri yapacağız.



```javascript
const fileUpload = require('express-fileupload'); // modülü kullanıma alıyoruz.
app.use(fileUpload());     
```  

Görsel Yükleme Aşamaları

- Biz görselleri uploads isimli bir klasöre yükleyeceğiz, öncelikle bu klasörün olup olmadığını kontrol edeceğiz.



```javascript
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) { // Bunun için const fs = require('fs'); almamız gerekir.
    fs.mkdirSync(uploadDir);
  }
```
- Sonra bu görselimizin kendisini ve yüklenmek istenen dosya yolunu yakalayalım.

```javascript
 let uploadeImage = req.files.image;
 let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
```  

- Son olarak da bu bilgileri görsele ait diğer bilgiler ile birlikte veritabanına yazdıralım.

```javascript
 uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
```
ilgili yönlendirmenin son hali aşağıdadır:

```javascript
app.post('/photos', async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);    // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
});
```

![site](https://i.ibb.co/x3RBZv6/imageupload1.gif)
