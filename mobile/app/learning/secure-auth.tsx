import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { Smartphone, Key, MessageSquare, Fingerprint, AlertTriangle, ChevronLeft } from 'lucide-react-native';

const MFA_TYPES = [
  {
    id: 'authenticator',
    title: 'Authenticator App',
    icon: Smartphone,
    color: '#007AFF',
    description: 'Most secure method. Uses time-based codes that change every 30 seconds.',
    strengthLevel: 5,
  },
  {
    id: 'biometric',
    title: 'Biometric',
    icon: Fingerprint,
    color: '#32C759',
    description: 'Very secure and convenient. Uses your unique biological features.',
    strengthLevel: 4,
  },
  {
    id: 'security-key',
    title: 'Security Key',
    icon: Key,
    color: '#AF52DE',
    description: 'Physical key that must be present for authentication.',
    strengthLevel: 4,
  },
  {
    id: 'sms',
    title: 'SMS Code',
    icon: MessageSquare,
    color: '#FF9500',
    description: 'Less secure due to potential SMS interception.',
    strengthLevel: 2,
  },
];

function AuthenticatorDemo() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateNewCode();
    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          generateNewCode();
          return 30;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: timeLeft * 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [code]);

  const generateNewCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
  };

  const rotation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.demoContainer}>
      <View style={styles.authenticatorContainer}>
        <Animated.View
          style={[
            styles.progressRing,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        />
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{code}</Text>
          <Text style={styles.timeText}>{timeLeft}s</Text>
        </View>
      </View>
    </View>
  );
}

export default function SecureAuthScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();

  useEffect(() => {
    updateModuleProgress('secure-auth', 'exploring-mfa');
  }, []);

  const renderDemo = () => {
    if (!showDemo || !selectedType) return null;

    switch (selectedType) {
      case 'authenticator':
        return <AuthenticatorDemo />;
      case 'biometric':
        return (
          <View style={styles.demoContainer}>
            <View style={styles.biometricDemo}>
              <Fingerprint size={80} color="#32C759" />
              <Text style={styles.demoText}>Touch sensor to authenticate</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Secure Authentication</Text>
      </View>
      <ScrollView style={styles.content}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multi-Factor Authentication</Text>
          <Text style={styles.description}>
            Learn about different types of MFA and their security levels. Tap each method to see how it works.
          </Text>

          {MFA_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mfaCard,
                selectedType === type.id && styles.selectedCard,
              ]}
              onPress={() => {
                setSelectedType(type.id);
                setShowDemo(true);
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.color }]}>
                <type.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.mfaInfo}>
                <Text style={styles.mfaTitle}>{type.title}</Text>
                <Text style={styles.mfaDescription}>{type.description}</Text>
                <View style={styles.strengthContainer}>
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthDot,
                        i < type.strengthLevel ? { backgroundColor: type.color } : {}
                      ]}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {renderDemo()}

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            markModuleComplete('secure-auth');
            router.back();
          }}
        >
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  mfaCard: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#E5E5EA',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mfaInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mfaTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  mfaDescription: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  demoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  authenticatorContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 4,
    borderRadius: 80,
    borderColor: '#007AFF',
    borderRightColor: '#E5E5EA',
  },
  codeContainer: {
    alignItems: 'center',
  },
  codeText: {
    fontSize: 28,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    letterSpacing: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  biometricDemo: {
    alignItems: 'center',
    padding: 20,
  },
  demoText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter_500Medium',
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
