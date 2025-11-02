import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresRef = collection(db, 'scores');
        const q = query(scoresRef, orderBy('score', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const scoresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setScores(scoresList);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Top Scores</h2>
      
      <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Score</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr 
                key={score.id}
                className="border-b border-white/10 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">#{index + 1}</td>
                <td className="px-6 py-4 capitalize">{score.category}</td>
                <td className="px-6 py-4">
                  {score.score} / {score.totalQuestions}
                </td>
                <td className="px-6 py-4">
                  {score.timestamp?.toDate().toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {scores.length === 0 && (
          <div className="text-center py-8">
            No scores yet. Be the first to play!
          </div>
        )}
      </div>
    </div>
  );
}
