import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {
  const token = localStorage.getItem("token");
  const message = "Silahkan login terlebih dahulu";
  if (!token) {
    return <Navigate to="/admin/login" state={{ message: message }} />;
  }

  return children;
}