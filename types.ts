export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'student';
  points: number;
  status: 'active' | 'late' | 'inactive';
  plan?: string;
  due_date?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  criteria_type: 'points' | 'workouts' | 'streak' | 'video' | 'custom';
  criteria_value: number;
  active: boolean;
}

export interface Exercise {
  name: string;
  video_url: string;
  sets: string;
  reps: string;
}

export interface Workout {
  id: string;
  title: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  description: string;
  exercises: Exercise[];
  created_at: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  personal_id: string | null;
  is_free: boolean;
  views_count: number;
}

export interface PersonalTrainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo_url: string | null;
  specialty: string;
  bio?: string;
  access_code: string;
  is_active: boolean;
  students_count: number;
}

export interface UserStats {
  level: number;
  total_points: number;
  workouts_completed: number;
  videos_completed: number;
  current_streak: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  stripePriceId: string;
}