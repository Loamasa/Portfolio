# Codex Delivery Guide

This guide tracks recurring steps the Codex assistant must follow while shipping updates for the Portfolio & CV Manager project.

## Required Delivery Steps

1. **Summaries and Tests** – Every final message must include a summary of the changes and an explicit list of commands executed for testing, matching the repository reporting conventions.
2. **Bolt Verification Prompt** – Close each task with the exact Bolt.New prompt the reviewer can paste into Bolt to validate the feature or bugfix. When Supabase authentication is involved, the prompt must cover:
   - Creating an email/password user
   - Verifying the session update in the UI
   - Signing out and confirming RLS enforcement on protected data
3. **Documentation Updates** – Whenever project processes change, reflect them here so the workflow remains consistent across tasks.

## Current Bolt.New Prompt Template

Use the following prompt at the end of each task (replace bracketed sections with the relevant feature details):

```
Open the Portfolio & CV Manager project.
1. Visit /signup and create a new user with email [test-email] and password [test-password].
2. After signing up, log in with the same credentials and confirm the dashboard shows the authenticated state for [feature/component name].
3. Navigate to /cv-manager (should redirect to login if signed out) and verify protected content requires authentication.
4. Sign out and confirm Supabase RLS blocks access to another user's data (attempt to open a protected page again).
Report any errors encountered.
```

Keep this template up to date as future tasks introduce new verification steps.
