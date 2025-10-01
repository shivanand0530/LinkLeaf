# 🍃 LinkLeaf

**Your one-stop solution for saving and organizing favorite links and bookmarks.**

LinkLeaf is a modern, intuitive bookmark manager that helps you organize, search, and access your favorite websites effortlessly. Built with React, TypeScript, and powered by Supabase, it offers a seamless experience across devices with real-time synchronization.

## ✨ Features

- 🔐 **Secure Authentication** - Sign up and sign in with Supabase authentication
- 📁 **Folder Organization** - Create folders to categorize your bookmarks
- 📌 **Pin Important Links** - Pin your most important bookmarks for quick access
- 🔍 **Smart Search** - Find your bookmarks instantly with powerful search
- 🎨 **Beautiful UI** - Modern interface built with Radix UI and Tailwind CSS
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark/Light Mode** - Switch between themes for comfortable browsing
- ⚡ **Real-time Sync** - Your bookmarks sync across all devices
- 🖼️ **Auto Favicon** - Automatic favicon detection for visual organization
- 📊 **Link Analytics** - Track and manage your bookmark collection

## 🚀 Tech Stack

**Frontend:**
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- Radix UI, Shadcn for accessible components
- Redux Toolkit for state management
- React Router for navigation

**Backend & Database:**
- Supabase for backend services
- Real-time database synchronization
- Row Level Security (RLS) for data protection

**Additional Tools:**
- Lucide React for icons
- React Hook Form for form handling
- Sonner for toast notifications

## 🛠️ Installation

1. **Clone the repository**
   ```bash

   cd linkleaf
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   or
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   or
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # Base UI components (Radix UI)
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── libs/               # Core utilities and database functions
├── services/           # API service layers
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🎯 Usage

### Getting Started
1. **Sign Up/Sign In** - Create an account or sign in to access your bookmarks
2. **Add Your First Link** - Click the "+" button to add a bookmark
3. **Organize with Folders** - Create folders to categorize your links
4. **Pin Important Links** - Use the pin feature for quick access
5. **Search & Filter** - Find bookmarks instantly with the search function

### Key Features

**Adding Links:**
- Paste any URL and LinkLeaf will automatically fetch the title and favicon
- Add custom descriptions and organize into folders
- Pin important links to the top

**Folder Management:**
- Create color-coded folders for better organization
- Save related links in one place.

**Search & Filter:**
- Search by title, URL, or description
- Filter by folders or pinned status
- Sort by date added, alphabetical, or custom order

## 📝 Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint

# Alternative with npm
npm run dev
npm run build
npm run preview
npm run lint
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up the following tables:
   - `links` - Store bookmark data
   - `folders` - Store folder organization
   - `profiles` - Store user profiles

3. Enable Row Level Security (RLS) policies
4. Get your project URL and anon key from the API settings

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework
- [Supabase](https://supabase.com/) for backend infrastructure
- [Lucide](https://lucide.dev/) for beautiful icons
- [Aceternity UI](https://ui.aceternity.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📧 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Reach out via email: [kshivananda534@example.com]

---

**Made with ❤️ by Shivanand K**

*LinkLeaf - Organize your digital garden of links* 🍃 