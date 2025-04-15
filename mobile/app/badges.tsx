import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Trophy } from 'lucide-react-native';
import { useBadges, BADGES } from '@/contexts/BadgesContext';

export default function BadgesScreen() {
  const { earnedBadges } = useBadges();

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
        <Text style={styles.title}>Your Badges</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Trophy size={24} color="#007AFF" />
          <Text style={styles.statCount}>{earnedBadges.length}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statBox}>
          <Trophy size={24} color="#FFD700" />
          <Text style={styles.statCount}>
            {earnedBadges.filter(b => b.level === 'gold').length}
          </Text>
          <Text style={styles.statLabel}>Gold</Text>
        </View>
        <View style={styles.statBox}>
          <Trophy size={24} color="#C0C0C0" />
          <Text style={styles.statCount}>
            {earnedBadges.filter(b => b.level === 'silver').length}
          </Text>
          <Text style={styles.statLabel}>Silver</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        <View style={styles.badgesGrid}>
          {earnedBadges.map((badge) => (
            <View
              key={badge.id}
              style={[
                styles.badgeContainer,
                { backgroundColor: getBadgeColor(badge.level) }
              ]}
            >
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
              <Text style={styles.earnedDate}>
                {new Date(badge.dateEarned!).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Available Badges</Text>
        <View style={styles.badgesGrid}>
          {Object.values(BADGES)
            .filter(badge => !earnedBadges.some(earned => earned.id === badge.id))
            .map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeContainer,
                  styles.lockedBadge,
                ]}
              >
                <Text style={[styles.badgeIcon, styles.lockedIcon]}>🔒</Text>
                <Text style={[styles.badgeTitle, styles.lockedText]}>{badge.title}</Text>
                <Text style={[styles.badgeDescription, styles.lockedText]}>
                  {badge.description}
                </Text>
              </View>
            ))}
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  earnedDate: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  lockedBadge: {
    backgroundColor: '#F2F2F7',
    opacity: 0.8,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  lockedText: {
    color: '#8E8E93',
  },
});
