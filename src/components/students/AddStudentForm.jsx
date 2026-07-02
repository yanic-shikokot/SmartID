import { useState } from "react";
import { addStudent } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CLASSES = [
  "Form 1", "Form 2", "Form 3", "Form 4",
  "Grade 7", "Grade 8", "Grade 9",
];

const emptyForm = {
  fullName: "",
  admissionNo: "",
  class: "",
  parentName: "",
  parentPhone: "",
  gender: "",
};

export default function AddStudentForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.admissionNo || !form.class) {
      setError("Full name, admission number, and class are required.");
      return;
    }
    setSaving(true);
    try {
      await addStudent(form);
      setForm(emptyForm);
      onSuccess?.();
    } catch (err) {
      setError("Failed to save student. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary-700">
          Add New Student
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handle}
                placeholder="e.g. Amina Wanjiku"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionNo">Admission No. *</Label>
              <Input
                id="admissionNo"
                name="admissionNo"
                value={form.admissionNo}
                onChange={handle}
                placeholder="e.g. ADM/2024/001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <select
                id="class"
                name="class"
                value={form.class}
                onChange={handle}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
              >
                <option value="">Select class</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handle}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name</Label>
              <Input
                id="parentName"
                name="parentName"
                value={form.parentName}
                onChange={handle}
                placeholder="e.g. John Wanjiku"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent Phone (Kenyan)</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                value={form.parentPhone}
                onChange={handle}
                placeholder="e.g. 0712 345 678"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Student"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
