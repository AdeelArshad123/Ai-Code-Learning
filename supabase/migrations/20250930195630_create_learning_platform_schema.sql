/*
  # Learning Platform Database Schema

  ## Overview
  Complete database schema for the AI-powered learning and coding assistant platform.

  ## 1. New Tables

  ### `profiles`
  User profile information extending Supabase auth.users
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `avatar_url` (text, optional)
  - `role` (text, default 'student')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `quizzes`
  Quiz definitions and metadata
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `category` (text)
  - `difficulty` (text: beginner, intermediate, advanced)
  - `language` (text: python, javascript, java, etc.)
  - `created_by` (uuid, references profiles)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `quiz_questions`
  Individual questions for each quiz
  - `id` (uuid, primary key)
  - `quiz_id` (uuid, references quizzes)
  - `question_text` (text)
  - `question_type` (text: multiple_choice, code_completion, true_false)
  - `options` (jsonb, array of answer options)
  - `correct_answer` (text)
  - `explanation` (text)
  - `points` (integer, default 10)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### `quiz_attempts`
  User quiz attempt records
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `quiz_id` (uuid, references quizzes)
  - `score` (integer)
  - `total_points` (integer)
  - `percentage` (numeric)
  - `time_spent_seconds` (integer)
  - `answers` (jsonb, array of user answers)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `learning_progress`
  Track user progress across topics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `category` (text)
  - `language` (text)
  - `total_quizzes_taken` (integer, default 0)
  - `total_score` (integer, default 0)
  - `average_percentage` (numeric, default 0)
  - `total_time_spent_seconds` (integer, default 0)
  - `current_streak_days` (integer, default 0)
  - `last_activity_date` (date)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `code_generations`
  History of AI-generated code
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `prompt` (text)
  - `language` (text)
  - `generated_code` (text)
  - `explanation` (text)
  - `is_bookmarked` (boolean, default false)
  - `created_at` (timestamptz)

  ### `achievements`
  User achievements and badges
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `achievement_type` (text)
  - `title` (text)
  - `description` (text)
  - `icon` (text)
  - `earned_at` (timestamptz)

  ## 2. Security

  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Users can read their own data
  - Users can update their own profiles
  - Quiz content is readable by authenticated users
  - Only users can create/update their own attempts and progress
  - Admin users can manage quiz content

  ## 3. Indexes

  Performance indexes on frequently queried columns:
  - quiz_attempts.user_id
  - quiz_attempts.quiz_id
  - learning_progress.user_id
  - code_generations.user_id
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'code_completion', 'true_false')),
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text,
  points integer DEFAULT 10,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  total_points integer DEFAULT 0,
  percentage numeric DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  answers jsonb DEFAULT '[]'::jsonb,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  language text NOT NULL,
  total_quizzes_taken integer DEFAULT 0,
  total_score integer DEFAULT 0,
  average_percentage numeric DEFAULT 0,
  total_time_spent_seconds integer DEFAULT 0,
  current_streak_days integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category, language)
);

CREATE TABLE IF NOT EXISTS code_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  language text NOT NULL,
  generated_code text NOT NULL,
  explanation text,
  is_bookmarked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  earned_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can view active quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (is_active = true OR created_by = auth.uid());

CREATE POLICY "Admin users can manage quizzes"
  ON quizzes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.is_active = true
    )
  );

CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own learning progress"
  ON learning_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress"
  ON learning_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress"
  ON learning_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own code generations"
  ON code_generations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own code generations"
  ON code_generations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own code generations"
  ON code_generations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own code generations"
  ON code_generations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_code_generations_user_id ON code_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
