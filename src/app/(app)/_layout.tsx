import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ title: 'Accueil' }} />
      <Stack.Screen name="students/index" options={{ title: 'Étudiants' }} />
      <Stack.Screen
        name="students/new"
        options={{ title: 'Nouvel étudiant', presentation: 'modal' }}
      />
      <Stack.Screen name="students/[id]" options={{ title: 'Détail' }} />
    </Stack>
  );
}
