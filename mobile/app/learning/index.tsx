import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Text } from '../../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleCard } from '../../components/learning/ModuleCard';

const learningModules = [
  {
    id: 'basic-security',
    title: 'Basic Security',
    description: 'Learn fundamental security practices',
    progress: 0,
    icon: '🛡️',
    color: '#1A73E8',
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection',
    description: 'Identify and prevent fraudulent activities',
    progress: 0,
    icon: '🔍',
    color: '#9C27B0',
  },
  {
    id: 'safe-transactions',
    title: 'Safe Transactions',
    description: 'Best practices for secure transactions',
    progress: 0,
    icon: '💳',
    color: '#00BCD4',
  },
  {
    id: 'privacy',
    title: 'Privacy Protection',
    description: 'Protect your personal information',
    progress: 0,
    icon: '🔐',
    color: '#4CAF50',
  },
];

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A73E8', '#0D47A1']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Security Learning</Text>
          <Text style={styles.subtitle}>
            Enhance your banking security knowledge
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Modules Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Learning Modules</Text>
          
          {learningModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              {...module}
              fadeAnim={fadeAnim}
              index={index}
            />
          ))}
        </Animated.View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});
