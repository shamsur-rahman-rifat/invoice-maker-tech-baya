import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (data) => {
  const element = document.getElementById("invoice");

  // Create a clone of the element
  const clone = element.cloneNode(true);

  // Create a temporary container to hold the clone
  // This container must be wide enough to hold the full invoice (760px)
  // and positioned off-screen to avoid flickering.
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.width = "760px"; // Force full width
  container.appendChild(clone);
  document.body.appendChild(container);

  // Ensure the clone has no transform/scaling applied
  // (We need to reach into the React component structure if scaling was applied deeply, 
  // but based on App.jsx, the scaling is on the PARENT of #invoice, so #invoice itself is clean.
  // However, just to be safe, if we copied styles that might affect it:)
  // clone.style.transform = "none"; 

  // Note: We might need to wait for images to load if they weren't already loaded, 
  // but since we are cloning an existing DOM resource, it should be fine.

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 760 // Hint to html2canvas about the viewport size
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const type =
      data.type === "invoice"
        ? "invoice"
        : data.type === "quotation"
        ? "quotation"
        : "acknowledgement";
    const timestamp = new Date().toISOString().split("T")[0];

    const customerName = data.customer
      .trim()
      .replace(/\s+/g, "_")           // spaces → _
      .replace(/[^a-zA-Z0-9_]/g, ""); // remove special chars

    const serial = data.serial
      ? String(data.serial).padStart(3, "0")
      : "XXX";

    const fileName = `${customerName}-${serial}-${type}-${timestamp}.pdf`;

    pdf.save(fileName);
  } catch (err) {
    console.error("PDF Generation failed", err);
    throw err; // Re-throw so the caller knows it failed
  } finally {
    // Clean up the temporary container
    document.body.removeChild(container);
  }
};
