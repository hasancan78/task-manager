# 📝 TaskFlow - Modern Görev Yöneticisi & PWA

Modern web teknolojileri ile geliştirilmiş, kullanıcıların günlük görevlerini organize edebilecekleri, istatistiklerini görebilecekleri ve tüm verilerini tarayıcıda kalıcı olarak saklayabilecekleri **yerel (native) mobil uygulama hissi veren** gelişmiş bir Görev Yöneticisi uygulamasıdır.

🌐 **Canlı Demo:** [TaskFlow'u İnceleyin](https://statuesque-rugelach-463ea1.netlify.app/)

---

## ✨ Temel Özellikler
* **Tam Kapsamlı CRUD İşlemleri:** Görev ekleme, listeleme, detaylı düzenleme ve güvenli silme onayı.
* **Kategorizasyon ve Öncelik:** Görevlere (Düşük/Orta/Yüksek) öncelik ve (Kişisel/İş/Sağlık vb.) kategoriler atama.
* **Dinamik Filtreleme ve Arama:** Görevler içinde metin bazlı anlık arama ve Aktif/Tamamlanan durumuna göre filtreleme.
* **İstatistik ve İlerleme:** Toplam, aktif, tamamlanan görev sayılarının ve yaklaşan hatırlatıcıların anlık takibi. İlerleme çubuğu (Progress bar).
* **Premium Tasarım:** Dark mode, Glassmorphism (buzlu cam efekti) ve akıcı animasyonlar ile 2024 standartlarında üst düzey kullanıcı deneyimi (UX).

## 🚀 Gelişmiş Özellikler (Premium)
* **PWA (Progressive Web App):** Uygulama tarayıcıdan (Safari/Chrome) tek tıkla masaüstü veya mobil cihazlara yüklenebilir. URL çubuğu olmadan tam ekran, gerçek bir uygulama gibi çalışır.
* **Çevrimdışı (Offline) Destek:** İnternet bağlantısı olmasa dahi kullanılabilir.
* **Çoklu Hatırlatıcı Sistemi:** Bir göreve birden fazla (örn: 1 gün önce, 1 saat önce, tam zamanında) hatırlatıcı eklenebilir. 
* **Özel Alarm Sesi & Web Audio API:** Kullanıcı kendi görevine özel MP3/WAV alarm sesi yükleyebilir. Eğer yüklenmezse uygulama Web Audio API ile oluşturulmuş, dışarıdan dosya gerektirmeyen standart dijital alarm sesini çalar.
* **Push Notifications (Sistem Bildirimleri):** Service Worker sayesinde uygulama arka planda çalışırken bile zamanı gelen görevler için cihazın bildirim paneline uyarı gönderir.

---

## 🛠️ Kullanılan Teknolojiler

* **Kütüphane:** React 19 (Component-Based Mimari)
* **Geliştirme Ortamı:** Vite & vite-plugin-pwa
* **Stillendirme:** Tailwind CSS v4
* **Yönlendirme:** React Router v7
* **Veritabanı & Durum Yönetimi:** LocalStorage & IndexedDB (Service Worker ile offline veri senkronizasyonu)

---

## 📂 Proje Yapısı

* `src/Components/` - Tekrar kullanılabilir UI bileşenleri (Navbar, Modal, TaskForm, TaskCard vb.)
* `src/Pages/` - Sayfa bileşenleri (HomePage, AboutPage)
* `src/Interfaces/` - Sabitler ve Veri Tipleri (taskTypes.js)
* `src/hooks/` - Custom React Hook'ları (useLocalStorage, useNotificationScheduler, useInstallPrompt)
* `src/utils/` - Yardımcı fonksiyonlar (reminderDB.js, notificationSound.js)
* `src/sw.js` - Özelleştirilmiş arka plan Service Worker (Bildirim motoru)
* `src/App.jsx` - Ana Uygulama Düzeni ve React Router yapılandırması
* `src/main.jsx` - React Entry Point ve SW Kaydı

---

## 🚀 Yerelde Çalıştırma (Kurulum)

1. **Depoyu Klonlama:** 
   ```bash
   git clone https://github.com/hasancan78/task-manager.git
   ```
2. **Proje Dizinine Geçiş:** 
   ```bash
   cd task-manager
   ```
3. **Bağımlılıkları Yükleme:** (Node.js v20+ gerektirir)
   ```bash
   npm install
   ```
4. **Geliştirme Sunucusunu Başlatma:** 
   ```bash
   npm run dev
   ```
