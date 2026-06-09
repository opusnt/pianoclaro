import os
import re

def fix_buttons(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find <button ... > without type="..."
    # We use a regex that matches <button followed by attributes, but not containing type=
    
    # Actually, a simpler way is to replace <button with <button type="button"
    # but we must avoid adding it if type= is already there.
    
    def replacer(match):
        attrs = match.group(1)
        if 'type=' in attrs:
            return match.group(0) # don't change
        return f'<button type="button"{attrs}'

    new_content = re.sub(r'<button([^>]*?)', replacer, content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

changed_files = 0
for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            if fix_buttons(os.path.join(root, file)):
                changed_files += 1

print(f"Fixed buttons in {changed_files} files.")
