/*
  # Create CV Management Tables

  1. New Tables
    - `cv_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, required)
      - `title` (text, professional title)
      - `email` (text)
      - `phone` (text)
      - `location` (text)
      - `date_of_birth` (text, YYYY-MM-DD format)
      - `nationality` (text)
      - `profile_photo` (text, URL)
      - `profile_summary` (text)
      - `core_strengths` (jsonb, array of strings)
      - `languages` (jsonb, array of language objects)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cv_experiences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `job_title` (text, required)
      - `company` (text, required)
      - `location` (text)
      - `start_date` (text, YYYY-MM format)
      - `end_date` (text, YYYY-MM format)
      - `is_current` (boolean, default false)
      - `overview` (text)
      - `role_categories` (jsonb, array of category objects)
      - `description` (text)
      - `order` (integer, for sorting, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cv_education`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `school` (text, required)
      - `degree` (text)
      - `field` (text)
      - `location` (text)
      - `start_date` (text, YYYY-MM format)
      - `end_date` (text, YYYY-MM format)
      - `is_ongoing` (boolean, default false)
      - `overview` (text)
      - `education_sections` (jsonb, array of section objects)
      - `website` (text)
      - `eqf_level` (text, European Qualifications Framework level)
      - `description` (text)
      - `order` (integer, for sorting, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cv_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `skill_name` (text, required)
      - `category` (text)
      - `proficiency` (text)
      - `order` (integer, for sorting, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cv_templates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, required)
      - `description` (text)
      - `selected_experience_ids` (jsonb, array of uuids)
      - `selected_education_ids` (jsonb, array of uuids)
      - `selected_skill_ids` (jsonb, array of uuids)
      - `include_profile` (boolean, default true)
      - `include_languages` (boolean, default true)
      - `is_default` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure users can only access their own CV data

  3. Indexes
    - Add indexes on user_id for all tables for query performance
    - Add indexes on order columns for sorting
*/

-- Create cv_profiles table
CREATE TABLE IF NOT EXISTS cv_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text,
  email text,
  phone text,
  location text,
  date_of_birth text,
  nationality text,
  profile_photo text,
  profile_summary text,
  core_strengths jsonb,
  languages jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create cv_experiences table
CREATE TABLE IF NOT EXISTS cv_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  company text NOT NULL,
  location text,
  start_date text NOT NULL,
  end_date text,
  is_current boolean DEFAULT false NOT NULL,
  overview text,
  role_categories jsonb,
  description text,
  "order" integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create cv_education table
CREATE TABLE IF NOT EXISTS cv_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school text NOT NULL,
  degree text,
  field text,
  location text,
  start_date text NOT NULL,
  end_date text,
  is_ongoing boolean DEFAULT false NOT NULL,
  overview text,
  education_sections jsonb,
  website text,
  eqf_level text,
  description text,
  "order" integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create cv_skills table
CREATE TABLE IF NOT EXISTS cv_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  category text,
  proficiency text,
  "order" integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create cv_templates table
CREATE TABLE IF NOT EXISTS cv_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  selected_experience_ids jsonb,
  selected_education_ids jsonb,
  selected_skill_ids jsonb,
  include_profile boolean DEFAULT true NOT NULL,
  include_languages boolean DEFAULT true NOT NULL,
  is_default boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS cv_profiles_user_id_idx ON cv_profiles(user_id);
CREATE INDEX IF NOT EXISTS cv_experiences_user_id_idx ON cv_experiences(user_id);
CREATE INDEX IF NOT EXISTS cv_experiences_order_idx ON cv_experiences("order");
CREATE INDEX IF NOT EXISTS cv_education_user_id_idx ON cv_education(user_id);
CREATE INDEX IF NOT EXISTS cv_education_order_idx ON cv_education("order");
CREATE INDEX IF NOT EXISTS cv_skills_user_id_idx ON cv_skills(user_id);
CREATE INDEX IF NOT EXISTS cv_skills_category_idx ON cv_skills(category);
CREATE INDEX IF NOT EXISTS cv_skills_order_idx ON cv_skills("order");
CREATE INDEX IF NOT EXISTS cv_templates_user_id_idx ON cv_templates(user_id);

-- Enable Row Level Security
ALTER TABLE cv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cv_profiles
CREATE POLICY "Users can view own profile"
  ON cv_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON cv_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON cv_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON cv_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cv_experiences
CREATE POLICY "Users can view own experiences"
  ON cv_experiences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiences"
  ON cv_experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON cv_experiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
  ON cv_experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cv_education
CREATE POLICY "Users can view own education"
  ON cv_education FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education"
  ON cv_education FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education"
  ON cv_education FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own education"
  ON cv_education FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cv_skills
CREATE POLICY "Users can view own skills"
  ON cv_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON cv_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON cv_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON cv_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for cv_templates
CREATE POLICY "Users can view own templates"
  ON cv_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON cv_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON cv_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON cv_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);