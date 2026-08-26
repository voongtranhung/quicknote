# PRD: QuickNote — Ứng dụng ghi chú cá nhân tối giản

## 1. Tổng quan

| | |
|---|---|
| **Tên sản phẩm** | QuickNote |
| **Loại sản phẩm** | Web app (responsive) |
| **Đối tượng người dùng** | Cá nhân cần ghi chú nhanh, không cần tính năng phức tạp |
| **Mục tiêu** | Cho phép người dùng tạo, quản lý ghi chú cá nhân một cách nhanh chóng, an toàn, và đồng bộ thời gian thực trên nhiều thiết bị/tab |

## 2. Vấn đề & Giá trị mang lại

- **Vấn đề:** Các app ghi chú hiện có (Notion, Evernote...) quá nặng cho nhu cầu ghi chú đơn giản, nhanh gọn.
- **Giá trị:** QuickNote tối giản hóa trải nghiệm — đăng nhập, ghi, xem lại — với dữ liệu luôn được cập nhật tức thời (realtime) giữa các phiên/thiết bị.

## 3. Đối tượng sử dụng (User Persona)

- Người dùng cá nhân, không cần cộng tác nhóm.
- Ưu tiên tốc độ, giao diện đơn giản, không phân tâm.
- Có thể dùng trên nhiều thiết bị/trình duyệt song song (ví dụ: mở 2 tab).

## 4. Phạm vi tính năng (Scope)

### 4.1 Trong phạm vi (In-scope) — MVP

**A. Xác thực người dùng**
- Đăng ký tài khoản bằng email + mật khẩu.
- Đăng nhập bằng email + mật khẩu.
- Đăng xuất.
- Phiên đăng nhập được duy trì (session persistence).
- Xác thực email khi đăng ký (tùy chọn bật/tắt qua Supabase Auth).

**B. Quản lý ghi chú (CRUD)**
- Tạo ghi chú mới với **tiêu đề** (title) và **nội dung** (content).
- Xem danh sách toàn bộ ghi chú của người dùng đang đăng nhập.
- Xem chi tiết một ghi chú.
- Sửa (cập nhật) tiêu đề/nội dung ghi chú.
- Xóa ghi chú.
- Mỗi ghi chú chỉ thuộc về đúng 1 người dùng (không chia sẻ ở MVP).

**C. Realtime**
- Khi một ghi chú được tạo/sửa/xóa (do chính người dùng đó, ở tab/thiết bị khác), giao diện danh sách ghi chú tự cập nhật mà không cần reload trang.
- Áp dụng Supabase Realtime (subscribe theo `user_id`).

### 4.2 Ngoài phạm vi (Out-of-scope) — MVP

- Chia sẻ ghi chú với người khác / cộng tác nhiều người dùng.
- Gắn thẻ (tags), thư mục, tìm kiếm nâng cao.
- Đính kèm hình ảnh/file.
- Đăng nhập qua mạng xã hội (Google, Facebook...) — có thể cân nhắc ở phiên bản sau.
- Ứng dụng mobile native.
- Chế độ offline.

## 5. User Flow chính

1. Người dùng truy cập trang web → chưa đăng nhập → hiển thị màn hình Đăng nhập/Đăng ký.
2. Đăng ký bằng email → xác thực (nếu bật) → đăng nhập.
3. Vào màn hình chính: danh sách ghi chú (trống nếu chưa có ghi chú nào).
4. Nhấn "Tạo ghi chú mới" → nhập tiêu đề + nội dung → Lưu.
5. Ghi chú xuất hiện ngay trong danh sách (không cần reload).
6. Nhấn vào một ghi chú → xem/sửa nội dung → Lưu thay đổi.
7. Xóa ghi chú → xác nhận → ghi chú biến mất khỏi danh sách trên mọi tab đang mở.
8. Đăng xuất.

## 6. Yêu cầu chức năng (Functional Requirements)

| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-01 | Người dùng đăng ký bằng email + mật khẩu | Must |
| FR-02 | Người dùng đăng nhập bằng email + mật khẩu | Must |
| FR-03 | Người dùng đăng xuất | Must |
| FR-04 | Tạo ghi chú mới (tiêu đề, nội dung) | Must |
| FR-05 | Xem danh sách ghi chú của bản thân | Must |
| FR-06 | Xem chi tiết 1 ghi chú | Must |
| FR-07 | Sửa ghi chú | Must |
| FR-08 | Xóa ghi chú (có xác nhận) | Must |
| FR-09 | Cập nhật realtime khi dữ liệu ghi chú thay đổi | Must |
| FR-10 | Người dùng chỉ truy cập được ghi chú của chính mình | Must |

## 7. Yêu cầu phi chức năng (Non-functional Requirements)

- **Bảo mật:** Áp dụng Row Level Security (RLS) trên Supabase để đảm bảo mỗi user chỉ đọc/ghi được ghi chú của chính mình.
- **Hiệu năng:** Danh sách ghi chú tải trong < 1s với dữ liệu thông thường (< 500 ghi chú/người dùng).
- **Khả dụng:** Ứng dụng hoạt động ổn định trên các trình duyệt hiện đại (Chrome, Safari, Edge, Firefox).
- **Responsive:** Giao diện dùng tốt trên desktop và mobile web.
- **Độ trễ realtime:** Thay đổi phản ánh trên UI trong vòng ~1-2 giây.

## 8. Kiến trúc kỹ thuật đề xuất

| Thành phần | Công nghệ |
|---|---|
| Frontend + API routes | **Next.js** (App Router) |
| Authentication | **Supabase Auth** (email/password) |
| Database | **Supabase (PostgreSQL)** |
| Realtime | **Supabase Realtime** (subscribe qua Postgres Changes) |
| Hosting | **Vercel** |

### 8.1 Data Model (đề xuất)

**Bảng `notes`**

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid (PK, default gen_random_uuid()) | |
| user_id | uuid (FK → auth.users.id) | |
| title | text | |
| content | text | |
| created_at | timestamptz (default now()) | |
| updated_at | timestamptz (default now()) | tự động cập nhật khi sửa |

### 8.2 Row Level Security (RLS) — nguyên tắc

- Bật RLS trên bảng `notes`.
- Policy: user chỉ được `SELECT / INSERT / UPDATE / DELETE` các row có `user_id = auth.uid()`.

### 8.3 Realtime

- Client subscribe kênh Postgres Changes trên bảng `notes`, filter theo `user_id = eq.<current_user_id>`.
- Khi có sự kiện `INSERT / UPDATE / DELETE` → cập nhật state trên UI tương ứng.

## 9. Metrics thành công (MVP)

- Tỷ lệ đăng ký thành công / tổng số lượt bắt đầu đăng ký.
- Số ghi chú trung bình được tạo mỗi người dùng active.
- Thời gian tải trang & độ trễ cập nhật realtime.
- Tỷ lệ lỗi khi tạo/sửa/xóa ghi chú.

## 10. Rủi ro & Giả định

- **Giả định:** Người dùng dùng 1 tài khoản trên nhiều thiết bị/tab, cần đồng bộ realtime giữa các phiên đó — không phải giữa nhiều người dùng khác nhau.
- **Rủi ro:** Cấu hình RLS sai có thể lộ dữ liệu ghi chú của người dùng khác — cần test kỹ trước khi go-live.
- **Rủi ro:** Giới hạn kết nối realtime đồng thời của gói Supabase miễn phí nếu số lượng người dùng tăng nhanh.

## 11. Lộ trình sau MVP (Đề xuất, không thuộc phạm vi hiện tại)

- Tìm kiếm/lọc ghi chú.
- Gắn thẻ, sắp xếp theo thư mục.
- Đăng nhập qua Google/OAuth.
- Chia sẻ ghi chú (read-only hoặc collaborative).
- Dark mode, rich text editor.
