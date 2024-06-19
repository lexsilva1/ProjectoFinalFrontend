import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDFExportButton = ({ contentRef }) => {
    const exportToPDF = () => {
        const input = contentRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('dashboard.pdf');
            });
    };

    return (
        <div className="text-center my-4">
            <button onClick={exportToPDF} className="btn btn-primary">Export Statistics (PDF)</button>
        </div>
    );
};

export default PDFExportButton;
