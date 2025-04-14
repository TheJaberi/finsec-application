import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import {
  Shield,
  Key,
  AlertTriangle,
  Smartphone,
  AlertCircle,
} from 'lucide-react-native';
import { useLearningProgress } from '@/contexts/LearningProgressContext';

const modules = [
  {
    id: 'password-security',
    title: 'Password Security',
    description: 'Learn about creating and managing strong passwords',
    icon: Key,
    color: '#007AFF',
  },
  {
    id: 'secure-auth',
    title: 'Secure Authentication',
    description: 'Understanding multi-factor authentication and biometrics',
    icon: Shield,
    color: '#32C759',
  },
  {
    id: 'transaction-safety',
    title: 'Transaction Safety',
    description: 'How to ensure your transactions are secure',
    icon: AlertCircle,
    color: '#FF9500',
  },
  {
    id: 'device-security',
    title: 'Device Security',
    description: 'Keeping your device and app secure',
    icon: Smartphone,
    color: '#AF52DE',
  },
  {
    id: 'phishing-prevention',
    title: 'Phishing Prevention',
    description: 'Identifying and avoiding security threats',
    icon: AlertTriangle,
    color: '#FF3B30',
  },
];

export default function LearningScreen() {
  const { progress, isModuleCompleted } = useLearningProgress();

  const calculateProgress = () => {
    const completedCount = modules.filter(module => isModuleCompleted(module.id)).length;
    return (completedCount / modules.length) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Security Learning</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${calculateProgress()}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {modules.filter(module => isModuleCompleted(module.id)).length} of {modules.length} completed
        </Text>
      </View>

      {/* Modules List */}
      <ScrollView style={styles.modulesList}>
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={[
              styles.moduleCard,
              isModuleCompleted(module.id) && styles.moduleCardCompleted
            ]}
            onPress={() => router.push(`/learning/${module.id}`)}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: module.color }]}
            >
              <module.icon size={24} color="#FFFFFF" />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
              {isModuleCompleted(module.id) && (
                <Text style={styles.completedText}>Completed</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
  },
  progressContainer: {
    padding: 20,
    paddingTop: 0,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
  },
  modulesList: {
    flex: 1,
    padding: 20,
  },
  moduleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  moduleCardCompleted: {
    borderColor: '#32C759',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  moduleTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Inter_600SemiBold',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  completedText: {
    fontSize: 12,
    color: '#32C759',
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
});
