#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT/.agents/skills"
DEST="${CODEX_HOME:-$HOME/.agents}/skills"

if [[ ! -d "$SOURCE" ]]; then
  echo "Skills folder not found: $SOURCE" >&2
  exit 1
fi

mkdir -p "$DEST"
for skill in ui-ux-design react-performance web-accessibility webapp-testing mobile-expo backend-api postgres-security; do
  if [[ -e "$DEST/$skill" ]]; then
    echo "Skipping existing skill: $DEST/$skill"
    continue
  fi
  cp -R "$SOURCE/$skill" "$DEST/$skill"
  echo "Installed: $DEST/$skill"
done

echo
echo "Restart Codex (or start a new session) to discover the global skills."
echo "No project dependencies were installed or changed."
