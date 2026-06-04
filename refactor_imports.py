import os
import glob
import re

MAPPINGS = {
    "PitchVisualizer": "@/components/shared/visualizers/PitchVisualizer",
    "TrebleClefVisualizer": "@/components/shared/visualizers/TrebleClefVisualizer",
    "DistanceVisualizer": "@/components/shared/visualizers/DistanceVisualizer",
    "RhythmVisualizer": "@/components/shared/visualizers/RhythmVisualizer",
    "MeasureVisualizer": "@/components/shared/visualizers/MeasureVisualizer",
    "DottedNoteVisualizer": "@/components/shared/visualizers/DottedNoteVisualizer",
    "TieVisualizer": "@/components/shared/visualizers/TieVisualizer",
    "AccidentalMovementVisualizer": "@/components/shared/visualizers/AccidentalMovementVisualizer",

    "InteractiveKeyboard": "@/components/shared/interactive/InteractiveKeyboard",
    "IntervalStepper": "@/components/shared/interactive/IntervalStepper",
    "MeasureBuilder": "@/components/shared/interactive/MeasureBuilder",
    "BeatTracker": "@/components/shared/interactive/BeatTracker",

    "NoteCard": "@/components/shared/cards/NoteCard",
    "TimeSignatureCard": "@/components/shared/cards/TimeSignatureCard",
    "EnharmonicPairCard": "@/components/shared/cards/EnharmonicPairCard",

    "AccidentalBadge": "@/components/shared/badges/AccidentalBadge",

    "useAudioSequencer": "@/components/shared/audio/useAudioSequencer",
    "useAudioSimulator": "@/components/shared/audio/useAudioSimulator",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    for component, new_path in MAPPINGS.items():
        # This regex looks for `import { Component } from ".../Component"`
        # or `import { ... Component ... } from ".../something"`
        # Actually it's easier: just replace any string inside quotes that ends with the component name
        # inside an import statement for that component.
        
        # We look for import statements that contain the component name.
        # Example: import { PitchNote, PitchVisualizer } from "../../unit-4/components/PitchVisualizer";
        # We can replace the whole string inside the quotes if it ends with /Component Name
        
        # Regex to find: import { ... } from "any_path/ComponentName";
        # and replace any_path/ComponentName with new_path
        
        pattern = r'(import\s+(?:type\s+)?(?:{[^}]*}|[A-Za-z0-9_]+)\s+from\s+["\'])(.*?)(["\'])'
        
        def repl(m):
            prefix = m.group(1)
            path = m.group(2)
            suffix = m.group(3)
            
            # If the import path is for the component we are checking
            # or if it's a relative path that resolves to it. We can just check if the path ends with the component name.
            if path.endswith("/" + component) or path == component or path.endswith("/" + component + ".tsx"):
                return prefix + new_path + suffix
            elif component in prefix:
                # Sometimes people import multiple things from a shared index. But here each component was in its own file.
                # If the component is being imported, and the path contains the component name or related dir
                if "/" + component in path or path.endswith(component):
                    return prefix + new_path + suffix
            return m.group(0)

        content = re.sub(pattern, repl, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            process_file(os.path.join(root, file))

print("Done.")
