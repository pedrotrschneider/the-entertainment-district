# GitHub Actions Docker Deployment

This repository includes a GitHub Action workflow to automatically build and publish the Docker image to Docker Hub.

## Workflow File
Location: `.github/workflows/docker-publish.yml`

## Triggers
- Pushes to the `main` branch
- Pushes of tags starting with `v` (e.g., `v1.0.0`)
- Pull Requests to `main` (Build only, no push)

## Configuration Required

To enable publishing to Docker Hub, you must set the following **Repository Secrets** in GitHub:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Your Docker Hub Access Token (Recommended) or Password |

### Generating a Docker Hub Access Token
1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to **Account Settings** > **Security**
3. Click **New Access Token**
4. Give it a description (e.g., "GitHub Actions") and "Read & Write" permissions

## Image Naming
The workflow defaults to using your GitHub repository name as the Docker Hub image name (e.g., `pedrotrschneider/the-entertainment-district`).

If you want to use a different image name, edit `.github/workflows/docker-publish.yml`:
```yaml
env:
  IMAGE_NAME: my-custom-image-name
```
