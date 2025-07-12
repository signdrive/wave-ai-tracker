-- Create enum for buddy request status
CREATE TYPE buddy_request_status AS ENUM ('pending', 'accepted', 'declined');

-- Create enum for group visibility
CREATE TYPE group_visibility AS ENUM ('public', 'private');

-- Create buddy requests table for surf buddy matching
CREATE TABLE public.buddy_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    requested_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message text,
    status buddy_request_status DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(requester_id, requested_id)
);

-- Create surf groups table
CREATE TABLE public.surf_groups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    location text NOT NULL,
    beach_region text,
    creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    visibility group_visibility DEFAULT 'public',
    max_members integer DEFAULT 50,
    member_count integer DEFAULT 1,
    group_image text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create group members table
CREATE TABLE public.group_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id uuid REFERENCES public.surf_groups(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role text DEFAULT 'member', -- member, admin, moderator
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- Create session posts table for sharing sessions socially
CREATE TABLE public.session_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id uuid REFERENCES public.surf_sessions(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    photos text[], -- Array of photo URLs
    location text,
    wave_rating integer CHECK (wave_rating >= 1 AND wave_rating <= 5),
    fun_rating integer CHECK (fun_rating >= 1 AND fun_rating <= 5),
    crowd_level text,
    visibility text DEFAULT 'public', -- public, friends, private
    like_count integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create session likes table
CREATE TABLE public.session_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.session_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- Create session comments table
CREATE TABLE public.session_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES public.session_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surf_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for buddy_requests
CREATE POLICY "Users can view buddy requests involving them" ON public.buddy_requests
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create buddy requests" ON public.buddy_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update buddy requests involving them" ON public.buddy_requests
    FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- RLS Policies for surf_groups
CREATE POLICY "Public groups are viewable by everyone" ON public.surf_groups
    FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id OR 
    auth.uid() IN (SELECT user_id FROM public.group_members WHERE group_id = surf_groups.id));

CREATE POLICY "Authenticated users can create groups" ON public.surf_groups
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group creators can update their groups" ON public.surf_groups
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Group creators can delete their groups" ON public.surf_groups
    FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for group_members
CREATE POLICY "Group members are viewable by group members" ON public.group_members
    FOR SELECT USING (auth.uid() = user_id OR 
    group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can join public groups" ON public.group_members
    FOR INSERT WITH CHECK (auth.uid() = user_id AND 
    group_id IN (SELECT id FROM public.surf_groups WHERE visibility = 'public'));

CREATE POLICY "Users can leave groups they're in" ON public.group_members
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_posts
CREATE POLICY "Public session posts are viewable by everyone" ON public.session_posts
    FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own session posts" ON public.session_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session posts" ON public.session_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own session posts" ON public.session_posts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_likes
CREATE POLICY "Session likes are viewable by everyone" ON public.session_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like posts" ON public.session_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" ON public.session_likes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_comments
CREATE POLICY "Session comments are viewable by everyone" ON public.session_comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON public.session_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.session_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.session_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_buddy_requests_updated_at
    BEFORE UPDATE ON public.buddy_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_surf_groups_updated_at
    BEFORE UPDATE ON public.surf_groups
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_posts_updated_at
    BEFORE UPDATE ON public.session_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_comments_updated_at
    BEFORE UPDATE ON public.session_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update like counts
CREATE OR REPLACE FUNCTION update_session_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.session_posts 
        SET like_count = like_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.session_posts 
        SET like_count = like_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update comment counts
CREATE OR REPLACE FUNCTION update_session_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.session_posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.session_posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER update_like_count_trigger
    AFTER INSERT OR DELETE ON public.session_likes
    FOR EACH ROW EXECUTE FUNCTION update_session_post_like_count();

CREATE TRIGGER update_comment_count_trigger
    AFTER INSERT OR DELETE ON public.session_comments
    FOR EACH ROW EXECUTE FUNCTION update_session_post_comment_count();

-- Create function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.surf_groups 
        SET member_count = member_count + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.surf_groups 
        SET member_count = member_count - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for group member count
CREATE TRIGGER update_group_member_count_trigger
    AFTER INSERT OR DELETE ON public.group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();