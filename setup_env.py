import os

env_content = """# Update these with your Supabase details from your project settings > API
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
"""

if not os.path.exists('.env.example'):
    with open('.env.example', 'w') as f:
        f.write(env_content)

if not os.path.exists('.env.local'):
    with open('.env.local', 'w') as f:
        f.write(env_content)

os.makedirs('src/lib/supabase', exist_ok=True)
