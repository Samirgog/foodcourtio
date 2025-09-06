# FoodCourt.io UI

A modern React TypeScript application built with Vite and React Router.

## Features

- ⚡️ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Modern React with TypeScript support
- 🧭 **React Router** - Client-side routing
- 🎨 **CSS** - Modern styling with CSS variables
- 📏 **ESLint** - Code linting and quality checks
- 🔧 **TypeScript** - Type safety and better developer experience

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── pages/           # Page components
│   ├── Home.tsx     # Home page
│   └── About.tsx    # About page
├── App.tsx          # Main App component with routing
├── App.css          # App-specific styles
├── index.css        # Global styles
├── main.tsx         # Application entry point
└── vite-env.d.ts    # Vite type definitions
```

## Routing

The application uses React Router for navigation:

- `/` - Home page
- `/about` - About page

## Development

The project is configured with:

- Hot Module Replacement (HMR) for fast development
- TypeScript for type safety
- ESLint for code quality
- Modern CSS with custom properties

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request