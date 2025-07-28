# CampusConnect - Modern Student Portal 🎓

A cutting-edge, interactive student portal with modern design, dark/light mode, animations, and seamless authentication that works perfectly with GitHub Pages.

## ✨ Modern Features

### 🎨 **Modern Design System**
- **Clean, minimal interface** with Inter font family
- **CSS Variables** for consistent theming
- **Gradient backgrounds** with animated color shifts
- **Glassmorphism effects** with backdrop filters
- **Professional color palette** with semantic meaning
- **Smooth micro-interactions** and hover effects

### 🌙 **Dark/Light Mode Toggle**
- **Instant theme switching** with smooth transitions
- **Persistent theme preference** saved to localStorage
- **System-aware defaults** respecting user preferences
- **Animated toggle button** with rotation effects

### 🎭 **Interactive Animations**
- **Scroll-triggered animations** using Intersection Observer
- **Hover effects** on cards and buttons
- **Loading states** with spinning animations
- **Slide-in notifications** (toast system)
- **Smooth page transitions** and element movements
- **Staggered animations** for dashboard elements

### 📱 **Responsive & Interactive UI**
- **Mobile-first design** with adaptive layouts
- **Touch-friendly interactions** for all devices
- **Dynamic statistics** with live updates
- **Interactive dashboard cards** with hover states
- **Contextual quick actions** with real feedback
- **Smooth modal transitions** with backdrop blur

### ⚡ **Enhanced User Experience**
- **Toast notifications** for user feedback
- **Keyboard shortcuts** (Ctrl+K for search, Escape to close)
- **Auto-save login state** across sessions
- **Dynamic greeting** based on time of day
- **Live data updates** every 30 seconds
- **Accessible design** with proper ARIA labels

### 🗺️ **Google Maps Integration**
- **Interactive campus maps** in all dashboards
- **Role-based map features** (Student, Teacher, Admin views)
- **Building markers** with detailed information popups
- **Classroom finder** with quick navigation buttons
- **Emergency locations** and safety information
- **Parking areas** with real-time availability
- **Custom map styling** matching application theme
- **Mobile-responsive** map interactions

### 🔐 **Advanced Authentication**
- **Smooth login flow** with loading states
- **Error handling** with user-friendly messages
- **Session persistence** across browser tabs
- **Auto-logout functionality** with confirmation
- **Secure credential validation** client-side

## 🚀 How Authentication Works

1. **User Credentials Storage**: Stored in `users.txt` (email,password format)
2. **Client-Side Authentication**: JavaScript fetches and validates credentials
3. **Session Management**: Uses sessionStorage for persistence
4. **GitHub Pages Compatible**: No server required - works with static hosting
5. **Real-time UI Updates**: Dynamic welcome messages and user state

## 👥 Demo Users

| Email | Password | Role |
|-------|----------|------|
| `admin@campus.edu` | `admin123` | Administrator |
| `student1@campus.edu` | `password123` | Student |
| `student2@campus.edu` | `mypassword` | Student |
| `teacher@campus.edu` | `teachpass` | Teacher |
| `lesedi.mahlangu@campus.edu` | `lesedi2024` | Student |

## 🛠 Quick Start

### Option 1: GitHub Pages (Recommended)
```bash
# 1. Push to GitHub repository
git add .
git commit -m "Modern CampusConnect portal"
git push origin main

# 2. Enable GitHub Pages in repository settings
# 3. Visit your GitHub Pages URL
# 4. Sign in with any demo credentials
```

### Option 2: Local Development
```bash
# Simple HTTP server
python3 -m http.server 8080
# or
npx serve .
# or
node server.js

# Visit http://localhost:8080
```

## 🎮 Interactive Features

### **Smart Dashboard**
- **Live Statistics**: Real-time updates of courses, GPA, assignments, messages
- **Quick Actions**: One-click access to common tasks
- **Recent Activity**: Timeline of user actions with icons
- **Schedule View**: Dynamic class schedule with interactive items

### **Modern Navigation**
- **Sticky header** with blur effects
- **Animated navigation links** with underline effects
- **Logo hover effects** with scaling
- **Theme toggle** with rotation animation

### **Enhanced Modals**
- **Backdrop blur effects** for focus
- **Smooth scale animations** on open/close
- **Form validation** with real-time feedback
- **Loading states** during authentication

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Quick search (coming soon) |
| `Escape` | Close modals/dialogs |
| `Enter` | Submit forms |

## 🎨 Design Tokens

```css
--primary-color: #6366f1    /* Indigo - Primary actions */
--secondary-color: #10b981  /* Emerald - Success states */
--danger-color: #ef4444     /* Red - Error states */
--warning-color: #f59e0b    /* Amber - Warning states */
--info-color: #3b82f6       /* Blue - Information */
```

## 📊 Live Features

- **Auto-updating stats** every 30 seconds
- **Time-based greetings** (Good morning/afternoon/evening)
- **Dynamic animations** triggered by scroll
- **Real-time notifications** with auto-dismiss
- **Responsive layout** adapts to screen size

## 🔧 Technical Features

### **Performance Optimizations**
- **CSS-only animations** for smooth 60fps
- **Efficient event listeners** with proper cleanup
- **Lazy loading** for heavy content
- **Optimized asset loading** with CDN fonts/icons

### **Accessibility**
- **Semantic HTML** structure
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **High contrast** color ratios
- **Focus indicators** for all interactive elements

### **Modern JavaScript**
- **ES6+ syntax** with async/await
- **Modular code structure** with clean separation
- **Error handling** with try/catch blocks
- **Local storage** for user preferences
- **Intersection Observer** for performance

## 🌟 Advanced Interactions

### **Card Animations**
- **Hover transformations**: Lift and scale effects
- **Color transitions**: Smooth gradient overlays
- **Stagger effects**: Sequential animation delays
- **Loading skeletons**: Placeholder content animation

### **Toast System**
- **Success notifications**: Green with checkmark
- **Error alerts**: Red with warning icon
- **Info messages**: Blue with info icon
- **Auto-dismiss**: 3-second timeout with smooth exit

### **Theme System**
- **CSS custom properties** for dynamic theming
- **Smooth transitions** between light/dark modes
- **Context-aware colors** that adapt to theme
- **Persistent preferences** across sessions

## 🗺️ Google Maps Setup

To enable Google Maps functionality:

1. **Get Google Maps API Key**: Follow the guide in `GOOGLE_MAPS_SETUP.md`
2. **Replace placeholder**: Update `YOUR_API_KEY` in all dashboard HTML files
3. **Configure restrictions**: Secure your API key with domain restrictions
4. **Customize coordinates**: Update campus location in `main.js`

See `GOOGLE_MAPS_SETUP.md` for detailed setup instructions.

## 🚀 Future Enhancements

- [ ] **Real-time messaging** system
- [ ] **Course enrollment** workflow
- [ ] **Grade visualization** charts
- [ ] **Calendar integration** with events
- [ ] **File upload** for assignments
- [ ] **Search functionality** with live results
- [ ] **Progressive Web App** features
- [ ] **Push notifications** for updates
- [x] **Google Maps integration** ✨ (Recently added!)
- [ ] **Directions API** for campus navigation
- [ ] **Real-time location** tracking

## 📱 Browser Support

- ✅ **Chrome** 90+ (Full support)
- ✅ **Firefox** 88+ (Full support)
- ✅ **Safari** 14+ (Full support)
- ✅ **Edge** 90+ (Full support)
- ⚠️ **IE** (Not supported - modern features only)

---

**Experience the future of student portals with CampusConnect! 🚀**

*Built with modern web technologies, accessibility in mind, and optimized for the best user experience.*