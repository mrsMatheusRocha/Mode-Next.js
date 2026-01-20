# Deploying to Vercel

Vercel is a cloud platform designed for frontend developers that makes deploying web applications incredibly simple. In this lesson, we'll walk through the process of deploying your Next.js application to Vercel using GitHub.

## Prerequisites

Before you begin, make sure you have:

- A GitHub account
- Your Next.js project pushed to a GitHub repository
- A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)

## Step 1: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. If this is your first time, you'll be prompted to authorize Vercel to access your GitHub repositories

## Step 2: Import Your Repository

1. From your Vercel dashboard, click the "Add New..." button and select "Project"
2. Vercel will display a list of your GitHub repositories
3. Find your Next.js project repository and click "Import"

## Step 3: Configure Your Project

1. Vercel will automatically detect that you're using Next.js and pre-fill most configuration settings
2. You can customize the project name if desired
3. If your project has environment variables, add them in the "Environment Variables" section
   - For database connections (like PostgreSQL, MySQL, MongoDB), add your connection string as an environment variable (e.g., `DATABASE_URL`)
   - For API keys and secrets, add each as a separate environment variable
   - Make sure to add all environment variables from your local `.env` file that your application needs to function
   - Vercel encrypts all environment variables to keep your sensitive data secure
4. Leave the default settings for Framework Preset (Next.js) and Build Command

## Step 4: Deploy

1. Click the "Deploy" button
2. Vercel will build and deploy your application
3. Once complete, you'll receive a URL where your application is live (e.g., `your-project.vercel.app`)

## Automatic Deployments

One of the best features of Vercel is automatic deployments:

- Every time you push to your main branch, Vercel automatically deploys the changes
- When you create a pull request, Vercel creates a preview deployment so you can test changes before merging

## Custom Domains

To add a custom domain to your project:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" and then "Domains"
3. Enter your domain and follow the instructions to configure DNS settings

## Managing Environment Variables

After deployment, you can still manage your environment variables:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Here you can add, edit, or remove environment variables
4. You can also specify different values for Production, Preview, and Development environments
5. After changing environment variables, you'll need to redeploy your application for the changes to take effect

## Conclusion

Deploying to Vercel with GitHub integration is one of the simplest ways to get your Next.js application online. The platform handles all the complex deployment infrastructure, allowing you to focus on building your application.

For more advanced deployment options and configurations, check out the [Vercel documentation](https://vercel.com/docs).
