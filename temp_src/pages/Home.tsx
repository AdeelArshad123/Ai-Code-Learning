import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Brain, TrendingUp, Zap, BookOpen, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: Brain,
    title: 'AI Code Generation',
    description: 'Generate code in multiple languages with detailed explanations',
    color: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with adaptive quizzes across various topics',
    color: 'text-green-500',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics',
    color: 'text-orange-500',
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Earn badges and track your accomplishments',
    color: 'text-purple-500',
  },
  {
    icon: Zap,
    title: 'Real-time Feedback',
    description: 'Get instant feedback on your quiz attempts',
    color: 'text-yellow-500',
  },
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Learn Python, JavaScript, Java, C++, and more',
    color: 'text-red-500',
  },
];

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Master Coding with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your intelligent companion for learning programming through interactive quizzes,
              AI-powered code generation, and personalized progress tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="text-lg px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/quiz">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Start Quiz
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="text-lg px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/quiz">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Explore Quizzes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 blur-3xl rounded-full" />
            <Card className="relative overflow-hidden">
              <CardContent className="p-8 bg-gradient-to-br from-blue-500/5 to-green-500/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Languages</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">100+</div>
                    <div className="text-sm text-muted-foreground">Quizzes</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">AI</div>
                    <div className="text-sm text-muted-foreground">Powered</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accelerate your coding journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners mastering programming with AI-powered assistance
            </p>
            <Link to={user ? '/dashboard' : '/login'}>
              <Button size="lg" className="text-lg px-12">
                {user ? 'Continue Learning' : 'Sign Up Now'}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
