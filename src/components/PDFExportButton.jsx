import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Cookies from 'js-cookie'; 
import { useTranslation } from 'react-i18next';

const PDFExportButton = ({ contentRef }) => {
    const currentDate = new Date();

    // Retrieve the user's language preference from cookies
    const userLang = Cookies.get('i18nextLng') || 'en'; // Default to English if not set
    // Determine the locale based on the user's language preference
    const locale = userLang.startsWith('pt') ? 'pt-PT' : 'en-US';
    const { t } = useTranslation();

    const dateString = currentDate.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const introText = t(`This document represents the statistics of the ForgeXperimental Projects application. Printed on: ${dateString}`);

    const exportToPDF = () => {
        const input = contentRef.current;
        const originalBackground = input.style.background;
        input.style.background = 'white';
        html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'normal');
            
            const pageHeight = pdf.internal.pageSize.height;
            const marginBottom = 10;
            const yPosition = pageHeight - marginBottom;
            const lineHeight = 3;
            pdf.text(introText, 10, yPosition - 6);
            pdf.text("Empowered by Critical Software", 10, yPosition - 6 + lineHeight);
            
            const pageWidth = pdf.internal.pageSize.width;
            const rightMargin = 10;
            const contactTextLine1 = t("Contact Us:");
            const contactTextLine2 = "239 101 001";
            const contactTextLine3 = "forgexperimentalprojects@mail.com";
            const textWidth = pdf.getStringUnitWidth(contactTextLine3) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
            const xPositionText = pageWidth - textWidth - rightMargin;
            pdf.text(contactTextLine1, xPositionText, yPosition - 6);
            pdf.text(contactTextLine2, xPositionText, yPosition - 6 + lineHeight);
            pdf.text(contactTextLine3, xPositionText, yPosition - 6 + 2 * lineHeight);
            
            pdf.save('dashboard.pdf');
        });
    };

    return (
        <div className="button-export-pdf" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "40px"}}>
            <button onClick={exportToPDF} className="btn btn-primary" style={{borderRadius: "20px", padding: "10px"}}>{t("Export Statistics (PDF)")}</button>
        </div>
    );
};

export default PDFExportButton;