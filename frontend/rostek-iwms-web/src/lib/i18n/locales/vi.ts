
import { TranslationKey } from '../types';

export const vi: Record<TranslationKey, string> = {
  // Common
  save_changes: 'Lưu thay đổi',
  cancel: 'Hủy',
  submit: 'Gửi',
  logout: 'Đăng xuất',
  login: 'Đăng nhập',
  welcome: 'Chào mừng',
  
  // Navigation & Sidebar
  dashboard: 'Bảng điều khiển',
  operator_interface: 'Giao diện người vận hành',
  inbound_outbound: 'Nhập/Xuất kho',
  warehouse_layout: 'Bố trí kho',
  robot_missions: 'Nhiệm vụ robot',
  team_management: 'Quản lý nhóm',
  user_settings: 'Cài đặt người dùng',
  system_settings: 'Cài đặt hệ thống',
  warehouse_settings: 'Cài đặt kho',
  layout_configuration: 'Cấu hình bố cục',
  storage_model_configuration: 'Cấu hình mô hình lưu trữ',
  notifications: 'Thông báo',
  help_center: 'Trung tâm trợ giúp',
  
  // User Settings
  appearance: 'Giao diện',
  dark_mode: 'Chế độ tối',
  dark_mode_description: 'Chuyển đổi giữa chủ đề sáng và tối',
  language: 'Ngôn ngữ',
  language_description: 'Chọn ngôn ngữ ưa thích của bạn',
  settings_saved: 'Đã lưu cài đặt!',
  notification_preferences: 'Tùy chọn thông báo',
  email_notifications: 'Thông báo qua email',
  email_notifications_description: 'Nhận thông báo qua email',
  push_notifications: 'Thông báo đẩy',
  push_notifications_description: 'Nhận thông báo đẩy trong trình duyệt',
  security: 'Bảo mật',
  current_password: 'Mật khẩu hiện tại',
  new_password: 'Mật khẩu mới',
  confirm_password: 'Xác nhận mật khẩu',
  update_password: 'Cập nhật mật khẩu',
  
  // Missions
  active_missions: 'Nhiệm vụ đang hoạt động',
  recent_missions: 'Nhiệm vụ gần đây',
  mission_id: 'ID Nhiệm vụ',
  robot: 'Robot',
  type: 'Loại',
  status: 'Trạng thái',
  from: 'Từ',
  to: 'Đến',
  started: 'Bắt đầu',
  finished: 'Kết thúc',
  actions: 'Thao tác',
  pause: 'Tạm dừng',
  cancel_mission: 'Hủy',
  new_mission: 'Nhiệm vụ mới',
  mission_templates: 'Mẫu nhiệm vụ',
  new_template: 'Mẫu mới',
  search_templates: 'Tìm kiếm mẫu...',
  filter: 'Lọc',
  date: 'Ngày',
  no_templates_found: 'Không tìm thấy mẫu',
  try_different_search: 'Thử từ khóa tìm kiếm khác',
  create_first_template: 'Tạo mẫu đầu tiên để bắt đầu',
  clear_search: 'Xóa tìm kiếm',
  edit: 'Chỉnh sửa',
  duplicate: 'Nhân bản',
  delete: 'Xóa',
  steps: 'Bước',
  modified: 'Đã sửa:',
  delete_template: 'Xóa mẫu',
  delete_template_confirm: 'Bạn có chắc chắn muốn xóa mẫu này? Hành động này không thể hoàn tác.',
  template_created: 'Đã tạo mẫu',
  template_created_description: 'đã được tạo thành công.',
  template_deleted: 'Đã xóa mẫu',
  template_deleted_description: 'đã được xóa.',
  edit_template: 'Chỉnh sửa mẫu',
  template_name: 'Tên mẫu',
  template_description: 'Mô tả',
  add_step: 'Thêm bước',
  remove_step: 'Xóa bước',
  save_template: 'Lưu mẫu',
  template_updated: 'Cập nhật mẫu',
  template_updated_description: 'đã được cập nhật thành công.',
  graph: 'Biểu đồ',
  visual_editor: 'Trình soạn thảo trực quan',
  settings: 'Cài đặt',
  
  // Operator Interface
  select_dock: 'Chọn khu vực',
  default_dock: 'Khu vực mặc định',
  current_location: 'Vị trí hiện tại',
  start_shift: 'Bắt đầu ca',
  end_shift: 'Kết thúc ca',
  inbound: 'Nhập kho',
  outbound: 'Xuất kho',
  history: 'Lịch sử',
  dock_history: 'Lịch sử khu vực',
  dock: 'Khu vực',
  activity: 'Hoạt động',
  scan_barcode: 'Quét mã vạch',
  enter_barcode: 'Nhập mã vạch',
  recent_activity: 'Hoạt động gần đây',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  failed: 'Thất bại',
  performance_metrics: 'Chỉ số hiệu suất',
  orders_processed: 'Đơn đã xử lý',
  avg_completion_time: 'Thời gian hoàn thành trung bình',
  today: 'Hôm nay',
  this_week: 'Tuần này',
  this_month: 'Tháng này',
  minutes_per_order: 'phút/đơn hàng',
  efficiency_rating: 'Đánh giá hiệu quả',
  excellent: 'Xuất sắc',
  good: 'Tốt',
  average: 'Trung bình',
  needs_improvement: 'Cần cải thiện',
  process_inbound: 'Xử lý nhập kho',
  process_outbound: 'Xử lý xuất kho',
  
  // Warehouse Layout
  warehouse_overview: 'Tổng quan kho',
  warehouse_zones: 'Khu vực kho',
  manage_zones: 'Quản lý các khu vực kho và cấu hình của chúng.',
  size: 'Kích thước',
  occupancy: 'Tỷ lệ lấp đầy',
  '2d_layout': 'Bố trí 2D',
  '3d_visualization': 'Hình ảnh 3D',
  rack_configurations: 'Cấu hình kệ',
  configure_racks: 'Cấu hình kệ lưu trữ và đơn vị kệ.',
  overview: 'Tổng quan',
  zones: 'Khu vực',
  racks: 'Kệ',
  to_be_implemented: 'Chức năng cấu hình kệ sẽ được triển khai sau.',
  row: 'Hàng',
  column: 'Cột',
  stored_items: 'Các mặt hàng lưu trữ',
  no_items_stored: 'Không có hàng hóa được lưu trữ ở vị trí này',
  shelf: 'Kệ',
  in_stock: 'Còn hàng',
  low_stock: 'Sắp hết',
  quantity: 'SL',
  
  // System Settings
  database_configuration: 'Cấu hình cơ sở dữ liệu',
  database_url: 'URL cơ sở dữ liệu',
  connection_pool: 'Kích thước nhóm kết nối',
  query_timeout: 'Thời gian chờ truy vấn (giây)',
  server_settings: 'Cài đặt máy chủ',
  server_port: 'Cổng máy chủ',
  environment: 'Môi trường',
  log_level: 'Mức độ ghi nhật ký',
  storage_configuration: 'Cấu hình lưu trữ',
  storage_path: 'Đường dẫn lưu trữ',
  automatic_backups: 'Sao lưu tự động',
  backup_frequency: 'Tần suất sao lưu',
  api_configuration: 'Cấu hình API',
  api_key: 'Khóa API',
  regenerate: 'Tạo lại',
  rate_limit: 'Giới hạn tốc độ (yêu cầu mỗi phút)',
  development: 'Phát triển',
  staging: 'Dàn dựng',
  production: 'Sản xuất',
  debug: 'Gỡ lỗi',
  info: 'Thông tin',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  enabled: 'Bật',
  disabled: 'Tắt',
  hourly: 'Hàng giờ',
  daily: 'Hàng ngày',
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
  reset: 'Đặt lại',
  
  // Warehouse Settings & Team Management
  team_settings: 'Cài đặt nhóm',
  warehouse_configuration: 'Cấu hình kho',
  reset_to_defaults: 'Đặt lại về mặc định',
  add_zone: 'Thêm khu vực',
  zone_name: 'Tên khu vực',
  number_of_rows: 'Số hàng',
  number_of_columns: 'Số cột',
  shelf_levels: 'Số tầng kệ',
  configured_storage_zones: 'Khu vực lưu trữ đã cấu hình',
  add_loading_dock: 'Thêm bến bốc dỡ',
  dock_name: 'Tên bến',
  dock_type: 'Loại bến',
  configured_loading_docks: 'Bến bốc dỡ đã cấu hình',
  add_dock: 'Thêm bến',
  structure_saved: 'Đã lưu cấu trúc',
  structure_saved_description: 'Cấu trúc kho của bạn đã được lưu thành công.',
  zone_added: 'Đã thêm khu vực',
  zone_added_description: 'đã được thêm vào kho.',
  zone_deleted: 'Đã xóa khu vực',
  zone_deleted_description: 'Khu vực đã chọn đã được xóa khỏi kho.',
  dock_added: 'Đã thêm bến',
  dock_added_description: 'đã được thêm vào kho.',
  dock_deleted: 'Đã xóa bến',
  dock_deleted_description: 'Bến đã chọn đã được xóa khỏi kho.',
  storage_zones: 'Khu vực lưu trữ',
  loading_docks: 'Bến bốc dỡ',
  maintenance: 'Bảo trì',
  inactive: 'Không hoạt động',
  active: 'Hoạt động',
  both: 'Cả hai',
  rows: 'hàng',
  columns: 'cột',
  levels: 'tầng',
  save_structure: 'Lưu cấu trúc',
  
  // Team Management
  user_management: 'Quản lý người dùng',
  create_user: 'Tạo người dùng',
  edit_user: 'Chỉnh sửa người dùng',
  disable_user: 'Vô hiệu hóa',
  administrator: 'Quản trị viên',
  operator: 'Người vận hành',
  manager: 'Người quản lý',
  roles_permissions: 'Vai trò & Quyền hạn',
  edit_permissions: 'Chỉnh sửa quyền',
  user_groups: 'Nhóm người dùng',
  manage_group: 'Quản lý nhóm',
  users: 'Người dùng',
  roles: 'Vai trò & Quyền hạn',
  groups: 'Nhóm',
  full_access: 'Toàn quyền truy cập vào tất cả tính năng của hệ thống',
  inventory_reports: 'Có thể quản lý kho và xem báo cáo',
  process_operations: 'Chỉ giới hạn ở xử lý hoạt động nhập/xuất kho',
  warehouse_staff: 'Nhân viên kho',
  management_team: 'Nhóm quản lý',
  it_support: 'Hỗ trợ IT',
  members: 'thành viên',
  create_role: 'Tạo vai trò',
  create_group: 'Tạo nhóm',
  
  // Help Center
  guides: 'Hướng dẫn',
  faqs: 'Câu hỏi thường gặp',
  contact_support: 'Liên hệ hỗ trợ',
  popular_guides: 'Hướng dẫn phổ biến',
  quick_answers: 'Câu trả lời nhanh',
  
  // Dashboard
  inventory_overview: 'Tổng quan kho',
  total_items: 'Tổng số mặt hàng',
  low_stock_items: 'Mặt hàng sắp hết',
  out_of_stock: 'Hết hàng',
  recent_activity_dashboard: 'Hoạt động gần đây',
  system_status: 'Trạng thái hệ thống',
  online: 'Trực tuyến',
  robots_available: 'Robot khả dụng',
  pending_orders: 'Đơn hàng đang chờ xử lý',
  recent_alerts: 'Cảnh báo gần đây',
  
  // Inbound/Outbound
  inbound_orders: 'Đơn nhập kho',
  outbound_orders: 'Đơn xuất kho',
  new_inbound_order: 'Đơn nhập kho mới',
  new_outbound_order: 'Đơn xuất kho mới',
  order_id: 'ID đơn hàng',
  supplier: 'Nhà cung cấp',
  customer: 'Khách hàng',
  items: 'Mặt hàng',
  orders: 'Đơn hàng',
  
  // Notifications
  mark_all_read: 'Đánh dấu tất cả là đã đọc',
  clear_all: 'Xóa tất cả',
  no_notifications: 'Không có thông báo',
  notification_time: 'trước'
};
