import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useStudents, type Student } from '@/context/students';
import { useTheme } from '@/hooks/use-theme';

export default function StudentsListScreen() {
  const { students } = useStudents();
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? students.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.program}`.toLowerCase().includes(q)
      )
    : students;

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/students/new" style={[styles.headerLink, { color: theme.tint }]}>
              Ajouter
            </Link>
          ),
        }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher par nom ou filière"
            placeholderTextColor={theme.textSecondary}
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={[styles.search, { color: theme.text, backgroundColor: theme.backgroundElement }]}
          />
        }
        ListEmptyComponent={
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            {q ? 'Aucun étudiant ne correspond à la recherche.' : 'Aucun étudiant pour le moment.'}
          </ThemedText>
        }
        renderItem={({ item }) => <StudentRow student={item} />}
      />
    </ThemedView>
  );
}

function StudentRow({ student }: { student: Student }) {
  const theme = useTheme();
  const initials = `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <Link href={{ pathname: '/students/[id]', params: { id: student.id } }} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: theme.tint }]}>
            <ThemedText type="smallBold" style={styles.avatarText}>
              {initials}
            </ThemedText>
          </View>
          <View style={styles.flex}>
            <ThemedText type="smallBold">
              {student.firstName} {student.lastName}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {student.program} · {student.age} ans
            </ThemedText>
          </View>
          <ThemedText themeColor="textSecondary">›</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  headerLink: {
    fontSize: 16,
    fontWeight: 600,
  },
  search: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.7,
  },
});
