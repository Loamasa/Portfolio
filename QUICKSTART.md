# Quick Start Guide - Portfolio & CV Manager

## First Time Setup (5 minutes)

### 1. Access the Application
- Open the development server at `http://localhost:3000`
- You'll see your professional homepage with your name and core strengths

### 2. Log In
- Click the "Logout" button in the top-right corner (or any protected link)
- You'll be redirected to the login page
- Log in with your Manus account

### 3. Set Up Your Profile
- Click "Manage CV" button on the homepage
- Go to the "Profile" tab
- Fill in your information:
  - Full Name (required)
  - Professional Title
  - Email & Phone
  - Location
  - Professional Summary
- Click "Save Profile"

### 4. Add Your Experience
- Go to "Experience" tab
- Click "Add Experience"
- Fill in your job details
- Click "Save"
- Repeat for each position

### 5. Add Education
- Go to "Education" tab
- Click "Add Education"
- Fill in your education details
- Click "Save"

### 6. Add Skills
- Go to "Skills" tab
- Click "Add Skill"
- Enter skill name, category, and proficiency
- Click "Save"

### 7. Export Your CV
- Click "Show Preview" to see how your CV looks
- Click "Export PDF" to download as PDF
- Or click "Export JSON" to backup your data

## Common Tasks

### Create a Targeted CV
1. Go to CV Manager → Templates tab
2. Click "Create Template"
3. Name it (e.g., "Tech Lead CV")
4. Select which experiences and skills to include
5. Save
6. Export as PDF when needed

### Import CV from JSON
1. Click "Import JSON" button
2. Select your JSON file
3. Your data will be imported
4. Refresh to see changes

### Access Admin Panel
1. On homepage, press **A**, then **D**, then **M**, then **I**, then **N**
2. An "Admin Panel" button appears in bottom-right
3. Click to manage projects, blog, and settings

### Add a Project
1. Go to Admin Panel → Projects
2. Click "Add Project"
3. Fill in title, description, image URL
4. Click "Save"

### Create a Blog Post
1. Go to Admin Panel → Blog
2. Click "Create Post"
3. Fill in title, content, excerpt
4. Click "Save"

## Keyboard Shortcut

**Access Admin Panel**: Press **A-D-M-I-N** on the homepage (one letter at a time, quickly)

## Tips & Tricks

- **Backup Regularly**: Export your CV as JSON monthly
- **Multiple CVs**: Create different templates for different job types
- **Professional Summary**: Keep it concise (2-3 sentences)
- **Skills Organization**: Group related skills by category
- **PDF Quality**: Use "Show Preview" before exporting to check formatting

## File Locations

- **Database**: MySQL/TiDB (configured via DATABASE_URL)
- **Frontend**: `client/src/`
- **Backend**: `server/`
- **Database Schema**: `drizzle/schema.ts`

## Environment Variables

Key environment variables (automatically configured):
- `DATABASE_URL`: Database connection string
- `VITE_APP_TITLE`: Your portfolio title
- `VITE_APP_LOGO`: Your logo URL
- `JWT_SECRET`: Session security
- `OAUTH_SERVER_URL`: Authentication server

## Troubleshooting

**Q: Can't see "Manage CV" button?**
A: Make sure you're logged in. Click "Logout" to trigger login.

**Q: PDF export not working?**
A: Ensure you've filled in at least your name in the Profile tab.

**Q: Admin panel button not appearing?**
A: Press A-D-M-I-N quickly on the homepage (one letter at a time).

**Q: Data not saving?**
A: Check your internet connection and browser console for errors.

## Next Steps

1. ✅ Set up your profile
2. ✅ Add your experiences and education
3. ✅ Create your first CV template
4. ✅ Export as PDF
5. ✅ Add portfolio projects
6. ✅ Write blog posts
7. ✅ Share your portfolio!

---

**Need help?** Check DOCUMENTATION.md for detailed information on all features.

