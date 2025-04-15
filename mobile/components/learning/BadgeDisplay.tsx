import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Badge } from '@/contexts/BadgesContext';
import ConfettiCannon from 'react-native-confetti-cannon';

interface BadgeDisplayProps {
  badge: Badge | null;
  onClose: () => void;
  visible: boolean;
}

export default function BadgeDisplay({ badge, onClose, visible }: BadgeDisplayProps) {
  const scaleAnim = new Animated.Value(0);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible && badge) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, badge]);

  if (!badge) return null;

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      default:
        return '#CD7F32';
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ConfettiCannon
            count={50}
            origin={{ x: -10, y: 0 }}
            fallSpeed={2500}
            fadeOut={true}
            autoStart={true}
          />
          
          <Text style={styles.congratsText}>Congratulations!</Text>
          
          <Animated.View
            style={[
              styles.badgeContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { rotate: rotation },
                ],
                backgroundColor: getBadgeColor(badge.level),
              },
            ]}
          >
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
          </Animated.View>

          <Text style={styles.badgeTitle}>{badge.title}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
  },
  congratsText: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  badgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  badgeIcon: {
    fontSize: 48,
  },
  badgeTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
