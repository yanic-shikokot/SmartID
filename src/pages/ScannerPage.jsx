import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QRScanner from "@/components/scanner/QRScanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ScanLine } from "lucide-react";

export default function ScannerPage() {
  const [scanning, setScanning] = useState(true);
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleScan(studentId) {
    if (loading || !scanning) return;
    setScanning(false);
    setLoading(true);
    setNotFound(false);
    setStudent(null);

    try {
      const snap = await getDoc(doc(db, "students", studentId));
      if (snap.exists()) {
        setStudent({ id: snap.id, ...snap.data() });
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStudent(null);
    setNotFound(false);
    setScanning(true);
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QR Scanner</h2>
          <p className="text-gray-500 text-sm mt-1">
            Point camera at a student ID card to look them up
          </p>
        </div>

        {scanning && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary-700">
              <ScanLine className="h-5 w-5 animate-pulse" />
              <span className="text-sm font-medium">Scanner active</span>
            </div>
            <QRScanner onScan={handleScan} />
          </div>
        )}

        {loading && (
          <div className="text-center py-8 text-gray-400">
            Looking up student...
          </div>
        )}

        {student && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Student found</span>
            </div>
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {student.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{student.admissionNo}</p>
                  </div>
                  <Badge variant="secondary">{student.class}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {student.gender && (
                    <div>
                      <p className="text-gray-400 text-xs">Gender</p>
                      <p className="font-medium">{student.gender}</p>
                    </div>
                  )}
                  {student.parentName && (
                    <div>
                      <p className="text-gray-400 text-xs">Parent/Guardian</p>
                      <p className="font-medium">{student.parentName}</p>
                    </div>
                  )}
                  {student.parentPhone && (
                    <div>
                      <p className="text-gray-400 text-xs">Emergency Contact</p>
                      <p className="font-medium">{student.parentPhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              Tap to scan another student
            </button>
          </div>
        )}

        {notFound && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Student not found</span>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl border-2 border-dashed border-red-200 text-red-400 text-sm font-medium hover:border-red-400 transition-colors"
            >
              Tap to try again
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
