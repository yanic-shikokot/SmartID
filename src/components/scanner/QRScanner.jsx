import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    async function startScanner() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            onScan?.(decodedText);
          },
          () => {}
        );
        setStarted(true);
      } catch (err) {
        setError("Camera access denied or not available.");
        onError?.(err);
      }
    }

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        id="qr-reader"
        className="w-full max-w-sm mx-auto rounded-xl overflow-hidden"
      />
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
      {!started && !error && (
        <p className="text-sm text-gray-400 text-center">
          Starting camera...
        </p>
      )}
    </div>
  );
}
