import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "@/services/studentService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddStudentForm from "@/components/students/AddStudentForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Users, Search } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    await deleteStudent(id);
    loadStudents();
  }

  const filtered = students.filter((s) =>
    `${s.fullName} ${s.admissionNo} ${s.class}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Students</h2>
            <p className="text-gray-500 text-sm mt-1">
              {students.length} student{students.length !== 1 ? "s" : ""} registered
            </p>
          </div>
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {showForm ? "Close" : "Add Student"}
          </Button>
        </div>

        {showForm && (
          <AddStudentForm
            onSuccess={() => {
              setShowForm(false);
              loadStudents();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, admission no. or class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {search ? "No students match your search" : "No students yet"}
            </p>
            <p className="text-gray-400 text-sm">
              {search ? "Try a different search term." : 'Click "Add Student" to register the first one.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">
                          {s.fullName}
                        </p>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {s.class}
                        </Badge>
                        {s.gender && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            {s.gender}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {s.admissionNo}
                      </p>
                      {s.parentName && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Parent: {s.parentName}
                          {s.parentPhone ? ` · ${s.parentPhone}` : ""}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleDelete(s.id, s.fullName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
