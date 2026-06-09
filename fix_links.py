import os

files_to_check = [
  "src/app/teoria/page.tsx",
  "src/components/modules/module-1/units/unit-1/Unit1SoundVsNoise.tsx",
  "src/components/modules/module-1/units/unit-2/Unit2SoundDetective.tsx",
  "src/components/modules/module-1/units/unit-4/Unit4MusicMap.tsx",
  "src/components/modules/module-1/units/unit-5/Unit5MeetTheNotes.tsx",
  "src/components/modules/module-1/units/unit-6/Unit6TrebleClef.tsx",
  "src/components/modules/module-1/units/unit-7/Unit7TimeAndRhythm.tsx",
  "src/components/modules/module-1/units/unit-8/Unit8Measures.tsx",
  "src/components/modules/module-1/units/unit-9/Unit9ExtendedNotes.tsx",
  "src/components/modules/module-2/units/unit-1/Unit1KeyboardMap.tsx",
  "src/components/modules/module-2/units/unit-2/Unit2MusicalDistances.tsx",
  "src/components/modules/module-2/units/unit-3/Unit3Accidentals.tsx",
  "src/components/modules/module-2/units/unit-4/Unit4AccidentalNotation.tsx",
  "src/components/SiteHeader.tsx",
  "src/app/page.tsx"
]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content.replace('href="/modulos/', 'href="/teoria/')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

