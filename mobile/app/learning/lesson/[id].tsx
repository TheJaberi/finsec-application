import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/Themed';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

// Sample lesson content
const lessonContent = {
  'passwords': {
    title: 'Password Security',
    sections: [
      {
        title: 'Creating Strong Passwords',
        content: [
          'Use at least 12 characters',
          'Mix uppercase and lowercase letters',
          'Include numbers and special characters',
          'Avoid personal information',
          'Use unique passwords for each account'
        ]
      },
      {
        title: 'Password Management Tips',
        content: [
          'Use a password manager',
          'Enable two-factor authentication',
          'Change passwords regularly',
          'Never share passwords',
          'Check for password breaches'
        ]
      }
    ],
    quiz: [
      {
        question: 'Which of these is the strongest password?',
        options: [
          'password123',
          'MyP@ssw0rd!2024',
          'birthday1990',
          'qwerty'
        ],
        correctAnswer: 1
      },
      {
        question: 'How often should you change important passwords?',
        options: [
          'Never',
          'Every day',
          'Every 3-6 months',
          'Only when compromised'
        ],
        correctAnswer: 2
      }
    ]
  },
  'device-security': {
    title: 'Device Security',
    sections: [
      {
        title: 'Basic Device Protection',
        content: [
          'Enable device lock screen with strong PIN/password',
          'Keep your operating system updated',
          'Install security updates promptly',
          'Use anti-malware protection',
          'Avoid using public Wi-Fi for banking'
        ]
      },
      {
        title: 'App Security',
        content: [
          'Only install apps from official stores',
          'Review app permissions carefully',
          'Keep apps updated',
          'Remove unused apps',
          'Use app lock for banking apps'
        ]
      }
    ],
    quiz: [
      {
        question: 'What should you do when using public Wi-Fi?',
        options: [
          'Check your bank balance',
          'Transfer money to friends',
          'Use a VPN connection',
          'Share your location'
        ],
        correctAnswer: 2
      },
      {
        question: 'How often should you update your device?',
        options: [
          'Never',
          'When it stops working',
          'Once a year',
          'As soon as updates are available'
        ],
        correctAnswer: 3
      }
    ]
  },
  'authentication': {
    title: 'Authentication Methods',
    sections: [
      {
        title: 'Types of Authentication',
        content: [
          'Something you know (passwords)',
          'Something you have (phone, security key)',
          'Something you are (fingerprint, face)',
          'Location-based authentication',
          'Behavioral biometrics'
        ]
      },
      {
        title: 'Two-Factor Authentication',
        content: [
          'Use 2FA whenever possible',
          'Keep backup codes safe',
          'Don\'t share verification codes',
          'Use authenticator apps over SMS',
          'Regular security checkups'
        ]
      }
    ],
    quiz: [
      {
        question: 'Which is the most secure form of 2FA?',
        options: [
          'SMS codes',
          'Email codes',
          'Hardware security key',
          'Recovery questions'
        ],
        correctAnswer: 2
      },
      {
        question: 'What should you do with backup codes?',
        options: [
          'Share with family',
          'Store securely offline',
          'Post on social media',
          'Ignore them'
        ],
        correctAnswer: 1
      }
    ]
  },
  'common-scams': {
    title: 'Common Banking Scams',
    sections: [
      {
        title: 'Types of Scams',
        content: [
          'Phishing emails and messages',
          'Fake banking websites',
          'Phone call scams (vishing)',
          'Investment fraud schemes',
          'Lottery and prize scams'
        ]
      },
      {
        title: 'Warning Signs',
        content: [
          'Urgent action required messages',
          'Too good to be true offers',
          'Requests for personal information',
          'Poor grammar and spelling',
          'Unofficial contact methods'
        ]
      }
    ],
    quiz: [
      {
        question: 'What should you do if a bank calls asking for your PIN?',
        options: [
          'Provide it immediately',
          'Write it down for them',
          'Hang up and call your bank directly',
          'Share it via email'
        ],
        correctAnswer: 2
      },
      {
        question: 'Which is a sign of a potential scam?',
        options: [
          'Official bank letterhead',
          'Scheduled maintenance notice',
          'Threat of account closure',
          'Branch closure notice'
        ],
        correctAnswer: 2
      }
    ]
  },
  'phishing': {
    title: 'Phishing Prevention',
    sections: [
      {
        title: 'Identifying Phishing',
        content: [
          'Check sender email addresses carefully',
          'Verify website URLs',
          'Be wary of urgent requests',
          'Look for personalization',
          'Check for secure connections (HTTPS)'
        ]
      },
      {
        title: 'Safe Practices',
        content: [
          'Never click suspicious links',
          'Don\'t download unexpected attachments',
          'Use spam filters',
          'Report phishing attempts',
          'Keep software updated'
        ]
      }
    ],
    quiz: [
      {
        question: 'How can you verify a website\'s authenticity?',
        options: [
          'Ask a friend',
          'Click all links',
          'Check the URL and SSL certificate',
          'Enter your password'
        ],
        correctAnswer: 2
      },
      {
        question: 'What should you do with suspicious emails?',
        options: [
          'Forward to friends',
          'Click links to check',
          'Reply to sender',
          'Report as phishing'
        ],
        correctAnswer: 3
      }
    ]
  },
  'secure-payments': {
    title: 'Secure Payments',
    sections: [
      {
        title: 'Payment Safety',
        content: [
          'Use secure payment methods',
          'Verify merchant authenticity',
          'Check for HTTPS before payment',
          'Keep payment receipts',
          'Monitor transactions regularly'
        ]
      },
      {
        title: 'Additional Precautions',
        content: [
          'Use virtual cards for online shopping',
          'Enable transaction notifications',
          'Never save card details on websites',
          'Use trusted payment services',
          'Set up spending limits'
        ]
      }
    ],
    quiz: [
      {
        question: 'What should you check before online payment?',
        options: [
          'Website reviews only',
          'Nothing, just pay',
          'HTTPS and merchant verification',
          'Website colors'
        ],
        correctAnswer: 2
      },
      {
        question: 'How often should you check transactions?',
        options: [
          'Once a year',
          'Never',
          'When you remember',
          'Regularly/Daily'
        ],
        correctAnswer: 3
      }
    ]
  },
  'data-privacy': {
    title: 'Data Privacy',
    sections: [
      {
        title: 'Personal Information',
        content: [
          'Minimize sharing personal data',
          'Read privacy policies',
          'Use privacy settings',
          'Regular privacy checkups',
          'Know your data rights'
        ]
      },
      {
        title: 'Data Protection',
        content: [
          'Use encrypted connections',
          'Clear browsing data regularly',
          'Be careful with public Wi-Fi',
          'Use privacy-focused services',
          'Enable app privacy settings'
        ]
      }
    ],
    quiz: [
      {
        question: 'What should you do before sharing personal info?',
        options: [
          'Share immediately',
          'Ask why it\'s needed',
          'Post on social media',
          'Ignore privacy concerns'
        ],
        correctAnswer: 1
      },
      {
        question: 'How can you protect data on public Wi-Fi?',
        options: [
          'Share with everyone',
          'Do nothing special',
          'Use a VPN',
          'Turn off device'
        ],
        correctAnswer: 2
      }
    ]
  }
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessonContent[lessonId as keyof typeof lessonContent];
  
  const insets = useSafeAreaInsets();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleBack = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      router.back();
    }
  };

  if (!lesson) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1A73E8', '#0D47A1']}
          style={[styles.header, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Lesson Not Found</Text>
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This lesson is not available.</Text>
          <Pressable style={styles.backToModules} onPress={handleBack}>
            <Text style={styles.backToModulesText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      router.back();
    }
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
        <Text style={styles.title}>{lesson.title}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showQuiz ? (
          <>
            {lesson.sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.content.map((item, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
            <Pressable
              style={styles.quizButton}
              onPress={() => setShowQuiz(true)}
            >
              <Text style={styles.quizButtonText}>Take Quiz</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.quizContainer}>
            <Text style={styles.questionText}>
              {lesson.quiz[currentQuestionIndex].question}
            </Text>
            {lesson.quiz[currentQuestionIndex].options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === lesson.quiz[currentQuestionIndex].correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && selectedAnswer !== lesson.quiz[currentQuestionIndex].correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => !showResult && handleAnswer(index)}
              >
                <Text
                  style={[
                    styles.optionText,
                    (showResult && (index === lesson.quiz[currentQuestionIndex].correctAnswer || selectedAnswer === index)) && styles.optionTextSelected
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
            {showResult && (
              <Pressable
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex === lesson.quiz.length - 1 ? 'Finish' : 'Next Question'}
                </Text>
              </Pressable>
            )}
          </View>
        )}
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
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backToModules: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backToModulesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#1A73E8',
  },
  bulletText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  quizButton: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizContainer: {
    padding: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: '#1A73E8',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#1A73E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
