#!/usr/bin/env python3
import re

# Read the file
with open('components/onboarding-form.tsx', 'r') as f:
    content = f.read()

# Pattern to match input/textarea/select with register
pattern = r'<(input|textarea|select)\s+\{\.\.\.register\([\'"]([^\'"]+)[\'"]\)\}\s+className="w-full px-3 py-2 border rounded-md"'

def replacement(match):
    element_type = match.group(1)
    field_path = match.group(2)
    return f'<{element_type} {{...register(\'{field_path}\')}} className={{getInputClassName(\'{field_path}\')}}'

# Replace all occurrences
updated_content = re.sub(pattern, replacement, content)

# Write back
with open('components/onboarding-form.tsx', 'w') as f:
    f.write(updated_content)

print("✅ Updated all static classNames to dynamic ones")
