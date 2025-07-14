-- =============================================
-- SUPABASE DATABASE SETUP
-- =============================================
-- Run this script in your Supabase SQL Editor
-- Make sure to replace any placeholder values

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_slug, user_id)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. CREATE INDEXES for better performance
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_visibility ON comments(is_hidden, post_slug);

-- Reactions indexes
CREATE INDEX IF NOT EXISTS idx_reactions_post_slug ON post_reactions(post_slug);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON post_reactions(user_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_page_views_post_slug ON page_views(post_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_hash ON page_views(ip_hash);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE RLS POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (NOT is_hidden);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can manage comments" ON comments
  FOR ALL USING (auth.role() = 'service_role');

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone" ON post_reactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage own reactions" ON post_reactions
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role can manage reactions" ON post_reactions
  FOR ALL USING (auth.role() = 'service_role');

-- Page views policies
CREATE POLICY "Anyone can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage page views" ON page_views
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 5. CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =============================================

-- Function to get comment count for a post
CREATE OR REPLACE FUNCTION get_comment_count(post_slug_param TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM comments
    WHERE post_slug = post_slug_param AND is_hidden = FALSE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get reaction counts for a post
CREATE OR REPLACE FUNCTION get_reaction_counts(post_slug_param TEXT)
RETURNS JSON AS $$
DECLARE
  likes_count INTEGER;
  dislikes_count INTEGER;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE reaction_type = 'like'),
    COUNT(*) FILTER (WHERE reaction_type = 'dislike')
  INTO likes_count, dislikes_count
  FROM post_reactions
  WHERE post_slug = post_slug_param;
  
  RETURN json_build_object(
    'likes', COALESCE(likes_count, 0),
    'dislikes', COALESCE(dislikes_count, 0)
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. CREATE TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- =============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 7. INSERT SAMPLE DATA (OPTIONAL)
-- =============================================

-- You can uncomment and modify this section to add sample data
/*
-- Sample user
INSERT INTO users (email, name, provider, provider_id) VALUES
('test@example.com', 'Test User', 'google', 'google123')
ON CONFLICT (email) DO NOTHING;

-- Sample comments
INSERT INTO comments (post_slug, user_id, content) VALUES
('welcome-to-my-blog', (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1), 'Great post! Looking forward to more content.')
ON CONFLICT DO NOTHING;
*/

-- =============================================
-- SETUP COMPLETE
-- =============================================

-- Verify the setup by running these queries:
SELECT 'Users table' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Comments table', COUNT(*) FROM comments
UNION ALL
SELECT 'Post reactions table', COUNT(*) FROM post_reactions
UNION ALL
SELECT 'Page views table', COUNT(*) FROM page_views;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'comments', 'post_reactions', 'page_views');

-- List all policies
SELECT schemaname, tablename, policyname, permissive, cmd, qual
FROM pg_policies 
WHERE tablename IN ('users', 'comments', 'post_reactions', 'page_views')
ORDER BY tablename, policyname; 