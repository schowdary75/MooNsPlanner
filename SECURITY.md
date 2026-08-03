# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in MooNsPlanner, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

### How to Report

1. **Email**: Send a detailed report to the repository owner via [GitHub profile](https://github.com/schowdary75)
2. **GitHub Security Advisories**: Use the [private vulnerability reporting](https://github.com/schowdary75/MooNsPlanner/security/advisories/new) feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Fix & Disclosure**: Coordinated with the reporter

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest | :x:               |

## Security Best Practices

When self-hosting MooNsPlanner:

- Always use HTTPS with a valid TLS certificate
- Set `FORCE_HTTPS=true` behind a TLS-terminating reverse proxy
- Use strong, unique values for `ENCRYPTION_KEY`
- Keep your instance updated to the latest version
- Restrict network access to trusted users
- Use environment variables for all secrets — never hardcode credentials
- Enable MFA for admin accounts when available
