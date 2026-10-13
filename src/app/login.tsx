import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { DEMO_ACCOUNT, useAuth } from '@/context/auth';
import { hasErrors, validateLogin, type FieldErrors, type LoginValues } from '@/lib/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const update = (field: keyof LoginValues) => (text: string) => {
    setValues((v) => ({ ...v, [field]: text }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setAuthError(null);
  };

  const onSubmit = () => {
    const validation = validateLogin(values);
    setErrors(validation);
    if (hasErrors(validation)) return;
    // En cas de succès, Stack.Protected redirige automatiquement vers l'accueil.
    if (!signIn(values.email, values.password)) {
      setAuthError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText type="subtitle">Connexion</ThemedText>
              <ThemedText themeColor="textSecondary">G_etudiant</ThemedText>
            </View>

            <FormField
              label="Email"
              value={values.email}
              onChangeText={update('email')}
              error={errors.email}
              placeholder="vous@ecole.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <FormField
              label="Mot de passe"
              value={values.password}
              onChangeText={update('password')}
              error={errors.password}
              placeholder="••••••"
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />

            {authError && (
              <ThemedText type="smallBold" themeColor="danger" role="alert">
                {authError}
              </ThemedText>
            )}

            <Button title="Se connecter" onPress={onSubmit} />

            <ThemedView type="backgroundElement" style={styles.hint}>
              <ThemedText type="small" themeColor="textSecondary">
                Compte de démo : {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
              </ThemedText>
            </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.three,  
  },
  hint: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
});
