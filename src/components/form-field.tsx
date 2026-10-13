import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  optional?: boolean;
};

export function FormField({ label, error, optional, style, ...inputProps }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">
        {label}
        {optional && <ThemedText type="small" themeColor="textSecondary"> (facultatif)</ThemedText>}
      </ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        aria-label={label}
        aria-invalid={!!error}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.backgroundElement,
            borderColor: error ? theme.danger : 'transparent',
          },
          style,
        ]}
        {...inputProps}
      />
      {error && (
        <ThemedText type="small" themeColor="danger" role="alert">
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
  },
});
