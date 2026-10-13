import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/button';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useStudents } from '@/context/students';
import {
  hasErrors,
  validateStudent,
  type FieldErrors,
  type StudentFormValues,
} from '@/lib/validation';

const EMPTY_FORM: StudentFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  program: '',
  phone: '',
};

export default function NewStudentScreen() {
  const { students, addStudent } = useStudents();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors<StudentFormValues>>({});
  const [submitted, setSubmitted] = useState(false);

  const existingEmails = students.map((s) => s.email.toLowerCase());

  // Après une première tentative d'envoi, la validation se fait en direct à chaque saisie.
  const update = (field: keyof StudentFormValues) => (text: string) => {
    const next = { ...values, [field]: text };
    setValues(next);
    if (submitted) setErrors(validateStudent(next, existingEmails));
  };

  const onSubmit = () => {
    setSubmitted(true);
    const validation = validateStudent(values, existingEmails);
    setErrors(validation);
    if (hasErrors(validation)) return;

    const phone = values.phone.trim();
    const student = addStudent({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      age: Number(values.age),
      program: values.program.trim(),
      phone: phone || undefined,
    });
    router.replace({ pathname: '/students/[id]', params: { id: student.id } });
  };

  const field = (name: keyof StudentFormValues) => ({
    value: values[name],
    onChangeText: update(name),
    error: errors[name],
  });

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled">
          <FormField label="Prénom" {...field('firstName')} autoComplete="given-name" />
          <FormField label="Nom" {...field('lastName')} autoComplete="family-name" />
          <FormField
            label="Email"
            {...field('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <FormField label="Âge" {...field('age')} keyboardType="number-pad" maxLength={2} />
          <FormField label="Filière" {...field('program')} placeholder="ex. Informatique" />
          <FormField
            label="Téléphone"
            optional
            {...field('phone')}
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          {submitted && hasErrors(errors) && (
            <ThemedText type="small" themeColor="danger">
              Veuillez corriger les champs en rouge.
            </ThemedText>
          )}

          <Button title="Enregistrer" onPress={onSubmit} />
          <Button title="Annuler" variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
});
