import { supabase } from '../lib/supabase';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  is_active: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'code_completion' | 'true_false';
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  order_index: number;
}

export interface QuizAttempt {
  id?: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_points: number;
  percentage: number;
  time_spent_seconds: number;
  answers: any[];
  completed_at?: string;
}

export const quizService = {
  async getQuizzes(category?: string, difficulty?: string) {
    let query = supabase
      .from('quizzes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Quiz[];
  },

  async getQuizById(quizId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .maybeSingle();

    if (error) throw error;
    return data as Quiz;
  },

  async getQuizQuestions(quizId: string) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as QuizQuestion[];
  },

  async submitQuizAttempt(attempt: QuizAttempt) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert(attempt)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserAttempts(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        quizzes:quiz_id (title, category, difficulty, language)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('score, total_points, percentage, time_spent_seconds')
      .eq('user_id', userId);

    if (error) throw error;

    const totalAttempts = data.length;
    const averageScore = data.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts || 0;
    const totalTimeSpent = data.reduce((acc, curr) => acc + curr.time_spent_seconds, 0);

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      totalTimeSpent,
    };
  },
};
