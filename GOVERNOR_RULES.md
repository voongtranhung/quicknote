# GOVERNOR RULES – QuickNote

## Ràng buộc tuyệt đối
1. Không gửi dữ liệu người dùng ra ngoài Supabase.
2. Không được thay đổi cấu trúc bảng `notes` mà không có backup.
3. Không sử dụng dịch vụ trả phí nếu chưa được Governor phê duyệt.

## Quyền hạn của AI
- Được phép tạo code, tạo Pull Request.
- Được phép cấu hình Supabase (tạo bảng, bật auth, bật realtime) thông qua API.

## Điều cấm
- Không được thay đổi cơ chế xác thực.
- Không được xóa dữ liệu người dùng.
