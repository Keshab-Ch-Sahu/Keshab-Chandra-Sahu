import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const categories = [
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    description: 'Test your knowledge of scientific concepts and discoveries'
  },
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    description: 'Challenge yourself with mathematical problems'
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    description: 'Prove your coding knowledge'
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    icon: '🌍',
    description: 'Test your knowledge of various topics'
  }
];

export default function Home() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/quiz/${categoryId}`);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to QuizMaster</h1>
        <p className="text-xl opacity-90">
          {user ? 'Choose a category to start your quiz!' : 'Sign in to start taking quizzes!'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 transition-all hover:transform hover:scale-105 hover:bg-white/20"
          >
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-sm opacity-75">{category.description}</p>
          </button>
        ))}
      </div>

      {!user && (
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg transition-colors"
          >
            Sign in to Start
          </button>
        </div>
      )}
    </div>
  );
}
