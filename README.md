# Shanghai Sanshi Shimasenkai - 上海三線島線会

A modern website for the Shanghai Sanshin Shimasenkai group, dedicated to preserving and sharing the traditional art of Okinawan sanshin music in Shanghai.

## Features

- **Homepage**: Introduction to the sanshin instrument and its history
- **Sessions Page**: Interactive calendar with biweekly session schedules and registration
- **Contact Page**: Contact form and information for interested participants

## Technology Stack

- React 18 with TypeScript
- React Router for navigation
- Vite for fast development and building
- CSS with custom properties for theming
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd shanghai-sanshin-shimasenkai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploying to GitHub Pages

1. Update the `base` in `vite.config.ts` to match your repository name
2. Build and deploy:
```bash
npm run deploy
```

This will build the project and push to the `gh-pages` branch automatically.

## Project Structure

```
src/
├── components/       # Reusable components (Header, Footer)
├── pages/           # Page components
├── styles/          # Global styles and CSS variables
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component with routing
└── main.tsx         # Entry point
```

## Customization

- **Colors**: Edit `src/styles/variables.css`
- **Content**: Update the text in each page component
- **Images**: Replace placeholder divs with actual images
- **Sessions**: Update the mock data in `SessionsPage.tsx` with real session data

## Future Enhancements

- Backend integration for dynamic session management
- User authentication for session registration
- Multi-language support (Chinese/English/Japanese)
- Photo gallery
- Video tutorials
- Online payment for sessions

## License

This project is private and intended for Shanghai Sanshi Shimasenkai use only.
