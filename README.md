# CodeLearn AI Platform

A modern, full-stack learning and coding assistant platform with AI-powered code generation, interactive quizzes, and comprehensive progress tracking.

## Features

- **AI Code Generation** - Generate code examples in Python, JavaScript, Java, C++, and more with explanations
- **Interactive Quizzes** - Adaptive quizzes with instant feedback and detailed results
- **Progress Tracking** - Analytics dashboard with charts showing your learning journey
- **Dark/Light Mode** - Beautiful theme toggle with smooth transitions
- **Responsive Design** - Mobile-first, works perfectly on all devices
- **Secure Authentication** - Email/password authentication with Supabase
- **Real-time Analytics** - Track quiz performance, time spent, and achievements

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (fast build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Recharts (data visualization)
- React Router (navigation)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (authentication)
- Row Level Security (data protection)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the application.

## Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React Context (Auth, Theme)
├── pages/          # Main application pages
├── services/       # API service layers
└── lib/            # Utilities and configurations
```

## Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup, deployment, and customization
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Architecture and code organization

## Key Pages

- `/` - Landing page with features overview
- `/login` - Authentication (sign in/sign up)
- `/dashboard` - Analytics and progress tracking
- `/quiz` - Interactive quiz interface
- `/codegen` - AI code generator

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features in Detail

### Dashboard
- Total quizzes taken
- Average score tracking
- Time spent learning
- Performance charts (line, bar, pie)
- Recent activity timeline
- Category distribution

### Quiz System
- Multiple difficulty levels (beginner, intermediate, advanced)
- Multiple question types (multiple choice, code completion, true/false)
- Real-time progress tracking
- Detailed score breakdown
- Quiz history

### Code Generator
- Support for 10+ programming languages
- Code explanations
- History tracking with bookmarks
- Copy to clipboard
- Template-based generation (ready for AI API integration)

## Database Schema

- **profiles** - User profiles
- **quizzes** - Quiz definitions
- **quiz_questions** - Quiz questions with answers
- **quiz_attempts** - User quiz submissions
- **learning_progress** - Progress tracking by category
- **code_generations** - Generated code history
- **achievements** - User achievements

## Security

- Row Level Security (RLS) on all tables
- Authenticated-only access
- Users can only access their own data
- Secure session management
- Environment variable protection

## Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Upload 'dist' folder to your hosting provider
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## License

MIT License - Free to use for learning and commercial projects