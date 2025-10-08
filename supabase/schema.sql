-- Supabase Database Schema for Softwar Learning Platform
-- Run this in Supabase SQL Editor: https://dmenzvniqndjkvyvpzut.supabase.co

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================
-- USERS & PROFILES
-- =======================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =======================
-- JOURNAL ENTRIES
-- =======================

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  week_of TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_week_of ON public.journal_entries(week_of);

-- =======================
-- JOURNAL LINKS
-- =======================

CREATE TABLE IF NOT EXISTS public.journal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('lesson', 'quiz', 'figure', 'glossary')) NOT NULL,
  ref TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage links for own entries"
  ON public.journal_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE id = journal_links.entry_id
      AND user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_journal_links_entry_id ON public.journal_links(entry_id);

-- =======================
-- GOALS
-- =======================

CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'done')) DEFAULT 'active',
  target_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

-- =======================
-- HABITS
-- =======================

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  cadence TEXT CHECK (cadence IN ('daily', 'weekly')) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habits"
  ON public.habits FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);

-- =======================
-- HABIT COMPLETIONS
-- =======================

CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entry_id, habit_id)
);

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage habit completions"
  ON public.habit_completions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.journal_entries
      WHERE id = habit_completions.entry_id
      AND user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_habit_completions_entry_id ON public.habit_completions(entry_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);

-- =======================
-- LESSON PROGRESS
-- =======================

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  module TEXT CHECK (module IN ('fundamentals', 'softwar')) NOT NULL,
  completed BOOLEAN DEFAULT false,
  quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
  quiz_attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON public.lesson_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_module ON public.lesson_progress(module);

-- =======================
-- WEAK AREAS
-- =======================

CREATE TABLE IF NOT EXISTS public.weak_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  miss_count INTEGER DEFAULT 0,
  related_lessons TEXT[] DEFAULT '{}',
  suggested_flashcards TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic)
);

ALTER TABLE public.weak_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own weak areas"
  ON public.weak_areas FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weak_areas_user_id ON public.weak_areas(user_id);
CREATE INDEX IF NOT EXISTS idx_weak_areas_miss_count ON public.weak_areas(miss_count DESC);

-- =======================
-- FUNCTIONS & TRIGGERS
-- =======================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weak_areas_updated_at
  BEFORE UPDATE ON public.weak_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =======================
-- STORAGE (for future file uploads)
-- =======================

-- Create a storage bucket for user uploads (optional - for future use)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('user-uploads', 'user-uploads', false);

-- =======================
-- INDEXES FOR PERFORMANCE
-- =======================

-- Additional composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created
  ON public.journal_entries(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_module
  ON public.lesson_progress(user_id, module);

-- =======================
-- DONE!
-- =======================

-- You can verify the schema by running:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
