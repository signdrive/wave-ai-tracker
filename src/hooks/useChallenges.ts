import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useChallenges = () => {
  const { user } = useAuth();

  // Function to check and update challenge progress
  const checkChallengeProgress = async (sessionData: any) => {
    if (!user) return;

    try {
      // Get user's current surf sessions to calculate progress
      const { data: surfSessions, error: sessionsError } = await supabase
        .from('surf_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Get all active challenges
      const { data: challenges, error: challengesError } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true);

      if (challengesError) throw challengesError;

      // Check progress for each challenge
      for (const challenge of challenges || []) {
        const progressData = calculateChallengeProgress(challenge, surfSessions || [], sessionData);
        
        // Get existing progress record
        const { data: existingProgress } = await supabase
          .from('user_challenge_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('challenge_id', challenge.id)
          .single();

        const isCompleted = checkIfChallengeCompleted(challenge, progressData);
        
        // Update or insert progress
        const progressRecord = {
          user_id: user.id,
          challenge_id: challenge.id,
          progress_data: progressData,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        };

        if (existingProgress) {
          // Only update if not already completed or if progress changed
          if (!existingProgress.is_completed || JSON.stringify(existingProgress.progress_data) !== JSON.stringify(progressData)) {
            await supabase
              .from('user_challenge_progress')
              .update(progressRecord)
              .eq('id', existingProgress.id);
          }
        } else {
          await supabase
            .from('user_challenge_progress')
            .insert(progressRecord);
        }

        // If challenge just completed, create achievement
        if (isCompleted && (!existingProgress || !existingProgress.is_completed)) {
          await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              challenge_id: challenge.id,
              points_earned: challenge.reward_points,
            });

          // Show toast notification
          toast({
            title: "Achievement Unlocked! 🏆",
            description: `You've completed "${challenge.name}" and earned ${challenge.reward_points} points!`,
          });
        }
      }

      // Update user stats
      await updateUserStats();
      
    } catch (error) {
      console.error('Error checking challenge progress:', error);
    }
  };

  const calculateChallengeProgress = (challenge: any, allSessions: any[], newSession?: any) => {
    const criteria = challenge.criteria;
    const now = new Date();
    
    let progressData: any = {};

    // Session count challenges
    if (criteria.session_count) {
      if (challenge.type === 'daily') {
        const today = new Date().toDateString();
        const todaySessions = allSessions.filter(session => 
          new Date(session.session_date).toDateString() === today
        );
        progressData.sessions_logged = todaySessions.length;
      } else if (challenge.type === 'monthly') {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthSessions = allSessions.filter(session => {
          const sessionDate = new Date(session.session_date);
          return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
        });
        progressData.sessions_logged = monthSessions.length;
      } else {
        progressData.sessions_logged = allSessions.length;
      }
    }

    // Consecutive days (streak) challenges
    if (criteria.consecutive_days) {
      progressData.current_streak = calculateCurrentStreak(allSessions);
    }

    // Unique spots challenges
    if (criteria.unique_spots) {
      const uniqueSpots = new Set(allSessions.map(session => session.spot_id));
      progressData.unique_spots_count = uniqueSpots.size;
    }

    // Dawn patrol challenge (sessions before 7 AM)
    if (criteria.time_before) {
      const dawnSessions = allSessions.filter(session => {
        const sessionTime = new Date(session.session_date).getHours();
        const targetHour = parseInt(criteria.time_before.split(':')[0]);
        return sessionTime < targetHour;
      });
      progressData.sessions_logged = dawnSessions.length;
    }

    // Weekend warrior challenge
    if (criteria.weekend_sessions) {
      const currentWeekStart = getWeekStart(now);
      const currentWeekEnd = getWeekEnd(now);
      
      const weekendSessions = allSessions.filter(session => {
        const sessionDate = new Date(session.session_date);
        const dayOfWeek = sessionDate.getDay();
        return (dayOfWeek === 0 || dayOfWeek === 6) && // Sunday or Saturday
               sessionDate >= currentWeekStart && 
               sessionDate <= currentWeekEnd;
      });
      
      progressData.weekend_sessions = weekendSessions.length;
    }

    // Total sessions milestone
    if (criteria.total_sessions) {
      progressData.total_sessions = allSessions.length;
    }

    return progressData;
  };

  const checkIfChallengeCompleted = (challenge: any, progressData: any) => {
    const criteria = challenge.criteria;

    if (criteria.session_count && progressData.sessions_logged >= criteria.session_count) return true;
    if (criteria.consecutive_days && progressData.current_streak >= criteria.consecutive_days) return true;
    if (criteria.unique_spots && progressData.unique_spots_count >= criteria.unique_spots) return true;
    if (criteria.weekend_sessions && progressData.weekend_sessions >= criteria.weekend_sessions) return true;
    if (criteria.total_sessions && progressData.total_sessions >= criteria.total_sessions) return true;

    return false;
  };

  const calculateCurrentStreak = (sessions: any[]) => {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions
      .map(session => new Date(session.session_date).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // Remove duplicates

    let streak = 1;
    const today = new Date().toDateString();
    let currentDate = new Date(sortedSessions[sortedSessions.length - 1]);

    // Check if last session was today or yesterday
    const daysSinceLastSession = Math.floor((new Date(today).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastSession > 1) return 0;

    // Count consecutive days backwards
    for (let i = sortedSessions.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedSessions[i]);
      const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const getWeekStart = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const getWeekEnd = (date: Date) => {
    const result = getWeekStart(date);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  const updateUserStats = async () => {
    if (!user) return;

    try {
      // Get total sessions and calculate streak
      const { data: surfSessions } = await supabase
        .from('surf_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      // Get achievements count and total points
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('points_earned')
        .eq('user_id', user.id);

      const totalSessions = surfSessions?.length || 0;
      const currentStreak = calculateCurrentStreak(surfSessions || []);
      const achievementsCount = achievements?.length || 0;
      const totalPoints = achievements?.reduce((sum, achievement) => sum + achievement.points_earned, 0) || 0;
      const level = Math.max(1, Math.floor(totalPoints / 500) + 1);

      // Calculate longest streak (this is simplified - you might want a more sophisticated approach)
      const longestStreak = currentStreak; // For now, assume current is longest

      const statsData = {
        user_id: user.id,
        total_points: totalPoints,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        total_sessions: totalSessions,
        achievements_count: achievementsCount,
        level: level,
      };

      await supabase
        .from('user_stats')
        .upsert(statsData, { onConflict: 'user_id' });

    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return {
    checkChallengeProgress,
    updateUserStats,
  };
};