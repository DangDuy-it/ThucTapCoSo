// components/Guard.js (Phiên bản đã chỉnh sửa và khuyến nghị)
import { Navigate, useLocation } from "react-router-dom";

const ROLES = {
  ADMIN: 1,
  TECHNICAL: 2,
  CONTENT_MANAGER: 3,
  USER: 4,
};

export default function Guard({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  console.log("--- Guard Debug ---");
  console.log("Location pathname:", location.pathname);
  console.log("Stored User:", storedUser ? JSON.parse(storedUser) : "Not found");
  console.log("Token exists:", !!token);

  // 1. Kiểm tra đăng nhập trước (nếu không có token, chuyển hướng về /login)
  if (!token) {
    console.log("Guard: No token found, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Nếu có token nhưng không có thông tin user, có thể là token cũ/hết hạn hoặc lỗi
  if (!storedUser) {
    console.log("Guard: Token exists but no user info, redirecting to /login (clear token)");
    localStorage.removeItem("token"); // Xóa token cũ
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(storedUser);
  const { role_id } = user;

  // Xác định các loại route dựa trên tiền tố
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isContentManagerRoute = location.pathname.startsWith("/content");
  const isTechnicalRoute = location.pathname.startsWith("/technical");
  const isLoginOrRegisterRoute = location.pathname === "/login" || location.pathname === "/register";

  // Nếu đã đăng nhập và đang ở trang login/register, điều hướng về trang chủ
  if (token && isLoginOrRegisterRoute) {
    console.log("Guard: Logged in user trying to access login/register, redirecting to /");
    return <Navigate to="/" replace />;
  }

  console.log("User role ID:", role_id);
  console.log("Is Admin Route:", isAdminRoute);
  console.log("Is Content Manager Route:", isContentManagerRoute);
  console.log("Is Technical Route:", isTechnicalRoute);

  // 3. Logic điều hướng dựa trên vai trò
  switch (Number(role_id)) {
    case ROLES.ADMIN: // Admin (role 1)
      // Admin có thể truy cập mọi route
      console.log("Guard: Admin, access granted to all routes.");
      return children;

    case ROLES.CONTENT_MANAGER: // Content Manager (role 3)
      if (isAdminRoute && !location.pathname.startsWith("/admin/manage-movie") && !location.pathname.startsWith("/admin/edit") && !location.pathname.startsWith("/admin/add") && !location.pathname.startsWith("/admin/search-movies")) {
        // Content Manager chỉ được vào các route admin cụ thể liên quan đến phim
        console.log("Guard: Content Manager on restricted admin route, redirecting to /");
        return <Navigate to="/" replace />;
      }
      if (isTechnicalRoute) {
        console.log("Guard: Content Manager on technical route, redirecting to /");
        return <Navigate to="/" replace />;
      }
      console.log("Guard: Content Manager, access granted to user, content, and specific admin routes.");
      return children;

    case ROLES.TECHNICAL: // Technical (role 2)
      if (isAdminRoute || isContentManagerRoute) {
        console.log("Guard: Technical on admin/content_manager route, redirecting to /");
        return <Navigate to="/" replace />;
      }
      console.log("Guard: Technical, access granted to user and technical routes.");
      return children;

    case ROLES.USER: // User thường (role 4)
      if (isAdminRoute || isContentManagerRoute || isTechnicalRoute) {
        console.log("Guard: User on admin/content/technical route, redirecting to /");
        return <Navigate to="/" replace />;
      }
      console.log("Guard: User, access granted to user routes.");
      return children;

    default: // Vai trò không xác định hoặc không hợp lệ
      console.log("Guard: Unknown role, redirecting to / (and clearing token)");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/" replace />;
  }
}