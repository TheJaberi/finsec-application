import React from 'react';
import { View, StyleSheet, ScrollView, Animated, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/Themed';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

const lessons = {
  'basic-security': [
    {
      id: 'passwords',
      title: 'Password Security',
      description: 'Learn how to create and manage strong passwords',
      estimatedTime: '10 min',
    },
    {
      id: 'device-security',
      title: 'Device Security',
      description: 'Best practices for keeping your device secure',
      estimatedTime: '8 min',
    },
    {
      id: 'authentication',
      title: 'Authentication Methods',
      description: 'Understanding different authentication methods',
      estimatedTime: '12 min',
    }
  ],
  'fraud-detection': [
    {
      id: 'common-scams',
      title: 'Common Banking Scams',
      description: 'Learn to identify common banking scams',
      estimatedTime: '15 min',
    },
    {
      id: 'phishing',
      title: 'Phishing Prevention',
      description: 'How to detect and avoid phishing attempts',
      estimatedTime: '10 min',
    }
  ],
  'safe-transactions': [
    {
      id: 'secure-payments',
      title: 'Secure Payments',
      description: 'Making safe online transactions',
      estimatedTime: '12 min',
    }
  ],
  'privacy': [
    {
      id: 'data-privacy',
      title: 'Data Privacy',
      description: 'Protecting your personal information',
      estimatedTime: '10 min',
    }
  ]
};

export default function ModuleScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const moduleId = Array.isArray(id) ? id[0] : id;
  const moduleLessons = lessons[moduleId as keyof typeof lessons] || [];
  
  const moduleTitle = {
    'basic-security': 'Basic Security',
    'fraud-detection': 'Fraud Detection',
    'safe-transactions': 'Safe Transactions',
    'privacy': 'Privacy Protection'
  }[moduleId as string] || 'Module Details';

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A73E8', '#0D47A1']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{moduleTitle}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Lessons</Text>
        
        {moduleLessons.map((lesson, index) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [
              styles.lessonCard,
              { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
            onPress={() => router.push(`/learning/lesson/${lesson.id}`)}
          >
            <View style={styles.lessonHeader}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonTime}>{lesson.estimatedTime}</Text>
            </View>
            <Text style={styles.lessonDescription}>{lesson.description}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  lessonTime: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 2,
  },
});
