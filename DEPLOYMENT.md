# Deployment Guide for Racing Financial App

This guide will help you deploy the Racing Financial App to Vercel with Supabase integration.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) account
3. Git installed on your local machine

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to the SQL Editor and run the SQL script from `scripts/setup-database.sql`
3. Set up authentication:
   - Go to Authentication > Settings
   - Enable Email provider
   - Configure any additional settings as needed

4. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the `URL` and `anon` key
   - Generate a service role key for admin operations

## Step 2: Deploy to Vercel

1. Push your code to a GitHub repository

2. In Vercel:
   - Create a new project
   - Import your GitHub repository
   - Configure the following environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

3. Deploy the project

## Step 3: Test Your Deployment

1. Visit your deployed application
2. Create a new account
3. Verify that you can:
   - Add transactions
   - View financial overview
   - Create and use shared links

## Sharing Access

To share financial overviews with others:

1. Log in to your account
2. Click the "Share Financial Overview" button
3. Generate a shareable link
4. Send the link to the person you want to share with

The link will be valid for 30 days and can be accessed by anyone with the link, without requiring login.

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set in Vercel
2. Verify that the SQL script was executed successfully in Supabase
3. Check the browser console for any JavaScript errors
4. Ensure your Supabase policies are correctly configured
