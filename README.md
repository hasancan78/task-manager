# 📝 TaskFlow - Modern Görev Yöneticisi

Modern web teknolojileri ile geliştirilmiş, kullanıcıların günlük görevlerini organize edebilecekleri, istatistiklerini görebilecekleri ve verilerini tarayıcıda kalıcı olarak saklayabilecekleri bir Görev Yöneticisi (Task Manager) uygulamasıdır.

🌐 **Canlı Demo:** [TaskFlow'u İnceleyin](https://statuesque-rugelach-463ea1.netlify.app)

## ✨ Özellikler

- **Tam Kapsamlı CRUD İşlemleri:** Görev ekleme, listeleme, düzenleme ve güvenli silme.
- **Kategorizasyon ve Öncelik:** Görevlere (Düşük/Orta/Yüksek) öncelik ve kişisel/iş gibi kategoriler atama.
- **Dinamik Filtreleme ve Arama:** Görevler içinde metin bazlı anlık arama ve Aktif/Tamamlanan durumuna göre filtreleme.
- **İstatistik ve İlerleme:** Toplam, aktif ve tamamlanan görev sayılarının anlık takibi ve ilerleme çubuğu.
- **Veri Kalıcılığı:** LocalStorage entegrasyonu sayesinde sayfa yenilendiğinde veri kaybı yaşanmaz.
- **Premium Tasarım:** Dark mode, Glassmorphism (buzlu cam efekti) ve akıcı animasyonlar ile geliştirilmiş kullanıcı deneyimi (UX).

## 🛠️ Kullanılan Teknolojiler

- **Kütüphane:** React 19 (Component-Based Mimari)
- **Geliştirme Ortamı:** Vite
- **Stillendirme:** Tailwind CSS v4
- **Yönlendirme:** React Router v7
- **Durum Yönetimi:** Custom React Hooks (`useLocalStorage`, vb.)

## 📂 Proje Yapısı

```text
src/
├── Components/         # Tekrar kullanılabilir UI bileşenleri (Navbar, Modal, TaskCard vb.)
├── Pages/              # Sayfa bileşenleri (HomePage, AboutPage)
├── Interfaces/         # Sabitler ve Veri Tipleri (taskTypes.js)
├── hooks/              # Custom React Hook'ları (useLocalStorage.js)
├── App.jsx             # Ana Uygulama Düzeni ve React Router yapılandırması
└── main.jsx            # React Entry Point


##Yerelde Çalıştırma (Kurulum)
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin

```text
Depoyu klonlayın:
bash


git clone https://github.com/hasancan78/task-manager.git
Proje dizinine gidin:
bash


cd task-manager
Bağımlılıkları yükleyin (Node.js v24+ gerektirir):
bash


npm install
Geliştirme sunucusunu başlatın:
bash


npm run dev
