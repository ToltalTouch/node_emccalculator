import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import ResponsiveLayout from '../components/ResponsiveLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.imc}>IMC: {item.imc}</Text>
        <Text style={styles.meta}>Peso: {item.peso} kg • Alt: {item.altura} m</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    </View>
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
          <TouchableOpacity style={styles.clearButton} onPress={this.clearHistory}>
            <Text style={styles.clearText}>Limpar histórico</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  empty: { color: '#666' },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  imc: { fontSize: 16, fontWeight: '700' },
  meta: { color: '#444' },
  date: { color: '#888', marginTop: 6 },
  footer: { marginTop: 12 },
  clearButton: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 6, alignItems: 'center' },
  clearText: { color: '#fff', fontWeight: '600' }
});
