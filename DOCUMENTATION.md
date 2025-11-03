# Portfolio & CV Manager - Complete Documentation

## Overview

**Portfolio & CV Manager** is a full-stack web application that combines a professional portfolio website with an advanced CV management system. It allows you to manage your professional information, create targeted CVs, and export them in multiple formats (PDF and JSON).

## Features

### 1. Public Portfolio Website
- **Homepage**: Professional landing page with hero section, core strengths, featured projects, and blog section
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, traditional design following CV best practices

### 2. CV Management System
- **Profile Management**: Store personal information, professional title, contact details, and professional summary
- **Experience Tracking**: Add, edit, and organize work experiences with descriptions
- **Education History**: Manage education entries with degree, field, and descriptions
- **Skills Database**: Organize skills by category with proficiency levels
- **CV Templates**: Create multiple CV templates for different job applications
- **JSON Import/Export**: Export CV data as JSON for backup or import from JSON files
- **PDF Export**: Generate professional, ATS-friendly PDFs with proper formatting and page breaks

### 3. Admin Panel
- **Content Management**: Manage portfolio projects, blog posts, and portfolio settings
- **Project Showcase**: Add, edit, and publish projects with descriptions and links
- **Blog Management**: Create and manage blog posts with markdown support
- **Portfolio Settings**: Customize portfolio title, description, and social links
- **Hidden Access**: Admin panel is accessible via secret key combination (A-D-M-I-N) on homepage

### 4. Authentication & Security
- **OAuth Integration**: Secure login via Manus OAuth
- **Role-Based Access Control**: Admin and user roles with protected procedures
- **Session Management**: Secure session handling with JWT tokens

## Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL/TiDB database

### Installation

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Up Database**
   ```bash
   pnpm db:push
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## User Guide

### For Portfolio Visitors

1. **View Homepage**: Visit the main page to see your professional profile, core strengths, and featured projects
2. **Access CV Manager**: Click "Manage CV" button to access the CV builder (requires login)
3. **Hidden Admin Access**: Press A-D-M-I-N on the homepage to reveal the admin panel button (if logged in)

### For CV Manager Users

#### Profile Setup
1. Navigate to CV Manager → Profile tab
2. Fill in your personal information:
   - Full name (required)
   - Professional title
   - Email and phone
   - Location
   - Professional summary
3. Click "Save Profile"

#### Adding Experience
1. Go to CV Manager → Experience tab
2. Click "Add Experience"
3. Fill in:
   - Job title (required)
   - Company (required)
   - Location
   - Start date (YYYY-MM format)
   - End date or mark as current
   - Description (bullet points or paragraph)
4. Save the entry

#### Adding Education
1. Go to CV Manager → Education tab
2. Click "Add Education"
3. Fill in:
   - School/University (required)
   - Degree
   - Field of study
   - Location
   - Start and end dates
   - Description (optional)
4. Save the entry

#### Managing Skills
1. Go to CV Manager → Skills tab
2. Click "Add Skill"
3. Enter:
   - Skill name (required)
   - Category (e.g., "Technical", "Languages", "Soft Skills")
   - Proficiency level (e.g., "Beginner", "Intermediate", "Advanced", "Expert")
4. Save the skill

#### Creating CV Templates
1. Go to CV Manager → Templates tab
2. Click "Create Template"
3. Name your template (e.g., "Tech Lead CV", "Operations CV")
4. Select which experiences, education, and skills to include
5. Choose whether to include profile and languages
6. Save the template

#### Exporting CV

**As JSON:**
1. Click "Export JSON" button at the top of CV Manager
2. A JSON file will download with all your CV data
3. You can import this JSON later to restore your data

**As PDF:**
1. Go to the template or profile you want to export
2. Click "Show Preview" to see how it will look
3. Click "Export PDF" to download the professional PDF
4. The PDF follows traditional CV design with proper formatting and page breaks

#### Importing CV from JSON
1. Click "Import JSON" button at the top of CV Manager
2. Select a JSON file from your computer
3. The data will be imported and merged with your existing information
4. Refresh the page to see the updated data

### For Admin Users

#### Access Admin Panel
1. Log in to your account
2. On the homepage, press A-D-M-I-N (one letter at a time)
3. An "Admin Panel" button will appear in the bottom-right corner
4. Click it to access the admin dashboard

#### Managing Projects
1. Go to Admin Panel → Projects tab
2. Click "Add Project"
3. Fill in:
   - Project title (required)
   - Description
   - Project image URL
   - Tags (comma-separated)
   - Project link
   - Publish status (draft or published)
4. Save the project

#### Managing Blog Posts
1. Go to Admin Panel → Blog tab
2. Click "Create Post"
3. Fill in:
   - Post title (required)
   - Slug (URL-friendly name)
   - Content (markdown or HTML)
   - Excerpt
   - Featured image URL
   - Tags
   - Publish status
4. Save the post

#### Portfolio Settings
1. Go to Admin Panel → Settings tab
2. Update:
   - Portfolio title
   - Portfolio description
   - Portfolio image
   - Social media links
3. Click "Save Settings"

## JSON Format Reference

### CV JSON Structure

```json
{
  "profile": {
    "fullName": "Pål Schakonat",
    "title": "Executive Assistant to the CEO",
    "email": "pal@example.com",
    "phone": "+46 123 456 789",
    "location": "Malmö, Sweden",
    "profileSummary": "Your professional summary here",
    "coreStrengths": ["Strength 1", "Strength 2"],
    "languages": [
      {
        "language": "Swedish",
        "proficiency": "Native"
      },
      {
        "language": "English",
        "proficiency": "Fluent"
      }
    ]
  },
  "experiences": [
    {
      "jobTitle": "Executive Assistant to the CEO",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "2025-01",
      "endDate": "2025-12",
      "isCurrent": false,
      "description": "Description of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor",
      "field": "Business Administration",
      "location": "City, Country",
      "startDate": "2020-09",
      "endDate": "2024-06",
      "isOngoing": false,
      "description": "Additional details about your education"
    }
  ],
  "skills": [
    {
      "skillName": "Project Management",
      "category": "Professional",
      "proficiency": "Advanced"
    }
  ]
}
```

## Database Schema

### Tables

1. **users**: Core authentication table with role-based access
2. **cvProfile**: Personal information and professional summary
3. **cvExperiences**: Work history entries
4. **cvEducation**: Education entries
5. **cvSkills**: Skills and competencies
6. **cvTemplates**: Saved CV configurations
7. **portfolioProjects**: Project showcase entries
8. **blogPosts**: Blog content
9. **portfolioSettings**: Portfolio metadata and configuration

## API Endpoints (tRPC)

### CV Management
- `cv.getProfile` - Retrieve profile information
- `cv.upsertProfile` - Create or update profile
- `cv.getExperiences` - Get all experiences
- `cv.createExperience` - Add new experience
- `cv.updateExperience` - Edit experience
- `cv.deleteExperience` - Remove experience
- `cv.getEducation` - Get all education entries
- `cv.createEducation` - Add education
- `cv.updateEducation` - Edit education
- `cv.deleteEducation` - Remove education
- `cv.getSkills` - Get all skills
- `cv.createSkill` - Add skill
- `cv.updateSkill` - Edit skill
- `cv.deleteSkill` - Remove skill
- `cv.getTemplates` - Get all templates
- `cv.createTemplate` - Create template
- `cv.updateTemplate` - Edit template
- `cv.deleteTemplate` - Remove template
- `cv.exportJson` - Export CV as JSON
- `cv.importJson` - Import CV from JSON

### Portfolio Management
- `portfolio.getProjectsByUser` - Get user's projects
- `portfolio.createProject` - Add project
- `portfolio.updateProject` - Edit project
- `portfolio.deleteProject` - Remove project
- `portfolio.getBlogPostsByUser` - Get user's blog posts
- `portfolio.createBlogPost` - Create blog post
- `portfolio.updateBlogPost` - Edit blog post
- `portfolio.deleteBlogPost` - Remove blog post
- `portfolio.getSettings` - Get portfolio settings
- `portfolio.updateSettings` - Update settings

## PDF Export Details

### Design Features
- **Professional Layout**: Clean, traditional CV design following best practices
- **Proper Typography**: Clear hierarchy with appropriate font sizes and weights
- **Section Organization**: Logical grouping of information (Profile, Experience, Education, Skills, Languages)
- **Page Breaks**: Automatic handling of content that spans multiple pages
- **ATS-Friendly**: Designed to be compatible with Applicant Tracking Systems

### Content Included
- Personal information (name, title, contact details, location)
- Professional summary
- Core strengths (if provided)
- Work experience with descriptions
- Education history
- Skills organized by category
- Languages with proficiency levels

## Troubleshooting

### PDF Export Not Working
- Ensure you have filled in at least the profile name
- Check that your browser allows downloads
- Try a different browser if issues persist

### JSON Import Failing
- Verify the JSON file format matches the structure in the reference section
- Ensure all required fields are present
- Check for any special characters that might cause parsing errors

### Admin Panel Not Accessible
- Make sure you're logged in
- Press A-D-M-I-N (one letter at a time) on the homepage
- Check that your account has admin role (contact system administrator)

### Changes Not Saving
- Ensure you have a stable internet connection
- Check browser console for error messages
- Try refreshing the page and trying again

## Best Practices

### CV Management
1. **Keep It Updated**: Regularly update your CV with new experiences and skills
2. **Use Templates**: Create different templates for different job applications
3. **Backup Your Data**: Regularly export your CV as JSON for backup
4. **Be Specific**: Include detailed descriptions of your achievements and responsibilities
5. **Organize Skills**: Group related skills by category for better organization

### Portfolio Content
1. **Quality Over Quantity**: Focus on your best projects
2. **Add Descriptions**: Provide context for each project
3. **Keep It Current**: Remove outdated projects and blog posts
4. **Use Consistent Formatting**: Maintain consistent styling across projects and posts

## Support & Feedback

For issues, feature requests, or general feedback, please contact the development team or submit your request through the feedback portal.

## Version History

- **v1.0.0** (Current): Initial release with full CV management, portfolio showcase, and admin panel

---

**Last Updated**: October 27, 2025

