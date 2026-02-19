#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

if [ -z "$FILE_PATH" ] || [ "$FILE_PATH" = "null" ]; then
  exit 0
fi

npx prettier --write "$FILE_PATH" 2>/dev/null

if [[ "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  npx eslint --fix "$FILE_PATH" 2>/dev/null
fi

exit 0
