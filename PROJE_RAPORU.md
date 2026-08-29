# Proje Raporu: TaskFlow - Modern Görev Yöneticisi

## 1. Proje Özeti
Bu proje, Web Geliştirme Eğitimi Yönergesi kapsamında hazırlanan, kullanıcıların günlük görevlerini organize edebilecekleri modern bir Görev Yöneticisi (Task Manager) uygulamasıdır. Projenin temel amacı; modern web geliştirme kütüphanelerini kullanarak bileşen bazlı (component-based) mimariyi kavramak ve fonksiyonel bir CRUD (Ekle, Oku, Güncelle, Sil) uygulaması geliştirmektir.

**Canlı Uygulama:** [TaskFlow Netlify](https://statuesque-rugelach-463ea1.netlify.app)
**Kaynak Kodlar:** [GitHub Repository](https://github.com/hasancan78/task-manager)

---

## 2. Kullanılan Teknolojiler ve Araçlar

Projede sektör standartlarında en güncel teknolojiler tercih edilmiştir:

*   **Çatı (Framework/Library):** ReactJS (v19)
*   **Derleyici / Geliştirme Ortamı:** Vite (Hızlı HMR ve build süreçleri için)
*   **Stil (CSS) Framework'ü:** Tailwind CSS (v4) - Utility-first yaklaşımı ile hızlı ve esnek tasarım.
*   **Yönlendirme (Routing):** React Router DOM (v7) - Sayfalar arası SPA (Single Page Application) geçişleri için.
*   **Veri Kalıcılığı:** Tarayıcı LocalStorage API (Sayfa yenilendiğinde verilerin kaybolmaması için custom hook kullanıldı).
*   **Sürüm Kontrolü ve Yayına Alma:** Git & GitHub, Netlify (CI/CD süreçleri ile entegre).

---

## 3. Karşılanan Proje İsterleri (Gereksinim Analizi)

Eğitim yönergesinde belirtilen tüm maddeler eksiksiz olarak yerine getirilmiştir:
1.  **Modern Kütüphane Seçimi:** ReactJS kullanıldı.
2.  **Veri Yönetimi:** LocalStorage kullanılarak verilerin kalıcılığı sağlandı.
3.  **Proje Klasör Mimarisi:** İstenildiği gibi `Components`, `Pages`, ve `Interfaces` klasörleri oluşturuldu.
4.  **Tasarım Çerçevesi:** Tailwind CSS entegre edilerek modern bir UI tasarlandı.
5.  **Fonksiyonalite:** TODO App formatında; görev ekleme, listeleme, güncelleme ve silme (CRUD) adımları tamamlandı.
6.  **Canlı Yayın:** Proje build edilerek Netlify üzerinden internete açıldı.

---

## 4. Proje Mimarisi ve Dosya Yapısı

Proje, genişletilebilir ve sürdürülebilir bir yapıda "Component-Based" mimariyle tasarlanmıştır:

```text
src/
├── Components/         # Tekrar kullanılabilir (Reusable) UI bileşenleri
│   ├── Navbar.jsx      # Üst navigasyon çubuğu
│   ├── TaskForm.jsx    # Yeni görev ekleme formu (Açılır/Kapanır)
│   ├── TaskCard.jsx    # Tekil görev gösterim kartı
│   ├── TaskList.jsx    # Görevleri listeleyen ana taşıyıcı
│   ├── SearchFilter.jsx# Arama ve Aktif/Tamamlanan filtreleme alanı
│   ├── Modal.jsx       # Silme/Düzenleme onay pencereleri
│   ├── StatsBar.jsx    # Görev istatistikleri ve ilerleme çubuğu
│   └── EmptyState.jsx  # Görev olmadığında gösterilen boş durum
├── Pages/              # Sayfa (Route) bileşenleri
│   ├── HomePage.jsx    # Ana uygulama sayfası (CRUD işlemlerinin merkezi)
│   └── AboutPage.jsx   # Proje detaylarını içeren "Hakkında" sayfası
├── Interfaces/         # Sabitler ve Veri Tipleri
│   └── taskTypes.js    # Öncelik, Kategori ve Filtre sabitleri
├── hooks/              # Custom React Hook'ları
│   └── useLocalStorage.js # LocalStorage veri yönetimi
├── App.jsx             # Ana Uygulama Düzeni ve React Router yapılandırması
├── main.jsx            # React Entry Point (Giriş noktası)
└── index.css           # Tailwind ve özel CSS ayarları (Scrollbar vb.)
```

---

## 5. Uygulama Özellikleri (Features)

*   **Tam Kapsamlı CRUD İşlemleri:** Görevlere başlık, açıklama, öncelik (Düşük, Orta, Yüksek) ve kategori atanabilir. Görevler düzenlenebilir, tamamlandı olarak işaretlenebilir ve tamamen silinebilir.
*   **Dinamik Filtreleme ve Arama:** Görevler metin bazlı aranabilir, "Tümü", "Aktif" ve "Tamamlanan" şeklinde filtrelenebilir.
*   **İstatistik Takibi:** Toplam görev sayısı, tamamlanan ve devam eden görevler anlık olarak istatistik çubuğunda (StatsBar) görselleştirilir. İlerleme yüzdesi bir progress bar ile sunulur.
*   **Premium UI/UX (Kullanıcı Deneyimi):**
    *   **Dark Mode & Glassmorphism:** Arka plan bulanıklığı (backdrop-blur) ve modern karanlık tema ile premium bir görünüm.
    *   **Animasyonlar:** Hover (üzerine gelme) durumlarında scale (büyüme), pürüzsüz renk geçişleri ve formların açılıp kapanmasında yumuşak animasyonlar.
    *   **Tam Duyarlı (Responsive) Tasarım:** Mobil, tablet ve masaüstü cihazlara tam uyumlu arayüz.
*   **Güvenli Silme İşlemleri:** Yanlışlıkla silmeleri engellemek için özel tasarlanmış Modal yapısı.

---

## 6. Sonuç

Bu proje ile React'in temel (useState, useEffect) ve ileri (Custom Hooks, Component Composition) özellikleri başarılı bir şekilde uygulanmıştır. State yönetimi ve prop drilling gibi kavramlar tecrübe edilmiş, modern CSS (Tailwind) ile hızlı ve etkili arayüz geliştirme pratikleri kazanılmıştır. Uygulama, tam donanımlı ve üretime hazır (production-ready) bir formattadır.
