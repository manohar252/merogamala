#!/bin/bash

# Quick save to both branches
# Usage: ./quick-save-both.sh "Your commit message"

COMMIT_MSG="${1:-Auto-save to both branches $(date)}"

echo "💾 Quick save to BOTH branches..."
echo "Message: $COMMIT_MSG"
echo "================================"

# Save to feature branch
echo "🌿 Saving to cursor/debug-code-issues-ad59..."
git checkout cursor/debug-code-issues-ad59
git add -A
git commit -m "$COMMIT_MSG"
git push origin cursor/debug-code-issues-ad59

# Save to main branch
echo "🌳 Saving to main..."
git checkout main
git pull origin main
git merge cursor/debug-code-issues-ad59 --no-ff -m "Merge: $COMMIT_MSG"
git push origin main

echo "✅ DONE! Saved to both branches:"
echo "   - cursor/debug-code-issues-ad59"
echo "   - main"