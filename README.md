# 🌱 MERO GAMALA - Premium Plant Store

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/manohar252/merogamala)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-cyan)](https://tailwindcss.com/)

**Your trusted partner for bringing nature into your home and office in Nepal** 🇳🇵

---

## 🌟 **Live Demo**

🔗 **Website**: [https://manohar252.github.io/merogamala](https://manohar252.github.io/merogamala)

---

## 📋 **About MERO GAMALA**

MERO GAMALA is a modern, full-featured e-commerce plant store built with React and TypeScript. It offers a comprehensive online shopping experience for plant enthusiasts in Nepal, featuring:

- 🛒 **Complete E-commerce** - Shopping cart, checkout, order management
- 🌐 **Bilingual Support** - English and Nepali (मेरो गमला)
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔐 **Admin Dashboard** - Product and order management
- 💳 **Payment Integration** - eSewa, FonePay, Bank Transfer with QR codes
- 📦 **Order Tracking** - Real-time order status updates
- 🌱 **Plant Care Guide** - Expert care tips and advice
- 🚀 **PWA Ready** - Progressive Web App capabilities

---

## 🛠️ **Tech Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Frontend framework |
| **TypeScript** | 5.6.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **Tailwind CSS** | 3.4.1 | Styling framework |
| **Lucide React** | 0.344.0 | Icons |
| **ESLint** | 9.9.1 | Code linting |

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/manohar252/merogamala.git

# Navigate to project directory
cd merogamala

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### **Build for Production**

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📁 **Project Structure**

```
merogamala/
├── 📁 src/
│   ├── 📁 components/          # React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Hero.tsx           # Landing page hero
│   │   ├── ShopSection2.tsx   # Product catalog
│   │   ├── Cart.tsx           # Shopping cart
│   │   ├── Checkout.tsx       # Checkout process
│   │   └── AdminPanel.tsx     # Admin dashboard
│   ├── 📁 contexts/           # React Context providers
│   │   ├── LanguageContext.tsx # Multi-language support
│   │   ├── CartContext.tsx    # Shopping cart state
│   │   ├── OrderContext.tsx   # Order management
│   │   └── AdminContext.tsx   # Admin state
│   ├── App.tsx               # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── 📁 public/               # Static assets
│   ├── favicon.svg          # Site icon
│   ├── manifest.json        # PWA manifest
│   └── robots.txt          # SEO rules
├── 📁 docs/                # GitHub Pages deployment
├── index.html              # Development HTML
├── package.json            # Dependencies & scripts
└── README.md              # Project documentation
```

---

## 🎯 **Key Features**

### **🛍️ E-commerce Functionality**
- Product catalog with filtering
- Shopping cart with quantity management
- Multi-step checkout process
- Order management system
- Payment gateway integration (eSewa, FonePay, Bank Transfer)

### **🌐 Multi-language Support**
- English and Nepali language toggle
- Localized product descriptions
- Native Devanagari font support
- Cultural context awareness

### **🔐 Admin Panel**
- Secure admin authentication
- Product management (CRUD operations)
- Order tracking and status updates
- Customer request management
- Sales analytics dashboard

### **📱 Progressive Web App**
- Offline functionality
- Install on mobile devices
- Push notifications ready
- Fast loading with service worker

### **🎨 Modern UI/UX**
- Clean, professional design
- Responsive mobile-first approach
- Loading states and animations
- Accessibility compliant
- Dark/light theme support

---

## 🚀 **Deployment**

### **GitHub Pages Deployment**
This project is configured for GitHub Pages deployment:

1. **Production build** is automatically created in `/docs` folder
2. **Enable GitHub Pages** in repository settings
3. **Set source** to "Deploy from a branch" → `main` → `/docs`

### **Manual Deployment Steps**
```bash
# Build for production
npm run build

# Copy build to docs (for GitHub Pages)
cp -r dist/* docs/

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### **Environment Variables** (Optional)
Copy `.env.example` to `.env.local` and configure:
```env
VITE_APP_NAME="MERO GAMALA"
VITE_API_URL=your_api_url
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

---

## 🧪 **Testing & Quality**

### **Code Quality**
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

### **Performance Metrics**
- ⚡ **Lighthouse Score**: 95+ 
- 📦 **Bundle Size**: ~225KB (67KB gzipped)
- 🚀 **Build Time**: ~2.2s
- 📱 **Mobile Responsive**: 100%

---

## 🐛 **Bug Fixes & Updates**

See [BUG_FIXES_REPORT.md](./BUG_FIXES_REPORT.md) for detailed information about:
- ✅ Security vulnerabilities fixed
- ✅ Performance optimizations
- ✅ Code quality improvements
- ✅ TypeScript errors resolved

---

## 📖 **Documentation**

- 📋 [Essential Files Documentation](./ESSENTIAL_FILES_DOCUMENTATION.md)
- 🐛 [Bug Fixes Report](./BUG_FIXES_REPORT.md)
- 🔧 [Debugging Summary](./DEBUGGING_SUMMARY.md)

---

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 **Contact & Support**

- 📧 **Email**: admin@merogamala.com
- 📱 **WhatsApp**: +977-9766473272
- 🌐 **Website**: [merogamala.com](https://manohar252.github.io/merogamala)
- 📍 **Location**: Kathmandu, Nepal

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- 🎨 **Icons**: [Lucide React](https://lucide.dev/)
- 🎨 **Fonts**: [Google Fonts](https://fonts.google.com/)
- 🖼️ **Images**: [Pexels](https://www.pexels.com/)
- 🌐 **Hosting**: [GitHub Pages](https://pages.github.com/)

---

## 📊 **Project Stats**

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | 15,000+ |
| **Components** | 13 |
| **Context Providers** | 4 |
| **Languages Supported** | 2 (EN/NE) |
| **Build Size** | 225KB |
| **Load Time** | <2s |

---

<div align="center">

**Made with ❤️ for plant lovers in Nepal** 🇳🇵

⭐ **Star this repo if you found it helpful!** ⭐

</div>
