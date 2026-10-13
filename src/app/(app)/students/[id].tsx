import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useStudents } from '@/context/students';
import { useTheme } from '@/hooks/use-theme';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStudent, removeStudent } = useStudents();
  const theme = useTheme();
  const student = getStudent(id);

  if (!student) {
    return (
      <ThemedView style={[styles.flex, styles.centered]}>
        <Stack.Screen options={{ title: 'Introuvable' }} />
        <ThemedText themeColor="textSecondary">Cet étudiant n&apos;existe pas.</ThemedText>
        <Button title="Retour à la liste" onPress={() => router.replace('/students')} />
      </ThemedView>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;

  const onDelete = () => {
    const remove = () => {
      if (router.canGoBack()) router.back();
      else router.replace('/students');
      removeStudent(student.id);
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`Supprimer ${fullName} ?`)) remove();
      return;
    }
    Alert.alert('Supprimer', `Supprimer ${fullName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: remove },
    ]);
  };

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: fullName }} />
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.hero}>
          <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
            <ThemedText type="subtitle" style={styles.avatarText}>
              {`${student.firstName[0]}${student.lastName[0]}`.toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.center}>
            {fullName}
          </ThemedText>
          <ThemedText themeColor="textSecondary">{student.program}</ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.card}>
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Âge" value={`${student.age} ans`} />
          <InfoRow label="Filière" value={student.program} />
          <InfoRow label="Téléphone" value={student.phone ?? '—'} />
          <InfoRow
            label="Inscrit le"
            value={new Date(student.createdAt).toLocaleDateString('fr-FR')}
          />
        </ThemedView>

        <Button title="Supprimer l'étudiant" variant="danger" onPress={onDelete} />
      </ScrollView>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText type="small" selectable style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
  },
  center: {
    textAlign: 'center',
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  infoValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
