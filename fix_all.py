import re

def fix_file(path, func):
    with open(path, "r") as f:
        content = f.read()
    new_content = func(content)
    if new_content != content:
        with open(path, "w") as f:
            f.write(new_content)

def fix_entrenamiento(c):
    # Change div role="button" tabIndex={0} to button type="button"
    c = c.replace('<div\n            key={exercise.id}\n            role="button"\n            tabIndex={0}', '<button\n            type="button"\n            key={exercise.id}')
    c = c.replace('<div\n            role="button"\n            tabIndex={0}', '<button\n            type="button"')
    return c

fix_file("src/app/entrenamiento/page.tsx", fix_entrenamiento)

def fix_iterable(c):
    # replace track => track.stop() with track => { track.stop(); }
    c = re.sub(r'=>\s*([a-zA-Z0-9_\.]+\((.*?)\))', r'=> { \1; }', c)
    # replace answer => counts.set(...) with answer => { counts.set(...); }
    return c

fix_file("src/components/lesson/hooks/useLessonPractice.ts", fix_iterable)
fix_file("src/components/lesson/hooks/useMicrophonePitchDetection.ts", fix_iterable)
fix_file("src/components/modules/rhythm/hooks/useRhythmEngine.ts", fix_iterable)
fix_file("src/lib/chord-inversions/theory.ts", fix_iterable)
fix_file("src/lib/chords/theory.ts", fix_iterable)
fix_file("src/lib/masteryStore.ts", fix_iterable)

def fix_map_name(c):
    return c.replace('import { ArrowRight, Map', 'import { ArrowRight, Map as MapIcon').replace('<Map ', '<MapIcon ')

fix_file("src/components/modules/module-1/units/unit-4/Unit4MusicMap.tsx", fix_map_name)
fix_file("src/components/modules/module-2/units/unit-1/Unit1KeyboardMap.tsx", fix_map_name)

def fix_svg_title(c):
    return c.replace('<svg', '<svg aria-hidden="true"')
    
fix_file("src/components/modules/module-1/units/unit-9/components/FinalReadingChallenge.tsx", fix_svg_title)
fix_file("src/components/shared/visualizers/PitchVisualizer.tsx", fix_svg_title)
fix_file("src/components/shared/visualizers/TieVisualizer.tsx", fix_svg_title)
fix_file("src/components/shared/visualizers/TrebleClefVisualizer.tsx", fix_svg_title)

def fix_implicit_any(c):
    c = c.replace('let clientY;', 'let clientY: number;')
    c = c.replace('let renderAlter;', 'let renderAlter: number | undefined;')
    return c
    
fix_file("src/components/shared/visualizers/PitchVisualizer.tsx", fix_implicit_any)
fix_file("src/lib/music/xmlParser.ts", fix_implicit_any)

