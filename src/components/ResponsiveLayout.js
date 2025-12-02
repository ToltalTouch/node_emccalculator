import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform } from 'react-native';

export default function ResponsiveLayout({ children, contentStyle }) {
  const [window, setWindow] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = ({ window: w }) => setWindow(w);
    const sub = Dimensions.addEventListener ? Dimensions.addEventListener('change', onChange) : null;
    return () => {
      if (sub && sub.remove) sub.remove();
      else if (!sub) Dimensions.removeEventListener && Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  const isWide = window.width >= 600;
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, isWide ? styles.wide : null, contentStyle]}>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 8 : 0 },
  scrollContainer: { flexGrow: 1, alignItems: 'center', padding: 16 },
  wide: { paddingHorizontal: 24 },
  inner: { width: '100%', maxWidth: 760 },
});
