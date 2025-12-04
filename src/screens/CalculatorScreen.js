import React from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import ResponsiveLayout from '../components/ResponsiveLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppButton from '../components/AppButton';
import Card from '../components/Card';
import { COLORS } from '../components/theme';

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
      <ResponsiveLayout contentStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View>
            <Text style={styles.title}>Calculadora de IMC</Text>

            <Card>
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
                <AppButton variant="primary" onPress={this.calcularIMC} style={{ flex: 1, marginRight: 8 }}>
                  Calcular
                </AppButton>
                <AppButton variant="outline" onPress={this.limparCampos} style={{ flex: 1 }}>
                  Limpar
                </AppButton>
              </View>
            </Card>
          </View>

          <Card style={styles.resultBox}>
            {resultado ? (
              <View style={styles.resultInner}>
                <Text style={styles.resultText}>Seu IMC: {resultado}</Text>
                <Text style={styles.classText}>{classificacao}</Text>
                <Text style={styles.adviceText}>{conselho}</Text>
                <AppButton variant="accent" style={styles.saveButton} onPress={this.salvarHistorico} disabled={loadingSave}>
                  {loadingSave ? 'Salvando...' : 'Salvar no Histórico'}
                </AppButton>
              </View>
            ) : (
              <Text style={styles.hintText}>Preencha peso e altura e pressione Calcular</Text>
            )}
          </Card>

          <View style={styles.footerRow}>
            <AppButton variant="outline" onPress={() => this.props.navigation.navigate('History')} style={{ flex: 1, marginRight: 8 }}>
              Histórico
            </AppButton>
            <AppButton variant="outline" onPress={() => this.props.navigation.navigate('About')} style={{ flex: 1 }}>
              Sobre
            </AppButton>
          </View>
        </KeyboardAvoidingView>
      </ResponsiveLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.background, justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  formRow: { marginBottom: 10 },
  label: { marginBottom: 4 },
  input: { borderWidth: 1, borderColor: COLORS.muted, padding: 8, borderRadius: 6, height: 44, backgroundColor: COLORS.surface },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  resultBox: { marginTop: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.surface, minHeight: 120, flexGrow: 1, backgroundColor: COLORS.surface },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12, color: COLORS.primary },
  resultText: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  classText: { marginTop: 6, fontSize: 16, fontWeight: '700', color: COLORS.muted, textAlign: 'center' },
  adviceText: { marginTop: 8, color: COLORS.muted },
  resultInner: { alignItems: 'center', justifyContent: 'center' },
  hintText: { color: COLORS.muted },
  saveButton: { marginTop: 8, backgroundColor: COLORS.accent, padding: 10, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }
});
