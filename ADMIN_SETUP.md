# Admin Role Assignment Guide

This document explains how to assign admin roles to users in the Portfolio & CV Manager application.

## Overview

The application uses Supabase Auth with role-based access control. Admin users have access to the Admin Panel where they can manage portfolio projects, blog posts, and portfolio settings.

## How Admin Roles Work

- Admin role is stored in `user_metadata.role` field
- The value must be exactly `"admin"` (case-sensitive)
- Regular users have no role or a different role value
- Admin status is checked in the frontend via `useAuth().isAdmin`
- Admin status is verified in the database via the `is_admin(user_id)` function

## Method 1: Assign Admin Role via Supabase Dashboard

This is the recommended method for most users.

### Steps:

1. **Log into Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Find the User**
   - Locate the user you want to make an admin
   - Click on the user's email to open their details

4. **Edit User Metadata**
   - Scroll down to the "User Metadata" section
   - Click "Edit" or the pencil icon
   - Add the following JSON:
     ```json
     {
       "role": "admin"
     }
     ```
   - If other metadata exists, merge it:
     ```json
     {
       "role": "admin",
       "other_field": "value"
     }
     ```

5. **Save Changes**
   - Click "Save" or "Update User"
   - The user will need to log out and log back in for changes to take effect

## Method 2: Assign Admin Role via SQL

You can also assign admin roles directly using SQL.

### Steps:

1. **Open SQL Editor**
   - In Supabase Dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run the Following SQL**
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data =
     CASE
       WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
       ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
     END
   WHERE email = 'user@example.com';
   ```
   Replace `user@example.com` with the actual user's email

3. **Execute Query**
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)
   - Verify the update was successful (should show "Success. No rows returned")

4. **Force Session Refresh**
   - The user will need to log out and log back in

## Method 3: Assign Admin During Signup (Development Only)

For development purposes, you can modify the signup process to automatically assign admin role.

**⚠️ WARNING: Do NOT use this in production!**

### Steps:

1. **Edit SignupForm.tsx** (for testing only)
   ```typescript
   await signup({
     email,
     password,
     options: {
       data: {
         role: 'admin'
       }
     }
   });
   ```

2. **Remember to remove this code before production!**

## Verifying Admin Access

After assigning the admin role:

1. User must **log out** if currently logged in
2. User logs back in
3. On the homepage, press the keys: **A - D - M - I - N** (in sequence)
4. If admin, a hint or admin panel access should appear
5. Navigate to `/admin` route
6. Admin Panel should be accessible

## Troubleshooting

### User shows as not admin after role assignment

**Solution:**
- Ensure user has logged out completely
- Clear browser cache/cookies if needed
- Log back in with fresh session
- Check that role value is exactly `"admin"` (lowercase, no typos)

### Admin Panel shows "Access restricted"

**Possible causes:**
1. User is not logged in
2. Role is not set correctly
3. User hasn't logged out/in after role assignment
4. Typo in role value (must be exactly "admin")

**Solution:**
- Verify the role in Supabase Dashboard under user metadata
- Check browser console for auth errors
- Ensure user has logged out and back in

### Cannot access /admin route

**Possible causes:**
- Not logged in
- Not an admin user
- AuthGate is blocking access

**Solution:**
- Log in first
- Verify admin role is assigned
- Check browser console for errors

## Security Notes

1. **Never expose admin assignment to public users**
   - Admin role should only be assigned by other admins or via database access
   - Do not create a public "Make me admin" button

2. **Protect admin routes**
   - Always use `<AuthGate requireAdmin>` for admin-only pages
   - Verify admin status in API calls if using edge functions

3. **Limit number of admins**
   - Only assign admin role to trusted users
   - Regularly audit admin user list

4. **RLS Policies**
   - The database `is_admin()` function checks user role
   - Use this function in RLS policies for admin-only tables if needed

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase User Management](https://supabase.com/docs/guides/auth/managing-user-data)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Quick Reference

```bash
# SQL to check current admins
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';

# SQL to remove admin role
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE email = 'user@example.com';

# SQL to add admin role (merge with existing metadata)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```
