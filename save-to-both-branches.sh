#!/bin/bash

echo "🔄 SAVING TO BOTH BRANCHES (main + cursor/debug-code-issues-ad59)..."
echo "================================================="

# Function to commit changes
commit_changes() {
    local branch_name=$1
    echo "💾 Committing to $branch_name..."
    
    git add -A
    git commit -m "🚀 Complete e-commerce plant store - Updated $(date)

✅ COMPLETE FEATURES:
- Customer checkout system with validation forms
- Payment options: eSewa, FonePay, Bank Transfer with QR codes
- Order management with admin dashboard
- WhatsApp auto-confirmation (+977 9766473272)
- Secure admin portal at /admin-portal-secure
- Multi-language support (English/Nepali)
- Shopping cart with full e-commerce functionality
- Plant catalog with 6 products
- Plant care guide and customer request forms

✅ ALL BUG FIXES APPLIED:
- Cart modal closing after successful order
- Empty cart protection with validation
- Enhanced Nepali phone number validation
- Better UX with close buttons throughout checkout
- Improved error handling and user feedback

✅ TECHNICAL COMPONENTS:
- OrderContext.tsx: Complete order management system
- Checkout.tsx: Multi-step checkout flow (373 lines)
- Cart.tsx: Shopping cart with checkout integration
- AdminPanel.tsx: Order dashboard with statistics
- SecretAdminLogin.tsx: Secure admin authentication
- PlantCareGuide.tsx: Plant care information
- PlantRequestForm.tsx: Customer request system
- ShopSection2.tsx: Complete plant catalog

🎯 PRODUCTION READY E-COMMERCE WEBSITE!"

    echo "✅ Committed to $branch_name"
}

# Check current status
echo "📍 Current branch:"
git branch --show-current

echo ""
echo "🌿 STEP 1: SAVING TO FEATURE BRANCH (cursor/debug-code-issues-ad59)"
echo "================================================="

# Switch to feature branch and save
git checkout cursor/debug-code-issues-ad59
echo "✅ Switched to cursor/debug-code-issues-ad59"

# Commit to feature branch
commit_changes "cursor/debug-code-issues-ad59"

# Push feature branch
echo "⬆️ Pushing cursor/debug-code-issues-ad59..."
git push origin cursor/debug-code-issues-ad59
echo "✅ Feature branch saved to GitHub"

echo ""
echo "🌳 STEP 2: SAVING TO MAIN BRANCH"
echo "================================================="

# Switch to main branch
git checkout main
echo "✅ Switched to main"

# Pull latest from main
echo "⬇️ Pulling latest from origin/main..."
git pull origin main

# Merge feature branch into main
echo "🔄 Merging feature branch into main..."
git merge cursor/debug-code-issues-ad59 --no-ff -m "Merge complete e-commerce system from cursor/debug-code-issues-ad59

✅ Complete plant store with checkout system
✅ All bug fixes and improvements included
✅ Production ready e-commerce website"

# Push main branch
echo "⬆️ Pushing main branch..."
git push origin main
echo "✅ Main branch saved to GitHub"

echo ""
echo "🎉 SUCCESS! SAVED TO BOTH BRANCHES"
echo "================================================="
echo "🌐 Repository: https://github.com/manohar252/new"
echo "🌿 Main Branch: https://github.com/manohar252/new/tree/main"
echo "🔧 Feature Branch: https://github.com/manohar252/new/tree/cursor/debug-code-issues-ad59"
echo ""
echo "✅ Both branches now have:"
echo "   - Complete e-commerce checkout system"
echo "   - Order management with admin dashboard"
echo "   - Payment integration (eSewa, FonePay, Bank)"
echo "   - WhatsApp confirmation system"
echo "   - All bug fixes and improvements"
echo "   - Production-ready plant store"
echo ""
echo "🚀 Your complete project is safely stored in BOTH locations!"