import os
import re

def fix_duplicates(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    def replacer(match):
        button_tag = match.group(0)
        if button_tag.count('type="button"') > 1:
            parts = button_tag.split('type="button"')
            new_tag = parts[0] + 'type="button"' + "".join(parts[1:])
            return new_tag
        return button_tag

    new_content = re.sub(r'<button[^>]+>', replacer, content)
    
    if new_content != content:
        with open(filepath, "w") as f:
            f.write(new_content)
        return True
    return False

changed = 0
for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            if fix_duplicates(os.path.join(root, file)):
                changed += 1

print(f"Fixed {changed} files.")
