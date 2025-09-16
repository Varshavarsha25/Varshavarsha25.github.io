// ===== FORM HANDLER =====
class FormHandler {
    constructor(app) {
        this.app = app;
        this.validators = {
            email: this.validateEmail,
            phone: this.validatePhone,
            required: this.validateRequired
        };
        
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupAutoComplete();
        this.setupKeyboardNavigation();
    }
    
    setupFormValidation() {
        // Real-time validation for all form inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target);
            }
        });
        
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target, true);
            }
        });
    }
    
    setupAutoComplete() {
        // Common job titles for autocomplete
        const commonJobTitles = [
            'Software Engineer',
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Product Manager',
            'Data Scientist',
            'UX Designer',
            'UI Designer',
            'DevOps Engineer',
            'Quality Assurance Engineer',
            'Business Analyst',
            'Project Manager',
            'Marketing Manager',
            'Sales Representative',
            'Customer Success Manager',
            'Operations Manager',
            'Human Resources Manager',
            'Financial Analyst',
            'Accountant',
            'Consultant'
        ];
        
        // Common companies
        const commonCompanies = [
            'Google',
            'Microsoft',
            'Apple',
            'Amazon',
            'Meta',
            'Netflix',
            'Tesla',
            'Spotify',
            'Uber',
            'Airbnb',
            'Dropbox',
            'Slack',
            'Zoom',
            'Adobe',
            'Salesforce',
            'Oracle',
            'IBM',
            'Intel',
            'NVIDIA',
            'PayPal'
        ];
        
        // Common technical skills
        const commonSkills = [
            'JavaScript',
            'Python',
            'Java',
            'C++',
            'React',
            'Vue.js',
            'Angular',
            'Node.js',
            'Express.js',
            'Django',
            'Flask',
            'Spring Boot',
            'MongoDB',
            'PostgreSQL',
            'MySQL',
            'Redis',
            'AWS',
            'Azure',
            'Google Cloud',
            'Docker',
            'Kubernetes',
            'Git',
            'CI/CD',
            'Machine Learning',
            'Data Analysis',
            'REST APIs',
            'GraphQL',
            'TypeScript',
            'HTML',
            'CSS',
            'SASS',
            'Webpack',
            'Jest',
            'Cypress'
        ];
        
        this.setupDatalist('jobTitle', commonJobTitles);
        this.setupDatalist('company', commonCompanies);
        this.setupSkillsAutocomplete('technical-skills', commonSkills);
    }
    
    setupDatalist(fieldName, suggestions) {
        const datalistId = `${fieldName}-suggestions`;
        
        // Create datalist if it doesn't exist
        if (!document.getElementById(datalistId)) {
            const datalist = document.createElement('datalist');
            datalist.id = datalistId;
            
            suggestions.forEach(suggestion => {
                const option = document.createElement('option');
                option.value = suggestion;
                datalist.appendChild(option);
            });
            
            document.body.appendChild(datalist);
        }
        
        // Add datalist to all matching fields
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll(`[data-field="${fieldName}"]`).forEach(input => {
                input.setAttribute('list', datalistId);
            });
        });
        
        // Also add to dynamically created fields
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const inputs = node.querySelectorAll(`[data-field="${fieldName}"]`);
                        inputs.forEach(input => {
                            input.setAttribute('list', datalistId);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    setupSkillsAutocomplete(fieldId, suggestions) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        // Create suggestion container
        const container = document.createElement('div');
        container.className = 'skills-autocomplete';
        container.style.cssText = `
            position: relative;
            display: none;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        
        input.parentNode.appendChild(container);
        
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            const lastComma = value.lastIndexOf(',');
            const currentInput = value.slice(lastComma + 1).trim().toLowerCase();
            
            if (currentInput.length < 2) {
                container.style.display = 'none';
                return;
            }
            
            const matches = suggestions.filter(skill => 
                skill.toLowerCase().includes(currentInput) &&
                !value.toLowerCase().includes(skill.toLowerCase())
            ).slice(0, 5);
            
            if (matches.length === 0) {
                container.style.display = 'none';
                return;
            }
            
            container.innerHTML = matches.map(skill => `
                <div class="suggestion-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">
                    ${skill}
                </div>
            `).join('');
            
            container.style.display = 'block';
            
            // Add click handlers
            container.querySelectorAll('.suggestion-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    const beforeComma = value.slice(0, lastComma + 1);
                    const afterValue = beforeComma + (beforeComma.trim() ? ' ' : '') + item.textContent + ', ';
                    input.value = afterValue;
                    input.focus();
                    container.style.display = 'none';
                    
                    // Trigger input event to update app state
                    input.dispatchEvent(new Event('input'));
                });
                
                item.addEventListener('mouseenter', () => {
                    container.querySelectorAll('.suggestion-item').forEach(el => el.style.background = '');
                    item.style.background = '#f0f0f0';
                });
            });
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !container.contains(e.target)) {
                container.style.display = 'none';
            }
        });
        
        // Handle keyboard navigation
        input.addEventListener('keydown', (e) => {
            const items = container.querySelectorAll('.suggestion-item');
            const highlighted = container.querySelector('.suggestion-item[style*="background"]');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!highlighted) {
                    items[0]?.click();
                } else {
                    const next = highlighted.nextElementSibling;
                    if (next) next.click();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (highlighted) {
                    const prev = highlighted.previousElementSibling;
                    if (prev) prev.click();
                }
            } else if (e.key === 'Enter' && highlighted) {
                e.preventDefault();
                highlighted.click();
            } else if (e.key === 'Escape') {
                container.style.display = 'none';
            }
        });
    }
    
    setupKeyboardNavigation() {
        // Allow Enter to move to next step
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.matches('input:not([type="textarea"])')) {
                e.preventDefault();
                this.app.nextStep();
            }
            
            // Allow Ctrl+Enter to generate resume
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                this.app.generateResume();
            }
        });
    }
    
    validateField(field, showErrors = false) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        const isRequired = field.hasAttribute('required');
        const fieldType = field.type;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Type-specific validation
        if (value && fieldType === 'email') {
            if (!this.validateEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (value && fieldType === 'tel') {
            if (!this.validatePhone(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Update field appearance
        this.updateFieldAppearance(field, isValid);
        
        // Show/hide error message
        if (showErrors) {
            this.showFieldError(field, isValid ? '' : errorMessage);
        }
        
        return isValid;
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone) {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        // Accept phones with 10-15 digits
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }
    
    validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    updateFieldAppearance(field, isValid) {
        if (isValid) {
            field.style.borderColor = 'var(--gray-300)';
            field.classList.remove('invalid');
        } else {
            field.style.borderColor = 'var(--danger-color)';
            field.classList.add('invalid');
        }
    }
    
    showFieldError(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message if needed
        if (message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: var(--danger-color);
                font-size: var(--text-sm);
                margin-top: var(--space-1);
                display: flex;
                align-items: center;
                gap: var(--space-1);
            `;
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            field.parentNode.appendChild(errorElement);
        }
    }
    
    // Form submission helpers
    validateCurrentStep() {
        const currentStep = document.querySelector('.form-step.active');
        if (!currentStep) return true;
        
        const fields = currentStep.querySelectorAll('input, textarea, select');
        let allValid = true;
        
        fields.forEach(field => {
            const isValid = this.validateField(field, true);
            if (!isValid) allValid = false;
        });
        
        return allValid;
    }
    
    validateAllFields() {
        const allFields = document.querySelectorAll('input, textarea, select');
        let allValid = true;
        
        allFields.forEach(field => {
            const isValid = this.validateField(field, true);
            if (!isValid) allValid = false;
        });
        
        return allValid;
    }
    
    // Format input helpers
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        
        input.value = value;
    }
    
    formatDate(input) {
        // Ensure date inputs are in YYYY-MM format for month inputs
        if (input.type === 'month') {
            const value = input.value;
            if (value && !value.match(/^\d{4}-\d{2}$/)) {
                // Try to parse and reformat
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    input.value = `${year}-${month}`;
                }
            }
        }
    }
    
    // Data persistence helpers
    saveFormData() {
        const formData = {};
        
        // Save personal info
        formData.personal = {};
        ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'summary'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                formData.personal[field] = input.value;
            }
        });
        
        // Save skills
        formData.skills = {};
        ['technical-skills', 'soft-skills', 'languages'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                const skillKey = field.replace('-skills', '').replace('languages', 'languages');
                formData.skills[skillKey] = input.value;
            }
        });
        
        // Save experience and education (these are managed by the main app)
        formData.experience = this.app.formData.experience || [];
        formData.education = this.app.formData.education || [];
        
        return formData;
    }
    
    loadFormData(data) {
        // Load personal info
        if (data.personal) {
            Object.keys(data.personal).forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.value = data.personal[field] || '';
                }
            });
        }
        
        // Load skills
        if (data.skills) {
            if (data.skills.technical) {
                const input = document.getElementById('technical-skills');
                if (input) input.value = data.skills.technical;
            }
            if (data.skills.soft) {
                const input = document.getElementById('soft-skills');
                if (input) input.value = data.skills.soft;
            }
            if (data.skills.languages) {
                const input = document.getElementById('languages');
                if (input) input.value = data.skills.languages;
            }
        }
    }
    
    // Smart suggestions
    suggestSkillsBasedOnRole(jobTitle) {
        const roleSkillMap = {
            'frontend developer': ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Vue.js', 'Angular'],
            'backend developer': ['Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Spring Boot', 'MongoDB'],
            'full stack developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'HTML', 'CSS'],
            'data scientist': ['Python', 'R', 'Machine Learning', 'Pandas', 'NumPy', 'SQL', 'TensorFlow'],
            'devops engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux'],
            'product manager': ['Product Strategy', 'Agile', 'Scrum', 'User Research', 'Analytics', 'A/B Testing'],
            'ux designer': ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
            'mobile developer': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Xamarin']
        };
        
        const normalizedRole = jobTitle.toLowerCase();
        
        for (const [role, skills] of Object.entries(roleSkillMap)) {
            if (normalizedRole.includes(role.replace(' ', ''))) {
                return skills;
            }
        }
        
        return [];
    }
    
    // Auto-suggest skills when job title is entered
    setupRoleBasedSuggestions() {
        document.addEventListener('input', (e) => {
            if (e.target.dataset.field === 'jobTitle') {
                const jobTitle = e.target.value;
                if (jobTitle.length > 3) {
                    const suggestedSkills = this.suggestSkillsBasedOnRole(jobTitle);
                    if (suggestedSkills.length > 0) {
                        this.showSkillSuggestions(suggestedSkills);
                    }
                }
            }
        });
    }
    
    showSkillSuggestions(skills) {
        const technicalSkillsInput = document.getElementById('technical-skills');
        if (!technicalSkillsInput || technicalSkillsInput.value.trim()) return;
        
        // Create a subtle suggestion tooltip
        const suggestion = document.createElement('div');
        suggestion.className = 'skill-suggestion-tooltip';
        suggestion.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 0.85rem;
            color: #0369a1;
            z-index: 100;
            margin-top: 4px;
        `;
        
        suggestion.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 4px;">
                <i class="fas fa-lightbulb"></i> Suggested skills for this role:
            </div>
            <div style="margin-bottom: 6px;">${skills.slice(0, 5).join(', ')}</div>
            <button type="button" style="background: #0ea5e9; color: white; border: none; padding: 2px 8px; border-radius: 3px; font-size: 0.8rem; cursor: pointer;">
                Add these skills
            </button>
        `;
        
        // Remove existing suggestions
        const existing = technicalSkillsInput.parentNode.querySelector('.skill-suggestion-tooltip');
        if (existing) existing.remove();
        
        // Add new suggestion
        technicalSkillsInput.parentNode.style.position = 'relative';
        technicalSkillsInput.parentNode.appendChild(suggestion);
        
        // Handle add button click
        suggestion.querySelector('button').addEventListener('click', () => {
            technicalSkillsInput.value = skills.join(', ');
            technicalSkillsInput.dispatchEvent(new Event('input'));
            suggestion.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (suggestion.parentNode) {
                suggestion.remove();
            }
        }, 10000);
    }
}

// Make FormHandler available globally
window.FormHandler = FormHandler;