const placeholderExamples = {
    companies: [
        'Google',
        'Microsoft',
        'Apple',
        'Amazon',
        'Meta',
        'Netflix',
        'Tesla',
        'Adobe',
        'Intel',
        'IBM'
    ],
    positions: [
        'Software Engineer',
        'Full Stack Developer',
        'Product Manager',
        'Data Scientist',
        'UX Designer',
        'DevOps Engineer',
        'AI Engineer',
        'Cloud Architect',
        'Security Engineer',
        'Mobile Developer'
    ],
    universities: [
        'Stanford University',
        'MIT',
        'Harvard University',
        'UC Berkeley',
        'Carnegie Mellon',
        'Georgia Tech',
        'Caltech',
        'University of Michigan',
        'Cornell University',
        'Princeton University'
    ],
    degrees: [
        'B.S. Computer Science',
        'M.S. Software Engineering',
        'B.Tech Information Technology',
        'M.S. Data Science',
        'B.S. Artificial Intelligence',
        'M.S. Cybersecurity',
        'B.E. Computer Engineering',
        'M.S. Machine Learning',
        'B.S. Robotics',
        'M.S. Cloud Computing'
    ],
    skills: [
        'Programming Languages',
        'Web Technologies',
        'Cloud Platforms',
        'Database Systems',
        'DevOps Tools',
        'Machine Learning',
        'Mobile Development',
        'UI/UX Design',
        'Cybersecurity',
        'Project Management'
    ],
    skillDetails: [
        'Python, Java, JavaScript, C++',
        'React, Node.js, Angular, Vue.js',
        'AWS, Azure, Google Cloud',
        'MongoDB, PostgreSQL, Redis',
        'Docker, Kubernetes, Jenkins',
        'TensorFlow, PyTorch, Scikit-learn',
        'React Native, Flutter, iOS, Android',
        'Figma, Adobe XD, Sketch',
        'Network Security, Encryption, Pentesting',
        'Agile, Scrum, JIRA'
    ]
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function updatePlaceholders() {
    const animatePlaceholder = (element, newPlaceholder) => {
        element.classList.add('placeholder-animating');
        
        // Wait for animation to reach its midpoint before changing the placeholder
        setTimeout(() => {
            element.placeholder = newPlaceholder;
        }, 600); // This timing corresponds to when the placeholder is invisible

        // Remove animation class after it's complete
        setTimeout(() => {
            element.classList.remove('placeholder-animating');
        }, 3000);
    };

    const updateElementPlaceholders = (selector, examples, prefix = 'e.g., ') => {
        document.querySelectorAll(selector).forEach(input => {
            if (!input.matches(':focus')) { // Don't update if input is focused
                const newPlaceholder = `${prefix}${getRandomItem(examples)}`;
                if (newPlaceholder !== input.placeholder) {
                    animatePlaceholder(input, newPlaceholder);
                }
            }
        });
    };

    // Update each type of input
    updateElementPlaceholders('.company', placeholderExamples.companies);
    updateElementPlaceholders('.position', placeholderExamples.positions);
    updateElementPlaceholders('.university', placeholderExamples.universities);
    updateElementPlaceholders('.degree', placeholderExamples.degrees);
    updateElementPlaceholders('.skill-category', placeholderExamples.skills);
    updateElementPlaceholders('.skills', placeholderExamples.skillDetails);
}

function previewResume() {
    const formData = collectFormData();
    const previewHtml = generatePreviewHtml(formData);
    
    const previewContainer = document.getElementById('preview');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = previewHtml;
    previewContainer.style.display = 'block';
    
    // Force a reflow before adding the show class
    previewContainer.offsetHeight;
    previewContainer.classList.add('show');
    
    // Smooth scroll to preview
    previewContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function generatePreviewHtml(formData) {
    return `
        <h1 style="text-align: center; color: black;">${formData.name}</h1>
        <div class="contact-info" style="color: black;">
            ${formData.email} | ${formData.phone} | ${formData.location}
        </div>
        
        <div class="section">
            <div class="section-title" style="color: black;">EDUCATION</div>
            ${formData.education.map(edu => `
                <div class="education-item" style="color: black;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>${edu.university}</strong>
                        <span>${edu.year}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>${edu.degree}</span>
                        <span>GPA: ${edu.gpa}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <div class="section-title" style="color: black;">EXPERIENCE</div>
            ${formData.experience.map(exp => `
                <div class="experience-item" style="color: black;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>${exp.company}</strong>
                        <span>${exp.duration}</span>
                    </div>
                    <div style="margin-bottom: 5px;"><em>${exp.position}</em></div>
                    <ul style="margin-left: 20px;">
                        <li>${exp.description}</li>
                    </ul>
                </div>
            `).join('')}
        </div>
        
        <div class="section">
            <div class="section-title" style="color: black;">SKILLS</div>
            ${formData.skills.map(skill => `
                <div class="skills-item" style="color: black;">
                    <strong>${skill.category}:</strong> ${skill.skills}
                </div>
            `).join('')}
        </div>
    `;
}

function collectFormData() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        education: Array.from(document.getElementsByClassName('education-entry')).map(entry => ({
            university: entry.querySelector('.university').value,
            degree: entry.querySelector('.degree').value,
            year: entry.querySelector('.year').value,
            gpa: entry.querySelector('.gpa').value
        })),
        experience: Array.from(document.getElementsByClassName('experience-entry')).map(entry => ({
            company: entry.querySelector('.company').value,
            position: entry.querySelector('.position').value,
            duration: entry.querySelector('.duration').value,
            description: entry.querySelector('.description').value
        })),
        skills: Array.from(document.getElementsByClassName('skills-entry')).map(entry => ({
            category: entry.querySelector('.skill-category').value,
            skills: entry.querySelector('.skills').value
        }))
    };
}

async function downloadPDF() {
    const element = document.getElementById('previewContent');
    const loading = document.getElementById('loading');
    
    if (!element.innerHTML.trim()) {
        alert('Please preview the resume first!');
        return;
    }

    try {
        loading.style.display = 'block';
        
        // Create a clone of the preview content
        const clone = element.cloneNode(true);
        clone.style.width = '8.5in';
        clone.style.backgroundColor = 'white';
        clone.style.padding = '0.5in';
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);

        // Convert to canvas
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff'
        });

        // Remove the clone
        document.body.removeChild(clone);

        // Convert to PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('resume.pdf');

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}

function addEducation() {
    const educationFields = document.getElementById('educationFields');
    const newEducation = document.createElement('div');
    newEducation.className = 'education-entry';
    newEducation.innerHTML = `
        <input type="text" placeholder="University Name" class="university" required>
        <input type="text" placeholder="Degree" class="degree" required>
        <input type="text" placeholder="Year" class="year" required>
        <input type="text" placeholder="GPA (e.g., 3.8)" class="gpa" required>
        <button type="button" class="remove-btn" onclick="removeEducation(this)">Remove</button>
    `;
    educationFields.appendChild(newEducation);
    updatePlaceholders();
}

function removeEducation(button) {
    button.parentElement.remove();
}

function addExperience() {
    const experienceFields = document.getElementById('experienceFields');
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-entry';
    newExperience.innerHTML = `
        <input type="text" placeholder="Company Name" class="company" required>
        <input type="text" placeholder="Position" class="position" required>
        <input type="text" placeholder="Duration (e.g., 2020 - Present)" class="duration" required>
        <textarea placeholder="Describe your key responsibilities and achievements" class="description" required></textarea>
        <button type="button" class="remove-btn" onclick="removeExperience(this)">Remove</button>
    `;
    experienceFields.appendChild(newExperience);
    updatePlaceholders();
}

function removeExperience(button) {
    button.parentElement.remove();
}

function addSkills() {
    const skillsFields = document.getElementById('skillsFields');
    const newSkills = document.createElement('div');
    newSkills.className = 'skills-entry';
    newSkills.innerHTML = `
        <input type="text" placeholder="Skill Category" class="skill-category" required>
        <input type="text" placeholder="Skills (comma separated)" class="skills" required>
        <button type="button" class="remove-btn" onclick="removeSkills(this)">Remove</button>
    `;
    skillsFields.appendChild(newSkills);
    updatePlaceholders();
}

function removeSkills(button) {
    button.parentElement.remove();
}

function generateLatex(formData) {
    let latex = `\\documentclass{article}
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{fontawesome}

\\pagestyle{empty}

\\begin{document}

% Name and Contact Information
\\centerline{\\huge\\bfseries ${formData.name}}
\\vspace{0.25em}
\\centerline{
    \\faEnvelope\\ \\href{mailto:${formData.email}}{${formData.email}} \\quad
    \\faPhone\\ ${formData.phone} \\quad
    \\faMapMarker\\ ${formData.location}
}

\\vspace{1em}

% Education Section
\\section*{Education}
\\hrule
\\vspace{0.5em}
`;

    // Add education entries
    formData.education.forEach(edu => {
        latex += `
{\\bf ${edu.university}} \\hfill ${edu.year}
\\\\
${edu.degree} \\hfill GPA: ${edu.gpa}
\\vspace{0.5em}
`;
    });

    // Add experience section
    latex += `
\\section*{Experience}
\\hrule
\\vspace{0.5em}
`;

    formData.experience.forEach(exp => {
        latex += `
{\\bf ${exp.company}} \\hfill ${exp.duration}
\\\\
{\\it ${exp.position}}
\\begin{itemize}
    \\item ${exp.description}
\\end{itemize}
`;
    });

    // Add skills section
    latex += `
\\section*{Skills}
\\hrule
\\vspace{0.5em}
`;

    formData.skills.forEach(skill => {
        latex += `
{\\bf ${skill.category}:} ${skill.skills}
\\\\
`;
    });

    latex += `
\\end{document}`;

    return latex;
}

document.getElementById('resumeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    const latex = generateLatex(formData);
    
    // Create a blob and download the LaTeX file
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    a.click();
    window.URL.revokeObjectURL(url);

    // Show preview after generating LaTeX
    previewResume();
});

// Add this function to handle section animations on scroll
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', handleScrollAnimations);

// Add this function for live preview updates
function updateLivePreview() {
    try {
        const formData = collectFormData();
        const previewHtml = generatePreviewHtml(formData);
        const livePreviewContent = document.getElementById('livePreviewContent');
        const livePreviewSection = document.querySelector('.live-preview-section');
        
        if (livePreviewContent && livePreviewSection) {
            livePreviewContent.innerHTML = previewHtml;
            
            if (!livePreviewSection.classList.contains('show')) {
                livePreviewSection.classList.add('show');
            }
        }
    } catch (error) {
        console.error('Error updating live preview:', error);
    }
}

// Update the event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                updateLivePreview();
            });
        });
        
        // Show live preview section
        const livePreviewSection = document.querySelector('.live-preview-section');
        if (livePreviewSection) {
            livePreviewSection.classList.add('show');
        }
    }
    
    // Initialize scroll animations
    handleScrollAnimations();

    // Initial placeholder update without animation
    document.querySelectorAll('input, textarea').forEach(input => {
        if (input.classList.contains('company')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.companies)}`;
        } else if (input.classList.contains('position')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.positions)}`;
        } else if (input.classList.contains('university')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.universities)}`;
        } else if (input.classList.contains('degree')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.degrees)}`;
        } else if (input.classList.contains('skill-category')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.skills)}`;
        } else if (input.classList.contains('skills')) {
            input.placeholder = `e.g., ${getRandomItem(placeholderExamples.skillDetails)}`;
        }
    });

    // Start the interval for placeholder updates
    let updateInterval = setInterval(updatePlaceholders, 3000);

    // Pause animations when any input is focused
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            clearInterval(updateInterval);
        });

        input.addEventListener('blur', () => {
            updateInterval = setInterval(updatePlaceholders, 3000);
        });
    });
}); 