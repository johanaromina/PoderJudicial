import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

const NuevoExpedienteScreen = ({ navigation }) => {
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nro: '',
    caratula: '',
    fuero: '',
    institucion_id: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nro.trim()) {
      newErrors.nro = 'El número de expediente es requerido';
    }

    if (!formData.caratula.trim()) {
      newErrors.caratula = 'La carátula es requerida';
    } else if (formData.caratula.length < 10) {
      newErrors.caratula = 'La carátula debe tener al menos 10 caracteres';
    }

    if (!formData.fuero.trim()) {
      newErrors.fuero = 'El fuero es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Aquí implementarías la lógica para crear el expediente
      Alert.alert(
        'Éxito',
        'Expediente creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Error al crear el expediente');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.inverse} />
        </TouchableOpacity>
        
        <Image
          source={require('../../../assets/WhatsApp Image 2025-08-22 at 07.58.37 (3).jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nuevo Expediente</Text>
          <Text style={styles.headerSubtitle}>Poder Judicial de Tucumán</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información del Expediente</Text>
          
          <AppInput
            label="Número de Expediente"
            placeholder="Ej: EXP-2024-001"
            value={formData.nro}
            onChangeText={(value) => handleInputChange('nro', value)}
            error={errors.nro}
            leftIcon="document"
          />
          
          <AppInput
            label="Carátula"
            placeholder="Descripción del caso judicial"
            value={formData.caratula}
            onChangeText={(value) => handleInputChange('caratula', value)}
            error={errors.caratula}
            multiline
            numberOfLines={3}
            leftIcon="text"
          />
          
          <AppInput
            label="Fuero"
            placeholder="Ej: Civil, Penal, Comercial"
            value={formData.fuero}
            onChangeText={(value) => handleInputChange('fuero', value)}
            error={errors.fuero}
            leftIcon="business"
          />
          
          <AppInput
            label="Institución"
            placeholder="Seleccionar institución"
            value={formData.institucion_id}
            onChangeText={(value) => handleInputChange('institucion_id', value)}
            error={errors.institucion_id}
            leftIcon="location"
          />
          
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            
            <AppButton
              title="Crear Expediente"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  
  logo: {
    width: 50,
    height: 50,
    marginRight: SPACING.md,
  },
  
  headerContent: {
    flex: 1,
  },
  
  headerTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.inverse,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.inverse + 'CC',
  },
  
  content: {
    flex: 1,
  },
  
  formContainer: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.xxl,
  },
  
  formTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  
  cancelButton: {
    flex: 1,
  },
  
  submitButton: {
    flex: 2,
  },
});

export default NuevoExpedienteScreen; 