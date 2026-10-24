import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import HrDashboard from "./pages/HrDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/employee" element={<ProtectedRoute allowedRoles={["Employee"]}><EmployeeDashboard /></ProtectedRoute>} />
    <Route path="/hr" element={<ProtectedRoute allowedRoles={["HR"]}><HrDashboard /></ProtectedRoute>} />
    <Route path="/manager" element={<ProtectedRoute allowedRoles={["Manager"]}><ManagerDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
