import React, { Suspense, lazy } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../types';
import { SkeletonLoader } from '../components/ui/LazyComponent';

// Lazy loading de pantallas para optimizar el rendimiento
const LoginScreen = lazy(() => import('../screens/auth/LoginScreen'));
const RecuperarPasswordScreen = lazy(() => import('../screens/auth/RecuperarPasswordScreen'));
const CrearUsuarioScreen = lazy(() => import('../screens/auth/CrearUsuarioScreen'));
const HomeScreen = lazy(() => import('../screens/home/HomeScreen'));
const ExpedientesListScreen = lazy(() => import('../screens/home/ExpedientesListScreen'));
const ExpedienteDetailScreen = lazy(() => import('../screens/home/ExpedienteDetailScreen'));
const NuevoExpedienteScreen = lazy(() => import('../screens/home/NuevoExpedienteScreen'));
const DocumentosScreen = lazy(() => import('../screens/docs/DocumentosScreen'));
const SubirDocumentoScreen = lazy(() => import('../screens/docs/SubirDocumentoScreen'));
const FirmarDocumentoScreen = lazy(() => import('../screens/docs/FirmarDocumentoScreen'));
const UsuariosScreen = lazy(() => import('../screens/admin/UsuariosScreen'));
const AuditoriaScreen = lazy(() => import('../screens/admin/AuditoriaScreen'));
const PerfilScreen = lazy(() => import('../screens/profile/PerfilScreen'));

// Importar componentes de navegación
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import CustomTabBar from '../components/navigation/CustomTabBar';

// Crear navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Navegador de autenticación
const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
        transitionSpec: {
          open: {
            animation: 'timing',
            config: { duration: 300 },
          },
          close: {
            animation: 'timing',
            config: { duration: 300 },
          },
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RecuperarPassword" component={RecuperarPasswordScreen} />
      <Stack.Screen name="CrearUsuario" component={CrearUsuarioScreen} />
    </Stack.Navigator>
  );
};

// Navegador de tabs para usuarios autenticados
const TabNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inicio',
          iconName: 'home'
        }}
      />
      
      <Tab.Screen 
        name="Expedientes" 
        component={ExpedientesListScreen}
        options={{
          title: 'Expedientes',
          iconName: 'folder'
        }}
      />
      
      <Tab.Screen 
        name="Documentos" 
        component={DocumentosScreen}
        options={{
          title: 'Documentos',
          iconName: 'document'
        }}
      />
      
      {/* Solo mostrar para roles administrativos */}
      {(user?.rol === USER_ROLES.ADMIN || user?.rol === USER_ROLES.SECRETARIO) && (
        <Tab.Screen 
          name="Usuarios" 
          component={UsuariosScreen}
          options={{
            title: 'Usuarios',
            iconName: 'people'
          }}
        />
      )}
      
      {/* Solo mostrar para roles administrativos */}
      {(user?.rol === USER_ROLES.ADMIN || user?.rol === USER_ROLES.SECRETARIO) && (
        <Tab.Screen 
          name="Auditoria" 
          component={AuditoriaScreen}
          options={{
            title: 'Auditoría',
            iconName: 'analytics'
          }}
        />
      )}
    </Tab.Navigator>
  );
};

// Navegador principal con drawer
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

// Navegador principal de la aplicación
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 18, color: '#1976d2' }}>Cargando SPJT...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
          transitionSpec: {
            open: {
              animation: 'timing',
              config: { duration: 400 },
            },
            close: {
              animation: 'timing',
              config: { duration: 400 },
            },
          },
        }}
      >
        {user ? (
          // Usuario autenticado - mostrar navegación principal
          <>
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen 
              name="ExpedienteDetail" 
              component={ExpedienteDetailScreen}
              options={{
                cardStyleInterpolator: ({ current, layouts }) => ({
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.height, 0],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
            <Stack.Screen 
              name="NuevoExpediente" 
              component={NuevoExpedienteScreen}
              options={{
                cardStyleInterpolator: ({ current, layouts }) => ({
                  cardStyle: {
                    transform: [
                      {
                        scale: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
            <Stack.Screen name="SubirDocumento" component={SubirDocumentoScreen} />
            <Stack.Screen name="FirmarDocumento" component={FirmarDocumentoScreen} />
          </>
        ) : (
          // Usuario no autenticado - mostrar navegación de auth
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 