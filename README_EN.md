# Instant Fresh Trace

**English** | [简体中文](./README.md)

A modern news aggregation platform that keeps you updated with the latest information in real-time.

![Nuxt](https://img.shields.io/badge/Nuxt-3.17.4-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5.14-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)

## ✨ Features

- 🚀 **Modern Tech Stack**: Built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS
- 📱 **Responsive Design**: Perfect adaptation for desktop and mobile devices
- 🎨 **Beautiful Interface**: Built with @nuxt/ui and Headless UI components
- 📰 **Multiple View Modes**: Support for both list and card view modes
- 🔍 **Smart Categorization**: Browse by source and tag-based filtering
- ⚡ **Real-time Updates**: Automatically fetch the latest news content
- 🔖 **Personalization**: Bookmark collections and personalized recommendations
- 📤 **Easy Sharing**: One-click sharing of interesting content
- 🌗 **Dark Mode**: Eye-friendly dark theme support

## 🛠️ Tech Stack

### Core Framework
- **[Nuxt 3](https://nuxt.com/)** - Vue.js full-stack framework
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI Components
- **[@nuxt/ui](https://ui.nuxt.com/)** - Official Nuxt UI component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[@headlessui/vue](https://headlessui.com/)** - Unstyled accessibility components
- **[@heroicons/vue](https://heroicons.com/)** - Beautiful SVG icon set

### State Management
- **[Pinia](https://pinia.vuejs.org/)** - Official Vue state management library
- **[@pinia/nuxt](https://pinia.vuejs.org/ssr/nuxt.html)** - Nuxt integration

### Utilities
- **[@vueuse/nuxt](https://vueuse.org/)** - Collection of Vue composition functions
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[uuid](https://github.com/uuidjs/uuid)** - UUID generator

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm, pnpm, yarn, or bun package manager

### Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

### Production Build

Build the application for production:

```bash
# Using npm
npm run build

# Using pnpm
pnpm build

# Using yarn
yarn build

# Using bun
bun run build
```

### Preview Production Build

Locally preview production build:

```bash
# Using npm
npm run preview

# Using pnpm
pnpm preview

# Using yarn
yarn preview

# Using bun
bun run preview
```

## 📁 Project Structure

```
instant-fresh-trace/
├── assets/              # Static asset files
│   └── css/            
│       └── main.css     # Global styles
├── layouts/             # Layout components
│   └── default.vue      # Default layout
├── pages/               # Page components
│   ├── index.vue        # Home page - news list
│   ├── sources.vue      # Source management
│   └── subscriptions.vue # Subscription management
├── public/              # Public static files
│   ├── favicon.ico
│   └── robots.txt
├── server/              # Server-side code
│   └── tsconfig.json
├── stores/              # Pinia state management
│   └── feeds.ts         # News data state
├── app.vue              # Root component
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🎯 Feature Modules

### 📰 News Browsing
- Support for both list and card view modes
- Sort by publish time, title, and source
- Real-time loading states and empty state handling
- Responsive design for all screen sizes

### 🏷️ Category Filtering
- Browse by news source categories
- Tag system supporting multi-dimensional filtering
- Intelligent recommendation of related content

### 🔖 Personal Bookmarks
- One-click bookmark for interesting articles
- Bookmark management and organization
- Offline reading support

### 📤 Content Sharing
- Native sharing API support
- Custom sharing formats
- One-click copy to clipboard

## 🎨 Design Philosophy

### Modern Interface
- Card-based design language
- Soft shadows and rounded corners
- Comfortable color schemes and spacing

### User Experience
- Intuitive interaction feedback
- Smooth animation transitions
- Keyboard navigation support

### Accessibility
- Semantic HTML structure
- Screen reader friendly
- High contrast theme support

## 🚢 Deployment

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more deployment options.

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

### Netlify Deployment

```bash
# Build the project
npm run build

# Deploy .output/public directory to Netlify
```

## 🤝 Contributing

We welcome Issues and Pull Requests to help improve the project.

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)

---

<div align="center">
  <p>Built with ❤️ and Vue</p>
</div>
