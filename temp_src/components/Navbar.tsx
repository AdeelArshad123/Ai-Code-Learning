import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
          <Code2 className="h-6 w-6" />
          <span>CodeLearn AI</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/quiz">
                <Button variant="ghost" size="sm">Quizzes</Button>
              </Link>
              <Link to="/codegen">
                <Button variant="ghost" size="sm">Code Generator</Button>
              </Link>
            </>
          )}

          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user.email}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
