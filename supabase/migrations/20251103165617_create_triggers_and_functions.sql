/*
  # Create Database Functions and Triggers

  1. Functions
    - `update_updated_at_column()` - Automatically updates updated_at timestamp
    - `is_admin(user_id uuid)` - Checks if user has admin role

  2. Triggers
    - Apply updated_at trigger to all tables with updated_at column
    - Automatically maintains timestamp accuracy

  3. Notes
    - Triggers fire before update operations
    - Functions are reusable across multiple tables
*/

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role') = 'admin'
    FROM auth.users
    WHERE id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at trigger to cv_profiles
DROP TRIGGER IF EXISTS update_cv_profiles_updated_at ON cv_profiles;
CREATE TRIGGER update_cv_profiles_updated_at
  BEFORE UPDATE ON cv_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to cv_experiences
DROP TRIGGER IF EXISTS update_cv_experiences_updated_at ON cv_experiences;
CREATE TRIGGER update_cv_experiences_updated_at
  BEFORE UPDATE ON cv_experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to cv_education
DROP TRIGGER IF EXISTS update_cv_education_updated_at ON cv_education;
CREATE TRIGGER update_cv_education_updated_at
  BEFORE UPDATE ON cv_education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to cv_skills
DROP TRIGGER IF EXISTS update_cv_skills_updated_at ON cv_skills;
CREATE TRIGGER update_cv_skills_updated_at
  BEFORE UPDATE ON cv_skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to cv_templates
DROP TRIGGER IF EXISTS update_cv_templates_updated_at ON cv_templates;
CREATE TRIGGER update_cv_templates_updated_at
  BEFORE UPDATE ON cv_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to portfolio_projects
DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to portfolio_settings
DROP TRIGGER IF EXISTS update_portfolio_settings_updated_at ON portfolio_settings;
CREATE TRIGGER update_portfolio_settings_updated_at
  BEFORE UPDATE ON portfolio_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();