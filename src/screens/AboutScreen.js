import React from 'react';
import { Text, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import ResponsiveLayout from '../components/ResponsiveLayout';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import { COLORS } from '../components/theme';

export async function fetchFromApi(url, apiKey = null) {
  try {
    const headers = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

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
      // cache-busting to reduce CDN caching
      const res = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      if (!res.ok) throw new Error('Falha ao buscar dica');
      const adviceJson = await res.json();
      const adviceText = adviceJson?.slip?.advice ?? null;
      this.setState({ advice: adviceText, nutrition: null, error: null });
    } catch (e) {
      this.setState({ error: e.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { advice, loading, error } = this.state;
    const govUrl = 'https://www.gov.br/saude/pt-br/assuntos/saude-brasil/eu-quero-ter-peso-saudavel/'

    return (
      <ResponsiveLayout contentStyle={styles.container}>
        <Text style={styles.title}>Sobre o Projeto</Text>

        <Card>
          <Text style={styles.text}>
            Este app foi adaptado para demonstrar uma Calculadora de IMC com histórico persistido.
          </Text>

          <Text style={{ marginTop: 8, fontWeight: '600' }}>Demonstração de requisição AJAX:</Text>
          <Text style={{ marginTop: 8 }}>
            {loading ? (
              <ActivityIndicator />
            ) : error ? (
              <Text style={{ color: COLORS.error }}>{error}</Text>
            ) : advice ? (
              <Text style={styles.advice}>'{advice}'</Text>
            ) : (
              <Text>Sem dica carregada.</Text>
            )}
          </Text>

          <Text style={styles.text}>A tela também serve de referência para a documentação e apresentação.</Text>
          <Text style={styles.text}>Esse aplicativo foi desenvolvido apenas como um exemplo de uso do React Native,</Text>
          <Text style={styles.text}>Os resultados aqui apresentados não devem ser considerados como aconselhamento profissional,</Text>
          <Text style={styles.text}>Procure sempre um médico, caso tenha dúvidas sobre o resultado verifique o site do governo</Text>

          <AppButton
            onPress={() => Linking.openURL(govUrl)}
            accessibilityRole="link"
            accessibilityLabel="Abrir página do governo sobre saúde"
            style={{ marginTop: 12 }}
          >
            Clique aqui para mais informações
          </AppButton>
        </Card>

      </ResponsiveLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center', color: COLORS.primary },
  text: { color: COLORS.text, marginTop: 6, lineHeight: 20 },
  advice: { fontStyle: 'italic', marginTop: 8, color: COLORS.accent },
  link: { color: '#fff', fontWeight: '600' },
});
