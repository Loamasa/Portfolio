/*
  # Create Portfolio and Blog Tables

  1. New Tables
    - `portfolio_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text)
      - `image_url` (text)
      - `tags` (jsonb, array of strings)
      - `link` (text, URL to project)
      - `order` (integer, for sorting, default 0)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `blog_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `slug` (text, required, unique)
      - `content` (text)
      - `excerpt` (text)
      - `image_url` (text)
      - `tags` (jsonb, array of strings)
      - `is_published` (boolean, default false)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `portfolio_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `portfolio_title` (text)
      - `portfolio_description` (text)
      - `portfolio_image` (text, URL)
      - `social_links` (jsonb, object with social media links)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can manage their own content
    - Published projects and blog posts are publicly readable
    - Portfolio settings are private to the user

  3. Indexes
    - Add indexes on user_id for all tables
    - Add index on slug for blog posts (unique)
    - Add indexes on order columns for sorting
    - Add indexes on is_published for filtering
*/

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  tags jsonb,
  link text,
  "order" integer DEFAULT 0 NOT NULL,
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  image_url text,
  tags jsonb,
  is_published boolean DEFAULT false NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create portfolio_settings table
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portfolio_title text,
  portfolio_description text,
  portfolio_image text,
  social_links jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS portfolio_projects_user_id_idx ON portfolio_projects(user_id);
CREATE INDEX IF NOT EXISTS portfolio_projects_order_idx ON portfolio_projects("order");
CREATE INDEX IF NOT EXISTS portfolio_projects_is_published_idx ON portfolio_projects(is_published);

CREATE INDEX IF NOT EXISTS blog_posts_user_id_idx ON blog_posts(user_id);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_is_published_idx ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);

CREATE INDEX IF NOT EXISTS portfolio_settings_user_id_idx ON portfolio_settings(user_id);

-- Enable Row Level Security
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_projects
CREATE POLICY "Users can view own projects"
  ON portfolio_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view published projects"
  ON portfolio_projects FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Users can insert own projects"
  ON portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON portfolio_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON portfolio_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for blog_posts
CREATE POLICY "Users can view own blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Users can insert own blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for portfolio_settings
CREATE POLICY "Users can view own settings"
  ON portfolio_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON portfolio_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON portfolio_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON portfolio_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);