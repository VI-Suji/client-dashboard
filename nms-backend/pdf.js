const fs = require('fs');
const PDFDocument = require('pdfkit');

function generatePDF(data) {
    console.log(data)
  const doc = new PDFDocument();
  doc.text(JSON.stringify(data));
  doc.save('table.pdf');
}

module.exports = generatePDF;
