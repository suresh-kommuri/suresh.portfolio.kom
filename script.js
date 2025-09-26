// Resume data
const resumeData = {
    personal: {
        name: "Suresh Kommuri",
        title: "Principal Software Engineer",
        email: "suresh.kommuri222@gmail.com",
        phone: "+91 89789 90176",
        location: "Hyderabad, India",
        linkedin: "https://linkedin.com/in/suresh-kommuri-187583123",
        github: "https://github.com/suresh-kommuri",
        stackoverflow: "https://stackoverflow.com/users/6474092/suresh-kommuri"
    },
    experience: [
        {
            title: "Principal Software Engineer",
            company: "Pegasystems",
            duration: "07/2022 - Present",
            description: "Platform Engineering for Pega Infinity. Resolve complex client-facing issues and deliver feature enhancements across UI and backend. Lead initiatives around observability (tracing, logging, monitoring). Participate in Generative and Agentic AI hackathons to integrate AI into product experiences.",
            technologies: ["JavaScript", "HTML", "CSS", "Java", "Node.js", "React", "Handlebars", "AWS"]
        },
        {
            title: "Application Development Team Lead",
            company: "Accenture",
            duration: "07/2021 - 07/2022",
            description: "Frontend lead on MIPS-based healthcare projects (Withme Health, Verana Health). Built reusable React components and Redux-Saga flows.",
            technologies: ["React", "Redux", "JavaScript", "HTML5", "SCSS", "CSS3"]
        },
        {
            title: "Senior Development Engineer",
            company: "Pramati Technologies (Imaginea)",
            duration: "12/2020 - 06/2021",
            description: "Worked on web applications for Ask Media Group and Verana Health. Implemented reusable components and front-end architectures.",
            technologies: ["React", "Redux", "JavaScript", "HTML5", "SCSS", "CSS3"]
        },
        {
            title: "Product Integrations Engineer 1",
            company: "Phenom People",
            duration: "09/2017 - 12/2020",
            description: "Full‑stack development of candidate career sites with ATS integrations (Workday, Taleo). Built performant UIs and Java EE microservices; used MongoDB and Redis for storage and caching.",
            technologies: ["Java 8", "JavaScript", "React", "jQuery", "HTML5", "CSS3", "LESS", "MongoDB", "Redis", "Docker"]
        },
        {
            title: "UI Developer",
            company: "Vensoft India Pvt. Ltd",
            duration: "04/2015 - 07/2017",
            description: "Designed and developed responsive UIs for web apps.",
            technologies: ["HTML5", "CSS3", "Bootstrap", "AngularJS", "Angular", "jQuery", "JavaScript", "LESS", "SASS"]
        }
    ],
    education: [
        {
            degree: "Master of Computer Applications",
            school: "BVRIT - Narsapur",
            year: "2017",
            gpa: "75.33% (Distinction)"
        },
        {
            degree: "B.Sc. in Computer Science",
            school: "Osmania University"
        }
    ],
    certifications: [
        { name: "Certified Pega System Architect", issuer: "Pegasystems", date: "10/2022" },
        { name: "React Certificate", issuer: "HackerRank", date: "01/2022", link: "https://www.hackerrank.com/certificates/9c0623fb5315" }
    ],
    skills: {
        core: ["GenAI", "Prompt Engineering", "Agentic AI"],
        frontend: ["HTML5", "CSS3", "JavaScript", "jQuery", "React", "Redux", "Angular", "Bootstrap", "LESS", "SASS"],
        backend: ["JAVA", "Node.js"],
        cloud_and_tools: ["Amazon S3", "Git", "MongoDB", "Redis", "Docker", "Photoshop"]
    },
    achievements: [
        "Real Time Recognition - Pegasystems (Mar 2025)",
        "SPOT Award - Pegasystems (Aug 2024) for driving stability, functionality and client satisfaction"
    ],
    interests: ["Learning new things", "Competitive coding", "Cricket", "Chess", "Music/Movies", "Travelling", "Science and Technology"]
};

// Chat functionality
let isTyping = false;
let chatSessions = []; // { id, title, messages: [{ role, content }], createdAt }
let currentSessionId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const charCount = document.getElementById('charCount');
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        const sidebar = document.getElementById('sidebar');
        // restore persisted state
        const collapsed = localStorage.getItem('sidebar_collapsed') === '1';
        if (collapsed) sidebar.classList.add('collapsed');
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
        });
    }

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        // Update character count
        charCount.textContent = `${this.value.length}/1000`;
        
        // Enable/disable send button
        sendButton.disabled = this.value.trim().length === 0;
    });

    // Send message on Enter (but not Shift+Enter)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim() && !isTyping) {
                sendMessage();
            }
        }
    });

    // Initialize sessions UI
    loadSessions();
    renderChatsList();
    initLibrary();
    initSearch();

    // Focus input on load
    messageInput.focus();
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;

    ensureSession();

    // Add user message to chat
    addMessage(message, 'user');
    saveMessageToSession('user', message);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    document.getElementById('charCount').textContent = '0/1000';
    document.getElementById('sendButton').disabled = true;

    // Show typing indicator and generate response
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'assistant');
        saveMessageToSession('assistant', response);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const lastRow = chatMessages.lastElementChild;
    const makeAlt = !(lastRow && lastRow.classList.contains('alt'));

    const row = document.createElement('div');
    row.className = `chat-row ${makeAlt ? 'alt' : ''}`;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = formatMessage(text);

    content.appendChild(textDiv);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    row.appendChild(messageDiv);
    chatMessages.appendChild(row);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function ensureSession() {
    if (!currentSessionId) {
        startNewChat();
    }
}

function startNewChat() {
    const id = 's_' + Date.now();
    currentSessionId = id;
    const session = { id, title: 'New chat', messages: [], createdAt: Date.now() };
    chatSessions.unshift(session);
    persistSessions();
    renderChatsList();
    // clear chat area but keep welcome row
    const chatMessages = document.getElementById('chatMessages');
    const firstRow = chatMessages.firstElementChild ? chatMessages.firstElementChild.cloneNode(true) : null;
    chatMessages.innerHTML = '';
    if (firstRow) chatMessages.appendChild(firstRow);
    const search = document.getElementById('searchChatsInput');
    if (search) search.value = '';
    const input = document.getElementById('messageInput');
    if (input) input.focus();
}

function saveMessageToSession(role, content) {
    const session = chatSessions.find(s => s.id === currentSessionId);
    if (!session) return;
    session.messages.push({ role, content });
    if (session.title === 'New chat' && role === 'user') {
        session.title = content.slice(0, 40);
    }
    persistSessions();
    renderChatsList();
}

function loadSessions() {
    try {
        const raw = localStorage.getItem('chat_sessions_v1');
        const cur = localStorage.getItem('chat_current_v1');
        chatSessions = raw ? JSON.parse(raw) : [];
        currentSessionId = cur || (chatSessions[0] ? chatSessions[0].id : null);
    } catch {}
}

function persistSessions() {
    localStorage.setItem('chat_sessions_v1', JSON.stringify(chatSessions));
    localStorage.setItem('chat_current_v1', currentSessionId || '');
}

function renderChatsList() {
    const list = document.getElementById('chatsList');
    if (!list) return;
    list.innerHTML = '';
    const filter = (document.getElementById('searchChatsInput')?.value || '').toLowerCase();
    const filtered = chatSessions.filter(s => !filter || (s.title || '').toLowerCase().includes(filter));
    if (!filtered.length) {
        const empty = document.createElement('div');
        empty.className = 'sidebar-empty';
        empty.textContent = 'No chats yet';
        list.appendChild(empty);
        return;
    }
    filtered.forEach(session => {
            const item = document.createElement('div');
            item.className = 'sidebar-chat' + (session.id === currentSessionId ? ' active' : '');
            item.innerHTML = `<i class="fas fa-comment-dots"></i><div class="title"></div><div class="actions"><button class="icon-btn" data-action="delete"><i class=\"fas fa-trash\"></i></button></div>`;
            item.querySelector('.title').textContent = session.title || 'Untitled';
            item.addEventListener('click', (e) => {
                if (e.target.closest('[data-action="delete"]')) return;
                currentSessionId = session.id;
                persistSessions();
                renderChatsList();
                renderSessionMessages(session);
            });
            item.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
                e.stopPropagation();
                chatSessions = chatSessions.filter(s => s.id !== session.id);
                if (currentSessionId === session.id) currentSessionId = chatSessions[0]?.id || null;
                persistSessions();
                renderChatsList();
                if (currentSessionId) renderSessionMessages(chatSessions.find(s => s.id === currentSessionId));
                else clearChat();
            });
            list.appendChild(item);
        });
}

function renderSessionMessages(session) {
    const chatMessages = document.getElementById('chatMessages');
    const firstRow = chatMessages.firstElementChild ? chatMessages.firstElementChild.cloneNode(true) : null;
    chatMessages.innerHTML = '';
    if (firstRow) chatMessages.appendChild(firstRow);
    session.messages.forEach(m => addMessage(m.content, m.role === 'user' ? 'user' : 'assistant'));
}

function initSearch() {
    const input = document.getElementById('searchChatsInput');
    if (!input) return;
    input.addEventListener('input', () => renderChatsList());
}

function initLibrary() {
    const el = document.getElementById('libraryList');
    if (!el) return;
    const prompts = [
        'Summarize my profile in 3 bullet points',
        'What makes me stand out for Principal Engineer roles?',
        'Generate a 2-sentence elevator pitch for me',
        'List 5 interview questions I’m ready to answer',
        'Draft a LinkedIn About section from this profile'
    ];
    el.innerHTML = '';
    prompts.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-item';
        btn.innerHTML = `<i class=\"fas fa-bolt\"></i> <span>${p}</span>`;
        btn.addEventListener('click', () => askQuestion(p));
        el.appendChild(btn);
    });
}

function formatMessage(text) {
    // Convert markdown-like formatting to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

function showTypingIndicator() {
    isTyping = true;
    document.getElementById('typingIndicator').classList.add('show');
    document.getElementById('sendButton').disabled = true;
}

function hideTypingIndicator() {
    isTyping = false;
    document.getElementById('typingIndicator').classList.remove('show');
    document.getElementById('sendButton').disabled = false;
}

function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Creative prompts from Library
    if (message.includes('summarize') && message.includes('profile')) {
        return generateSummaryBullets();
    }
    if (message.includes('elevator pitch') || (message.includes('pitch') && message.includes('two'))) {
        return generateElevatorPitch();
    }
    if (message.includes('stand out') || message.includes('principal engineer')) {
        return generateStandoutForPrincipal();
    }
    if (message.includes('interview questions')) {
        return generateInterviewQuestions();
    }
    if (message.includes('linkedin') && message.includes('about')) {
        return generateLinkedInAbout();
    }

    // Experience related questions
    if (message.includes('experience') || message.includes('work') || message.includes('job') || message.includes('career')) {
        return generateExperienceResponse();
    }
    
    // Skills related questions
    if (message.includes('skill') || message.includes('technology') || message.includes('tech') || message.includes('programming')) {
        return generateSkillsResponse();
    }
    
    // Projects related questions
    if (message.includes('project') || message.includes('portfolio') || message.includes('work') || message.includes('built')) {
        return generateProjectsResponse();
    }
    
    // Education related questions
    if (message.includes('education') || message.includes('degree') || message.includes('school') || message.includes('university') || message.includes('certification')) {
        return generateEducationResponse();
    }
    
    // Contact related questions
    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach') || message.includes('hire')) {
        return generateContactResponse();
    }
    
    // About/Introduction
    if (message.includes('about') || message.includes('who') || message.includes('introduce') || message.includes('tell me about')) {
        return generateAboutResponse();
    }
    
    // Achievements
    if (message.includes('achievement') || message.includes('accomplish') || message.includes('award') || message.includes('success')) {
        return generateAchievementsResponse();
    }
    
    // Default response
    return generateDefaultResponse();
}

function generateSummaryBullets() {
    return `**Profile summary:**\n\n` +
           `• Principal Software Engineer (10+ years) in platform and full‑stack.\n` +
           `• Strengths: incident resolution, observability, reusable UI systems, GenAI prototypes.\n` +
           `• Domains: enterprise platforms, healthcare; tools: JavaScript, React, Java, Node, AWS.`;
}

function generateElevatorPitch() {
    return `I’m a Principal Software Engineer with 10+ years building reliable, user‑centric platforms. I turn complex problems into observable, maintainable systems and accelerate teams with reusable UI patterns and GenAI‑powered workflows.`;
}

function generateStandoutForPrincipal() {
    return `**Why I stand out for Principal roles:**\n\n` +
           `1) Proven track record stabilizing large platforms (Pega Infinity) with end‑to‑end incident ownership.\n` +
           `2) Raised reliability via tracing/logging/monitoring; reduced MTTR.\n` +
           `3) Led reusable React/JS patterns that sped up delivery and cut regressions.\n` +
           `4) Shipped GenAI/Agentic prototypes that informed roadmap.\n` +
           `5) Mentored engineers and improved code quality across teams.`;
}

function generateInterviewQuestions() {
    return `**Interview questions I’m ready to answer:**\n\n` +
           `• How to design observability for complex frontends and Java services?\n` +
           `• Debugging approach for a flaky production issue across UI/BE?\n` +
           `• Pattern for reusable React components with accessibility baked‑in?\n` +
           `• Strategy to reduce bundle size and improve Core Web Vitals?\n` +
           `• Where does GenAI add leverage in enterprise apps and how to evaluate it?`;
}

function generateLinkedInAbout() {
    return `Principal Software Engineer with 10+ years across platform and full‑stack. I specialize in turning complex systems into reliable, observable products—shipping features faster with reusable UI patterns and evidence‑based engineering. Recently, I’ve prototyped GenAI/Agentic flows that improved developer and user experiences. I care about clarity, performance, and mentoring teams to do their best work.`;
}

function generateExperienceResponse() {
    let response = "**Work Experience (10+ years):**\n\n";
    
    resumeData.experience.forEach((job, index) => {
        response += `**${job.title}** at ${job.company} (${job.duration})\n`;
        response += `${job.description}\n`;
        response += `*Technologies: ${job.technologies.join(', ')}*\n\n`;
    });
    
    response += "I have over 10 years of experience in full‑stack and platform engineering across startup and enterprise environments, leading teams, resolving complex incidents, and shipping high‑quality solutions.";
    
    return response;
}

function generateSkillsResponse() {
    let response = "**Technical Skills:**\n\n";

    if (resumeData.skills.core?.length) {
        response += "**Core (GenAI):**\n";
        response += resumeData.skills.core.join(', ') + "\n\n";
    }
    
    response += "**Frontend:**\n";
    response += resumeData.skills.frontend.join(', ') + "\n\n";
    
    response += "**Backend:**\n";
    response += resumeData.skills.backend.join(', ') + "\n\n";
    
    if (resumeData.skills.cloud_and_tools?.length) {
        response += "**Cloud & Tools:**\n";
        response += resumeData.skills.cloud_and_tools.join(', ') + "\n\n";
    }
    
    response += "I'm always learning new technologies and staying up-to-date with industry trends. I particularly enjoy working with modern JavaScript frameworks and cloud technologies.";
    
    return response;
}

function generateProjectsResponse() {
    let response = "**Impact Highlights (instead of projects):**\n\n";

    const highlights = [
        "Resolved high‑severity client issues across UI and backend in Pega Infinity, improving platform stability and customer trust.",
        "Drove observability adoption (tracing, logging, monitoring) that reduced mean time to resolution and improved reliability.",
        "Led reusable UI patterns in React/JS that accelerated feature delivery and reduced regression surface.",
        "Integrated GenAI/Agentic AI prototypes into internal product flows during hackathons, shaping future roadmap.",
        "Mentored engineers and established code quality practices across teams."
    ];

    highlights.forEach(h => { response += `• ${h}\n`; });
    
    response += "\nAsk for details on any highlight to dive deeper.";
    return response;
}

function generateEducationResponse() {
    let response = "**Education & Certifications:**\n\n";
    
    response += "**Formal Education:**\n";
    resumeData.education.forEach(edu => {
        if (edu.degree && edu.school) {
            response += `• ${edu.degree} - ${edu.school}${edu.year ? ` (${edu.year})` : ''}`;
            if (edu.gpa) response += ` - ${edu.gpa}`;
            response += "\n";
        }
    });
    
    if (resumeData.certifications && resumeData.certifications.length) {
        response += "\n**Professional Certifications:**\n";
        resumeData.certifications.forEach(c => {
            response += `• ${c.name} - ${c.issuer}${c.date ? ` (${c.date})` : ''}${c.link ? ` - ${c.link}` : ''}\n`;
        });
    }
    
    response += "\nI believe in continuous learning and regularly pursue certifications to stay current with industry best practices and emerging technologies.";
    
    return response;
}

function generateContactResponse() {
    return `**Contact Information:**\n\n` +
           `📧 **Email:** ${resumeData.personal.email}\n` +
           `📱 **Phone:** ${resumeData.personal.phone}\n` +
           `📍 **Location:** ${resumeData.personal.location}\n` +
           `💼 **LinkedIn:** ${resumeData.personal.linkedin}\n` +
           `🐙 **GitHub:** ${resumeData.personal.github}\n` +
           `${resumeData.personal.stackoverflow ? `💬 **Stack Overflow:** ${resumeData.personal.stackoverflow}\n` : ''}` +
           `\nI'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to discuss potential projects or opportunities!`;
}

function    generateAboutResponse() {
    return `**About Suresh Kommuri:**\n\n` +
           `I'm a passionate **${resumeData.personal.title}** with over 10 years of experience building scalable web applications and leading development teams. Based in ${resumeData.personal.location}, I specialize in full-stack development with a focus on modern JavaScript frameworks and cloud technologies.\n\n` +
           `**What drives me:**\n` +
           `• Creating user-centric solutions that solve real-world problems\n` +
           `• Mentoring and growing development teams\n` +
           `• Staying current with emerging technologies and best practices\n` +
           `• Contributing to open-source projects and the developer community\n\n` +
           `When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge through technical writing and speaking engagements.`;
}

function generateAchievementsResponse() {
    let response = "**Key Achievements:**\n\n";
    
    resumeData.achievements.forEach((achievement, index) => {
        response += `• ${achievement}\n`;
    });
    
    response += "\nThese achievements reflect my commitment to delivering high-quality software, mentoring others, and continuously improving both personally and professionally.";
    
    return response;
}

function generateDefaultResponse() {
    const responses = [
        "I'd be happy to help you learn more about Suresh's background! You can ask me about his work experience, technical skills, projects, education, or contact information. What specific area interests you?",
        
        "That's a great question! I can tell you about Suresh's professional experience, technical expertise, notable projects, educational background, or how to get in touch with him. What would you like to know more about?",
        
        "I'm here to help you learn about Suresh's professional background. Try asking about his experience, skills, projects, education, or contact details. What specific information are you looking for?",
        
        "Great question! I can provide detailed information about Suresh's career, technical skills, portfolio projects, education, and contact information. What aspect of his background would you like to explore?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Quick action functions
function askQuestion(question) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = question;
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    document.getElementById('charCount').textContent = `${question.length}/1000`;
    document.getElementById('sendButton').disabled = false;
    sendMessage();
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    const firstRow = chatMessages.firstElementChild ? chatMessages.firstElementChild.cloneNode(true) : null;
    chatMessages.innerHTML = '';
    if (firstRow) {
        chatMessages.appendChild(firstRow);
    }
    document.getElementById('messageInput').focus();
}

function downloadResume() {
    const url = 'Suresh_Kommuri.pdf';
    try {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Suresh_Kommuri.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch {
        window.open(url, '_blank');
    }
}

// remove duplicate startNewChat definition (handled above)

// Add some interactive features
function addMessageInteraction() {
    // Add click handlers for links in messages
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href) {
            e.preventDefault();
            window.open(e.target.href, '_blank');
        }
    });
}

// Initialize interactive features
addMessageInteraction();
