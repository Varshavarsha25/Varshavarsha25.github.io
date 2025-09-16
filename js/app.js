// ===== MAIN APPLICATION CONTROLLER =====
class ResumeBuilder {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 5;
        this.formData = this.loadFromStorage() || this.getDefaultFormData();
        this.selectedTemplate = 'professional';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadTemplates();
        this.updatePreview();
        this.setupAutoSave();
    }
    
    getDefaultFormData() {
        return {
            personal: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: '',
                summary: ''
            },
            experience: [],
            education: [],
            skills: {
                technical: '',
                soft: '',
                languages: ''
            }
        };
    }
    
    bindEvents() {
        // Navigation events
        document.getElementById('start-building')?.addEventListener('click', () => {
            this.showBuilder();
        });
        
        document.getElementById('next-step')?.addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('prev-step')?.addEventListener('click', () => {
            this.prevStep();
        });
        
        document.getElementById('generate-resume')?.addEventListener('click', () => {
            this.generateResume();
        });
        
        // Add experience/education events
        document.getElementById('add-experience')?.addEventListener('click', () => {
            this.addExperience();
        });
        
        document.getElementById('add-education')?.addEventListener('click', () => {
            this.addEducation();
        });
        
        // Form input events
        this.bindFormInputs();
        
        // Preview control events
        document.getElementById('preview-desktop')?.addEventListener('click', () => {
            this.setPreviewMode('desktop');
        });
        
        document.getElementById('preview-mobile')?.addEventListener('click', () => {
            this.setPreviewMode('mobile');
        });
        
        document.getElementById('preview-print')?.addEventListener('click', () => {
            this.setPreviewMode('print');
        });
        
        // Smooth scrolling for navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    bindFormInputs() {
        // Bind personal information inputs
        const personalInputs = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'summary'];
        personalInputs.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.formData.personal[field] = e.target.value;
                    this.updatePreview();
                });
            }
        });
        
        // Bind skills inputs
        const skillsInputs = ['technical-skills', 'soft-skills', 'languages'];
        const skillsMapping = {
            'technical-skills': 'technical',
            'soft-skills': 'soft',
            'languages': 'languages'
        };
        
        skillsInputs.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.formData.skills[skillsMapping[field]] = e.target.value;
                    this.updatePreview();
                });
            }
        });
    }
    
    showBuilder() {
        document.getElementById('hero').classList.add('hidden');
        document.getElementById('builder').classList.remove('hidden');
        this.updateFormFields();
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.updateStep();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
        }
    }
    
    updateStep() {
        // Update progress bar
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });
        
        // Update form steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const generateBtn = document.getElementById('generate-resume');
        
        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.maxSteps) {
            nextBtn.classList.add('hidden');
            generateBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            generateBtn.classList.add('hidden');
        }
        
        // Special handling for template step
        if (this.currentStep === 5) {
            this.loadTemplateSelection();
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validatePersonalInfo();
            case 2:
                return true; // Experience is optional
            case 3:
                return true; // Education is optional
            case 4:
                return true; // Skills are optional
            case 5:
                return true; // Template selection
            default:
                return true;
        }
    }
    
    validatePersonalInfo() {
        const required = ['firstName', 'lastName', 'email', 'phone'];
        let isValid = true;
        
        required.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--gray-300)';
            }
        });
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }
    
    addExperience() {
        const experience = {
            id: Date.now(),
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        
        this.formData.experience.push(experience);
        this.renderExperienceItem(experience);
        this.updatePreview();
    }
    
    addEducation() {
        const education = {
            id: Date.now(),
            degree: '',
            school: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        
        this.formData.education.push(education);
        this.renderEducationItem(education);
        this.updatePreview();
    }
    
    renderExperienceItem(experience) {
        const container = document.getElementById('experience-container');
        const item = document.createElement('div');
        item.className = 'experience-item';
        item.dataset.id = experience.id;
        
        item.innerHTML = `
            <button type="button" class="remove-btn" onclick="app.removeExperience(${experience.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" data-field="jobTitle" value="${experience.jobTitle}" required>
                </div>
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" data-field="company" value="${experience.company}" required>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" data-field="startDate" value="${experience.startDate}">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" data-field="endDate" value="${experience.endDate}" ${experience.current ? 'disabled' : ''}>
                </div>
                <div class="form-group full-width">
                    <label>
                        <input type="checkbox" data-field="current" ${experience.current ? 'checked' : ''}>
                        Currently working here
                    </label>
                </div>
                <div class="form-group full-width">
                    <label>Job Description</label>
                    <textarea data-field="description" rows="3" placeholder="Describe your responsibilities and achievements...">${experience.description}</textarea>
                </div>
            </div>
        `;
        
        container.appendChild(item);
        this.bindExperienceEvents(item, experience.id);
    }
    
    renderEducationItem(education) {
        const container = document.getElementById('education-container');
        const item = document.createElement('div');
        item.className = 'education-item';
        item.dataset.id = education.id;
        
        item.innerHTML = `
            <button type="button" class="remove-btn" onclick="app.removeEducation(${education.id})">
                <i class="fas fa-times"></i>
            </button>
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" data-field="degree" value="${education.degree}" required>
                </div>
                <div class="form-group">
                    <label>School/University *</label>
                    <input type="text" data-field="school" value="${education.school}" required>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" data-field="startDate" value="${education.startDate}">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" data-field="endDate" value="${education.endDate}" ${education.current ? 'disabled' : ''}>
                </div>
                <div class="form-group full-width">
                    <label>
                        <input type="checkbox" data-field="current" ${education.current ? 'checked' : ''}>
                        Currently studying here
                    </label>
                </div>
                <div class="form-group full-width">
                    <label>Description</label>
                    <textarea data-field="description" rows="2" placeholder="Additional details about your education...">${education.description}</textarea>
                </div>
            </div>
        `;
        
        container.appendChild(item);
        this.bindEducationEvents(item, education.id);
    }
    
    bindExperienceEvents(item, id) {
        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const experience = this.formData.experience.find(exp => exp.id === id);
                if (experience) {
                    const field = input.dataset.field;
                    if (input.type === 'checkbox') {
                        experience[field] = input.checked;
                        // Disable/enable end date based on current checkbox
                        if (field === 'current') {
                            const endDateInput = item.querySelector('[data-field="endDate"]');
                            endDateInput.disabled = input.checked;
                            if (input.checked) {
                                endDateInput.value = '';
                                experience.endDate = '';
                            }
                        }
                    } else {
                        experience[field] = input.value;
                    }
                    this.updatePreview();
                }
            });
        });
    }
    
    bindEducationEvents(item, id) {
        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const education = this.formData.education.find(edu => edu.id === id);
                if (education) {
                    const field = input.dataset.field;
                    if (input.type === 'checkbox') {
                        education[field] = input.checked;
                        // Disable/enable end date based on current checkbox
                        if (field === 'current') {
                            const endDateInput = item.querySelector('[data-field="endDate"]');
                            endDateInput.disabled = input.checked;
                            if (input.checked) {
                                endDateInput.value = '';
                                education.endDate = '';
                            }
                        }
                    } else {
                        education[field] = input.value;
                    }
                    this.updatePreview();
                }
            });
        });
    }
    
    removeExperience(id) {
        this.formData.experience = this.formData.experience.filter(exp => exp.id !== id);
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
        }
        this.updatePreview();
    }
    
    removeEducation(id) {
        this.formData.education = this.formData.education.filter(edu => edu.id !== id);
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.remove();
        }
        this.updatePreview();
    }
    
    loadTemplates() {
        // This will be handled by template-engine.js
        if (window.TemplateEngine) {
            this.templateEngine = new TemplateEngine();
        }
    }
    
    loadTemplateSelection() {
        const container = document.getElementById('template-selection');
        if (!container || container.children.length > 0) return;
        
        const templates = [
            { id: 'professional', name: 'Professional', description: 'Clean and corporate design' },
            { id: 'creative', name: 'Creative', description: 'Colorful and modern layout' },
            { id: 'technical', name: 'Technical', description: 'Perfect for developers' },
            { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' }
        ];
        
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            if (template.id === this.selectedTemplate) {
                card.classList.add('selected');
            }
            
            card.innerHTML = `
                <div class="template-preview">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h4 class="template-name">${template.name}</h4>
                <p>${template.description}</p>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedTemplate = template.id;
                this.updatePreview();
            });
            
            container.appendChild(card);
        });
    }
    
    updatePreview() {
        if (this.templateEngine) {
            this.templateEngine.render(this.formData, this.selectedTemplate);
        }
    }
    
    setPreviewMode(mode) {
        const preview = document.getElementById('resume-preview');
        preview.className = 'resume-preview';
        
        if (mode === 'mobile') {
            preview.classList.add('mobile-preview');
        } else if (mode === 'print') {
            preview.classList.add('print-preview');
        }
        
        // Update button states
        document.querySelectorAll('.preview-controls .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`preview-${mode}`).classList.add('active');
    }
    
    generateResume() {
        if (!this.validateAllSteps()) {
            return;
        }
        
        this.showLoading(true);
        
        // Use PDF generator
        if (window.PDFGenerator) {
            const pdfGenerator = new PDFGenerator();
            pdfGenerator.generate(this.formData, this.selectedTemplate)
                .then(() => {
                    this.showLoading(false);
                    this.showNotification('Resume generated successfully!', 'success');
                })
                .catch((error) => {
                    this.showLoading(false);
                    this.showNotification('Error generating resume. Please try again.', 'error');
                    console.error('PDF generation error:', error);
                });
        }
    }
    
    validateAllSteps() {
        // Basic validation
        if (!this.formData.personal.firstName || !this.formData.personal.lastName) {
            this.showNotification('Please provide your name', 'error');
            return false;
        }
        
        if (!this.formData.personal.email || !this.formData.personal.phone) {
            this.showNotification('Please provide contact information', 'error');
            return false;
        }
        
        return true;
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                }
                
                .notification-success { border-left: 4px solid var(--success-color); }
                .notification-error { border-left: 4px solid var(--danger-color); }
                .notification-info { border-left: 4px solid var(--primary-color); }
                
                .notification button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin-left: auto;
                    color: var(--gray-400);
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    setupAutoSave() {
        // Auto-save every 10 seconds
        setInterval(() => {
            this.saveToStorage();
        }, 10000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('resumeBuilderData', JSON.stringify(this.formData));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('resumeBuilderData');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
            return null;
        }
    }
    
    updateFormFields() {
        // Update personal info fields
        Object.keys(this.formData.personal).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = this.formData.personal[field];
            }
        });
        
        // Update skills fields
        document.getElementById('technical-skills').value = this.formData.skills.technical;
        document.getElementById('soft-skills').value = this.formData.skills.soft;
        document.getElementById('languages').value = this.formData.skills.languages;
        
        // Render existing experience and education
        this.formData.experience.forEach(exp => this.renderExperienceItem(exp));
        this.formData.education.forEach(edu => this.renderEducationItem(edu));
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ResumeBuilder();
});