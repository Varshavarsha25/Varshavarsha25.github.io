// ===== PDF GENERATOR =====
class PDFGenerator {
    constructor() {
        this.jsPDF = window.jspdf?.jsPDF;
        if (!this.jsPDF) {
            console.error('jsPDF library not loaded');
        }
    }
    
    async generate(formData, templateId = 'professional', options = {}) {
        if (!this.jsPDF) {
            throw new Error('PDF library not available');
        }
        
        try {
            // Create template engine instance
            const templateEngine = new TemplateEngine();
            
            // Get the HTML content for the resume
            const resumeHTML = templateEngine.getTemplateHTML(formData, templateId, options);
            
            // Create a temporary container for PDF generation
            const tempContainer = this.createTempContainer(resumeHTML);
            document.body.appendChild(tempContainer);
            
            // Generate PDF using html2canvas approach
            await this.generatePDFFromHTML(tempContainer, formData);
            
            // Clean up
            document.body.removeChild(tempContainer);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }
    
    createTempContainer(html) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.left = '-10000px';
        container.style.width = '800px';
        container.style.background = 'white';
        container.style.padding = '40px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.lineHeight = '1.5';
        container.style.color = '#333';
        
        // Add inline styles for PDF
        const styles = `
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .resume-template { 
                    background: white; 
                    color: #333; 
                    font-family: Arial, sans-serif; 
                    line-height: 1.5; 
                    font-size: 14px;
                }
                .resume-header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    padding-bottom: 20px; 
                    border-bottom: 2px solid #e2e8f0; 
                }
                .resume-name { 
                    font-size: 28px; 
                    font-weight: 700; 
                    color: #1e293b; 
                    margin-bottom: 10px; 
                }
                .resume-contact { 
                    display: flex; 
                    justify-content: center; 
                    gap: 20px; 
                    flex-wrap: wrap; 
                    color: #64748b; 
                    font-size: 12px; 
                }
                .resume-contact span { display: flex; align-items: center; gap: 5px; }
                .resume-section { margin-bottom: 25px; }
                .section-title { 
                    font-size: 18px; 
                    font-weight: 600; 
                    color: #1e293b; 
                    margin-bottom: 15px; 
                    padding-bottom: 5px; 
                    border-bottom: 1px solid #cbd5e1; 
                    text-transform: uppercase; 
                    letter-spacing: 0.5px; 
                }
                .resume-item { margin-bottom: 18px; }
                .item-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-start; 
                    margin-bottom: 8px; 
                }
                .item-title { 
                    font-weight: 600; 
                    color: #1e293b; 
                    font-size: 16px; 
                    margin: 0; 
                }
                .item-subtitle { 
                    color: #2563eb; 
                    font-weight: 500; 
                    margin-bottom: 5px; 
                }
                .item-date { 
                    color: #64748b; 
                    font-size: 12px; 
                    font-weight: 500; 
                    white-space: nowrap; 
                }
                .item-description { 
                    color: #475569; 
                    line-height: 1.6; 
                    margin: 8px 0 0 0; 
                }
                .skills-list { 
                    display: flex; 
                    flex-wrap: wrap; 
                    gap: 6px; 
                }
                .skill-tag { 
                    background: #2563eb; 
                    color: white; 
                    padding: 3px 8px; 
                    border-radius: 12px; 
                    font-size: 11px; 
                    font-weight: 500; 
                    display: inline-block;
                }
                .resume-summary { 
                    background: #f8fafc; 
                    padding: 15px; 
                    border-radius: 6px; 
                    margin-bottom: 20px; 
                    border-left: 4px solid #2563eb; 
                }
                .resume-summary p { margin: 0; }
                
                /* Professional template styles */
                .template-professional .resume-header { 
                    background: linear-gradient(135deg, #2563eb, #1d4ed8); 
                    color: white; 
                    margin: -40px -40px 30px; 
                    padding: 30px 40px; 
                    border-bottom: none; 
                }
                .template-professional .resume-name { color: white; }
                .template-professional .resume-contact { color: rgba(255, 255, 255, 0.9); }
                .template-professional .section-title { 
                    color: #2563eb; 
                    border-bottom-color: #2563eb; 
                }
                
                /* Creative template styles */
                .template-creative .resume-header::after {
                    content: '';
                    display: block;
                    width: 60px;
                    height: 6px;
                    background: #d97706;
                    margin: 10px auto 0;
                    border-radius: 3px;
                }
                .template-creative .section-title {
                    background: #2563eb;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: none;
                    text-align: center;
                }
                .template-creative .resume-item {
                    background: #f8fafc;
                    padding: 15px;
                    border-radius: 6px;
                    border-left: 4px solid #2563eb;
                }
                .template-creative .skill-tag { background: #d97706; }
                
                /* Technical template styles */
                .template-technical {
                    background: #1e293b !important;
                    color: #f1f5f9 !important;
                }
                .template-technical .resume-header {
                    background: #0f172a !important;
                    color: #f1f5f9 !important;
                    border-bottom: 2px solid #2563eb;
                }
                .template-technical .resume-name {
                    color: #3b82f6 !important;
                }
                .template-technical .resume-name::before {
                    content: '> ';
                    color: #059669;
                }
                .template-technical .section-title {
                    color: #3b82f6 !important;
                    border-bottom-color: #2563eb;
                }
                .template-technical .section-title::before {
                    content: '// ';
                    color: #94a3b8;
                }
                .template-technical .item-title { color: #f1f5f9 !important; }
                .template-technical .item-subtitle { color: #3b82f6 !important; }
                .template-technical .skill-tag {
                    background: #374151 !important;
                    color: #3b82f6 !important;
                    border: 1px solid #2563eb;
                }
                .template-technical .resume-summary {
                    background: #0f172a !important;
                    border-left-color: #059669;
                }
                
                /* Minimalist template styles */
                .template-minimalist .resume-name {
                    font-weight: 300;
                    letter-spacing: 2px;
                }
                .template-minimalist .section-title {
                    font-weight: 300;
                    text-transform: none;
                    letter-spacing: 1px;
                    border-bottom: none;
                    font-size: 20px;
                }
                .template-minimalist .resume-item {
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 15px;
                }
                .template-minimalist .resume-item:last-child {
                    border-bottom: none;
                }
                .template-minimalist .skill-tag {
                    background: white;
                    color: #374151;
                    border: 1px solid #9ca3af;
                }
                .template-minimalist .resume-summary {
                    background: transparent;
                    border-left: none;
                    padding: 0;
                    font-style: italic;
                    color: #6b7280;
                }
            </style>
        `;
        
        container.innerHTML = styles + html;
        return container;
    }
    
    async generatePDFFromHTML(container, formData) {
        // Simple PDF generation without html2canvas dependency
        const pdf = new this.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Get the resume data
        const { personal } = formData;
        const fileName = `${personal.firstName}_${personal.lastName}_Resume.pdf`.replace(/\s+/g, '_');
        
        // Set up PDF formatting
        let yPosition = 20;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);
        
        // Add title
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        const nameText = `${personal.firstName} ${personal.lastName}`;
        const nameWidth = pdf.getTextWidth(nameText);
        pdf.text(nameText, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 10;
        
        // Add contact info
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const contactInfo = [];
        if (personal.email) contactInfo.push(personal.email);
        if (personal.phone) contactInfo.push(personal.phone);
        if (personal.address) {
            let address = personal.address;
            if (personal.city) address += ', ' + personal.city;
            if (personal.country) address += ', ' + personal.country;
            contactInfo.push(address);
        }
        
        contactInfo.forEach(info => {
            const infoWidth = pdf.getTextWidth(info);
            pdf.text(info, (pageWidth - infoWidth) / 2, yPosition);
            yPosition += 5;
        });
        
        yPosition += 5;
        
        // Add line
        pdf.setDrawColor(200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        
        // Add summary if exists
        if (personal.summary) {
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
            yPosition += 8;
            
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'normal');
            const summaryLines = pdf.splitTextToSize(personal.summary, contentWidth);
            pdf.text(summaryLines, margin, yPosition);
            yPosition += summaryLines.length * 5 + 10;
        }
        
        // Add experience
        if (formData.experience && formData.experience.length > 0) {
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
            }
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
            yPosition += 8;
            
            formData.experience.forEach(exp => {
                if (yPosition > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(11);
                pdf.setFont(undefined, 'bold');
                pdf.text(exp.jobTitle || 'Job Title', margin, yPosition);
                
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(0, 100, 200);
                pdf.text(exp.company || 'Company', margin, yPosition + 5);
                
                pdf.setTextColor(100);
                const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
                const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
                const dateRange = `${startDate} - ${endDate}`;
                const dateWidth = pdf.getTextWidth(dateRange);
                pdf.text(dateRange, pageWidth - margin - dateWidth, yPosition);
                
                yPosition += 10;
                
                if (exp.description) {
                    pdf.setTextColor(0);
                    pdf.setFontSize(10);
                    const descLines = pdf.splitTextToSize(exp.description, contentWidth);
                    pdf.text(descLines, margin, yPosition);
                    yPosition += descLines.length * 4;
                }
                
                yPosition += 8;
            });
        }
        
        // Add education
        if (formData.education && formData.education.length > 0) {
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
            }
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0);
            pdf.text('EDUCATION', margin, yPosition);
            yPosition += 8;
            
            formData.education.forEach(edu => {
                if (yPosition > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                pdf.setFontSize(11);
                pdf.setFont(undefined, 'bold');
                pdf.text(edu.degree || 'Degree', margin, yPosition);
                
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(0, 100, 200);
                pdf.text(edu.school || 'School', margin, yPosition + 5);
                
                pdf.setTextColor(100);
                const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
                const endDate = edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
                const dateRange = `${startDate} - ${endDate}`;
                const dateWidth = pdf.getTextWidth(dateRange);
                pdf.text(dateRange, pageWidth - margin - dateWidth, yPosition);
                
                yPosition += 10;
                
                if (edu.description) {
                    pdf.setTextColor(0);
                    pdf.setFontSize(10);
                    const descLines = pdf.splitTextToSize(edu.description, contentWidth);
                    pdf.text(descLines, margin, yPosition);
                    yPosition += descLines.length * 4;
                }
                
                yPosition += 8;
            });
        }
        
        // Add skills
        const skills = formData.skills;
        if (skills && (skills.technical || skills.soft || skills.languages)) {
            if (yPosition > pageHeight - 40) {
                pdf.addPage();
                yPosition = 20;
            }
            
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.setTextColor(0);
            pdf.text('SKILLS', margin, yPosition);
            yPosition += 8;
            
            if (skills.technical) {
                pdf.setFontSize(10);
                pdf.setFont(undefined, 'bold');
                pdf.text('Technical Skills:', margin, yPosition);
                yPosition += 5;
                
                pdf.setFont(undefined, 'normal');
                const techSkills = pdf.splitTextToSize(skills.technical, contentWidth - 20);
                pdf.text(techSkills, margin + 10, yPosition);
                yPosition += techSkills.length * 4 + 5;
            }
            
            if (skills.soft) {
                pdf.setFont(undefined, 'bold');
                pdf.text('Soft Skills:', margin, yPosition);
                yPosition += 5;
                
                pdf.setFont(undefined, 'normal');
                const softSkills = pdf.splitTextToSize(skills.soft, contentWidth - 20);
                pdf.text(softSkills, margin + 10, yPosition);
                yPosition += softSkills.length * 4 + 5;
            }
            
            if (skills.languages) {
                pdf.setFont(undefined, 'bold');
                pdf.text('Languages:', margin, yPosition);
                yPosition += 5;
                
                pdf.setFont(undefined, 'normal');
                const languages = pdf.splitTextToSize(skills.languages, contentWidth - 20);
                pdf.text(languages, margin + 10, yPosition);
                yPosition += languages.length * 4 + 5;
            }
        }
        
        // Save the PDF
        pdf.save(fileName);
    }
    
    // Alternative method for generating different formats
    async generateHTML(formData, templateId = 'professional') {
        const templateEngine = new TemplateEngine();
        const html = templateEngine.getTemplateHTML(formData, templateId);
        const css = templateEngine.getTemplateCSS();
        
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${formData.personal.firstName} ${formData.personal.lastName} - Resume</title>
                <style>${css}</style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;
        
        return fullHTML;
    }
    
    async downloadAsHTML(formData, templateId = 'professional') {
        const html = await this.generateHTML(formData, templateId);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.personal.firstName}_${formData.personal.lastName}_Resume.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    async downloadAsText(formData) {
        const { personal, experience, education, skills } = formData;
        
        let textContent = `${personal.firstName} ${personal.lastName}\n`;
        textContent += '='.repeat(textContent.length - 1) + '\n\n';
        
        // Contact info
        if (personal.email) textContent += `Email: ${personal.email}\n`;
        if (personal.phone) textContent += `Phone: ${personal.phone}\n`;
        if (personal.address) {
            textContent += `Address: ${personal.address}`;
            if (personal.city) textContent += `, ${personal.city}`;
            if (personal.country) textContent += `, ${personal.country}`;
            textContent += '\n';
        }
        textContent += '\n';
        
        // Summary
        if (personal.summary) {
            textContent += 'PROFESSIONAL SUMMARY\n';
            textContent += '-'.repeat(20) + '\n';
            textContent += personal.summary + '\n\n';
        }
        
        // Experience
        if (experience && experience.length > 0) {
            textContent += 'PROFESSIONAL EXPERIENCE\n';
            textContent += '-'.repeat(25) + '\n';
            
            experience.forEach(exp => {
                textContent += `${exp.jobTitle || 'Job Title'}\n`;
                textContent += `${exp.company || 'Company'}\n`;
                
                const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
                const endDate = exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '');
                textContent += `${startDate} - ${endDate}\n`;
                
                if (exp.description) {
                    textContent += `${exp.description}\n`;
                }
                textContent += '\n';
            });
        }
        
        // Education
        if (education && education.length > 0) {
            textContent += 'EDUCATION\n';
            textContent += '-'.repeat(9) + '\n';
            
            education.forEach(edu => {
                textContent += `${edu.degree || 'Degree'}\n`;
                textContent += `${edu.school || 'School'}\n`;
                
                const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
                const endDate = edu.current ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '');
                textContent += `${startDate} - ${endDate}\n`;
                
                if (edu.description) {
                    textContent += `${edu.description}\n`;
                }
                textContent += '\n';
            });
        }
        
        // Skills
        if (skills && (skills.technical || skills.soft || skills.languages)) {
            textContent += 'SKILLS\n';
            textContent += '-'.repeat(6) + '\n';
            
            if (skills.technical) {
                textContent += `Technical Skills: ${skills.technical}\n`;
            }
            if (skills.soft) {
                textContent += `Soft Skills: ${skills.soft}\n`;
            }
            if (skills.languages) {
                textContent += `Languages: ${skills.languages}\n`;
            }
        }
        
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${personal.firstName}_${personal.lastName}_Resume.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Make PDFGenerator available globally
window.PDFGenerator = PDFGenerator;