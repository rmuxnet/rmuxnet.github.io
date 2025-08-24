# 🤝 Contributing to rmux Website

Thank you for your interest in contributing to the rmux website! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Contact](#contact)

## 🎯 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

**Be respectful, inclusive, and collaborative.**

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git** (latest version)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   # Then clone your fork
   git clone https://github.com/YOUR_USERNAME/rmux.github.io.git
   cd rmux.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
rmux.github.io/
├── index.html              # Main HTML file
├── style/
│   ├── 1.css              # Main stylesheet
│   └── animations.css     # Animation styles
├── script/
│   └── 1.js               # JavaScript functionality
├── manifest.json           # PWA manifest
├── robots.txt              # SEO robots file
├── sitemap.xml            # SEO sitemap
├── package.json           # Project configuration
├── README.md              # Project documentation
├── CONTRIBUTING.md        # This file
└── LICENSE                # MIT license
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with live reload
- `npm run build` - Build project (static site, no build step)
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run optimize` - Optimize assets
- `npm run analyze` - Run Lighthouse performance analysis

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes** - Fix issues and improve reliability
- ✨ **New features** - Add new functionality
- 📱 **UI/UX improvements** - Enhance design and user experience
- 📚 **Documentation** - Improve or add documentation
- 🧪 **Testing** - Add or improve tests
- 🚀 **Performance** - Optimize performance and loading speed
- ♿ **Accessibility** - Improve accessibility features
- 🌐 **Internationalization** - Add multi-language support

### Before Contributing

1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open an issue first for significant changes
3. **Follow the project structure** - Maintain consistency
4. **Test your changes** - Ensure everything works correctly

## 🎨 Code Standards

### HTML Standards

- Use semantic HTML5 elements
- Include proper ARIA labels and roles
- Ensure proper heading hierarchy
- Add alt text to images
- Use proper meta tags for SEO

### CSS Standards

- Follow Material You 2 design principles
- Use CSS custom properties for theming
- Implement responsive design patterns
- Follow BEM-like naming conventions
- Ensure accessibility with proper contrast ratios

### JavaScript Standards

- Use ES6+ features
- Follow modern JavaScript best practices
- Implement proper error handling
- Use async/await for asynchronous operations
- Add JSDoc comments for complex functions

### General Standards

- Write clear, descriptive commit messages
- Keep changes focused and atomic
- Test across different browsers and devices
- Ensure mobile responsiveness
- Maintain performance standards

## 🧪 Testing

### Manual Testing

- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices (desktop, tablet, mobile)
- Test accessibility features
- Test performance with Lighthouse
- Test PWA functionality

### Automated Testing

```bash
# Run Lighthouse analysis
npm run analyze

# Check code formatting
npm run format

# Validate HTML
# Use browser dev tools or online validators
```

## 🔄 Pull Request Process

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Test thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the PR template
   - Describe changes clearly
   - Link related issues
   - Include screenshots if applicable

### Pull Request Guidelines

- **Title**: Use conventional commit format
- **Description**: Explain what and why, not how
- **Screenshots**: Include for UI changes
- **Testing**: Describe how you tested
- **Breaking changes**: Note if any

### Commit Message Format

Use conventional commit format:

```
type(scope): description

feat: add new animation system
fix: resolve mobile navigation issue
docs: update contributing guidelines
style: improve button hover effects
refactor: reorganize CSS structure
test: add accessibility tests
chore: update dependencies
```

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (browser, OS, device)
- **Screenshots or videos** if applicable
- **Console errors** if any

### Issue Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 90]
- OS: [e.g., Windows 10]
- Device: [e.g., Desktop]

## Additional Information
Any other context, screenshots, or logs
```

## 💡 Feature Requests

### Feature Request Guidelines

- **Clear description** of the feature
- **Use case** and benefits
- **Mockups or examples** if applicable
- **Priority level** (low, medium, high)
- **Implementation suggestions** if any

## 📞 Contact

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: contact@rmux.me (for private matters)

### Community

- **Discord**: Join our development community
- **Telegram**: Follow updates and announcements
- **Twitter**: Stay updated with latest news

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **GitHub** contributors page
- **Release notes** for significant contributions
- **Project documentation** where applicable

## 📚 Resources

### Learning Resources

- [Material You 2 Guidelines](https://m3.material.io/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/)
- [Modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [CSS Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [HTML Semantic Elements](https://developer.mozilla.org/en-US/docs/Web/HTML)

### Tools

- **Code Editor**: VS Code, WebStorm, or your preference
- **Browser Dev Tools**: Chrome DevTools, Firefox Developer Tools
- **Performance**: Lighthouse, WebPageTest
- **Accessibility**: axe DevTools, WAVE
- **Design**: Figma, Adobe XD, or similar

---

**Thank you for contributing to the rmux website! 🎉**

Your contributions help make this project better for the entire Android development community.
