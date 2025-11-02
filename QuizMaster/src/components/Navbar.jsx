import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            QuizMaster
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/leaderboard"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Leaderboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
