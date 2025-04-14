import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useLearningProgress } from '@/contexts/LearningProgressContext';
import { router } from 'expo-router';
import { AlertTriangle, Mail, MessageSquare, Check, X, AlertCircle, ChevronLeft } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const EXAMPLES = [
  {
    id: 1,
    type: 'email',
    title: 'Account Security Alert',
    content: {
      from: 'security@accounts-verify.com',
      subject: 'Urgent: Account Access Limited',
      body: 'Dear valued customer,\n\nWe have detected unusual activity on your account. To prevent unauthorized access, your account has been temporarily limited. Click here to verify your identity: http://secure-verify-accounts.com/restore',
      time: '3:45 AM',
    },
    isSuspicious: true,
    indicators: [
      'Unofficial email domain',
      'Generic greeting',
      'Urgent action required',
      'Suspicious link',
      'Unusual timing',
    ],
  },
  {
    id: 2,
    type: 'sms',
    title: 'Package Delivery',
    content: {
      from: '+1-555-0123',
      body: 'Your package is held at customs. Pay a small fee (2.99$) to release: http://track-delivery.co/pay',
      time: 'Just now',
    },
    isSuspicious: true,
    indicators: [
      'Unexpected delivery',
      'Request for payment',
      'Shortened URL',
      'Unknown sender',
    ],
  },
  {
    id: 3,
    type: 'email',
    title: 'Bank Statement',
    content: {
      from: 'statements@mybank.com',
      subject: 'Your Monthly Statement is Ready',
      body: 'Your account statement for the period ending April 15, 2025 is now available in your online banking portal. Sign in to your account to view: https://mybank.com/statements',
      time: '9:00 AM',
    },
    isSuspicious: false,
    indicators: [
      'Official bank domain',
      'No urgent action required',
      'Directs to official website',
      'Expected monthly communication',
    ],
  },
];

export default function PhishingPreventionScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  const { updateModuleProgress, markModuleComplete } = useLearningProgress();

  useEffect(() => {
    updateModuleProgress('phishing-prevention', `example-${currentIndex}`);
  }, [currentIndex]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => handleSwipe(false));
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => handleSwipe(true));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const handleSwipe = (markedAsSuspicious: boolean) => {
    const example = EXAMPLES[currentIndex];
    const isCorrect = markedAsSuspicious === example.isSuspicious;

    setFeedbackType(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      setShowFeedback(false);
      position.setValue({ x: 0, y: 0 });
      if (currentIndex === EXAMPLES.length - 1) {
        setShowCompletion(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 2000);
  };

  const getRotation = () => {
    return position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
  };

  const getCardStyle = () => {
    const rotate = getRotation();
    return {
      transform: [
        { translateX: position.x },
        { rotate },
      ],
    };
  };

  const renderExample = () => {
    if (showCompletion) return null;
    const example = EXAMPLES[currentIndex];

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <View style={styles.cardHeader}>
          {example.type === 'email' ? (
            <Mail size={24} color="#1A1A1A" />
          ) : (
            <MessageSquare size={24} color="#1A1A1A" />
          )}
          <Text style={styles.cardTitle}>{example.title}</Text>
        </View>

        <View style={styles.messageContent}>
          <Text style={styles.messageField}>From: {example.content.from}</Text>
          {example.content.subject && (
            <Text style={styles.messageField}>Subject: {example.content.subject}</Text>
          )}
          <Text style={styles.messageBody}>{example.content.body}</Text>
          <Text style={styles.messageTime}>{example.content.time}</Text>
        </View>

        <View style={styles.swipeHint}>
          <View style={styles.swipeAction}>
            <X size={24} color="#FF3B30" />
            <Text style={[styles.swipeText, { color: '#FF3B30' }]}>
              Swipe left if suspicious
            </Text>
          </View>
          <View style={styles.swipeAction}>
            <Check size={24} color="#32C759" />
            <Text style={[styles.swipeText, { color: '#32C759' }]}>
              Swipe right if safe
            </Text>
          </View>
        </View>
      </Animated.View>
    );
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
        <Text style={styles.title}>Phishing Prevention</Text>
      </View>

      {!showCompletion ? (
        <>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}/{EXAMPLES.length}</Text>
            <Text style={styles.progressText}>
              Example {currentIndex + 1} of {EXAMPLES.length}
            </Text>
          </View>

          <View style={styles.cardContainer}>
            {renderExample()}
            {showFeedback && (
              <View style={[
                styles.feedback,
                feedbackType === 'correct' ? styles.feedbackCorrect : styles.feedbackIncorrect
              ]}>
                <Text style={styles.feedbackTitle}>
                  {feedbackType === 'correct' ? 'Correct!' : 'Incorrect!'}
                </Text>
                <Text style={styles.feedbackText}>
                  {EXAMPLES[currentIndex].indicators.map((indicator) => `• ${indicator}\n`)}
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.completionContainer}>
          <Text style={styles.completionTitle}>Congratulations!</Text>
          <Text style={[styles.completionText, { marginBottom: 20 }]}>
            You've completed all phishing scenarios
          </Text>
          <Text style={styles.scoreText}>
            Final Score: {score}/{EXAMPLES.length}
          </Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => {
              markModuleComplete('phishing-prevention');
              router.back();
            }}
          >
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        </View>
      )}
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
  scoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#007AFF',
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  cardContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  messageContent: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
  },
  messageField: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  messageBody: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1A1A1A',
    marginVertical: 12,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  swipeHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  swipeAction: {
    alignItems: 'center',
  },
  swipeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  feedback: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: '#E8F8EF',
  },
  feedbackIncorrect: {
    backgroundColor: '#FFEFEF',
  },
  feedbackTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
