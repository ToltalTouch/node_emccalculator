import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

// ProfileScreen convertido para Class Component principalmente para fins de
// demonstração na apresentação: aqui mostramos como acessar `props` (route.params)
// dentro de um component class e onde se esperaria usar `this.state` caso
// o componente precisasse manter estado local.
export default class ProfileScreen extends React.Component {
  render() {
    // `route` e `navigation` são injetados pelo React Navigation via props
    const { route } = this.props;
    const { profile } = route.params || {};

    if (!profile) {
      return (
        <View style={styles.center}>
          <Text>Nenhum perfil selecionado.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name || profile.login}</Text>
        <Text style={styles.login}>@{profile.login}</Text>
        <Text style={styles.bio}>{profile.bio || 'Sem descrição'}</Text>
        <View style={styles.row}>
          <Text style={styles.stat}>Repos: {profile.public_repos}</Text>
          <Text style={styles.stat}>Seguidores: {profile.followers}</Text>
        </View>
        <Text style={styles.link}>{profile.html_url}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  login: { color: '#666', marginBottom: 8 },
  bio: { textAlign: 'center', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  stat: { fontWeight: '600' },
  link: { marginTop: 12, color: '#007AFF' }
});
