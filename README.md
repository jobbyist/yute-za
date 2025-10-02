# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/28ac1135-8f17-4889-8f63-6cbf7b1fc0d9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/28ac1135-8f17-4889-8f63-6cbf7b1fc0d9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is configured to deploy automatically to GitHub Pages with the custom domain **yute.co.za**.

### Automatic Deployment

The repository includes a GitHub Actions workflow that automatically deploys the site to GitHub Pages whenever you push to the `main` branch.

To enable GitHub Pages:
1. Go to your repository Settings > Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. The workflow will automatically build and deploy your site

### Custom Domain Setup

The custom domain `yute.co.za` is already configured via the `CNAME` file in the `public` directory.

To complete the domain setup:
1. In your DNS provider, add a CNAME record pointing `yute.co.za` to `<username>.github.io`
2. GitHub Pages will automatically handle the SSL certificate via Let's Encrypt

### Environment Variables

Make sure to add the following secrets in your repository settings (Settings > Secrets and variables > Actions):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Manual Deployment

You can also trigger a deployment manually from the Actions tab in your repository.

### Alternative: Deploy via Lovable

You can also open [Lovable](https://lovable.dev/projects/28ac1135-8f17-4889-8f63-6cbf7b1fc0d9) and click on Share -> Publish.
