# Contributing to Scout

Thank you for your interest in contributing to Scout! This document provides guidelines for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/scout.git
   cd scout
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in your local development values
   ```

3. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Format code with Prettier

## Before Submitting

1. **Test your changes:**
   ```bash
   npm run build
   npm run lint
   ```

2. **Run type checking:**
   ```bash
   npx tsc --noEmit
   ```

3. **Update documentation** if needed
4. **Create a clear commit message:**
   ```
   feat: add new monitoring feature
   fix: resolve database connection issue
   docs: update deployment guide
   ```

## Pull Request Process

1. Push your branch to your fork
2. Create a Pull Request to the main repository
3. Provide a clear description of changes
4. Link related issues if applicable
5. Wait for code review

## Commit Message Guidelines

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Dependencies, build tools

Example:
```
feat: add route deletion functionality

- Implemented delete route button in route details
- Added DeleteRoute server action
- Added confirmation dialog to prevent accidental deletion
```

## Reporting Issues

When reporting bugs, include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

## Feature Requests

When requesting features:
- Clear description of the feature
- Use case and motivation
- Possible implementation approach
- Any alternatives considered

## Code Review

All contributions require code review. Reviewers will check:
- Code quality and style
- TypeScript compliance
- Test coverage
- Documentation
- Performance implications

## Questions?

- Check existing issues and discussions
- Read the DEPLOYMENT.md guide
- Review the README.md

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Happy coding! 🚀
