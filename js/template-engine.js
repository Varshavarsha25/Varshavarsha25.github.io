// ===== TEMPLATE ENGINE =====
class TemplateEngine {
    constructor() {
        this.templates = {
            professional: this.professionalTemplate,
            creative: this.creativeTemplate,
            technical: this.technicalTemplate,
            minimalist: this.minimalistTemplate
        };
    }
    
    render(formData, templateId = 'professional') {
        const previewContainer = document.getElementById('resume-preview');
        if (!previewContainer) return;
        
        const template = this.templates[templateId];
        if (!template) {
            console.error('Template not found:', templateId);
            return;
        }
        
        const html = template.call(this, formData);
        previewContainer.innerHTML = html;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    
    formatDateShort(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    splitSkills(skillsString) {
        if (!skillsString) return [];
        return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }
    
    professionalTemplate(data) {
        const { personal, experience, education, skills } = data;
        
        return `
            <div class="resume-template template-professional">
                <header class="resume-header">
                    <h1 class="resume-name">${personal.firstName} ${personal.lastName}</h1>
                    <div class="resume-contact">
                        ${personal.email ? `<span><i class="fas fa-envelope"></i> ${personal.email}</span>` : ''}
                        ${personal.phone ? `<span><i class="fas fa-phone"></i> ${personal.phone}</span>` : ''}
                        ${personal.address ? `<span><i class="fas fa-map-marker-alt"></i> ${personal.address}${personal.city ? ', ' + personal.city : ''}${personal.country ? ', ' + personal.country : ''}</span>` : ''}
                    </div>
                </header>
                
                ${personal.summary ? `
                    <section class="resume-section">
                        <div class="resume-summary">
                            <p>${personal.summary}</p>
                        </div>
                    </section>
                ` : ''}
                
                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Professional Experience</h2>
                        ${experience.map(exp => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${exp.jobTitle}</h3>
                                        <div class="item-subtitle">${exp.company}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(exp.startDate)} - ${exp.current ? 'Present' : this.formatDateShort(exp.endDate)}
                                    </div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Education</h2>
                        ${education.map(edu => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${edu.degree}</h3>
                                        <div class="item-subtitle">${edu.school}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(edu.startDate)} - ${edu.current ? 'Present' : this.formatDateShort(edu.endDate)}
                                    </div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${skills.technical || skills.soft || skills.languages ? `
                    <section class="resume-section">
                        <h2 class="section-title">Skills</h2>
                        ${skills.technical ? `
                            <div class="resume-item">
                                <h3 class="item-title">Technical Skills</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.technical).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.soft ? `
                            <div class="resume-item">
                                <h3 class="item-title">Soft Skills</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.soft).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.languages ? `
                            <div class="resume-item">
                                <h3 class="item-title">Languages</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.languages).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </section>
                ` : ''}
            </div>
        `;
    }
    
    creativeTemplate(data) {
        const { personal, experience, education, skills } = data;
        
        return `
            <div class="resume-template template-creative">
                <header class="resume-header">
                    <h1 class="resume-name">${personal.firstName} ${personal.lastName}</h1>
                    <div class="resume-contact">
                        ${personal.email ? `<span><i class="fas fa-envelope"></i> ${personal.email}</span>` : ''}
                        ${personal.phone ? `<span><i class="fas fa-phone"></i> ${personal.phone}</span>` : ''}
                        ${personal.address ? `<span><i class="fas fa-map-marker-alt"></i> ${personal.address}${personal.city ? ', ' + personal.city : ''}${personal.country ? ', ' + personal.country : ''}</span>` : ''}
                    </div>
                </header>
                
                ${personal.summary ? `
                    <section class="resume-section">
                        <div class="resume-summary">
                            <p>${personal.summary}</p>
                        </div>
                    </section>
                ` : ''}
                
                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Experience</h2>
                        ${experience.map(exp => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${exp.jobTitle}</h3>
                                        <div class="item-subtitle">${exp.company}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(exp.startDate)} - ${exp.current ? 'Present' : this.formatDateShort(exp.endDate)}
                                    </div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Education</h2>
                        ${education.map(edu => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${edu.degree}</h3>
                                        <div class="item-subtitle">${edu.school}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(edu.startDate)} - ${edu.current ? 'Present' : this.formatDateShort(edu.endDate)}
                                    </div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${skills.technical || skills.soft || skills.languages ? `
                    <section class="resume-section">
                        <h2 class="section-title">Skills & Expertise</h2>
                        ${skills.technical ? `
                            <div class="resume-item">
                                <h3 class="item-title">Technical</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.technical).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.soft ? `
                            <div class="resume-item">
                                <h3 class="item-title">Personal</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.soft).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.languages ? `
                            <div class="resume-item">
                                <h3 class="item-title">Languages</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.languages).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </section>
                ` : ''}
            </div>
        `;
    }
    
    technicalTemplate(data) {
        const { personal, experience, education, skills } = data;
        
        return `
            <div class="resume-template template-technical">
                <header class="resume-header">
                    <h1 class="resume-name">${personal.firstName} ${personal.lastName}</h1>
                    <div class="resume-contact">
                        ${personal.email ? `<span><i class="fas fa-envelope"></i> ${personal.email}</span>` : ''}
                        ${personal.phone ? `<span><i class="fas fa-phone"></i> ${personal.phone}</span>` : ''}
                        ${personal.address ? `<span><i class="fas fa-map-marker-alt"></i> ${personal.address}${personal.city ? ', ' + personal.city : ''}${personal.country ? ', ' + personal.country : ''}</span>` : ''}
                    </div>
                </header>
                
                ${personal.summary ? `
                    <section class="resume-section">
                        <div class="resume-summary">
                            <p>${personal.summary}</p>
                        </div>
                    </section>
                ` : ''}
                
                ${skills.technical ? `
                    <section class="resume-section">
                        <h2 class="section-title">Technical Stack</h2>
                        <div class="resume-item">
                            <div class="skills-list">
                                ${this.splitSkills(skills.technical).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    </section>
                ` : ''}
                
                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Work Experience</h2>
                        ${experience.map(exp => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${exp.jobTitle}</h3>
                                        <div class="item-subtitle">${exp.company}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(exp.startDate)} - ${exp.current ? 'Present' : this.formatDateShort(exp.endDate)}
                                    </div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Education</h2>
                        ${education.map(edu => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${edu.degree}</h3>
                                        <div class="item-subtitle">${edu.school}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(edu.startDate)} - ${edu.current ? 'Present' : this.formatDateShort(edu.endDate)}
                                    </div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${skills.soft || skills.languages ? `
                    <section class="resume-section">
                        <h2 class="section-title">Additional Skills</h2>
                        ${skills.soft ? `
                            <div class="resume-item">
                                <h3 class="item-title">Soft Skills</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.soft).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.languages ? `
                            <div class="resume-item">
                                <h3 class="item-title">Languages</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.languages).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </section>
                ` : ''}
            </div>
        `;
    }
    
    minimalistTemplate(data) {
        const { personal, experience, education, skills } = data;
        
        return `
            <div class="resume-template template-minimalist">
                <header class="resume-header">
                    <h1 class="resume-name">${personal.firstName} ${personal.lastName}</h1>
                    <div class="resume-contact">
                        ${personal.email ? `<span>${personal.email}</span>` : ''}
                        ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                        ${personal.address ? `<span>${personal.address}${personal.city ? ', ' + personal.city : ''}${personal.country ? ', ' + personal.country : ''}</span>` : ''}
                    </div>
                </header>
                
                ${personal.summary ? `
                    <section class="resume-section">
                        <div class="resume-summary">
                            <p>${personal.summary}</p>
                        </div>
                    </section>
                ` : ''}
                
                ${experience.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Experience</h2>
                        ${experience.map(exp => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${exp.jobTitle}</h3>
                                        <div class="item-subtitle">${exp.company}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(exp.startDate)} - ${exp.current ? 'Present' : this.formatDateShort(exp.endDate)}
                                    </div>
                                </div>
                                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${education.length > 0 ? `
                    <section class="resume-section">
                        <h2 class="section-title">Education</h2>
                        ${education.map(edu => `
                            <div class="resume-item">
                                <div class="item-header">
                                    <div>
                                        <h3 class="item-title">${edu.degree}</h3>
                                        <div class="item-subtitle">${edu.school}</div>
                                    </div>
                                    <div class="item-date">
                                        ${this.formatDateShort(edu.startDate)} - ${edu.current ? 'Present' : this.formatDateShort(edu.endDate)}
                                    </div>
                                </div>
                                ${edu.description ? `<p class="item-description">${edu.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}
                
                ${skills.technical || skills.soft || skills.languages ? `
                    <section class="resume-section">
                        <h2 class="section-title">Skills</h2>
                        ${skills.technical ? `
                            <div class="resume-item">
                                <h3 class="item-title">Technical</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.technical).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.soft ? `
                            <div class="resume-item">
                                <h3 class="item-title">Personal</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.soft).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${skills.languages ? `
                            <div class="resume-item">
                                <h3 class="item-title">Languages</h3>
                                <div class="skills-list">
                                    ${this.splitSkills(skills.languages).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </section>
                ` : ''}
            </div>
        `;
    }
    
    // Method to get HTML for PDF generation
    getTemplateHTML(data, templateId = 'professional', options = {}) {
        const template = this.templates[templateId];
        if (!template) {
            console.error('Template not found:', templateId);
            return '';
        }
        
        let html = template.call(this, data);
        
        // Add ATS-friendly class if requested
        if (options.atsOptimized) {
            html = html.replace('resume-template', 'resume-template ats-friendly');
        }
        
        return html;
    }
    
    // Method to get CSS for PDF generation
    getTemplateCSS() {
        return `
            /* Inline CSS for PDF generation */
            .resume-template {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
            }
            
            .resume-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e2e8f0;
            }
            
            .resume-name {
                font-size: 2rem;
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
                font-size: 0.9rem;
            }
            
            .resume-section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 15px;
                padding-bottom: 5px;
                border-bottom: 1px solid #cbd5e1;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .resume-item {
                margin-bottom: 20px;
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .item-title {
                font-weight: 600;
                color: #1e293b;
                font-size: 1.1rem;
                margin: 0;
            }
            
            .item-subtitle {
                color: #2563eb;
                font-weight: 500;
                margin-bottom: 5px;
            }
            
            .item-date {
                color: #64748b;
                font-size: 0.9rem;
                font-weight: 500;
                white-space: nowrap;
            }
            
            .item-description {
                color: #475569;
                line-height: 1.6;
                margin: 0;
            }
            
            .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .skill-tag {
                background: #2563eb;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }
            
            .resume-summary {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-left: 4px solid #2563eb;
            }
            
            /* Template-specific styles */
            .template-professional .resume-header {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                margin: -20px -20px 30px;
                padding: 30px 20px;
                border-bottom: none;
            }
            
            .template-professional .resume-name {
                color: white;
            }
            
            .template-professional .resume-contact {
                color: rgba(255, 255, 255, 0.9);
            }
            
            .template-professional .section-title {
                color: #2563eb;
                border-bottom-color: #2563eb;
            }
        `;
    }
}

// Make TemplateEngine available globally
window.TemplateEngine = TemplateEngine;