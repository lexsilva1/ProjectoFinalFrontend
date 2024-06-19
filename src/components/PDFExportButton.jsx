import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDFExportButton = ({ contentRef }) => {
    const exportToPDF = () => {
        const input = contentRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('dashboard.pdf');
            });
    };

    return (
        <div>
            <button onClick={exportToPDF}>Export Statistics (PDF)</button>
        </div>
    );
};

export default PDFExportButton;