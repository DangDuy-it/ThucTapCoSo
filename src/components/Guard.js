import { Navigate, useLocation } from "react-router-dom";

export default function Guard({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return children; // Chưa đăng nhập ⇒ cho qua

  const { role } = JSON.parse(storedUser);

  const path = location.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isContentRoute = path.startsWith("/content")||path.startsWith("/admin");
  const isTechnicalRoute = path.startsWith("/technical");

  // Quy tắc phân quyền
  if (role === "user" && (isAdminRoute || isContentRoute || isTechnicalRoute)) {
    return <Navigate to="/" replace />;
  }

  if (role === "admin" && !isAdminRoute) {
    return <Navigate to="/admin/manage-user" replace />;
  }

  if (role === "content_manager" && !isContentRoute) {
    return <Navigate to="/admin/manage-movie" replace />;
  }

  if (role === "technical" && !isTechnicalRoute) {
    return <Navigate to="/technical" replace />;
  }

  return children; // Được phép truy cập
}
