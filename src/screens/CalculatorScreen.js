import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CalculatorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peso: '', // kg
      altura: '', // meters
      resultado: null,
      classificacao: '',
      conselho: '',
      loadingSave: false,
    };
  }

  componentDidMount() {
    // demonstração: poderia carregar configurações iniciais
  }

  validarInputs = () => {
    const { peso, altura } = this.state;
    const p = parseFloat(peso.replace(',', '.'));
    const h = parseFloat(altura.replace(',', '.'));
    if (!p || !h || p <= 0 || h <= 0) {
      return null;
    }
    return { p, h };
  };

  calcularIMC = () => {
    Keyboard.dismiss();
    const v = this.validarInputs();
    if (!v) {
      Alert.alert('Entrada inválida', 'Informe peso (kg) e altura (m) válidos');
      return;
    }
    const { p, h } = v;
    const imc = p / (h * h);
    const imcFixed = parseFloat(imc.toFixed(2));
    const { classificacao, conselho } = this.classificar(imc);
    this.setState({ resultado: imcFixed, classificacao, conselho });
  };

  classificar = (imc) => {
    if (imc < 18.5) return { classificacao: 'Abaixo do peso', conselho: 'Considere aumentar a ingestão calórica e consultar um profissional.' };
    if (imc < 25) return { classificacao: 'Peso normal', conselho: 'Mantenha uma dieta equilibrada e pratique exercícios regularmente.' };
    if (imc < 30) return { classificacao: 'Sobrepeso', conselho: 'Adote hábitos de vida mais ativos e ajuste a alimentação.' };
    return { classificacao: 'Obesidade', conselho: 'Consulte um profissional de saúde para orientação personalizada.' };
  };

  salvarHistorico = async () => {
    const { resultado, peso, altura } = this.state;
    if (!resultado) {
      Alert.alert('Nada para salvar', 'Calcule o IMC antes de salvar no histórico.');
      return;
    }
    this.setState({ loadingSave: true });
    try {
      const item = { id: Date.now().toString(), peso, altura, imc: resultado, date: new Date().toISOString() };
      const raw = await AsyncStorage.getItem('@imc_history');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(item);
      await AsyncStorage.setItem('@imc_history', JSON.stringify(arr));
      Alert.alert('Salvo', 'Entrada salva no histórico');
      // opcional: navegar para histórico
      this.props.navigation.navigate('History');
    } catch (e) {
      console.warn(e);
      Alert.alert('Erro', 'Não foi possível salvar o histórico');
    } finally {
      this.setState({ loadingSave: false });
    }
  };

  limparCampos = () => this.setState({ peso: '', altura: '', resultado: null, classificacao: '', conselho: '' });

  render() {
    const { peso, altura, resultado, classificacao, conselho, loadingSave } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calculadora de IMC</Text>

        <View style={styles.formRow}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="ex: 70"
            value={peso}
            onChangeText={(t) => this.setState({ peso: t })}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Altura (m)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="ex: 1.75"
            value={altura}
            onChangeText={(t) => this.setState({ altura: t })}
          />
        </View>

        <View style={styles.buttonsRow}>
          <Button title="Calcular" onPress={this.calcularIMC} />
          <Button title="Limpar" onPress={this.limparCampos} color="#888" />
        </View>

        <View style={styles.resultBox}>
          {resultado ? (
            <>
              <Text style={styles.resultText}>Seu IMC: {resultado}</Text>
              <Text style={styles.classText}>{classificacao}</Text>
              <Text style={styles.adviceText}>{conselho}</Text>
              <View style={{ height: 12 }} />
              <TouchableOpacity style={styles.saveButton} onPress={this.salvarHistorico} disabled={loadingSave}>
                <Text style={styles.saveButtonText}>{loadingSave ? 'Salvando...' : 'Salvar no Histórico'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.hintText}>Preencha peso e altura e pressione Calcular</Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <Button title="Histórico" onPress={() => this.props.navigation.navigate('History')} />
          <Button title="Sobre" onPress={() => this.props.navigation.navigate('About')} color="#007AFF" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'flex-start' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  formRow: { marginBottom: 10 },
  label: { marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, height: 44 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  resultBox: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', minHeight: 120 },
  resultText: { fontSize: 20, fontWeight: '700' },
  classText: { marginTop: 6, fontSize: 16, fontWeight: '600' },
  adviceText: { marginTop: 8, color: '#444' },
  hintText: { color: '#666' },
  saveButton: { marginTop: 8, backgroundColor: '#007AFF', padding: 10, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }
});
