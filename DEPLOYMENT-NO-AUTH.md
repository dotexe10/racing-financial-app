# Deployment Guide for Racing Financial App (Link-Only Access)

This guide will help you deploy the Racing Financial App to Vercel with Supabase integration, accessible only via direct links.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) account
3. Git installed on your local machine

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to the SQL Editor and run the SQL script from `scripts/setup-database-no-auth.sql`
3. Disable authentication (since we're using link-only access):
   - Go to Authentication > Settings
   - You can disable all auth providers since we won't be using them

4. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the `URL` and `anon` key

## Step 2: Deploy to Vercel

1. Push your code to a GitHub repository

2. In Vercel:
   - Create a new project
   - Import your GitHub repository
   - Configure the following environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

3. Deploy the project

## Step 3: Access Your Application

1. Visit your deployed application URL directly
2. The application will be immediately accessible without any login
3. Test that you can:
   - Add transactions
   - View financial overview
   - Create and use access links

## Sharing Access

To share access with others:

1. Open the application
2. Click the "Share Access Link" button
3. Generate a shareable link
4. Send the link to the person you want to give access to

## Security Considerations

Since there's no user authentication:
- Anyone with the main URL can access and modify data
- Keep your main application URL private
- Only share access links with trusted individuals
- Consider implementing IP restrictions if needed
- Monitor usage through Supabase dashboard

## Access Methods

1. **Main URL**: Direct access to the application (keep this private)
2. **Access Links**: Time-limited links (30 days) that can be shared
3. **Demo Mode**: Works without Supabase for testing purposes

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set in Vercel
2. Verify that the SQL script was executed successfully in Supabase
3. Check the browser console for any JavaScript errors
4. Ensure your Supabase policies allow all operations
