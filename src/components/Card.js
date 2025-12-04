import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, METRICS } from './theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: METRICS.radius,
    padding: METRICS.base,
    marginVertical: 8,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
});