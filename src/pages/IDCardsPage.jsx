import { useEffect, useState } from "react";
import { getStudents } from "@/services/studentService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentIDCard from "@/components/students/StudentIDCard";
import { Button } from "@/components/ui/button";
import { Printer, Users } from "lucide-react";

export default function IDCardsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ID Cards</h2>
            <p className="text-gray-500 text-sm mt-1">
              Print or save student ID cards with QR codes
            </p>
          </div>
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print All
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Generating ID cards...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No students registered</p>
            <p className="text-gray-400 text-sm">
              Add students first to generate ID cards.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 print:gap-4">
            {students.map((student) => (
              <StudentIDCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
