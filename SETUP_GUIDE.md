# CodeLearn AI - Setup & Deployment Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file is already configured with Supabase credentials:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_SUPABASE_ANON_KEY` - Your Supabase anon key

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Database Setup

The database schema has been automatically created in Supabase with the following tables:
- profiles
- quizzes
- quiz_questions
- quiz_attempts
- learning_progress
- code_generations
- achievements

All tables have Row Level Security (RLS) enabled for data protection.

## Adding Sample Data

### Create Sample Quizzes

Run this SQL in your Supabase SQL editor:

```sql
-- Insert sample quizzes
INSERT INTO quizzes (title, description, category, difficulty, language, is_active) VALUES
('Python Basics', 'Test your knowledge of Python fundamentals', 'Programming', 'beginner', 'Python', true),
('JavaScript ES6', 'Modern JavaScript features and syntax', 'Programming', 'intermediate', 'JavaScript', true),
('Java OOP Concepts', 'Object-oriented programming in Java', 'Programming', 'advanced', 'Java', true),
('React Fundamentals', 'Core concepts of React.js', 'Web Development', 'intermediate', 'JavaScript', true),
('SQL Queries', 'Database queries and joins', 'Database', 'beginner', 'SQL', true);

-- Get quiz IDs for adding questions
DO $$
DECLARE
  python_quiz_id uuid;
  js_quiz_id uuid;
BEGIN
  SELECT id INTO python_quiz_id FROM quizzes WHERE title = 'Python Basics' LIMIT 1;
  SELECT id INTO js_quiz_id FROM quizzes WHERE title = 'JavaScript ES6' LIMIT 1;

  -- Python quiz questions
  INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, order_index) VALUES
  (python_quiz_id, 'What is the output of: print(type([]))?', 'multiple_choice',
   '["<class ''list''>", "<class ''tuple''>", "<class ''dict''>", "<class ''set''>"]'::jsonb,
   '<class ''list''>', 'Lists are defined with square brackets [] in Python', 0),
  (python_quiz_id, 'Which keyword is used to create a function in Python?', 'multiple_choice',
   '["function", "def", "func", "define"]'::jsonb,
   'def', 'The def keyword is used to define functions in Python', 1),
  (python_quiz_id, 'Is Python case-sensitive?', 'true_false',
   '["True", "False"]'::jsonb,
   'True', 'Python is case-sensitive, variable and Variable are different', 2);

  -- JavaScript quiz questions
  INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, order_index) VALUES
  (js_quiz_id, 'What is the correct syntax for arrow functions?', 'multiple_choice',
   '["() => {}", "function() => {}", "() -> {}", "=> () {}"]'::jsonb,
   '() => {}', 'Arrow functions use the => syntax', 0),
  (js_quiz_id, 'What does let allow that var does not?', 'multiple_choice',
   '["Block scoping", "Hoisting", "Global scope", "Function scope"]'::jsonb,
   'Block scoping', 'let provides block-level scoping unlike var', 1);
END $$;
```

## Authentication Setup

### User Registration
1. Navigate to `/login`
2. Click "Don't have an account? Sign up"
3. Enter email and password
4. Click "Sign Up"

### User Login
1. Navigate to `/login`
2. Enter credentials
3. Click "Sign In"

## Features Tour

### 1. Dashboard (`/dashboard`)
- View overall statistics
- See performance charts
- Track progress by category
- Review recent quiz attempts

### 2. Quizzes (`/quiz`)
- Browse available quizzes
- Filter by category and difficulty
- Take interactive quizzes
- View detailed results

### 3. Code Generator (`/codegen`)
- Select programming language
- Enter code description
- Generate code examples
- View history and bookmarks

## Customization

### Adding New Languages

Edit `src/pages/CodeGen.tsx`:

```typescript
const LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'C++',
  'YourNewLanguage', // Add here
];
```

### Changing Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Change primary color */
}
```

### Adding New Quiz Categories

Simply insert quizzes with new category names in the database. The app will automatically recognize them.

## API Integration

### Integrating OpenAI for Code Generation

Replace the placeholder in `src/services/codeGenService.ts`:

```typescript
export const codeGenService = {
  async generateCode(prompt: string, language: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a coding assistant. Generate ${language} code with explanations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    return {
      code: data.choices[0].message.content,
      explanation: 'Generated by GPT-4'
    };
  },
};
```

Don't forget to add `VITE_OPENAI_API_KEY` to your `.env` file.

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# VITE_SUPABASE_URL
# VITE_SUPABASE_SUPABASE_ANON_KEY
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:
```bash
docker build -t codelearn-ai .
docker run -p 3000:3000 codelearn-ai
```

## Troubleshooting

### Issue: "Module not found"
**Solution:** Run `npm install` to ensure all dependencies are installed.

### Issue: "Supabase connection error"
**Solution:** Check that `.env` file contains valid Supabase credentials.

### Issue: "Authentication not working"
**Solution:** Verify Supabase Auth is enabled in your Supabase dashboard.

### Issue: "RLS policy errors"
**Solution:** Ensure the database migration was applied successfully. Check Supabase logs.

### Issue: "Charts not rendering"
**Solution:** Ensure recharts is installed: `npm install recharts`

## Performance Optimization

### Code Splitting
Already implemented with React.lazy for route-based code splitting.

### Image Optimization
Use WebP format and lazy loading for images:
```tsx
<img loading="lazy" src="image.webp" alt="Description" />
```

### Database Optimization
- Indexes are already created on frequently queried columns
- Use `.select('specific, columns')` instead of `SELECT *`
- Implement pagination for large datasets

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use RLS policies** - Already enabled on all tables
3. **Validate user input** - Implement on form submissions
4. **Rate limiting** - Add to API endpoints
5. **HTTPS only** - Configure in production

## Support

For issues or questions:
- Check `PROJECT_STRUCTURE.md` for architecture details
- Review Supabase documentation: https://supabase.com/docs
- React documentation: https://react.dev
- Vite documentation: https://vitejs.dev

## License

MIT License - Feel free to use this project for learning and commercial purposes.
