#!/bin/bash

# 🚀 SUPER QUICK BRANCH CLEANUP
# One command to clean up all merged branches

echo "🚀 Quick Branch Cleanup Starting..."

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository!"
    exit 1
fi

echo "📊 Before cleanup:"
echo "   Branches: $(git branch | wc -l)"

# The magic one-liner - safe cleanup
git checkout main 2>/dev/null || git checkout master 2>/dev/null || {
    echo "❌ No main or master branch found!"
    exit 1
}

echo "🔄 Updating main branch..."
git pull origin $(git branch --show-current) 2>/dev/null

echo "🧹 Cleaning merged branches..."
merged_count=$(git branch --merged | grep -v "\*\|main\|master\|develop" | wc -l)

if [ "$merged_count" -gt 0 ]; then
    git branch --merged | grep -v "\*\|main\|master\|develop" | xargs -n 1 git branch -d
    echo "✅ Deleted $merged_count merged branches"
else
    echo "ℹ️  No merged branches to delete"
fi

echo "🌐 Cleaning remote tracking..."
git remote prune origin 2>/dev/null

echo ""
echo "📊 After cleanup:"
echo "   Branches: $(git branch | wc -l)"

echo ""
echo "🎉 Quick cleanup complete!"
echo "📋 Remaining branches:"
git branch

echo ""
echo "💡 For more advanced cleanup options, run: ./cleanup-branches.sh"