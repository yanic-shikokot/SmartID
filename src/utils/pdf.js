import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Export HTML element as PDF (ID cards / receipts)
 */
export const exportElementToPDF = async (elementId, fileName = "document") => {
  const element = document.getElementById(elementId);

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("portrait", "mm", "a4");

  const pageWidth = 210;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 10, pageWidth, imgHeight);

  pdf.save(`${fileName}.pdf`);
};
