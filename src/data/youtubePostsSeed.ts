import type { YouTubePostInput } from "@/lib/youtubePosts";

export const seedPosts: YouTubePostInput[] = [
  {
    slug: "what-admin-wifi-can-see-on-the-user-browsing",
    title: "What admin Wi‑Fi can see on the user browsing",
    excerpt:
      "If you’re on a network you don’t control, what can the Wi‑Fi admin actually see? A practical breakdown of DNS, HTTPS, logs, and common misconceptions — plus how to protect yourself.",
    youtubeId: "Fq6JZcBPRSk",
    tags: ["privacy", "networking", "security"],
    published: true,
    publishedAt: null,
    contentMd: `## TL;DR

On Wi‑Fi you don’t control (office, school, hotel, cafe), the admin can often see **where your device connects** (domains + timing), but usually **can’t see the content** of what you read/type when the site uses **HTTPS**—unless your device/network is set up for **HTTPS inspection**.

## What a Wi‑Fi admin can usually see

- **Your device on the network**: IP address, MAC address, and sometimes device name.
- **Connection timing**: when you connected, when you accessed services, and for how long.
- **Traffic volume**: how much data went in/out.
- **Domains you visit (often)**:
  - via DNS logs, router logs, or gateway logs.
  - “Domain” means \`example.com\`, not necessarily the exact page.

## What they usually cannot see (with normal HTTPS)

- **Page content**: messages, passwords, form fields, page text.
- **Exact pages (full URL path)** in many setups.

## The 3 real-world “gotchas”

### 1) DNS can reveal what sites you visit
Regular DNS is often visible. Using **encrypted DNS** (DoH/DoT) can reduce that visibility.

### 2) Managed networks can do HTTPS inspection
Some org networks (especially with **company-managed devices**) install a trusted certificate to intercept traffic.

### 3) Apps look noisy
Apps call many domains (CDN, analytics, APIs), so logs can look confusing—don’t over-interpret them.

## Practical ways to reduce exposure

- Use **mobile data** for sensitive sessions.
- Use a **trusted VPN**, especially on public Wi‑Fi.
- Enable **encrypted DNS** where available.
- Be cautious with **work/school-managed devices** (profiles/certificates).

## FAQ

### Can they see my passwords?
With normal HTTPS: **no**. With HTTPS inspection on a managed device: it depends.

## Watch the video
The full explanation and examples are in the video above.`,
  },
  {
    slug: "apa-yang-admin-wifi-bisa-lihat",
    title: "Apa yang admin Wi‑Fi bisa lihat",
    excerpt:
      "Kalau kamu pakai Wi‑Fi kantor/sekolah/kafe, admin jaringan itu sebenarnya bisa lihat apa? Bahas DNS, HTTPS, log, dan cara mengurangi risiko privasi dengan langkah yang realistis.",
    youtubeId: "n23GIk1c1rY",
    tags: ["privasi", "jaringan", "keamanan"],
    published: true,
    publishedAt: null,
    contentMd: `## Intinya dulu

Kalau kamu pakai **Wi‑Fi yang bukan milikmu** (kantor, sekolah, kafe, hotel), admin jaringan biasanya bisa melihat **jejak koneksi** (domain + waktu + volume data), tapi umumnya **tidak bisa melihat isi** halaman/chat/password kalau koneksi memakai **HTTPS** normal.

## Yang biasanya bisa dilihat admin Wi‑Fi

- **Perangkat kamu**: IP, MAC address, kadang nama perangkat.
- **Waktu akses**: kapan konek, kapan mulai/berhenti akses layanan.
- **Volume trafik**: kira-kira berapa MB/GB.
- **Domain yang diakses (sering)**: misalnya \`google.com\`, \`youtube.com\`.

## Yang biasanya tidak terlihat (kalau HTTPS)

- **Isi halaman** yang kamu baca.
- **Yang kamu ketik** (password, chat, isi form).
- **Halaman persisnya** (URL lengkap) pada banyak konfigurasi.

## 3 hal yang sering bikin salah paham

### 1) DNS bisa membocorkan situs yang kamu buka
DNS biasa sering terlihat. **DNS terenkripsi (DoH/DoT)** bisa mengurangi jejak domain.

### 2) “HTTPS inspection” itu kasus khusus
Di device yang dikelola kantor/sekolah, bisa ada sertifikat/profil untuk inspeksi.

### 3) Aplikasi itu “berisik”
Satu app bisa akses banyak domain (CDN, analytics, API). Jangan langsung simpulkan itu “histori lengkap”.

## Cara praktis mengurangi risiko

- Untuk hal sensitif, pakai **data seluler**.
- Pakai **VPN** yang tepercaya (terutama di Wi‑Fi publik).
- Aktifkan **DNS terenkripsi** jika ada.
- Hati-hati dengan **profil manajemen/sertifikat** di device kerja/sekolah.

## FAQ

### Admin bisa lihat password?
Normal HTTPS: **tidak**. Kalau device kamu dipasang sertifikat inspeksi: bisa berbeda.

## Tonton videonya
Penjelasan lengkap dan contoh real-nya ada di video di atas.`,
  },
  {
    slug: "cara-admin-wifi-melihat-histori",
    title: "Cara admin Wi‑Fi melihat histori",
    excerpt:
      "Banyak orang bilang admin Wi‑Fi bisa lihat “histori browsing”. Benarkah? Kita bahas apa yang bisa terlihat dari sisi jaringan (DNS, domain, timestamp) dan apa yang tidak (konten HTTPS), plus cara meminimalkan jejak.",
    youtubeId: "rNJZorRf5-8",
    tags: ["privasi", "wifi", "keamanan", "histori"],
    published: true,
    publishedAt: null,
    contentMd: `## Ringkasnya

Kalimat “admin Wi‑Fi bisa lihat histori” biasanya berarti admin bisa melihat **domain + waktu akses** dari sisi jaringan. Itu **bukan** berarti admin bisa membaca isi chat/password kamu.

## Apa yang sering terlihat dari sisi jaringan

- **Domain** yang diakses (sering dari DNS / log gateway).
- **Timestamp** akses (kapan) + **durasi**.
- **Ukuran trafik** (kira-kira pemakaian data).
- **Identitas perangkat** (IP/MAC) di jaringan tersebut.

## Apa yang biasanya tidak terlihat (kalau HTTPS)

- Isi halaman (teks, chat, password, form).
- URL lengkap sampai halaman tertentu (path/query) pada banyak setup.

## Kapan admin bisa melihat lebih detail?

### Perangkat terkelola (kantor/sekolah)
Kalau device dipasang profil/sertifikat untuk inspeksi, visibility bisa lebih tinggi.

### Trafik tidak terenkripsi
Layanan yang tidak enkripsi (jarang, tapi masih ada) lebih mudah dipantau.

## Cara aman yang realistis

- Gunakan **VPN tepercaya** saat di Wi‑Fi publik.
- Aktifkan **DNS terenkripsi (DoH/DoT)** bila tersedia.
- Untuk akun penting, pakai **data seluler** atau jaringan yang kamu percaya.

## Tonton videonya
Video di atas membahasnya dengan contoh yang mudah dipahami.`,
  },
  {
    slug: "apakah-history-web-pengguna-wifi-bisa-dilihat-oleh-pemilik-wifi",
    title: "Apakah history web pengguna Wi‑Fi bisa dilihat oleh pemilik Wi‑Fi?",
    excerpt:
      "Pertanyaan klasik: pemilik/admin Wi‑Fi bisa lihat history browsing pengguna atau tidak? Jawabannya tergantung (DNS, HTTPS, inspeksi, perangkat terkelola). Kita bedah yang bisa terlihat dan batasannya, plus tips praktis.",
    youtubeId: "lnf28RX7RzE",
    tags: ["privasi", "wifi", "history", "keamanan"],
    published: true,
    publishedAt: null,
    contentMd: `## Jawaban singkat

**Bisa, tapi terbatas.** Pemilik/admin Wi‑Fi biasanya bisa melihat **domain yang kamu akses** (dan kapan), tetapi umumnya **tidak bisa melihat isi** browsing kamu jika memakai **HTTPS**.

## “History” yang dimaksud biasanya apa?

Yang sering terlihat adalah:

- Domain (misalnya \`example.com\`)
- Timestamp (kapan kamu akses)
- Pola trafik + ukuran data

Itu sering dianggap “histori”, padahal **bukan** daftar halaman lengkap seperti di browser kamu.

## Yang biasanya tidak terlihat (HTTPS normal)

- Isi halaman / chat / password
- URL lengkap sampai halaman tertentu (path/query) di banyak setup

## Kapan visibility bisa lebih tinggi?

- **Device kantor/sekolah** (ada profil/sertifikat inspeksi)
- Layanan **tidak terenkripsi**

## Tips praktis

- Aktivitas sensitif: gunakan **data seluler** atau **VPN tepercaya**.
- Aktifkan **DNS terenkripsi** bila tersedia.
- Jangan instal **profil/sertifikat** dari jaringan yang tidak kamu percaya.

## Tonton videonya
Video di atas membahasnya dengan contoh yang mudah dipahami.`,
  },
  {
    slug: "how-the-admin-wifi-see-your-browser-history",
    title: "How the admin Wi‑Fi see your browser history",
    excerpt:
      "Can a Wi‑Fi admin see your browsing history? This post explains what’s visible on the network (DNS/domains, timestamps, traffic volume) vs what’s protected by HTTPS — plus practical steps to reduce exposure.",
    youtubeId: "k2sZ5MSf80U",
    tags: ["privacy", "wifi", "security", "browsing-history"],
    published: true,
    publishedAt: null,
    contentMd: `## TL;DR

A Wi‑Fi admin can usually see **connection metadata** (domains, timing, traffic volume), but not your **HTTPS content** (messages, passwords, form fields). The exception is **managed environments** where devices are configured for HTTPS inspection.

## What “browser history” means from the network side

From Wi‑Fi logs, “history” often looks like:

- Domains (e.g. \`example.com\`)
- Timestamps (when the connection happened)
- Data volume (how much was transferred)

It’s not the same as your browser’s full history list.

## What they can typically see

- Your device (IP, MAC, sometimes name)
- When you used services + traffic volume
- Domains you visited (often via DNS)

## What they typically cannot see (normal HTTPS)

- The content you read/type (passwords, messages, form fields)
- Full URLs (exact pages) in many setups

## When they can see more

- Managed org networks + **trusted certificate** for HTTPS inspection
- Unencrypted traffic (rarer today, but possible)

## Practical ways to reduce exposure

- Use **mobile data** for sensitive sessions
- Use a **trusted VPN** on public Wi‑Fi
- Enable **encrypted DNS** where available
- Be cautious on **work/school-managed devices**

## Watch the video
The video above walks through real scenarios and common misconceptions.`,
  },
  {
    slug: "sudah-tahukah-dirimu-berapa-literkah-dari-1-kg-beras",
    title: "Sudah tahukah dirimu berapa literkah dari 1 kg beras?",
    excerpt:
      "1 kg beras itu kira-kira berapa liter? Di video ini kita bahas cara berpikirnya, perkiraan konversi yang masuk akal, dan kenapa hasilnya bisa beda tergantung jenis beras dan cara menakar.",
    youtubeId: "TxPSSkIYv9o",
    tags: ["matematika", "konversi", "sains", "rumah-tangga"],
    published: true,
    publishedAt: null,
    contentMd: `## Intinya dulu

**1 kg** itu satuan **massa**, sedangkan **liter** itu satuan **volume**. Jadi, 1 kg beras **tidak otomatis** sama dengan 1 liter—hasilnya tergantung **densitas (kepadatan)** beras dan cara menakarnya.

## Kenapa hasil takaran bisa beda?

- **Jenis beras & ukuran butir**: ada yang lebih padat, ada yang lebih “berongga”.
- **Kadar air**: beras yang lebih lembap bisa terasa “lebih berat”.
- **Cara menakar**: dituang biasa vs dipadatkan akan berbeda volumenya.

## Cara berpikir yang benar (estimasi cepat)

Gunakan ide sederhana:

\`\`\`
volume = massa / densitas
\`\`\`

Karena densitas beras curah berbeda dari air, jangan pakai asumsi “1 kg = 1 liter”.

## Tips praktis di rumah

- Kalau butuh konsisten (mis. untuk resep), gunakan **gelas ukur yang sama** dan cara menakar yang sama.
- Untuk hitungan kasar, fokus ke **konsistensi**, bukan angka “pasti” yang selalu sama.

## Tonton videonya
Di video di atas, penjelasan langkah demi langkahnya dibuat mudah dan aplikatif.`,
  },
];

