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

const SubirDocumentoScreen = ({ navigation, route }) => {
  const { expedienteId } = route.params || {};
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    expediente_id: expedienteId || ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del documento es requerido';
    }

    if (!selectedFile) {
      newErrors.file = 'Debe seleccionar un archivo';
    }

    if (!formData.expediente_id.trim()) {
      newErrors.expediente_id = 'Debe seleccionar un expediente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectFile = () => {
    // Aquí implementarías la lógica para seleccionar archivo
    Alert.alert('Seleccionar Archivo', 'Funcionalidad de selección de archivo');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Aquí implementarías la lógica para subir el documento
      Alert.alert(
        'Éxito',
        'Documento subido correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Error al subir el documento');
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
          <Text style={styles.headerTitle}>Subir Documento</Text>
          <Text style={styles.headerSubtitle}>Poder Judicial de Tucumán</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Información del Documento</Text>
          
          <AppInput
            label="Nombre del Documento"
            placeholder="Ej: Resolución judicial"
            value={formData.nombre}
            onChangeText={(value) => handleInputChange('nombre', value)}
            error={errors.nombre}
            leftIcon="document"
          />
          
          <AppInput
            label="Descripción"
            placeholder="Descripción del documento"
            value={formData.descripcion}
            onChangeText={(value) => handleInputChange('descripcion', value)}
            error={errors.descripcion}
            multiline
            numberOfLines={3}
            leftIcon="text"
          />
          
          <AppInput
            label="Tipo de Documento"
            placeholder="Ej: Resolución, Sentencia, Oficio"
            value={formData.tipo}
            onChangeText={(value) => handleInputChange('tipo', value)}
            error={errors.tipo}
            leftIcon="folder"
          />
          
          <AppInput
            label="Expediente"
            placeholder="Número de expediente"
            value={formData.expediente_id}
            onChangeText={(value) => handleInputChange('expediente_id', value)}
            error={errors.expediente_id}
            leftIcon="folder-open"
          />
          
          {/* Selección de archivo */}
          <View style={styles.fileSection}>
            <Text style={styles.fileSectionTitle}>Archivo a Subir</Text>
            
            <TouchableOpacity
              style={styles.fileSelector}
              onPress={handleSelectFile}
              activeOpacity={0.8}
            >
              {selectedFile ? (
                <View style={styles.selectedFile}>
                  <Ionicons name="document" size={24} color={COLORS.primary} />
                  <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                  <Text style={styles.selectedFileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
              ) : (
                <View style={styles.filePlaceholder}>
                  <Ionicons name="cloud-upload" size={48} color={COLORS.text.disabled} />
                  <Text style={styles.filePlaceholderText}>Seleccionar Archivo</Text>
                  <Text style={styles.filePlaceholderSubtext}>
                    PDF, DOC, DOCX (máx. 10MB)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {errors.file && (
              <Text style={styles.errorText}>{errors.file}</Text>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
            
            <AppButton
              title="Subir Documento"
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
  
  fileSection: {
    marginTop: SPACING.lg,
  },
  
  fileSectionTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  
  fileSelector: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  
  filePlaceholder: {
    alignItems: 'center',
  },
  
  filePlaceholderText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  
  filePlaceholderSubtext: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.disabled,
    textAlign: 'center',
  },
  
  selectedFile: {
    alignItems: 'center',
  },
  
  selectedFileName: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  
  selectedFileSize: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.sm,
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

export default SubirDocumentoScreen; 