import { Navigate, useLocation } from "react-router-dom";

export default function Guard({ children }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");

  const path = location.pathname;

  // Các route cấm người dùng thông thường truy cập
  const isAdminRoute = path.startsWith("/admin");
  const isContentRoute = path.startsWith("/content");
  const isTechnicalRoute = path.startsWith("/technical");

  // Nếu chưa đăng nhập → cho phép truy cập các giao diện cơ bản
  if (!storedUser) {
    // Nếu đang cố vào route quản trị thì chặn
    if (isAdminRoute || isContentRoute || isTechnicalRoute) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  const { role } = JSON.parse(storedUser);

  // Nếu là user thường → chặn vào các route nội bộ
  if (role === "user" && (isAdminRoute || isContentRoute || isTechnicalRoute)) {
    return <Navigate to="/" replace />;
  }

  // Nếu là admin → chỉ cho vào /admin/*
  if (role === "admin" && !isAdminRoute) {
    return <Navigate to="/admin/manage-user" replace />;
  }

  // Nếu là content_manager → chỉ cho vào /content/*
  if (role === "content_manager" && !isContentRoute) {
    return <Navigate to="/content/movies/all" replace />;
  }

  // Nếu là technical → chỉ cho vào /technical/*
  if (role === "technical" && !isTechnicalRoute) {
    return <Navigate to="/technical/responsed" replace />;
  }

  return children; // Được phép truy cập
}
