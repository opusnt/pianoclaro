import os
import re

def replace_in_file(filepath, pattern, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(pattern, replacement, content)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {filepath}")

# Fix RhythmExerciseScreen.tsx
replace_in_file(
    "src/components/modules/rhythm/RhythmExerciseScreen.tsx",
    r'@/components/shared/visualizers/RhythmVisualizer',
    r'@/components/modules/rhythm/RhythmVisualizer'
)

# Fix relative imports in shared components
shared_files = []
for root, _, files in os.walk("src/components/shared"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            shared_files.append(os.path.join(root, file))

# We'll just regex replace any relative import ending in notesData or rhythmFigures to use the new absolute @/lib paths
for filepath in shared_files:
    replace_in_file(filepath, r'["\'](\.\.[/a-zA-Z0-9_-]*?/notesData)["\']', r'"@/lib/music/notesData"')
    replace_in_file(filepath, r'["\'](\.\.[/a-zA-Z0-9_-]*?/rhythmFigures)["\']', r'"@/lib/music/rhythmFigures"')

# We also need to fix any other files that were importing notesData or rhythmFigures from their old paths.
for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            fp = os.path.join(root, file)
            # Find any import ending in notesData or rhythmFigures that isn't already @/lib/music
            # This is simpler: just replace `import { ... } from "any/path/notesData"`
            replace_in_file(fp, r'from\s+["\']([^"\']*?/notesData)["\']', r'from "@/lib/music/notesData"')
            replace_in_file(fp, r'from\s+["\']([^"\']*?/rhythmFigures)["\']', r'from "@/lib/music/rhythmFigures"')

print("Fixes applied.")
