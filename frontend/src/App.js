import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
