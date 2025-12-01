import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

// SearchScreen implementado como Class Component para demonstrar o uso de
// - `this.state` (estado interno do componente)
// - `this.setState()` (atualizador síncrono do state)
// - `componentDidMount()` (ciclo de vida para requisições iniciais)
// Também mostra um TextInput controlado ligado ao state (`usuario`).
export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: '',
      dados: null,
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    // busca inicial de demonstração
    this.fetchDados('octocat');
  }

  fetchDados = async (username) => {
    if (!username) return;
    this.setState({ loading: true, error: null, dados: null });
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        throw new Error('Usuário não encontrado');
      }
      const json = await res.json();
      this.setState({ dados: json });
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { usuario, dados, loading, error } = this.state;

    // `navigation` é recebido via props pelo React Navigation
    // `usuario`, `dados`, `loading` e `error` vêm de `this.state`
    // TextInput abaixo é um componente controlado: seu `value` vem do state
    // e cada alteração chama `this.setState()` para atualizar o estado.

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gerenciador de Perfil</Text>
          <TouchableOpacity style={styles.aboutButton} onPress={() => navigation.navigate('About')}>
            <Text style={styles.aboutText}>Sobre</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Digite o usuário do GitHub"
            value={usuario}
            onChangeText={(text) => this.setState({ usuario: text })}
            autoCapitalize="none"
          />
          <Button title="Buscar" onPress={() => this.fetchDados(usuario)} />
        </View>

        <View style={styles.result}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : dados ? (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile', { profile: dados })}>
              <Image source={{ uri: dados.avatar_url }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{dados.name || dados.login}</Text>
                <Text style={styles.bio}>{dados.bio || 'Sem bio'}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Text>Digite um usuário e pressione Buscar</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  aboutButton: { padding: 8 },
  aboutText: { color: '#007AFF' },
  searchBox: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 8, height: 40 },
  result: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  bio: { color: '#666' },
  errorText: { color: 'red' }
});
