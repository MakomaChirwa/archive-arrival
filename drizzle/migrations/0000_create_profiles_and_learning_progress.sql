CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '',
 education text NOT NULL DEFAULT '',
 interests text[] NOT NULL DEFAULT '{}',
 language text NOT NULL DEFAULT 'English',
 data_saver boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE FUNCTION public.create_signup_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.profiles (id, display_name, education, interests, language)
 VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.raw_user_meta_data->>'education', ''), ARRAY(SELECT jsonb_array_elements_text(COALESCE(NEW.raw_user_meta_data->'interests', '[]'::jsonb))), CASE WHEN NEW.raw_user_meta_data->>'language' = 'Sepedi' THEN 'Sepedi' ELSE 'English' END);
 RETURN NEW;
END;
$$;
CREATE TRIGGER on_sheconnect_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_signup_profile();
CREATE TABLE public.learning_progress (
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 path_id text NOT NULL CHECK (path_id IN ('ux', 'web', 'data')),
 step_index integer NOT NULL CHECK (step_index BETWEEN 0 AND 3),
 completed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id, path_id, step_index)
);
GRANT SELECT, INSERT, DELETE ON public.learning_progress TO authenticated;
GRANT ALL ON public.learning_progress TO service_role;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own progress" ON public.learning_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Save own progress" ON public.learning_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Undo own progress" ON public.learning_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);