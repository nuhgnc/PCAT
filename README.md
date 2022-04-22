## Pagination (Sayfalama)

Uygulamamızın yavaş yavaş sonuna geliyoruz. Ama bir sorunumuz var, uygulamamıza yüklediğimiz tüm fotoğraflar anasayfada sıralanıyor. Fotoğraf sayımız arttığında sayfamızın aşağıya doğru uzadığını göreceğiz. Bunun önüne geçmek için farklı çözümler var biz bu çalışmamızda Pagination kavramı üzerine konuşacağız. Sayfalama özelliğine geçmeden önce req.query özelliği üzerine konuşmamız gerekir.

## req.query

req.query özelliği ile ilgili yönlendirmede bulunan sorgu parametrelerini yakalamamızı sağlar. URL de ?user=test&pass=1234 sorgusu yapıldığında req.query özelliği bize sorgu parametlerini ve değerlerini gösteren bir key - value objesi döner.  


`{ user: 'test', pass: '1234' }`  

Bu özellik sayesinde biz ne yapabiliriz? Eğer hangi sayfada olduğumuzu bir şekilde query ile yakaladığımızda biz sayfa içeriğimizi de o anda bulunan sayfaya göre belirleyebiliriz. Her sayfada bulunan içerik sayısını da belirledikten sonra her sayfaya hangi içeriğin düşeceğini belirleyebiliriz. Bu arada toplam fotoğraf sayımızı her sayfada bulunmasını istediğimiz fotoğraf sayısına bölersek toplam sayfa sayımız da ortaya çıkar. Nasıl karışık geldi değil mi?:)))  

Şimdi hemen ilgili kodumuzu yazalım ve ve yanlarına açıklamalarımızı koyalım.


`photoController.js`  
```javascript
exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1  // urldeki parametreyi alıyoruz
  const photoPerPage = 2  // sayfa başına kaç fotoğraf olduğunu belirtiyoruz
  const totalPhotos = await photo.find().countDocuments();  // Database'de kayıtlı olan tüm fotoğrafların sayısını alıyoruz

  const photos = await photo.find({}) // Tüm fotoğrafları alıyoruz
    .sort('-dateCreated') // Yüklenme tarihine göre sıralıyoruz
    .skip( (page - 1) * photoPerPage )  // url'den aldığımız sayfa sayısından 1(bi önceki sayfa) çıkartıp, her sayfada kaç fotoğraf olacaksa onla çarpıyoruz
    .limit(photoPerPage); // Kaç adet veri gösterileceğini pelirtiyoruz

  res.render('index', { 
    photos: photos,
    page:page,
    totalPhotos: Math.ceil(totalPhotos  / photoPerPage )  // toplam fotoğraf sayısını, her sayfada gözükecek olan fotoğraf sayısına bölerek toplam sayfa sayınıaelde ediyoruz. ondalık sayı çıkarsa diye en yakın onluğa yuvarlıyoruz
   });
};
```

index.js sayfasındaki pagination kodu ise aşağıdadır.

`views/index.ejs`
```javascript
<!-- Catalog Paging Buttons -->
                    <div>
                        <% if (totalPage > 0 ) { %> <!-- Toplam sayfa sayısı 0'dan büyük ise aşağıdakileri yap -->
                            
                            <ul class="nav tm-paging-links">

                                <% for( let i = 1; i <= totalPage; i++ ) { %> <!-- Toplam sayfa sayfa sayısına ulaşana kadar sayfa butonunu 1 arttır-->
                                    <% if (currentPage == i ) { %> <!-- eğer ki url'deki sayfa saysı, for döngüsündeki sayısa eşit ise active class'lı olanı göster -->

                                            <li class="nav-item active"><a href="/?page=<%= i %>" class="nav-link tm-paging-link"><%= i %> </a></li>

                                    <% } else if ( i <= 18 ) { %>  <!-- Eğer şuan ki sayfa sayısı 18'den küçük veya eşit ise sadece 18 tane (sayfaya bu kadar sığıyor) sayfa numarası göster -->
                                        
                                            <li class="nav-item"><a href="/?page=<%= i %>" class="nav-link tm-paging-link"><%= i  %> </a></li>
                                        <% }  %>  
                                <% } %>
                                        <% if (currentPage < totalPage) { %> <!-- Eğer şuan ki sayfa toplam sayfa sayısından küçük ise sayfa butonlarının yanına last butonu koy-->
                                            
                                            <li class="nav-item"><a href="/?page=<%= totalPage %>"  class="nav-link tm-paging-link"> last </a></li>
                                        <% } %>
                            </ul>
                        <% } %>
                        
                    </div>

```
![alt](./public/video/pcat.gif)