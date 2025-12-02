import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import ResponsiveLayout from '../components/ResponsiveLayout';

// AboutScreen convertido para classe para demonstrar componentDidMount e uma
// requisição AJAX simples a uma API pública (Advice Slip API) como exemplo.
export default class AboutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { advice: null, loading: false, error: null };
  }

  componentDidMount() {
    this.fetchAdvice();
  }

  fetchAdvice = async () => {
    this.setState({ loading: true, error: null });
    try {
      const res = await fetch('https://api.adviceslip.com/advice');
      if (!res.ok) throw new Error('Falha ao buscar dica');
      const json = await res.json();
      this.setState({ advice: json.slip.advice });
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { advice, loading, error } = this.state;
    return (
      <ResponsiveLayout contentStyle={styles.container}>
        <Text style={styles.title}>Sobre o Projeto</Text>
        <Text style={styles.text}>
          Este app foi adaptado para demonstrar uma Calculadora de IMC com histórico persistido.
        </Text>

        <Text style={{ marginTop: 8, fontWeight: '600' }}>Demonstração de requisição AJAX:</Text>
        <Text style={{ marginTop: 8 }}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : advice ? (
            <Text style={styles.advice}>'{advice}'</Text>
          ) : (
            <Text>Sem dica carregada.</Text>
          )}
        </Text>

        <Text style={styles.note}>A tela também serve de referência para a documentação e apresentação.</Text>
      </ResponsiveLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  text: { marginBottom: 8 },
  advice: { fontStyle: 'italic', color: '#333' },
  note: { marginTop: 12, fontStyle: 'italic', color: '#333' }
});