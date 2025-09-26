# Interactive Resume - ChatGPT Style

A modern, interactive resume application built with HTML, CSS, and JavaScript that provides a ChatGPT-like conversational interface to explore professional background, skills, and experience.

## 🚀 Features

- **ChatGPT-like Interface**: Interactive conversation to explore resume details
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Typing Animation**: Simulates natural conversation flow
- **Quick Action Buttons**: Fast access to common questions
- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **GitHub Pages Ready**: Easy deployment to GitHub Pages

## 📋 What You Can Ask

The interactive resume can answer questions about:

- **Work Experience**: Current and previous roles, responsibilities, and achievements
- **Technical Skills**: Programming languages, frameworks, tools, and technologies
- **Projects**: Portfolio projects with descriptions and technologies used
- **Education**: Academic background and professional certifications
- **Contact Information**: How to get in touch for opportunities
- **General Questions**: About background, interests, and career goals

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality and chat logic
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Inter font family for modern typography

## 🚀 Quick Start

### Option 1: Direct File Opening
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start chatting with the interactive resume!

### Option 2: Local Server (Recommended)
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd interactive-resume
   ```

2. Start a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open `http://localhost:8000` in your browser

## 📱 Usage

1. **Start a Conversation**: Type your question in the input field at the bottom
2. **Quick Actions**: Use the quick action buttons for common questions
3. **Navigation**: Use Enter to send messages, Shift+Enter for new lines
4. **Clear Chat**: Use the "Clear Chat" button to reset the conversation
5. **Download Resume**: Use the "Download Resume" button (placeholder functionality)

## 🎨 Customization

### Personalizing the Resume Data

Edit the `resumeData` object in `script.js` to customize:

```javascript
const resumeData = {
    personal: {
        name: "Your Name",
        title: "Your Title",
        email: "your.email@example.com",
        // ... other personal details
    },
    experience: [
        // Your work experience
    ],
    skills: {
        // Your technical skills
    },
    projects: [
        // Your projects
    ],
    education: [
        // Your education and certifications
    ]
};
```

### Styling Customization

Modify `styles.css` to change:
- Color scheme and gradients
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Adding New Response Types

Extend the `generateResponse()` function in `script.js` to handle new types of questions:

```javascript
if (message.includes('your-keyword')) {
    return generateYourCustomResponse();
}
```

## 🚀 GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. Push your code to the `main` branch
2. Go to your repository settings
3. Navigate to "Pages" section
4. Select "GitHub Actions" as the source
5. The workflow will automatically deploy your site

### Manual Deployment

1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch"
3. Choose `main` branch and `/ (root)` folder
4. Your site will be available at `https://yourusername.github.io/your-repo-name`

## 📁 Project Structure

```
interactive-resume/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and animations
├── script.js               # JavaScript functionality and resume data
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
└── README.md               # This file
```

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help customizing the resume, please open an issue in the repository.

---

**Made with ❤️ for showcasing professional profiles in an interactive way**
