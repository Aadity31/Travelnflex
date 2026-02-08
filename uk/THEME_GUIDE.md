# Theme & Design System Guide

## 🎨 Global Theme Configuration

### Typography
**Primary Font:** Inter (Apple/Google style)
- Clean, modern, highly readable
- Optimized for screens
- Similar to San Francisco (Apple) and Roboto (Google)

**Monospace Font:** JetBrains Mono
- For code snippets and technical content

### Font Features
- Kerning enabled for better letter spacing
- Ligatures enabled for improved readability
- Optimized text rendering
- Anti-aliasing for smooth edges

## 🎨 Color Palette

### Primary Colors (Orange Theme)
```css
--color-primary: #f97316        /* Orange-500 - Main brand color */
--color-primary-dark: #ea580c   /* Orange-600 - Hover states */
--color-primary-light: #fed7aa  /* Orange-200 - Subtle highlights */
--color-primary-lighter: #ffedd5 /* Orange-100 - Backgrounds */
--color-primary-lightest: #fff7ed /* Orange-50 - Very light backgrounds */
```

### Usage Examples
- **Buttons:** `bg-orange-600 hover:bg-orange-700`
- **Text Highlights:** `text-orange-600`
- **Badges:** `bg-orange-100 text-orange-600`
- **Borders:** `border-orange-200`

### Secondary Colors (Blue)
```css
--color-secondary: #3b82f6      /* Blue-500 */
--color-secondary-dark: #2563eb /* Blue-600 */
```

### Status Colors
- **Success:** `#10b981` (Green-500)
- **Warning:** `#f59e0b` (Amber-500)
- **Error:** `#ef4444` (Red-500)

### Neutral Colors
```css
--foreground: #111827           /* Gray-900 - Primary text */
--foreground-secondary: #4b5563 /* Gray-600 - Secondary text - good contrast */
--foreground-muted: #6b7280     /* Gray-500 - Muted text - good contrast */
```

## 📐 Spacing System
```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 0.75rem  /* 12px */
--spacing-md: 1rem     /* 16px */
--spacing-lg: 1.5rem   /* 24px */
--spacing-xl: 2rem     /* 32px */
```

## 🔲 Border Radius
```css
--radius-sm: 0.375rem  /* 6px - Small elements */
--radius-md: 0.5rem    /* 8px - Default */
--radius-lg: 0.75rem   /* 12px - Cards */
--radius-xl: 1rem      /* 16px - Large cards */
--radius-2xl: 1.5rem   /* 24px - Hero sections */
--radius-full: 9999px  /* Fully rounded */
```

## 🎭 Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

## 🎬 Transitions
```css
--transition-fast: 150ms ease
--transition-normal: 300ms ease
--transition-slow: 500ms ease
```

## 📱 Component Guidelines

### Cards
```jsx
<div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
  {/* Card content */}
</div>
```

### Buttons
```jsx
// Primary Button
<button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
  Click Me
</button>

// Secondary Button
<button className="bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
  Learn More
</button>
```

### Badges
```jsx
<span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
  Featured
</span>
```

### Text Hierarchy
```jsx
// Headings
<h1 className="text-4xl font-bold text-gray-900">Main Title</h1>
<h2 className="text-3xl font-bold text-gray-900">Section Title</h2>
<h3 className="text-2xl font-bold text-gray-900">Subsection</h3>

// Body Text
<p className="text-base text-gray-700 leading-relaxed">Regular paragraph text</p>
<p className="text-sm text-gray-600">Secondary information</p>
<p className="text-xs text-gray-500">Fine print</p>
```

## 🎨 Gradient Utilities
```css
.bg-gradient-primary {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}
```

## 📏 Responsive Design
- **Mobile:** 320px - 639px
- **Tablet:** 640px - 1023px
- **Desktop:** 1024px - 1535px
- **2K+:** 1536px+

### Responsive Classes
```jsx
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid */}
</div>
```

## ✨ Best Practices

### 1. Consistent Spacing
Use the spacing system variables for consistent padding and margins:
```jsx
<div className="p-5 sm:p-6">  {/* Responsive padding */}
```

### 2. Color Consistency
Always use the defined color palette:
- Primary actions: Orange (`orange-600`)
- Text: Gray scale (`gray-900`, `gray-700`, `gray-600`)
- Backgrounds: White or light gray (`gray-50`)

### 3. Typography
- Use `font-semibold` or `font-bold` for emphasis
- Maintain proper line-height with `leading-relaxed` or `leading-tight`
- Use `truncate` or `line-clamp-{n}` for text overflow

### 4. Hover States
Always include hover states for interactive elements:
```jsx
<button className="hover:bg-orange-700 transition-colors duration-200">
```

### 5. Accessibility
- Maintain proper color contrast
- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works

## 🚫 Navbar Exception
**Note:** The navbar maintains its current black/transparent styling and should NOT be changed to match the orange theme. It uses:
```jsx
className="backdrop-blur-md bg-black/70"
```

## 📦 Implementation Checklist
- [x] Inter font family configured
- [x] CSS variables defined
- [x] Color palette established
- [x] Spacing system in place
- [x] Border radius standards set
- [x] Shadow utilities ready
- [x] Transition speeds defined
- [x] Responsive breakpoints configured
- [x] Gradient utilities available

## 🔄 Migration Notes
When updating existing components:
1. Replace hardcoded colors with theme colors
2. Use consistent spacing from the system
3. Apply standard border radius values
4. Implement hover states with transitions
5. Ensure responsive behavior
6. Test on multiple screen sizes

---

**Last Updated:** 2026-02-08
**Version:** 1.0.0
