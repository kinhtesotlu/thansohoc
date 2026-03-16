# Changelog — AuraNumerology

Tất cả thay đổi đáng kể của dự án được ghi lại tại đây.  
Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] — 2026-03-16

### ✨ Thêm mới
- **Multi-provider AI**: Hỗ trợ 3 nhà cung cấp AI — Google Gemini, Groq, OpenRouter
- **Settings Panel**: Modal UI cho phép chọn provider, chọn model, nhập API key và lưu vào `localStorage`
- **Badge provider**: Hiển thị provider đang active ngay trong form, click để mở Cài đặt
- **Tự động mở Settings**: Nếu chưa có API key khi bấm "Giải mã", mở Settings panel tự động
- **Toggle hiển thị key**: Nút 👁 ẩn/hiện API key trong ô nhập
- **Link lấy key**: Nút "Lấy API Key miễn phí →" cho từng provider
- **Model selection**: Dropdown chọn model cụ thể cho từng provider

### 🔧 Thay đổi
- `geminiService.ts`: Refactor thành multi-provider dispatcher, hàm `getNumerologyReading()` nhận thêm tham số `AISettings`
- `App.tsx`: Thêm component `SettingsPanel`, cập nhật loading message và AI reading header hiển thị tên provider
- Model mặc định Gemini đổi từ `gemini-3-flash-preview` → `gemini-2.0-flash`

### 📁 File mới
- `src/utils/aiProviders.ts` — Cấu hình providers, interface, hàm `loadAISettings` / `saveAISettings`

---

## [1.0.0] — 2026-03-12

### ✨ Ra mắt lần đầu
- **Số Chủ Đạo** (Life Path) — tính từ ngày sinh
- **Số Sứ Mệnh** (Expression) — tính từ toàn bộ tên
- **Số Linh Hồn** (Soul Urge) — tính từ nguyên âm trong tên
- **Số Nhân Cách** (Personality) — tính từ phụ âm trong tên
- **Năm Cá Nhân** (Personal Year) — dự báo năng lượng năm cụ thể
- **Biểu Đồ Ngày Sinh** và **Biểu Đồ Tên** (lưới 3×3)
- **Kim Tự Tháp 4 Đỉnh Cao** + 4 Thử Thách (SVG)
- Xử lý chữ **Y** thông minh theo ngữ cảnh tiếng Việt
- Tích hợp **Google Gemini AI** để tạo phân tích cá nhân hóa bằng tiếng Việt
- Giao diện **Mystical Dark** — glassmorphism, animation, responsive
- Số chủ đạo đặc biệt: giữ nguyên **11, 22, 33** không rút gọn tiếp

---

## Hướng dẫn cập nhật Changelog

Sau mỗi lần thay đổi code, thêm entry vào đầu file với định dạng:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### ✨ Thêm mới
- Mô tả tính năng mới

### 🔧 Thay đổi  
- Mô tả thay đổi so với trước

### 🐛 Sửa lỗi
- Mô tả lỗi đã sửa

### ❌ Xóa bỏ
- Mô tả tính năng đã loại bỏ
```

**Quy tắc đánh version (Semantic Versioning):**
- `MAJOR` (X): Thay đổi breaking, tái cấu trúc lớn
- `MINOR` (Y): Thêm tính năng mới backward-compatible  
- `PATCH` (Z): Sửa lỗi, cải tiến nhỏ
