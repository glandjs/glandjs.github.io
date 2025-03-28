# Contributing to Gland Website

Thank you for your interest in contributing to the Gland website! We welcome contributions from everyone in the community. This document outlines how you can contribute and what to expect when interacting with the project.

## Table of Contents

- [Contributing to Gland Website](#contributing-to-gland-website)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Development Server](#development-server)
  - [Making Contributions](#making-contributions)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Enhancements](#suggesting-enhancements)
    - [Code Contributions](#code-contributions)
    - [Commit Messages](#commit-messages)
  - [Pull Request Process](#pull-request-process)

## Getting Started

### Installation

1. Fork the repository
2. Clone your fork locally:

   ```bash
   git clone https://github.com/glandjs/docs.git
   cd docs
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Server

To start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`.

## Making Contributions

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/glandjs/docs/issues)
2. If not, open a new issue with:
   - A clear, descriptive title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Browser/OS version if relevant

### Suggesting Enhancements

1. Search existing issues to avoid duplicates
2. Open a new issue with:
   - A clear description of the enhancement
   - Use cases and benefits
   - Any relevant examples from other projects

### Code Contributions

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```
2. Test your changes thoroughly
3. Push to your fork and open a Pull Request

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Common types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style/formatting
- `refactor`: Code change that neither fixes nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

Example:

```
feat(components): add new CodeBlock component

Adds a reusable CodeBlock component with syntax highlighting and copy functionality

Closes #123
```

## Pull Request Process

1. Ensure your branch is up-to-date with `main`
2. Run all tests and verify your changes work as expected
3. Open a PR with a clear title and description
4. Reference any related issues
5. Include screenshots for UI changes
6. Our team will review your PR and may request changes
7. Once approved, your PR will be merged
