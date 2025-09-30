import { supabase } from '../lib/supabase';

export interface LearningProgress {
  id?: string;
  user_id: string;
  category: string;
  language: string;
  total_quizzes_taken: number;
  total_score: number;
  average_percentage: number;
  total_time_spent_seconds: number;
  current_streak_days: number;
  last_activity_date: string;
}

export const progressService = {
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as LearningProgress[];
  },

  async updateProgress(userId: string, category: string, language: string, quizScore: number, timeSpent: number) {
    const { data: existing } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .eq('language', language)
      .maybeSingle();

    const today = new Date().toISOString().split('T')[0];

    if (existing) {
      const newTotal = existing.total_quizzes_taken + 1;
      const newTotalScore = existing.total_score + quizScore;
      const newAverage = (newTotalScore / newTotal);

      const { error } = await supabase
        .from('learning_progress')
        .update({
          total_quizzes_taken: newTotal,
          total_score: newTotalScore,
          average_percentage: newAverage,
          total_time_spent_seconds: existing.total_time_spent_seconds + timeSpent,
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('learning_progress')
        .insert({
          user_id: userId,
          category,
          language,
          total_quizzes_taken: 1,
          total_score: quizScore,
          average_percentage: quizScore,
          total_time_spent_seconds: timeSpent,
          last_activity_date: today,
        });

      if (error) throw error;
    }
  },

  async getProgressByCategory(userId: string) {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('average_percentage', { ascending: false });

    if (error) throw error;
    return data as LearningProgress[];
  },
};
