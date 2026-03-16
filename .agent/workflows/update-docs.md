---
description: Cập nhật tài liệu sau khi thay đổi code
---

# Workflow: Cập nhật tài liệu sau thay đổi code

Sau mỗi lần thay đổi code đáng kể, thực hiện các bước sau để giữ tài liệu luôn chính xác.

## Bước 1: Xác định loại thay đổi

Xác định thay đổi thuộc loại nào:
- **Tính năng mới** (thêm file, component, chức năng mới)
- **Thay đổi logic** (sửa cách tính toán, thay đổi API)
- **UI/UX** (thay đổi giao diện, animation)
- **Sửa lỗi** (bug fix)
- **Cấu hình** (vite.config, tsconfig, package.json)

## Bước 2: Cập nhật CHANGELOG.md

// turbo
Mở file `CHANGELOG.md` và thêm entry mới vào **đầu file** (dưới dòng tiêu đề) với định dạng:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### ✨ Thêm mới
- ...

### 🔧 Thay đổi
- ...

### 🐛 Sửa lỗi
- ...
```

Quy tắc tăng version:
- Tính năng mới → tăng MINOR (1.1.0 → 1.2.0)
- Sửa lỗi nhỏ → tăng PATCH (1.1.0 → 1.1.1)
- Thay đổi lớn → tăng MAJOR (1.1.0 → 2.0.0)

## Bước 3: Cập nhật README.md nếu cần

Cập nhật các phần trong `README.md` phù hợp với thay đổi:

- **Tính năng mới** → Cập nhật mục "Tính năng"
- **File/folder mới** → Cập nhật mục "Cấu trúc dự án"
- **Hàm/logic mới** → Cập nhật mục "Chức năng chi tiết"
- **Provider/model mới** → Cập nhật mục "AI Providers"
- **Dependency mới** → Cập nhật mục "Cài đặt & Chạy"
- **Roadmap item hoàn thành** → Đổi `[ ]` → `[x]` trong "Lộ trình phát triển"

Cập nhật badge version ở đầu README nếu version thay đổi:
```
![Version](https://img.shields.io/badge/version-X.Y.Z-orange)
```

## Bước 4: Commit với message rõ ràng

Commit toàn bộ thay đổi bao gồm cả docs:

```bash
git add .
git commit -m "feat/fix/refactor: [Mô tả ngắn thay đổi]

- Chi tiết thay đổi 1
- Chi tiết thay đổi 2
- docs: cập nhật README và CHANGELOG"

git push origin main
```

**Convention commit message:**
- `feat:` — Tính năng mới
- `fix:` — Sửa lỗi
- `refactor:` — Tái cấu trúc code
- `docs:` — Chỉ cập nhật tài liệu
- `style:` — Thay đổi UI/CSS
- `chore:` — Cập nhật dependencies, cấu hình
