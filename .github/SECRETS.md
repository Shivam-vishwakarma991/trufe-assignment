# GitHub Secrets Configuration

This document lists all required GitHub secrets for the deployment workflows.

## Required Secrets

Configure these in your GitHub repository: Settings > Secrets and variables > Actions > New repository secret

### Vercel Integration

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | 1. Go to https://vercel.com/account/tokens<br>2. Create new token<br>3. Copy the token value |
| `VERCEL_ORG_ID` | Your Vercel organization ID | 1. Go to your Vercel project settings<br>2. Find in project settings JSON<br>3. Or run `vercel project ls` in CLI |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | 1. Go to your Vercel project settings<br>2. Find in project settings JSON<br>3. Or run `vercel project ls` in CLI |

### Application Configuration

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DATABASE_URL` | Production database connection string | `postgresql://user:pass@host:5432/db`<br>or `file:./prod.db` |
| `NEXT_PUBLIC_APP_URL` | Production application URL | `https://marketplace.example.com` |

### Preview Environment (Optional)

| Secret Name | Description | Example |
|------------|-------------|---------|
| `PREVIEW_DATABASE_URL` | Preview environment database URL | `postgresql://user:pass@preview-host:5432/db` |
| `PREVIEW_APP_URL` | Preview environment URL | `https://preview.marketplace.example.com` |

## Setup Instructions

### 1. Get Vercel Credentials

#### Option A: Via Vercel Dashboard
1. Log in to https://vercel.com
2. Go to Settings > Tokens
3. Create a new token with appropriate permissions
4. Copy the token immediately (it won't be shown again)

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link your project
vercel link

# Get project info
vercel project ls
```

### 2. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with its name and value
5. Click "Add secret"

### 3. Verify Secrets

After adding secrets, you can verify they're set correctly by:
1. Going to Settings > Secrets and variables > Actions
2. You should see all secret names listed (values are hidden)
3. Try running the deployment workflow to test

## Security Best Practices

- ✅ Never commit secrets to the repository
- ✅ Use different secrets for production and preview environments
- ✅ Rotate tokens periodically (every 90 days recommended)
- ✅ Use minimal permissions for tokens
- ✅ Review secret access logs regularly
- ✅ Remove unused secrets
- ❌ Don't share secrets via insecure channels
- ❌ Don't use production secrets in development
- ❌ Don't log secret values in workflows

## Troubleshooting

### Secret Not Found Error
**Problem**: Workflow fails with "secret not found"
**Solution**: 
- Verify secret name matches exactly (case-sensitive)
- Check secret is added to the correct repository
- Ensure secret is not empty

### Invalid Token Error
**Problem**: Vercel deployment fails with authentication error
**Solution**:
- Verify VERCEL_TOKEN is valid and not expired
- Create a new token if needed
- Ensure token has correct permissions

### Database Connection Error
**Problem**: Migration fails with connection error
**Solution**:
- Verify DATABASE_URL format is correct
- Check database is accessible from GitHub Actions
- Ensure database credentials are valid
- Check firewall rules allow GitHub Actions IPs

## Environment-Specific Secrets

### Production Environment
Used by: `.github/workflows/deploy.yml`
- Triggered on push to `main` branch
- Uses production secrets

### Preview Environment
Used by: `.github/workflows/preview.yml`
- Triggered on pull requests
- Uses preview secrets (if configured)
- Falls back to production secrets if preview secrets not set

## Updating Secrets

To update a secret:
1. Go to Settings > Secrets and variables > Actions
2. Click on the secret name
3. Click "Update secret"
4. Enter new value
5. Click "Update secret"

Note: Workflows using the secret will automatically use the new value on next run.

## Removing Secrets

To remove a secret:
1. Go to Settings > Secrets and variables > Actions
2. Click on the secret name
3. Click "Remove secret"
4. Confirm removal

Warning: Workflows depending on this secret will fail until it's re-added or the workflow is updated.
