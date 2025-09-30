# CodeLearn AI Platform - Project Structure

## Overview
A modern full-stack learning and coding assistant platform built with React, TypeScript, Vite, and Supabase.

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS)
  - Real-time subscriptions

### State Management
- **React Context API** - Theme and authentication state
- **React Hooks** - Component-level state

## Project Structure

```
/tmp/cc-agent/57798693/project/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx           # Animated button component
│   │   │   ├── Card.tsx             # Card components
│   │   │   └── Input.tsx            # Input component
│   │   ├── Navbar.tsx               # Main navigation
│   │   └── ThemeToggle.tsx          # Dark/light theme toggle
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication state
│   │   └── ThemeContext.tsx         # Theme state
│   ├── lib/
│   │   └── supabase.ts              # Supabase client configuration
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── Login.tsx                # Auth page (login/signup)
│   │   ├── Dashboard.tsx            # Analytics dashboard
│   │   ├── Quiz.tsx                 # Interactive quizzes
│   │   └── CodeGen.tsx              # AI code generator
│   ├── services/
│   │   ├── quizService.ts           # Quiz API functions
│   │   ├── progressService.ts       # Progress tracking
│   │   └── codeGenService.ts        # Code generation
│   ├── App.tsx                      # Main app component with routing
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Global styles & Tailwind
│   └── vite-env.d.ts               # TypeScript definitions
├── .env                             # Environment variables
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── vite.config.ts                   # Vite configuration
└── tsconfig.json                    # TypeScript configuration
```

## Database Schema

### Tables

1. **profiles** - User profiles extending auth.users
   - id, email, full_name, avatar_url, role

2. **quizzes** - Quiz definitions
   - id, title, description, category, difficulty, language

3. **quiz_questions** - Quiz questions
   - id, quiz_id, question_text, options, correct_answer

4. **quiz_attempts** - User quiz attempts
   - id, user_id, quiz_id, score, percentage, time_spent

5. **learning_progress** - Progress tracking
   - id, user_id, category, language, stats

6. **code_generations** - Generated code history
   - id, user_id, prompt, language, generated_code

7. **achievements** - User achievements
   - id, user_id, achievement_type, title, description

## Features

### Core Features
- AI Code Generation (multiple languages)
- Interactive Quizzes (adaptive difficulty)
- Progress Tracking & Analytics
- Dark/Light Mode Toggle
- Responsive Design (mobile-first)
- User Authentication (Supabase Auth)

### Dashboard Features
- Total quiz statistics
- Performance charts (Line, Bar, Pie)
- Category distribution
- Recent activity timeline
- Time tracking

### Quiz Features
- Multiple choice questions
- Real-time progress indicator
- Score calculation
- Detailed results page
- Question navigation

### Code Generator Features
- Multi-language support (Python, JavaScript, Java, C++, etc.)
- Code explanations
- History tracking
- Bookmark functionality
- Copy to clipboard

## Security

- Row Level Security (RLS) enabled on all tables
- Authenticated-only access for sensitive data
- Users can only access their own data
- Secure session management
- Environment variables for secrets

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_SUPABASE_ANON_KEY` - Supabase anonymous key

## API Integration

The platform includes placeholder code generation that can be replaced with:
- OpenAI API
- Anthropic Claude API
- Google Gemini API
- LangChain integration

Example in `src/services/codeGenService.ts`:
```typescript
// Replace generateCode() with actual API calls
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  }),
});
```

## Styling Guidelines

- Mobile-first responsive design
- Consistent 8px spacing system
- Professional color palette (no purple/indigo by default)
- Smooth transitions and animations
- Accessible contrast ratios
- Dark mode support

## Future Enhancements

- OAuth integration (Google, GitHub)
- Real-time leaderboards (WebSockets)
- Offline mode (PWA)
- Multi-language i18n
- Advanced analytics (ClickHouse)
- Microservices architecture
- API rate limiting
- Content management system
- Social features (sharing, comments)
- Video tutorials integration
