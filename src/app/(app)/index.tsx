import { Link, router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useStudents } from '@/context/students';

export default function HomeScreen() {
  const { userEmail, signOut } = useAuth();
  const { students } = useStudents();
  const programs = new Set(students.map((s) => s.program)).size;
  const latest = students[0];

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <ThemedText type="subtitle">Bienvenue 👋</ThemedText>
          <ThemedText themeColor="textSecondary">Connecté en tant que {userEmail}</ThemedText>
        </View>

        <View style={styles.stats}>
          <StatCard label="Étudiants" value={students.length} />
          <StatCard label="Filières" value={programs} />
        </View>

        {latest && (
          <Link href={{ pathname: '/students/[id]', params: { id: latest.id } }}>
            <ThemedText type="small" themeColor="textSecondary">
              Dernier ajout : {latest.firstName} {latest.lastName} →
            </ThemedText>
          </Link>
        )}

        <View style={styles.actions}>
          <Button title="Voir la liste des étudiants" onPress={() => router.push('/students')} />
          <Button
            title="Ajouter un étudiant"
            variant="secondary"
            onPress={() => router.push('/students/new')}
          />
          <Button title="Se déconnecter" variant="danger" onPress={signOut} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  header: {
    gap: Spacing.one,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  card: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  actions: {
    gap: Spacing.three,
  },
});
