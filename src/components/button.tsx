import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ title, variant = 'primary', disabled, ...props }: ButtonProps) {
  const theme = useTheme();
  const backgroundColor = {
    primary: theme.tint,
    secondary: theme.backgroundElement,
    danger: theme.danger,
  }[variant];

  return (
    <Pressable
      role="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        (pressed || disabled) && styles.dimmed,
      ]}
      {...props}>
      <ThemedText
        type="smallBold"
        style={[styles.label, variant !== 'secondary' && styles.onColor]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  onColor: {
    color: '#ffffff',
  },
  dimmed: {
    opacity: 0.7,
  },
});
