# 🌿 GIT BRANCH CLEANUP - COMPLETE SOLUTION

## 🚨 **PROBLEM**: Too Many Branches
Having too many branches can cause:
- Confusion about which branch to work on
- Difficulty finding the right code
- Performance issues in Git
- Cluttered repository management

---

## 🎯 **QUICK SOLUTION** (Choose One)

### Option A: **SAFE CLEANUP** (Recommended)
```bash
# 1. First, let's see what we have
git branch -a
git remote -v

# 2. Switch to main/master branch
git checkout main
# OR if your default branch is master:
# git checkout master

# 3. Update main branch
git pull origin main

# 4. Clean up merged branches only (SAFE)
git branch --merged | grep -v "\*\|main\|master\|develop" | xargs -n 1 git branch -d

# 5. Clean up remote tracking branches that no longer exist
git remote prune origin
```

### Option B: **AGGRESSIVE CLEANUP** (More Thorough)
```bash
# WARNING: This will delete unmerged branches too!
# Make sure you don't need any of them first

# 1. List all branches to review
git branch -a

# 2. Delete all local branches except main/master
git branch | grep -v "main\|master\|\*" | xargs -n 1 git branch -D

# 3. Clean up remote references
git remote prune origin

# 4. Reset to clean state
git checkout main
git pull origin main
```

---

## 🔧 **AUTOMATED BRANCH CLEANUP SCRIPT**

I've created a comprehensive script for you: `cleanup-branches.sh`

### Run the automated script:
```bash
# Make it executable
chmod +x cleanup-branches.sh

# Run the interactive cleanup tool
./cleanup-branches.sh
```

---

## ⚡ **INSTANT ONE-LINER SOLUTIONS**

### 1. **SUPER QUICK CLEANUP** (Most Common)
```bash
git checkout main && git pull origin main && git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d && git remote prune origin
```

### 2. **NUCLEAR OPTION** (Delete Everything Except Main)
```bash
git checkout main && git branch | grep -v "main\|master\|\*" | xargs -n 1 git branch -D
```

### 3. **REMOTE CLEANUP** (Clean Dead Remote Branches)
```bash
git remote prune origin && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```

---

## 📋 **MANUAL STEP-BY-STEP** (If you prefer control)

### Step 1: See what you have
```bash
# List all branches
git branch -a

# See which branches are merged
git branch --merged

# See branch details with last commit
git branch -v
```

### Step 2: Switch to main branch
```bash
git checkout main
# OR
git checkout master
```

### Step 3: Update main branch
```bash
git pull origin main
```

### Step 4: Delete specific branches (one by one)
```bash
# Delete a single branch (safe)
git branch -d branch-name

# Force delete a branch (if not merged)
git branch -D branch-name

# Delete multiple specific branches
git branch -D branch1 branch2 branch3
```

### Step 5: Clean up remote references
```bash
# Remove remote tracking branches that no longer exist
git remote prune origin

# OR remove all remote tracking references
git remote prune --dry-run origin  # Preview first
git remote prune origin
```

---

## 🛡️ **SAFETY MEASURES**

### Before aggressive cleanup, backup your work:
```bash
# Create a backup branch with all your work
git checkout -b backup-all-branches-$(date +%Y%m%d)

# OR create a bundle backup
git bundle create backup-$(date +%Y%m%d).bundle --all
```

### Check what will be deleted:
```bash
# Preview which branches would be deleted
git branch --merged | grep -v "\*\|main\|master\|develop"

# See what remote prune would do
git remote prune --dry-run origin
```

---

## 🎯 **RECOMMENDED WORKFLOW**

### For Most Users (SAFE):
1. Run the automated script: `./cleanup-branches.sh`
2. Choose option 1 (Safe cleanup)
3. Review the results

### For Power Users (FAST):
```bash
# One command to rule them all
git checkout main && git pull && git branch --merged | grep -v "\*\|main\|master\|develop" | xargs -n 1 git branch -d && git remote prune origin && echo "✅ Cleanup complete!"
```

---

## 🚨 **EMERGENCY RECOVERY**

If you deleted something important:
```bash
# Find deleted branch commits in reflog
git reflog

# Restore a deleted branch
git checkout -b recovered-branch-name <commit-hash>

# OR restore from backup bundle
git clone backup-$(date +%Y%m%d).bundle recovered-repo
```

---

## 💡 **BEST PRACTICES FOR FUTURE**

### 1. **Delete branches after merging**
```bash
# After merging a PR/MR
git checkout main
git pull origin main
git branch -d feature-branch-name
```

### 2. **Use meaningful branch names**
```bash
# Good examples:
git checkout -b feature/user-authentication
git checkout -b bugfix/payment-error
git checkout -b hotfix/security-patch
```

### 3. **Regular maintenance**
```bash
# Weekly cleanup (add to your routine)
git checkout main && git pull && git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d
```

### 4. **Configure Git aliases for quick cleanup**
```bash
# Add these to your ~/.gitconfig
git config --global alias.cleanup "!git checkout main && git pull && git branch --merged | grep -v '\*\|main\|master' | xargs -n 1 git branch -d"
git config --global alias.prune-remotes "remote prune origin"

# Then use:
git cleanup
git prune-remotes
```

---

## 🎉 **QUICK START**

**Choose your path:**

1. **Safest**: Run `./cleanup-branches.sh` and choose option 1
2. **Fastest**: Copy-paste this one-liner:
   ```bash
   git checkout main && git pull origin main && git branch --merged | grep -v "\*\|main\|master" | xargs -n 1 git branch -d && git remote prune origin
   ```
3. **Customized**: Follow the manual step-by-step guide above

**After cleanup, you should have:**
- ✅ Only active branches remaining
- ✅ Clean remote tracking
- ✅ Updated main branch
- ✅ Organized repository

---

*Happy branching! 🌿*

```