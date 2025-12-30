import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/dashboard/student", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome, {data.student.name}</h1>

      <p><b>Email:</b> {data.student.email}</p>
      <p><b>Department:</b> {data.student.department}</p>

      <hr />

      <h3>Total Subjects: {data.totalSubjects}</h3>
      <h3>Attendance: {data.attendancePercentage}%</h3>
    </div>
  );
}
