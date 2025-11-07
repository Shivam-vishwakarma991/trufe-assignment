# GitHub Configuration

This directory contains GitHub-specific configuration files for the Marketplace Catalog project.

## Contents

### Workflows

- **`workflows/deploy.yml`**: Production deployment workflow
  - Triggers on push to `main` branch
  - Runs tests, builds, and deploys to Vercel
  - Executes database migrations
  
- **`workflows/preview.yml`**: Preview deployment workflow
  - Triggers on pull requests to `main`
  - Creates preview deployments for testing
  - Adds deployment URL as PR comment

### Documentation

- **`SECRETS.md`**: Complete guide for configuring GitHub secrets
- **`DEPLOYMENT_QUICK_START.md`**: Quick reference for common deployment tasks

## Quick Links

- [Setup GitHub Secrets](./SECRETS.md)
- [Deployment Quick Start](./DEPLOYMENT_QUICK_START.md)
- [Full Deployment Guide](../DEPLOYMENT.md)

## Workflow Status

Check the status of workflows:
- Go to the Actions tab in your repository
- View recent workflow runs
- Check logs for any failures

## Modifying Workflows

When modifying workflow files:
1. Test changes in a feature branch first
2. Use `workflow_dispatch` for manual testing
3. Monitor the Actions tab for results
4. Review logs for any issues

## Security

- Never commit secrets to the repository
- Use GitHub Secrets for sensitive values
- Review workflow permissions regularly
- Keep actions up to date
