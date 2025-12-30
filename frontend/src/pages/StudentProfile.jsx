import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const StudentProfile = () => {
  const [student, setStudent] = useState({});
  const [attendance, setAttendance] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get("/students/profile");
        setStudent(profileRes.data);

        const attendanceRes = await axios.get("/attendance/percentage");
        setAttendance(attendanceRes.data.percentage);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Student Profile</h2>

      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        marginTop: "30px"
      }}>
        <p><b>Name:</b> {student.name}</p>
        <p><b>Roll Number:</b> {student.rollNumber}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Semester:</b> {student.semester}</p>

        <hr style={{ margin: "20px 0" }} />

        <p>
          <b>Overall Attendance:</b>{" "}
          <span style={{
            color: attendance < 75 ? "red" : "green",
            fontSize: "18px"
          }}>
            {attendance}%
          </span>
        </p>

        {attendance < 75 && (
          <p style={{ color: "red" }}>⚠ Attendance below required limit</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
