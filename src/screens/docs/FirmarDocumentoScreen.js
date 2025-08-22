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

const FirmarDocumentoScreen = ({ navigation, route }) => {
  const { documentoId } = route.params || {};
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo_firma: 'demo',
    pin: '',
    comentario: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo_firma) {
      newErrors.tipo_firma = 'Debe seleccionar un tipo de firma';
    }

    if (formData.tipo_firma === 'token' && !formData.pin.trim()) {
      newErrors.pin = 'El PIN es requerido para firma con token';
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
      // Aquí implementarías la lógica para firmar el documento
      Alert.alert(
        'Éxito',
        'Documento firmado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Error al firmar el documento');
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

  const FirmaTypeOption = ({ type, title, description, icon, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.firmaTypeOption, isSelected && styles.firmaTypeOptionSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.firmaTypeHeader}>
        <View style={[styles.firmaTypeIcon, { backgroundColor: (isSelected ? COLORS.primary : COLORS.text.secondary) + '20' }]}>
          <Ionicons 
            name={icon} 
            size={24} 
            color={isSelected ? COLORS.primary : COLORS.text.secondary} 
          />
        </View>
        <View style={styles.firmaTypeInfo}>
          <Text style={[styles.firmaTypeTitle, isSelected && styles.firmaTypeTitleSelected]}>
            {title}
          </Text>
          <Text style={[styles.firmaTypeDescription, isSelected && styles.firmaTypeDescriptionSelected]}>
            {description}
          </Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Firmar Documento</Text>
          <Text style={styles.headerSubtitle}>Poder Judicial de Tucumán</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Configuración de Firma</Text>
          
          {/* Información del documento */}
          <View style={styles.documentInfo}>
            <View style={styles.documentIcon}>
              <Ionicons name="document" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.documentDetails}>
              <Text style={styles.documentTitle}>Documento a Firmar</Text>
              <Text style={styles.documentName}>Resolución judicial #2024-001</Text>
              <Text style={styles.documentSize}>2.5 MB - PDF</Text>
            </View>
          </View>
          
          {/* Tipo de firma */}
          <View style={styles.firmaTypeSection}>
            <Text style={styles.sectionTitle}>Tipo de Firma</Text>
            
            <FirmaTypeOption
              type="demo"
              title="Firma Demo"
              description="Firma de prueba para desarrollo"
              icon="flask"
              isSelected={formData.tipo_firma === 'demo'}
              onPress={() => handleInputChange('tipo_firma', 'demo')}
            />
            
            <FirmaTypeOption
              type="token"
              title="Firma con Token"
              description="Firma segura con dispositivo físico"
              icon="key"
              isSelected={formData.tipo_firma === 'token'}
              onPress={() => handleInputChange('tipo_firma', 'token')}
            />
            
            <FirmaTypeOption
              type="hsm"
              title="Firma HSM"
              description="Firma con módulo de seguridad"
              icon="shield-checkmark"
              isSelected={formData.tipo_firma === 'hsm'}
              onPress={() => handleInputChange('tipo_firma', 'hsm')}
            />
          </View>
          
          {/* Campos adicionales según tipo de firma */}
          {formData.tipo_firma === 'token' && (
            <View style={styles.pinSection}>
              <AppInput
                label="PIN de Seguridad"
                placeholder="Ingrese su PIN"
                value={formData.pin}
                onChangeText={(value) => handleInputChange('pin', value)}
                error={errors.pin}
                secureTextEntry
                leftIcon="lock-closed"
              />
            </View>
          )}
          
          <AppInput
            label="Comentario (Opcional)"
            placeholder="Agregar comentario sobre la firma"
            value={formData.comentario}
            onChangeText={(value) => handleInputChange('comentario', value)}
            error={errors.comentario}
            multiline
            numberOfLines={3}
            leftIcon="chatbubble"
          />
          
          {/* Información de seguridad */}
          <View style={styles.securityInfo}>
            <View style={styles.securityHeader}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.securityTitle}>Información de Seguridad</Text>
            </View>
            <Text style={styles.securityText}>
              • La firma será verificada criptográficamente{'\n'}
              • Se registrará en el sistema de auditoría{'\n'}
              • El documento quedará protegido contra modificaciones
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            
            <AppButton
              title="Firmar Documento"
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
  
  documentInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  
  documentIcon: {
    marginRight: SPACING.md,
  },
  
  documentDetails: {
    flex: 1,
  },
  
  documentTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  
  documentName: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  documentSize: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  
  firmaTypeSection: {
    marginBottom: SPACING.lg,
  },
  
  sectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  
  firmaTypeOption: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  
  firmaTypeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  
  firmaTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  firmaTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  
  firmaTypeInfo: {
    flex: 1,
  },
  
  firmaTypeTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  
  firmaTypeTitleSelected: {
    color: COLORS.primary,
  },
  
  firmaTypeDescription: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text.secondary,
  },
  
  firmaTypeDescriptionSelected: {
    color: COLORS.primary + 'CC',
  },
  
  pinSection: {
    marginBottom: SPACING.md,
  },
  
  securityInfo: {
    backgroundColor: COLORS.success + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  
  securityTitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.success,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  
  securityText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.success + 'CC',
    lineHeight: 20,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  
  cancelButton: {
    flex: 1,
  },
  
  submitButton: {
    flex: 2,
  },
});

export default FirmarDocumentoScreen; 