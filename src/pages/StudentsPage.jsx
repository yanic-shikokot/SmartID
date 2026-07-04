import { useState } from "react";
import StudentIDCard from "../components/StudentIDCard";

export default function StudentsPage() {
  const [students] = useState([
    {
      name: "John Doe",
      class: "Grade 10",
      admissionNo: "STD001"
    },
    {
      name: "Mary Wanjiku",
      class: "Grade 9",
      admissionNo: "STD002"
    }
  ]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Students</h1>

      <div className="space-y-6">
        {students.map((student, index) => (
          <StudentIDCard key={index} student={student} />
        ))}
      </div>
    </div>
  );
}
