#!/bin/bash

# 🌿 GIT BRANCH CLEANUP SCRIPT
# This script safely cleans up git branches while preserving important ones

echo "🌿 Git Branch Cleanup Tool"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository!"
    exit 1
fi

print_info "Current repository: $(basename $(git rev-parse --show-toplevel))"

# Show current branch status
echo ""
print_info "Current branch: $(git branch --show-current)"
print_info "Total branches: $(git branch -a | wc -l)"

# List all branches
echo ""
print_info "All branches:"
git branch -a

echo ""
echo "🔧 CLEANUP OPTIONS:"
echo "1. Safe cleanup (only merged branches)"
echo "2. Aggressive cleanup (all except main/master)"
echo "3. Interactive cleanup (choose branches manually)"
echo "4. Just clean remote tracking branches"
echo "5. Show branch information only"
echo "6. Exit"

read -p "Choose option (1-6): " choice

case $choice in
    1)
        echo ""
        print_info "🛡️  SAFE CLEANUP - Only removing merged branches"
        
        # Switch to main branch
        if git show-ref --verify --quiet refs/heads/main; then
            git checkout main
            print_status "Switched to main branch"
        elif git show-ref --verify --quiet refs/heads/master; then
            git checkout master
            print_status "Switched to master branch"
        else
            print_error "No main or master branch found!"
            exit 1
        fi
        
        # Update main branch
        git pull origin $(git branch --show-current)
        print_status "Updated main branch"
        
        # Clean up merged branches
        merged_branches=$(git branch --merged | grep -v "\*\|main\|master\|develop\|staging\|production")
        if [ -n "$merged_branches" ]; then
            echo "$merged_branches" | xargs -n 1 git branch -d
            print_status "Deleted merged branches"
        else
            print_info "No merged branches to delete"
        fi
        
        # Clean up remote tracking branches
        git remote prune origin
        print_status "Cleaned up remote tracking branches"
        ;;
        
    2)
        echo ""
        print_warning "⚠️  AGGRESSIVE CLEANUP - This will delete ALL local branches except main/master"
        read -p "Are you sure? This cannot be undone! (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            # Switch to main/master
            if git show-ref --verify --quiet refs/heads/main; then
                git checkout main
            elif git show-ref --verify --quiet refs/heads/master; then
                git checkout master
            fi
            
            # Delete all branches except protected ones
            git branch | grep -v "main\|master\|develop\|staging\|production\|\*" | xargs -n 1 git branch -D
            print_status "Deleted all local branches except protected ones"
            
            # Clean up remote tracking
            git remote prune origin
            print_status "Cleaned up remote tracking branches"
        else
            print_info "Cleanup cancelled"
        fi
        ;;
        
    3)
        echo ""
        print_info "📋 INTERACTIVE CLEANUP - Choose branches to delete"
        
        # List branches with numbers
        branches=$(git branch | grep -v "\*" | sed 's/^[ ]*//')
        if [ -z "$branches" ]; then
            print_info "No other branches to delete"
            exit 0
        fi
        
        echo "Branches (current branch is excluded):"
        echo "$branches" | nl
        
        echo ""
        read -p "Enter branch numbers to delete (space-separated, e.g., 1 3 5): " selections
        
        for num in $selections; do
            branch=$(echo "$branches" | sed -n "${num}p")
            if [ -n "$branch" ]; then
                git branch -D "$branch"
                print_status "Deleted branch: $branch"
            fi
        done
        ;;
        
    4)
        echo ""
        print_info "🧹 Cleaning only remote tracking branches"
        git remote prune origin
        print_status "Remote tracking branches cleaned"
        ;;
        
    5)
        echo ""
        print_info "📊 BRANCH INFORMATION"
        echo ""
        echo "Local branches:"
        git branch -v
        echo ""
        echo "Remote branches:"
        git branch -r
        echo ""
        echo "Branch count: $(git branch | wc -l) local, $(git branch -r | wc -l) remote"
        
        # Show merged branches
        echo ""
        echo "Merged branches (safe to delete):"
        git branch --merged | grep -v "\*\|main\|master\|develop"
        ;;
        
    6)
        print_info "Cleanup cancelled"
        exit 0
        ;;
        
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
print_status "🎉 Branch cleanup completed!"
print_info "Current branches:"
git branch

echo ""
print_info "💡 Tips for future branch management:"
echo "   - Create feature branches from main/master"
echo "   - Delete branches after merging"
echo "   - Use descriptive branch names"
echo "   - Regular cleanup prevents accumulation"