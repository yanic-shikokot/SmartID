import { useEffect, useState } from "react";
import { generateQRDataURL } from "@/services/qrService";
import { GraduationCap } from "lucide-react";

export default function StudentIDCard({ student }) {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    if (student?.id) {
      generateQRDataURL(student.id).then(setQrUrl);
    }
  }, [student?.id]);

  if (!student) return null;

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg print:shadow-none"
      style={{ width: "320px", minHeight: "200px" }}
    >
      <div className="bg-primary-900 px-4 py-3 flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-white shrink-0" />
        <div>
          <p className="text-white font-bold text-sm leading-tight">SmartID</p>
          <p className="text-primary-300 text-xs">School Management System</p>
        </div>
      </div>

      <div className="flex gap-3 p-4">
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-bold text-gray-900 text-sm leading-tight">
            {student.fullName}
          </p>
          <p className="text-xs text-gray-500">{student.admissionNo}</p>
          <div className="pt-1 space-y-0.5">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Class:</span> {student.class}
            </p>
            {student.gender && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Gender:</span> {student.gender}
              </p>
            )}
            {student.parentPhone && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Emergency:</span>{" "}
                {student.parentPhone}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center gap-1">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Student QR Code"
              className="w-20 h-20 rounded"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">Loading...</span>
            </div>
          )}
          <p className="text-xs text-gray-400 text-center">Scan to verify</p>
        </div>
      </div>

      <div className="bg-primary-50 px-4 py-2 border-t border-primary-100">
        <p className="text-xs text-primary-700 text-center font-medium">
          STUDENT IDENTIFICATION CARD
        </p>
      </div>
    </div>
  );
}
