import QRCode from "qrcode";

export async function generateQRDataURL(studentId) {
  try {
    const url = await QRCode.toDataURL(studentId, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1e3a8a",
        light: "#ffffff",
      },
    });
    return url;
  } catch (err) {
    console.error("QR generation failed:", err);
    return null;
  }
}
