# Sistema de Gestión de Parqueaderos con React Native

**Estudiante:** David Marcelo Guamán Medina  
**Profesor:** Jose Alzati Zarate  
**Universidad:** Saint Leo University  
**Curso:** Desarrollo de Apps Móviles COM-437ES-AVOL1  
**Fecha:** 25 de octubre de 2025

---

## 📋 Descripción del Proyecto

Aplicación móvil para Android desarrollada en React Native que digitaliza y automatiza la gestión integral de parqueaderos. La solución contempla dos interfaces principales: una aplicación para usuarios finales que permite la búsqueda de parqueaderos disponibles, el registro de vehículos y la gestión de pagos; y un panel administrativo web que facilita el control operativo, la configuración de tarifas, el monitoreo en tiempo real y la generación de reportes analíticos.

Este proyecto será construido con React Native y Expo para facilitar el desarrollo, pruebas y despliegue multiplataforma.

---

## 🎯 Objetivos

- Optimizar la gestión de parqueaderos mediante tecnología móvil
- Mejorar la experiencia del usuario final reduciendo tiempos de espera
- Facilitar el control operativo y administrativo de los parqueaderos
- Implementar una arquitectura escalable y mantenible siguiendo principios SOLID y arquitectura hexagonal

---

## 🚧 Problemática

Los sistemas tradicionales de gestión de parqueaderos presentan múltiples deficiencias:

- ❌ Procesos manuales propensos a errores humanos en registro y cálculo de tarifas
- ❌ Falta de visibilidad en tiempo real sobre disponibilidad de espacios
- ❌ Dificultades en conciliación de ingresos y control de accesos
- ❌ Ausencia de trazabilidad en transacciones
- ❌ Limitada capacidad para generar análisis de ocupación y tendencias
- ❌ Incertidumbre para conductores sobre espacios disponibles
- ❌ Congestión vehicular y pérdida de tiempo

Esta problemática se agudiza en zonas de alta densidad urbana donde la disponibilidad de estacionamiento es limitada y la rotación es constante.

---

## 🛠️ Tecnologías

### Frontend (Aplicación Móvil)
- **React Native** 0.72+
- **Expo** (workflow gestionado) para desarrollo, compilación y despliegue
- **Redux** para gestión de estado
- **React Navigation** para navegación entre pantallas
- **React Native Maps** para visualización de ubicaciones
- Compatible con **iOS** (versión 13.0+) y **Android** (API nivel 23+)

### Backend y Base de Datos
- **Firebase** como plataforma backend
- **Firestore** (base de datos NoSQL) para almacenamiento en tiempo real
- **Firebase Authentication** para autenticación segura de usuarios
- **Firebase Cloud Functions** para lógica del servidor

### Servicios Adicionales
- **Firebase Cloud Messaging** para notificaciones push
- **Firebase Analytics** para monitoreo y logging del sistema
- Integración con pasarelas de pago (tarjeta, transferencia, monederos digitales)

---

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal** (Puertos y Adaptadores) propuesta por Molinari (2020), separando claramente la lógica de negocio de las interfaces externas y las tecnologías de infraestructura. Esta arquitectura se compone de tres capas principales:

### Capa de Dominio
- **Entidades centrales**: `Vehiculo`, `Espacio`, `Tarifa`, `Transaccion`
- Reglas de negocio fundamentales
- Completamente independiente de frameworks y tecnologías

### Capa de Aplicación
- **Casos de uso**: `RegistrarIngreso`, `CalcularTarifa`, `ProcesarPago`, `GenerarReporte`
- Orquestación de la lógica del dominio
- Implementa los principios SOLID para garantizar mantenibilidad

### Capa de Infraestructura
- Adaptadores para persistencia (Firestore)
- Adaptadores para servicios externos (Firebase Authentication, pasarelas de pago, servicios de mapas)
- Interfaces de usuario (aplicación móvil Android y panel web administrativo)

**Ventajas de esta arquitectura:**
- Flexibilidad para evolucionar el sistema sin comprometer el núcleo funcional
- Facilita pruebas automatizadas
- Permite trabajo colaborativo eficiente
- Código de alta calidad y mantenible

---

## ✨ Funcionalidades Principales

### Para Usuarios (Aplicación Móvil)
- 🗺️ **Mapa interactivo** con parqueaderos cercanos y disponibilidad en tiempo real
- 🔍 **Búsqueda y filtrado** por ubicación, tarifa, horarios y servicios adicionales
- 🚗 **Registro de vehículos** mediante ingreso manual del número de placa
- 📱 **Código QR** para ingreso y salida rápida del parqueadero
- 💳 **Múltiples métodos de pago**: tarjeta, transferencia, monederos digitales
- 📊 **Historial de estacionamientos** y gestión de pagos
- 🔔 **Notificaciones push** sobre tiempo de estadía, recordatorios de pago y promociones

### Para Administradores (Panel Web)
- 📈 **Dashboard en tiempo real** con métricas de ocupación actual, ingresos diarios y rotación de espacios
- 💰 **Gestión de tarifas dinámicas** con configuración por horarios, días especiales y eventos
- 🎥 **Control de accesos** y registro de entradas/salidas con visualización de cámaras de seguridad
- 📄 **Módulo de reportes** con exportación a Excel y PDF para análisis financiero y operativo
- 👥 **Gestión de usuarios**, roles y permisos del personal operativo

### Funcionalidades Core (Siguiendo Principios SOLID)

Según los principios SOLID descritos por Leiva (2021):

- **Registro automatizado** de vehículos con validación de placas mediante expresiones regulares
- **Cálculo automático de tarifas** con precisión de minutos y descuentos por permanencia prolongada
- **Tarifas diferenciadas** por tipo de vehículo (auto, moto, etc.)
- **Gestión de múltiples métodos de pago** con integración a pasarelas seguras y conciliación automática
- **Sistema de reservas anticipadas** para asegurar espacios antes de la llegada
- **Notificaciones automatizadas** mediante Firebase Cloud Messaging
- **Reportes analíticos** con gráficos interactivos para toma de decisiones
- **Sistema de fidelización** con acumulación de puntos y descuentos para usuarios frecuentes

---

## 📱 Interfaces

### Aplicación Móvil (Android)
- **Pantalla de splash** con carga de configuración inicial y logo de Saint Leo University
- **Mapa principal** con parqueaderos cercanos y disponibilidad en tiempo real
- **Detalle de parqueadero** mostrando disponibilidad, servicios, tarifas y horarios
- **Registro de vehículo** mediante ingreso manual del número de placa
- **Confirmación de ingreso** con generación de código QR para acceso rápido
- **Historial** completo de estacionamientos anteriores
- **Perfil de usuario** con configuración y método de pago preferido

### Panel Administrativo Web
- **Dashboard principal** con KPIs visuales (ocupación, ingresos, rotación)
- **Gestión de espacios** con representación gráfica del parqueadero
- **Configuración de tarifas** con calendario de precios dinámicos
- **Módulo de reportes** con filtros avanzados y exportación de datos
- **Administración de usuarios** y permisos del personal

---

## 🎨 Diseño UX/UI

El diseño seguirá principios de:
- **Simplicidad**: Interfaz intuitiva y fácil de usar
- **Accesibilidad**: Diseño responsive y compatible con lectores de pantalla
- **Consistencia**: Uso coherente de colores, tipografías y componentes
- **Feedback**: Respuestas visuales claras a las acciones del usuario

---

## 🖼️ Wireframes (Primeras pantallas)

A continuación se presentan los primeros wireframes del proyecto. Estas imágenes están versionadas en el repositorio dentro de la carpeta `wireframe/` y se referencian con rutas relativas para que se vean correctamente en GitHub.

![Login](wireframe/LOGINPHONE.png)

![Recuperación de contraseña](wireframe/LOGINRECUPERACION.png)

![Menú principal](wireframe/MENUPRINCIPAL.png)

![Cerrar sesión](wireframe/LOGOUT.png)

![Precio en tiempo real](wireframe/PRECIOHORA.png)

![Como llegar](wireframe/COMOLLEGAR.png)

---

## 📦 Estructura del Proyecto

```
parking-app/
├── src/
│   ├── domain/              # Entidades y lógica de negocio
│   │   ├── entities/
│   │   │   ├── Vehiculo.js
│   │   │   ├── Espacio.js
│   │   │   ├── Tarifa.js
│   │   │   └── Transaccion.js
│   │   └── repositories/    # Interfaces de repositorios
│   ├── application/         # Casos de uso
│   │   └── useCases/
│   │       ├── RegistrarIngreso.js
│   │       ├── CalcularTarifa.js
│   │       ├── ProcesarPago.js
│   │       └── GenerarReporte.js
│   ├── infrastructure/      # Adaptadores
│   │   ├── firebase/        # Adaptadores de Firebase
│   │   │   ├── FirestoreAdapter.js
│   │   │   ├── AuthAdapter.js
│   │   │   └── StorageAdapter.js
│   │   ├── api/             # APIs externas
│   │   │   ├── PaymentGateway.js
│   │   │   └── MapsService.js
│   │   └── notifications/   # Firebase Cloud Messaging
│   ├── presentation/        # UI
│   │   ├── screens/
│   │   │   ├── MapScreen.js
│   │   │   ├── ParkingDetailScreen.js
│   │   │   ├── VehicleRegistrationScreen.js
│   │   │   ├── QRScreen.js
│   │   │   └── HistoryScreen.js
│   │   ├── components/
│   │   │   ├── ParkingCard.js
│   │   │   ├── MapMarker.js
│   │   │   └── PaymentModal.js
│   │   └── navigation/
│   │       └── AppNavigator.js
│   ├── shared/              # Utilidades compartidas
│   │   ├── constants/
│   │   ├── utils/
│   │   └── validators/
│   └── config/              # Configuración
│       ├── firebase.config.js
│       └── app.config.js
├── tests/                   # Pruebas
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                    # Documentación
│   ├── wireframes/
│   ├── architecture/
│   └── api/
├── android/                 # Configuración Android
├── ios/                     # Configuración iOS (futuro)
├── .env.example
├── package.json
├── README.md
└── firebase.json
```

---

## 🚀 Roadmap de Desarrollo

### Módulo 1-2: Planificación y Diseño ✅
- Definición de requisitos
- Diseño de arquitectura
- Creación de wireframes
- Configuración del entorno de desarrollo

### Módulo 3-4: Desarrollo del MVP
- Implementación de registro de vehículos
- Sistema de ingreso/salida
- Cálculo básico de tarifas
- Integración con base de datos

### Módulo 5-6: Funcionalidades Avanzadas
- Mapa interactivo
- Sistema de pagos
- Notificaciones
- Panel administrativo básico

### Módulo 7-8: Refinamiento y Despliegue
- Pruebas de usuario
- Optimización de rendimiento
- Documentación final
- Preparación para despliegue

---

## 🧪 Pruebas

- **Unitarias**: Jest para lógica de negocio y componentes
- **Integración**: Testing de Firebase services y Firestore
- **E2E**: Detox para flujos completos de usuario en Android
- **Firebase Test Lab**: Pruebas en dispositivos reales en la nube
- **Manuales**: Pruebas de usabilidad con usuarios reales
- **Cobertura de código**: Objetivo mínimo del 80%

---

## 📚 Principios de Desarrollo

El proyecto sigue los **Principios SOLID**:

- **S** - Single Responsibility: Cada clase tiene una única responsabilidad
- **O** - Open/Closed: Abierto para extensión, cerrado para modificación
- **L** - Liskov Substitution: Las subclases pueden sustituir a sus clases base
- **I** - Interface Segregation: Interfaces específicas mejor que genéricas
- **D** - Dependency Inversion: Depender de abstracciones, no de implementaciones concretas

---

## 🔐 Seguridad

- **Firebase Authentication** con múltiples métodos de inicio de sesión
- Renovación automática de tokens de sesión
- Encriptación de datos sensibles en Firestore
- Validación de entrada en frontend y backend
- **Firestore Security Rules** para protección de datos
- Comunicación HTTPS obligatoria
- Cumplimiento de GDPR y regulaciones de privacidad
- Validación de placas mediante expresiones regulares
- Control de acceso basado en roles (RBAC)

---

## 📖 Referencias

1. Cruz Navas, J. (2023). *React Native: Aprende a crear aplicaciones móviles en un fin de semana*. Independently published.

2. Leiva, A. (2021). *Principios SOLID*. Leanpub. https://leanpub.com/principios-solid

3. Molinari, E. (2020). *Introducción a la Arquitectura de Software*. Leanpub. https://leanpub.com/arquitecturasoftware

---

## 👥 Equipo de Desarrollo

**David Marcelo Guamán Medina**
- Rol: Desarrollador Full Stack
- Universidad: Saint Leo University
- Curso: Desarrollo de Apps Móviles COM-437ES-AVOL1
- Profesor: Jose Alzati Zarate

---

## 📄 Licencia

Este proyecto es desarrollado con fines académicos para el curso de Desarrollo de Apps Móviles en Saint Leo University.

---

## 📞 Contacto

Para consultas sobre el proyecto:
- Estudiante: David Marcelo Guamán Medina
- Universidad: Saint Leo University
- Curso: COM-437ES-AVOL1

---

## 🙏 Agradecimientos

- Profesor Jose Alzati Zarate por la guía y retroalimentación
- Compañeros de clase por las discusiones constructivas
- Comunidad de React Native y Firebase por la documentación y recursos
- Saint Leo University por facilitar las herramientas de desarrollo

---

**Última actualización**: 23 de noviembre de 2025

**Estado del proyecto**: 🔧 En desarrollo — Ya terminado la navegación principal, pantalla Precio en tiempo real y menú dinámico desde Firestore

---

## 📌 Estado actual del código (Módulo 1)

### Integraciones y pantallas

- Autenticación con Firebase Auth:
  - Inicio de sesión: `src/presentation/screens/LoginScreen.js`
  - Recuperación de contraseña: `src/presentation/screens/RecoverPasswordScreen.js`
  - Cierre de sesión desde el header del menú: `src/presentation/navigation/AppNavigator.js:31-39`
- Navegación principal: `src/presentation/navigation/AppNavigator.js`
  - Registro de pantallas: Login, RecuperarClave, Menu, Mapa y Precio
  - Import de pantalla Precio: `src/presentation/navigation/AppNavigator.js:7`
  - Registro de ruta Precio: `src/presentation/navigation/AppNavigator.js:57`
- Menú con datos en tiempo real desde Firestore: `src/presentation/screens/MenuScreen.js`
  - Suscripción al documento `config/menu`: `src/presentation/screens/MenuScreen.js:27-39`
  - Ítems con acciones `navigate`, `link` y `noop`
  - Apertura de Google Maps para “Como llegar”: `src/presentation/screens/MenuScreen.js:14`
- Pantalla de Precio en tiempo real: `src/presentation/screens/PrecioScreen.js`
  - Suscripción al documento `config/pricing`: `src/presentation/screens/PrecioScreen.js:12-28`
  - Admite `priceCents` (entero en centavos) o `pricing` (decimal en USD)
  - UI mejorada con `react-native-paper` y `@expo/vector-icons`

### Adaptadores y configuración Firebase

- Configuración central de Firebase: `src/config/firebase.config.js:5-29`
  - Lee claves desde `expo.extra` en `app.json` o variables de entorno `EXPO_PUBLIC_FIREBASE_*` / `FIREBASE_*`
- Adaptadores:
  - Auth: `src/infrastructure/firebase/AuthAdapter.js` (expone `auth`)
  - Firestore: `src/infrastructure/firebase/FirestoreAdapter.js` (expone `db`)
  - Storage: `src/infrastructure/firebase/StorageAdapter.js` (expone `storage`)

---

## 🗄️ Esquemas de datos en Firestore

### Precio

- Ruta: colección `config`, documento `pricing`
- Campos soportados por la app:
  - `priceCents`: Número entero en centavos (recomendado), ejemplo: `50` → muestra `0.50`
  - `pricing`: Número decimal en USD (alternativo), ejemplo: `0.5` → convierte a `50` centavos

Ejemplo:

```json
{
  "priceCents": 50
}
```

### Menú

- Ruta: colección `config`, documento `menu`
- Campo: `items` (Array de objetos)
- Estructura de cada item:
  - `key`: String único (ej. `precio`, `ruta`)
  - `label`: Texto visible (ej. `Precio hora`)
  - `icon`: Nombre `MaterialIcons` (ej. `attach-money`)
  - `type`: `navigate` | `link` | `noop`
  - `value`: String (ruta de navegación o URL según `type`)
  - `order`: Número para orden (opcional)
  - `enabled`: Boolean para activar/desactivar (opcional)

Ejemplo:

```json
{
  "items": [
    { "key": "precio", "label": "Precio hora", "icon": "attach-money", "type": "navigate", "value": "Precio", "order": 1, "enabled": true },
    { "key": "plazas", "label": "Plazas disponibles", "icon": "local-parking", "type": "noop", "order": 2, "enabled": true },
    { "key": "ingresar", "label": "Ingresar", "icon": "login", "type": "noop", "order": 3, "enabled": true },
    { "key": "salir", "label": "Salir", "icon": "logout", "type": "noop", "order": 4, "enabled": true },
    { "key": "servicios", "label": "Servicios", "icon": "miscellaneous-services", "type": "noop", "order": 5, "enabled": true },
    { "key": "ruta", "label": "Como llegar", "icon": "directions", "type": "link", "value": "https://www.google.com/maps/place/0%C2%B018'02.6%22S+78%C2%B032'55.1%22W/@-0.3007016,-78.5512209,755m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-0.300707!4d-78.548646?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D", "order": 6, "enabled": true }
  ]
}
```

---

## 🔒 Reglas recomendadas de Firestore

Permitir lectura pública de `config/menu` y `config/pricing` y escritura solo autenticada:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/pricing {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /config/menu {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ⚙️ Configuración de Firebase (Expo)

- Completa las claves en `app.json` → `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "FIREBASE_API_KEY": "...",
      "FIREBASE_AUTH_DOMAIN": "...",
      "FIREBASE_PROJECT_ID": "...",
      "FIREBASE_STORAGE_BUCKET": "...",
      "FIREBASE_MESSAGING_SENDER_ID": "...",
      "FIREBASE_APP_ID": "..."
    }
  }
}
```

- La app usa estas claves: `src/config/firebase.config.js:5-29`
- Alternativamente, define `EXPO_PUBLIC_FIREBASE_*` en tu entorno.

---

## 🧭 Navegación y comportamiento

- Menú: obtiene ítems desde Firestore y reacciona en tiempo real: `src/presentation/screens/MenuScreen.js:27-39`
- Precio: muestra tarifa con UI mejorada y suscripción en tiempo real: `src/presentation/screens/PrecioScreen.js:12-28`
- Mapa: disponible como pantalla base: `src/presentation/navigation/AppNavigator.js:56`
- Acceso a Maps: `src/presentation/screens/MenuScreen.js:14`

---

## 🚀 Prueba rápida

1. Configura `app.json` con tus claves de Firebase.
2. En Firestore:
   - Crea `config/pricing` con `{ priceCents: 50 }`.
   - Crea `config/menu` con el `items` del ejemplo.
3. Inicia el proyecto con Expo y abre la app.
4. En Firestore, cambia `priceCents` a `60` y verifica “Precio hora” en tiempo real.
5. Edita `config/menu.items` (por ejemplo `label` u `order`) y confirma que el menú se actualiza al instante.
