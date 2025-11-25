export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'student';
  points: number;
  status: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  active: boolean;
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
  photo_url: string | null;
  specialty: string;
  access_code: string;
  is_active: boolean;
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