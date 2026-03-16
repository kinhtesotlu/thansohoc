# 🔮 AuraNumerology — Giải Mã Thần Số Học AI

> Ứng dụng khám phá bản thân qua thần số học Pitago kết hợp trí tuệ nhân tạo, tối ưu cho người dùng Việt Nam.

![Version](https://img.shields.io/badge/version-1.1.0-orange)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![License](https://img.shields.io/badge/license-Apache--2.0-green)

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc & Luồng dữ liệu](#kiến-trúc--luồng-dữ-liệu)
- [Chức năng chi tiết](#chức-năng-chi-tiết)
- [AI Providers](#ai-providers)
- [Lộ trình phát triển](#lộ-trình-phát-triển)

---

## Giới thiệu

**AuraNumerology** là web app thần số học được xây dựng bằng React 19 + TypeScript + Vite. Ứng dụng tính toán các chỉ số thần số học theo hệ **Pitago** và sử dụng AI để tạo ra bài phân tích cá nhân hóa hoàn toàn bằng tiếng Việt.

---

## Tính năng

### 🔢 Tính toán thần số học (Hệ Pitago)

| Chỉ số | Tiếng Anh | Cách tính |
|---|---|---|
| Số Chủ Đạo | Life Path | Rút gọn (Ngày + Tháng + Năm sinh) |
| Số Sứ Mệnh | Expression | Tổng giá trị tất cả chữ cái trong tên |
| Số Linh Hồn | Soul Urge | Tổng giá trị các **nguyên âm** trong tên |
| Số Nhân Cách | Personality | Tổng giá trị các **phụ âm** trong tên |
| Năm Cá Nhân | Personal Year | Rút gọn (Ngày + Tháng sinh + Năm hiện tại) |

### 📊 Biểu đồ & Bản đồ

- **Biểu Đồ Ngày Sinh** — Lưới 3×3, đếm tần suất từng chữ số trong ngày sinh
- **Biểu Đồ Tên** — Lưới 3×3, đếm tần suất từng chữ số quy đổi từ tên
- **Kim Tự Tháp 4 Đỉnh Cao** — SVG animation, hiển thị 4 giai đoạn đỉnh cao cuộc đời
- **4 Thử Thách** — Bài học cần vượt qua tương ứng với từng đỉnh cao

### 🤖 AI Đa Provider

Hỗ trợ 3 nhà cung cấp AI (có thể chuyển đổi trong Cài đặt):

- **Google Gemini** — Chất lượng cao, hỗ trợ tiếng Việt tốt
- **Groq** ⚡ — Tốc độ phản hồi nhanh nhất (Llama 4)
- **OpenRouter** 🌐 — Tổng hợp 100+ model, nhiều model miễn phí

### 🇻🇳 Tối ưu cho tiếng Việt

- Xử lý chữ **"Y"** thông minh: tự động nhận diện là nguyên âm hay phụ âm theo ngữ cảnh
- Prompt AI được thiết kế theo văn hóa và tư duy người Việt
- Giải thích công thức tính toán minh bạch trên giao diện (tooltip)

---

## Cài đặt & Chạy

### Yêu cầu

- Node.js ≥ 18
- npm ≥ 9
- API Key từ một trong các provider AI bên dưới

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/kinhtesotlu/thansohoc.git
cd thansohoc

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (nếu dùng Gemini làm mặc định)
cp .env.example .env
# Mở .env và điền GEMINI_API_KEY của bạn

# 4. Chạy development server
npm run dev
# Truy cập: http://localhost:3000
```

### Lấy API Key miễn phí

| Provider | Link | Free Tier |
|---|---|---|
| Google Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | 15 req/phút |
| Groq | [console.groq.com/keys](https://console.groq.com/keys) | 30 req/phút |
| OpenRouter | [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys) | $1 credit miễn phí |

> 💡 API Key có thể nhập trực tiếp trong ứng dụng qua nút **⚙️ Cài đặt AI** — không cần sửa file `.env`.

---

## Cấu trúc dự án

```
thansohoc/
├── index.html                  # Entry HTML
├── vite.config.ts              # Cấu hình Vite (inject env vars)
├── tsconfig.json               # Cấu hình TypeScript
├── package.json                # Dependencies & scripts
├── .env.example                # Mẫu file môi trường
├── .gitignore                  # Loại trừ node_modules, .env, dist
│
└── src/
    ├── main.tsx                # Entry point React
    ├── App.tsx                 # Component chính + Settings Panel UI
    ├── index.css               # Global styles (Glassmorphism, fonts)
    │
    ├── utils/
    │   ├── numerology.ts       # Logic tính toán thần số học
    │   └── aiProviders.ts      # Config danh sách AI providers
    │
    └── services/
        └── geminiService.ts    # Gọi API AI (Gemini/Groq/OpenRouter)
```

---

## Kiến trúc & Luồng dữ liệu

```
User Input (tên, ngày sinh, năm)
        │
        ▼
[App.tsx: handleCalculate()]
        │
        ├──► [numerology.ts]
        │       ├── calculateLifePath()
        │       ├── calculateNameNumbers()  ← xử lý chữ Y thông minh
        │       ├── calculatePersonalYear()
        │       ├── calculatePinnacles()
        │       ├── calculateChallenges()
        │       └── calculateBirthChart()
        │               │
        │               ▼
        │         NumerologyData object
        │
        ├──► [App.tsx: setResults()] → Render UI ngay lập tức
        │
        └──► [geminiService.ts: getNumerologyReading()]
                │
                ├── Gemini  → @google/genai SDK
                ├── Groq    → fetch POST /openai/v1/chat/completions
                └── OpenRouter → fetch POST /api/v1/chat/completions
                        │
                        ▼
                 Markdown text → react-markdown → Hiển thị
```

---

## Chức năng chi tiết

### `src/utils/numerology.ts`

#### `reduceToMaster(num: number): number`
Rút gọn số bằng cách cộng các chữ số lại, giữ nguyên số chủ đạo **11, 22, 33**.

```
Input: 29 → 2+9 = 11 → trả về 11 (số chủ đạo)
Input: 28 → 2+8 = 10 → 1+0 = 1
```

#### `calculateLifePath(dob: string): number`
```
Công thức: reduceToMaster(year) + reduceToMaster(month) + reduceToMaster(day)
Input: "1990-05-15"
→ year=1990→20→2, month=5, day=15→6
→ 2 + 5 + 6 = 13 → 4
```

#### `calculateNameNumbers(fullName: string)`
Bảng mã Pitago: A=1, B=2, C=3... Z=8. Xử lý đặc biệt chữ **Y**:
- Y là **nguyên âm** nếu không có nguyên âm nào liền kề (VD: TÝ, LÝ)
- Y là **phụ âm** nếu có nguyên âm liền kề (VD: NGUYỄN, HUYỀN)

#### `calculatePinnacles(dob, lifePath)`
```
Đỉnh 1 = Ngày + Tháng       │ Giai đoạn: 0 → (36 - Số Chủ Đạo)
Đỉnh 2 = Ngày + Năm         │ Giai đoạn: tiếp theo 9 năm
Đỉnh 3 = Đỉnh 1 + Đỉnh 2   │ Giai đoạn: tiếp theo 9 năm
Đỉnh 4 = Tháng + Năm        │ Giai đoạn: còn lại
```

#### `calculateChallenges(dob)`
```
Thử thách 1 = |Tháng - Ngày|
Thử thách 2 = |Ngày - Năm|
Thử thách 3 = |Thử thách 1 - Thử thách 2|
Thử thách 4 = |Tháng - Năm|
```

### `src/utils/aiProviders.ts`

Định nghĩa interface `AIProvider` và mảng `AI_PROVIDERS` gồm 3 providers.
Exports `loadAISettings()` / `saveAISettings()` để đọc/ghi `localStorage`.

### `src/services/geminiService.ts`

Hàm `getNumerologyReading(data, settings)`:
- **Gemini**: dùng `@google/genai` SDK
- **Groq/OpenRouter**: dùng `fetch` với OpenAI-compatible API format
- Prompt tiếng Việt chuyên sâu, yêu cầu phân tích bù trừ năng lượng biểu đồ, kết quả trả về dạng Markdown

### `src/App.tsx`

**Component `SettingsPanel`**: Modal chọn provider, chọn model, nhập API key (có toggle hiện/ẩn), lưu localStorage.  
**Component `App`**: Form nhập liệu, badge provider, hiển thị kết quả (5 chỉ số, 2 biểu đồ, Kim Tự Tháp SVG, AI reading).

---

## AI Providers

### Cấu hình mặc định

| Provider | Model mặc định | Model khác |
|---|---|---|
| Gemini | `gemini-2.0-flash` | 1.5 Flash, 1.5 Pro |
| Groq | `llama-3.3-70b-versatile` | Llama 3 8B, Mixtral 8x7B |
| OpenRouter | `meta-llama/llama-4-maverick:free` | Llama 4 Scout, Gemma 3 27B, Mistral 7B, Qwen 72B |

### Cách thêm provider mới

1. Thêm object vào mảng `AI_PROVIDERS` trong `src/utils/aiProviders.ts`
2. Thêm `case` xử lý trong `getNumerologyReading()` ở `src/services/geminiService.ts`

---

## Lộ trình phát triển

- [x] Hệ thống Pitago — Tính toán đầy đủ
- [x] Multi-provider AI (Gemini, Groq, OpenRouter)
- [x] Settings Panel — nhập và lưu API key trong trình duyệt
- [ ] Hệ thống Chaldean — Đang phát triển
- [ ] Hệ thống Kabbalah — Đang phát triển
- [ ] Xuất kết quả PDF
- [ ] So sánh độ hòa hợp giữa hai người

---

*Phát triển bởi Aura Team — 2026 | [Báo lỗi](https://github.com/kinhtesotlu/thansohoc/issues)*
