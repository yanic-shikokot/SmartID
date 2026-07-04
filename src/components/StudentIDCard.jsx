import { exportElementToPDF } from "../utils/pdf";

export default function StudentIDCard({ student }) {
  return (
    <div className="p-4 flex flex-col items-center">

      {/* ID CARD */}
      <div
        id={`id-${student.admissionNo}`}
        className="w-80 bg-white border rounded-xl shadow p-4"
      >
        <div className="text-center font-bold text-lg">
          SMARTID SCHOOL
        </div>

        <div className="mt-3 text-sm">
          <p><b>Name:</b> {student.name}</p>
          <p><b>Class:</b> {student.class}</p>
          <p><b>Admission No:</b> {student.admissionNo}</p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          This card is property of the school
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() =>
          exportElementToPDF(
            `id-${student.admissionNo}`,
            `ID_${student.admissionNo}`
          )
        }
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Download ID Card
      </button>

    </div>
  );
}
