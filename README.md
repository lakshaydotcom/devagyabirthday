# devagyabirthday

This project is configured for live deployment with **GitHub + Azure Static Web Apps**.

## Deployment flow

- `main` branch is production.
- Create feature branches for changes.
- Open a PR to `main` to get a preview deployment URL.
- Merge to `main` to auto-deploy production.

## One-time Azure setup

1. Create an **Azure Static Web App** resource.
2. In GitHub repository settings, add this secret:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Azure Static Web App deployment token)
3. Keep the GitHub Actions workflow at:
   - `/home/runner/work/devagyabirthday/devagyabirthday/.github/workflows/azure-static-web-apps.yml`

## How this project is built for Azure

- CI installs dependencies with `npm install`.
- CI builds with `NITRO_PRESET=azure_swa npm run build`.
- Static assets are deployed from `.output/public`.
- Server/API runtime is deployed from `.output/server`.

## Share on any device

- Azure gives you a public HTTPS URL by default.
- Open that URL on phone, tablet, or laptop in any modern browser.
- Add a custom domain from Azure Static Web Apps when you want a permanent branded URL.

## Update workflow

1. Make code changes in a feature branch.
2. Push the branch and open PR for preview.
3. Verify preview.
4. Merge PR into `main` to publish.



click here to view the site :  

# https://lively-sky-035da4600.7.azurestaticapps.net
