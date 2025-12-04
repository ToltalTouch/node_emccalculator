import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from './theme';

export default function AppButton({ children, onPress, style, disabled, variant = 'primary' }) {
  const variantStyles = (() => {
    switch (variant) {
      case 'accent':
        return { backgroundColor: COLORS.accent, textColor: '#fff', border: null };
      case 'outline':
        return { backgroundColor: 'transparent', textColor: COLORS.primary, border: { borderWidth: 1, borderColor: COLORS.primary } };
      case 'danger':
        return { backgroundColor: COLORS.danger, textColor: '#fff', border: null };
      default:
        return { backgroundColor: COLORS.primary, textColor: '#fff', border: null };
    }
  })();

  return (
    <Pressable
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variantStyles.backgroundColor },
        variantStyles.border,
        style,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.label, { color: variantStyles.textColor }, disabled && styles.labelDisabled]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minHeight: 44,
    minWidth: 44,
  },
  label: { color: '#fff', fontWeight: '700' },
  disabled: { opacity: 0.5 },
  labelDisabled: { color: '#eee' },
  pressed: { transform: [{ scale: Platform.OS === 'ios' ? 0.98 : 1 }] },
});
