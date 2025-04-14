import React from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text } from '../Themed';
import { router } from 'expo-router';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  color: string;
  fadeAnim: Animated.Value;
  index: number;
}

export function ModuleCard({
  id,
  title,
  description,
  progress,
  icon,
  color,
  fadeAnim,
  index,
}: ModuleCardProps) {
  const handlePress = () => {
    router.push(`/learning/module/${id}`);
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * (index + 1), 0],
            }),
          }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.moduleCard,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={[styles.moduleIcon, { backgroundColor: `${color}15` }]}>
          <Text style={styles.moduleIconText}>{icon}</Text>
        </View>
        <View style={styles.moduleContent}>
          <Text style={styles.moduleTitle}>{title}</Text>
          <Text style={styles.moduleDescription}>
            {description}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: color
                }
              ]} 
            />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressText, { color }]}>
              {progress}% Complete
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIconText: {
    fontSize: 24,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressTextContainer: {
    marginTop: 4,
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
