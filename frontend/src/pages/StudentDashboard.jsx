import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);

  // 🔹 Fetch subject-wise attendance
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/attendance/subject-wise",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAttendance(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttendance();
  }, []);

  // 🔹 Download PDF
  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/attendance/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ RETURN MUST BE INSIDE COMPONENT
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Attendance</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Total</th>
            <th>Present</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item) => (
            <tr key={item.subjectId}>
              <td>{item.subjectName}</td>
              <td>{item.totalClasses}</td>
              <td>{item.present}</td>
              <td>{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button
        onClick={downloadPDF}
        style={{
          padding: "10px 20px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Download Attendance PDF
      </button>
    </div>
  );
};

export default StudentDashboard;
