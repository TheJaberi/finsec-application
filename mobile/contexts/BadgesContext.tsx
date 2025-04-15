import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BadgeLevel = 'bronze' | 'silver' | 'gold';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: BadgeLevel;
  dateEarned?: string;
}

export const BADGES: { [key: string]: Badge } = {
  securityTrainee: {
    id: 'securityTrainee',
    title: 'Security Trainee',
    description: 'Completed your first security module',
    icon: '🔰',
    level: 'bronze',
  },
  passwordMaster: {
    id: 'passwordMaster',
    title: 'Password Master',
    description: 'Mastered password security concepts',
    icon: '🔑',
    level: 'bronze',
  },
  transactionMaster: {
    id: 'transactionMaster',
    title: 'Transaction Safety Expert',
    description: 'Mastered transaction safety concepts',
    icon: '💰',
    level: 'bronze',
  },
  authenticationPro: {
    id: 'authenticationPro',
    title: 'Authentication Pro',
    description: 'Mastered multi-factor authentication',
    icon: '🛡️',
    level: 'bronze',
  },
  deviceGuardian: {
    id: 'deviceGuardian',
    title: 'Device Guardian',
    description: 'Completed all device security checks',
    icon: '📱',
    level: 'bronze',
  },
  phishingDetective: {
    id: 'phishingDetective',
    title: 'Phishing Detective',
    description: 'Expert at identifying phishing attempts',
    icon: '🎯',
    level: 'bronze',
  },
  securityApprentice: {
    id: 'securityApprentice',
    title: 'Security Apprentice',
    description: 'Completed any three security modules',
    icon: '⭐',
    level: 'silver',
  },
  securityExpert: {
    id: 'securityExpert',
    title: 'Security Expert',
    description: 'Completed all security modules',
    icon: '🌟',
    level: 'gold',
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Security Perfectionist',
    description: 'Achieved perfect scores in all modules',
    icon: '👑',
    level: 'gold',
  },
};

interface BadgesContextType {
  earnedBadges: Badge[];
  awardBadge: (badgeId: string) => Promise<void>;
  hasBadge: (badgeId: string) => boolean;
  getLatestBadge: () => Badge | null;
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

export function BadgesProvider({ children }: { children: React.ReactNode }) {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const savedBadges = await AsyncStorage.getItem('earnedBadges');
      if (savedBadges) {
        setEarnedBadges(JSON.parse(savedBadges));
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const saveBadges = async (badges: Badge[]) => {
    try {
      await AsyncStorage.setItem('earnedBadges', JSON.stringify(badges));
    } catch (error) {
      console.error('Error saving badges:', error);
    }
  };

  const awardBadge = async (badgeId: string) => {
    if (hasBadge(badgeId)) return;

    const badge = BADGES[badgeId];
    if (!badge) return;

    const newBadge = {
      ...badge,
      dateEarned: new Date().toISOString(),
    };

    const updatedBadges = [...earnedBadges, newBadge];
    setEarnedBadges(updatedBadges);
    await saveBadges(updatedBadges);
  };

  const hasBadge = (badgeId: string) => {
    return earnedBadges.some(badge => badge.id === badgeId);
  };

  const getLatestBadge = () => {
    if (earnedBadges.length === 0) return null;
    return earnedBadges[earnedBadges.length - 1];
  };

  return (
    <BadgesContext.Provider
      value={{
        earnedBadges,
        awardBadge,
        hasBadge,
        getLatestBadge,
      }}
    >
      {children}
    </BadgesContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgesContext);
  if (context === undefined) {
    throw new Error('useBadges must be used within a BadgesProvider');
  }
  return context;
}
