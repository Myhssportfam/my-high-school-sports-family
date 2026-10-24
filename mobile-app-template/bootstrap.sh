#!/usr/bin/env bash
set -euo pipefail
template_dir="$(cd "$(dirname "$0")" && pwd)"
mobile_target="${1:-$HOME/Documents/myhssportsfamily-mobile}"
if [ -e "$mobile_target" ]; then
  echo "Destination already exists: $mobile_target. Choose a new folder to avoid replacing your work."
  exit 1
fi
npx create-expo-app@latest "$mobile_target" --template blank-typescript
cd "$mobile_target"
npx expo install react-native-webview react-native-safe-area-context expo-dev-client
cp "$template_dir/App.tsx.template" App.tsx
cp "$template_dir/app.json.template" app.json
cp "$template_dir/eas.json" eas.json
mkdir -p assets
cp "$template_dir/app-icon.png" assets/app-icon.png
echo "Created the mobile development project at $mobile_target"
echo "Read the included README before testing or building."
