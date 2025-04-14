import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ModuleProgress = {
  completed: boolean;
  lastPosition: string;
  timeSpent: number;
};

type LearningProgress = {
  [moduleId: string]: ModuleProgress;
};

interface LearningProgressContextType {
  progress: LearningProgress;
  markModuleComplete: (moduleId: string) => Promise<void>;
  updateModuleProgress: (moduleId: string, position: string) => Promise<void>;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  isModuleCompleted: (moduleId: string) => boolean;
}

const LearningProgressContext = createContext<LearningProgressContextType | undefined>(undefined);

export function LearningProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>({});

  // Load progress from AsyncStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('learningProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading learning progress:', error);
    }
  };

  const saveProgress = async (newProgress: LearningProgress) => {
    try {
      await AsyncStorage.setItem('learningProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving learning progress:', error);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    const updatedProgress = {
      ...progress,
      [moduleId]: {
        ...progress[moduleId],
        completed: true,
      },
    };
    await saveProgress(updatedProgress);
  };

  const updateModuleProgress = async (moduleId: string, position: string) => {
    const currentModule = progress[moduleId] || { completed: false, timeSpent: 0, lastPosition: '' };
    const updatedProgress = {
      ...progress,
      [moduleId]: {
        ...currentModule,
        lastPosition: position,
        timeSpent: currentModule.timeSpent + 1, // Increment time spent
      },
    };
    await saveProgress(updatedProgress);
  };

  const getModuleProgress = (moduleId: string) => {
    return progress[moduleId];
  };

  const isModuleCompleted = (moduleId: string) => {
    return progress[moduleId]?.completed || false;
  };

  return (
    <LearningProgressContext.Provider
      value={{
        progress,
        markModuleComplete,
        updateModuleProgress,
        getModuleProgress,
        isModuleCompleted,
      }}
    >
      {children}
    </LearningProgressContext.Provider>
  );
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);
  if (context === undefined) {
    throw new Error('useLearningProgress must be used within a LearningProgressProvider');
  }
  return context;
}
