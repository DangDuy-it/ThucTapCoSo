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

  // Log để debug
  console.log("--- Guard Debug ---");
  console.log("Location pathname:", location.pathname);
  console.log("Stored User:", storedUser ? JSON.parse(storedUser) : "Not found");
  console.log("Token exists:", !!token);

  // 1. Định nghĩa các đường dẫn công khai (không cần đăng nhập)
  const publicPaths = [
    "/", // Trang chủ
    "/dang-anime",
    "/the-loai/:name", // Lưu ý: React Router sẽ khớp /the-loai/abc
    "/login",
    "/register",
    "/movie/:id/episode/:episodeNumber", // Player phim có thể công khai hoặc không tùy ý bạn
    "/movies/search",
    "/movies/favorites", // Danh sách yêu thích có thể công khai, nhưng thường thì cần user
    "/movieDetail/:id",
    "/movies/watch-history", // Lịch sử xem thường cần user
  ];

  // Hàm kiểm tra xem đường dẫn có khớp với một trong các publicPaths không
  const isPublicPath = publicPaths.some(path => {
    if (path.includes(':')) {
      const regexPath = new RegExp(`^${path.replace(/:[a-zA-Z0-9_]+/g, '[^/]+')}$`);
      return regexPath.test(location.pathname);
    }
    return location.pathname === path;
  });

  // Nếu đường dẫn hiện tại là công khai, cho phép truy cập ngay lập tức
  if (isPublicPath) {
    console.log("Guard: Public path, allowing access without authentication/authorization check.");
    // Nếu người dùng đã đăng nhập mà cố vào login/register, điều hướng họ về trang chủ
    if (token && (location.pathname === "/login" || location.pathname === "/register")) {
      console.log("Guard: Logged in user trying to access login/register, redirecting to /");
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // 2. Kiểm tra token (xác thực)
  if (!token) {
    console.log("Guard: Not a public path and no token found, redirecting to /login");
    // Lưu lại đường dẫn hiện tại để sau khi đăng nhập có thể quay lại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra thông tin người dùng (sau khi có token)
  if (!storedUser) {
    console.log("Guard: Token exists but no user info, redirecting to /login (clearing token and user data)");
    localStorage.removeItem("token"); // Xóa token cũ
    localStorage.removeItem("user"); // Xóa user cũ
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(storedUser);
  const { role_id } = user;

  // Xác định các loại route dựa trên tiền tố
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isContentManagerRoutePrefix = location.pathname.startsWith("/content"); // Sử dụng prefix cho dễ quản lý
  const isTechnicalRoute = location.pathname.startsWith("/technical");

  console.log("User role ID:", role_id);
  console.log("Is Admin Route (prefix /admin):", isAdminRoute);
  console.log("Is Content Manager Route (prefix /content):", isContentManagerRoutePrefix);
  console.log("Is Technical Route (prefix /technical):", isTechnicalRoute);

  // 4. Logic điều hướng dựa trên vai trò (phân quyền)
  switch (Number(role_id)) {
    case ROLES.ADMIN: // Admin (role 1)
      // Admin có thể truy cập mọi route
      console.log("Guard: Admin, access granted to all routes.");
      return children;

    case ROLES.CONTENT_MANAGER: // Content Manager (role 3)
      // Content Manager có quyền truy cập:
      // - Các route /content/*
      // - Các route /admin/* liên quan đến quản lý phim (/admin/manage-movie, /admin/edit, /admin/add, /admin/search-movies)
      if (isContentManagerRoutePrefix) {
        console.log("Guard: Content Manager on /content/* route, allowed.");
        return children;
      }
      if (isAdminRoute) {
        // Kiểm tra các route admin cụ thể mà content_manager được phép
        if (location.pathname.startsWith("/admin/manage-movie") ||
            location.pathname.startsWith("/admin/edit") ||
            location.pathname.startsWith("/admin/add") ||
            location.pathname.startsWith("/admin/search-movies")) {
          console.log("Guard: Content Manager on specific /admin/* route, allowed.");
          return children;
        } else {
          // Content Manager cố gắng vào các route /admin/* khác không được phép
          console.log("Guard: Content Manager on restricted /admin/* route, redirecting to /.");
          return <Navigate to="/" replace />;
        }
      }
      // Nếu không phải admin route, không phải content route, tức là user route, cho phép
      console.log("Guard: Content Manager on user route, allowed.");
      return children;

    case ROLES.TECHNICAL: // Technical (role 2)
      if (isTechnicalRoute) {
        console.log("Guard: Technical on /technical route, allowed.");
        return children;
      }
      // Technical không được vào các route admin hoặc content_manager
      if (isAdminRoute || isContentManagerRoutePrefix) {
        console.log("Guard: Technical on admin/content_manager route, redirecting to /.");
        return <Navigate to="/" replace />;
      }
      // Nếu không phải route đặc quyền nào khác, tức là user route, cho phép
      console.log("Guard: Technical on user route, allowed.");
      return children;

    case ROLES.USER: // User thường (role 4)
      // User thường chỉ được vào các route không phải admin, content, technical
      if (isAdminRoute || isContentManagerRoutePrefix || isTechnicalRoute) {
        console.log("Guard: User on admin/content/technical route, redirecting to /.");
        return <Navigate to="/" replace />;
      }
      console.log("Guard: User on user route, allowed.");
      return children;

    default: // Vai trò không xác định hoặc không hợp lệ
      console.log("Guard: Unknown role, redirecting to / (and clearing token/user)");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/" replace />;
  }
}