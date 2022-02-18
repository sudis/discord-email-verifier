# Doğrulama Botu
> Selam canım yine harika bir bot ile karşındayım 25 saatir bu bot ile uğraşıyorum aynen aynen. Neyse birkaç saatte Discord için E-posta üstünden doğrulama sağlayan bu botu yaptım. Discord ne diyor hiç bilmiyorum vallahi orası artık sizde. 

> SMTP nedir, E-posta nedir ne işe yarar bilmiyorsanız ve bu **sefil** botu "nasıl kopyalarım?", "nasıl çalarım" diye düşünüyorsan kafes dövüşüne davet ediyorum seni bıktım şu hırsız sefil pis botçulardan. Dediğim gibi SMTP ve basit bir şekilde E-postanın inceliklerini vs. bilmiyorsan **Gmail** kullanmanı tavsiye ediyorum. Bu bot saniyede 500 e-posta gönderebilecek bir bot değil. Ona göre sakin davranın fazla kullanmayın.

> **Kendi E-posta adresini SMTP adresi olarak kullanmayın!** Sonra başıma bela açacaksınız yok E-postam gitti, Sude E-postamı yedi vs. Fazla uzatmadan botun kurulumuna geçmek istiyorum ama **#help** kanalında edeceğiniz tacizleri düşündüğümde önceden açıklamak daha iyi olur bu bot (ve benim diğer bütün botlarım) **eğik çizgi** komutlarıyla geliyor. Normal komut yükleyicileri yerine de **geliştirilmiş GCommands V9**'u kullanıyorum. (En azından bu botta bu versiyon en sonuncu versiyon.) Yani istersen GCommands kullanmayıp kendi botuna komutları kopyalayabilirsin **umrumdışı**. Yine de benim bu botu azıcık uzucuk içi dolu kuzucuk kıvamında değiştirip yeni bir bot yaptığını sanıp videosunu falan çekme beni de telif hakkı ile uğraştırma.

## SMTP Ayarlama
> SMTP ayarlaması yapmak için bazı prosedürleri incelememiz gerekiyor. Ben Gmail'i kullanıyorum. Kullandığımız **Nodemailer** modülü daha az güvenli uygulamalardan birisi sayıldığından dolayı **yeni açacağınız ve SMTP servisi olarak kullanacağınız E-posta**'nızda ayarlardan devre dışı bırakmanız gereken bir seçenek var. [Bu adresten](https://www.google.com/settings/u/2/security/lesssecureapps) daha az güvenli uygulamalar için erişimi açmayı unutmayın.

![SMTP](https://www.hostinger.web.tr/rehberler/wp-content/uploads/sites/6/2017/04/s1-3.png)
Ayarlar dosyasında bulunan e-posta ayarlamasını şu şekilde yapabilirsiniz;

```
"emailDefs": {
"host": "smtp.gmail.com",
"port": 587,
"secureType": false,
"auth": {
"user": "Tam Gmail Adresiniz. (Mesela test@gmail.com gibi.)",
"password": "Tam Gmail Şifreniz (Mesela 12345 gibi.)"
	}
}
```

Daha sonra bu bot MySQL kullandığı için (*MongoDB'ye dönüştürmeyin kalbinizi kırarım.*) MySQL ayarlamalarını yapmanız gerekiyor. MySQL hakkında bilgi ve ayarlamalar için [bu adresi](https://github.com/sudis/mysql) ziyaret edebilirsiniz.

En sonunda da bütün ayarlar dosyanızı doldurun. `Nodemon` kullandığı için `nodemon main` komutu ile başlatabilirsiniz.

> Bu bot eğik çizgi yetkilerine ihtiyaç duyar. Yani Oauth üstünden sunucuda bu botun eğik çizgi komutlarını oluşturmasına izin vermeyi unutmayın.

Daha bir şey yok yazsam çok yazardım da üşendim. Bot içinden bir kaç fotoğraf bırakıyorum inceleyin falan işte. 

![Ne baktın](https://cdn.discordapp.com/attachments/908605415854587915/944355989606506566/Ekran_Resmi_2022-02-18_23.13.10.png)
![enter image description here](https://cdn.discordapp.com/attachments/908605415854587915/944356371883782164/Ekran_Resmi_2022-02-18_23.14.26.png)
## Meraklısına
> Kan sömürücü hırsızların buraya kadar okuyacağını sanmıyorum. Biraz çalışma mantığından bahsetmek istiyorum. E-posta onaylama işleminin çok saçma olduğunu söyleyerek başlamalıyım. Bir e-posta belirtmek için `/verify send <email>` komutunu kullanıyorsunuz. Bu komut veritabanına işleniyor. Durum ise `PENDING` olarak bekliyor. Eğer beş dakika içinde hiçbir onaylama işlemi yapmazsanız (pozitif yönden yani durumu `VERIFIED`'e çevirmezseniz) otomatik olarak veritabanından e-posta kayıdınız siliniyor. 

> Diyelim ki `test@test.com` e-postasını girdiniz. Fakat sonradan anladınız ki bu e-postayı yanlış yazmışsınız. Bu durumda tekrar `/verify send <email>` komutunu kullanabilirsiniz. Bu şekilde veritabanında bulunan `test@test.com` e-postanız otomatik olarak belirttiğiniz ikinci e-postaya çevriliyor. (Zamanınız da tekrardan sıfırlanıyor.) Burada tekrar bir ama diyecek olursak; ben `superarabalar@mesla.com` e-postasını yazdım. Ancak bu e-postaya sahip değilim başka birisinin e-postasını kayıt olmasın diye kendim tutmaya çalışıyorum. Bu e-posta onaylanmadığı için beş dakika sonunda silinecek ve asıl sahibi için alınabilir hale gelecek. Evet bu sistemi zor kullanabilir miyiz? Bir sapık her beş dakikada bir komut yazdırarak sahibi olmadığı e-postayı tutabilir fakat bu günümüzde bile zor ve milyonlar içeren sunuculardan bahsetmiyoruz. 

> Beş dakikada silinme durumu hem e-posta veritabanını gereksiz çöplerden kurtarıyor hem de üstteki durumlardan bir nebze kurtarıyor. SMTP konusuna gelecek olursak kendinize ait bir şirket e-postanız veya SMTP yapılandırmanız yoksa Gmail baya kurtarıcı oluyor. Yine de API'yi zorlamanızı tavsiye etmem. Olabildiğince bütün bugları kapatmaya çalıştım yine de birisini görürseniz bildirmekten çekinmeyin.

## Kaynakça
SMTP ayarlamaları için fotoğrafı [bu adresten](https://www.hostinger.web.tr) aldım.
E-posta için HTML tasarımını [bu adresten](https://bbbootstrap.com/snippets/confirm-account-email-template-17848137) aldım.
Serendia Squad sunucusuna [bu adresten](https://discord.gg/serendia) katılabilirsiniz.
GCommands'ı sevdin mi? [buradan](https://npmjs.com/package/gcommands) incelemelisin.

## Teşekkürler
Kendime teşekkür ediyorum harika birisiyim. Üstteki kaynakçaya da teşekkür ediyorum.
