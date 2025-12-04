import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import ResponsiveLayout from '../components/ResponsiveLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import { COLORS } from '../components/theme';

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { history: [], loading: false };
  }

  componentDidMount() {
    this.loadHistory();
  }

  loadHistory = async () => {
    this.setState({ loading: true });
    try {
      const raw = await AsyncStorage.getItem('@imc_history');
      const arr = raw ? JSON.parse(raw) : [];
      this.setState({ history: arr });
    } catch (e) {
      console.warn(e);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      this.setState({ loading: false });
    }
  };

  clearHistory = async () => {
    Alert.alert('Confirmar', 'Deseja limpar todo o histórico?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@imc_history');
          this.setState({ history: [] });
        }
      }
    ]);
  };

  renderItem = ({ item }) => (
    <Card style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.imc}>IMC: {item.imc}</Text>
        <Text style={styles.meta}>Peso: {item.peso} kg • Alt: {item.altura} m</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    </Card>
  );

  render() {
    const { history } = this.state;
    return (
      <ResponsiveLayout contentStyle={styles.container}>
        <Text style={styles.title}>Histórico de IMC</Text>
        {history.length === 0 ? (
          <Text style={styles.empty}>Nenhuma entrada salva ainda.</Text>
        ) : (
          <FlatList data={history} keyExtractor={(i) => i.id} renderItem={this.renderItem} />
        )}
        <View style={styles.footer}>
          <AppButton style={styles.clearButton} onPress={this.clearHistory}>
            <Text style={styles.clearText}>Limpar histórico</Text>
          </AppButton>
        </View>
      </ResponsiveLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center', color: COLORS.primary },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 24 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: COLORS.surface, flexDirection: 'row', backgroundColor: COLORS.surface },
  imc: { fontWeight: '700', color: COLORS.text },
  meta: { color: COLORS.muted, marginTop: 4 },
  date: { color: COLORS.muted, marginTop: 6, fontSize: 12 },
  footer: { marginTop: 18, alignItems: 'center' },
  clearButton: { backgroundColor: COLORS.danger, paddingHorizontal: 14 },
  clearText: { color: '#fff', fontWeight: '600' },
});