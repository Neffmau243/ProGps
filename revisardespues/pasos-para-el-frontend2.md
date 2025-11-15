# 🎨 Propuesta de Estructura Visual del Frontend 2.0

---

## 📱 **VISTAS NECESARIAS**

### 🔓 **1. Vista Pública (1 vista)**
- **Login** - Página de inicio de sesión

---

### 👤 **2. Vistas Comunes (2 vistas)**
Disponibles para Admin y Empleado:
- **Perfil** - Ver/editar información personal
- **Configuración** - Preferencias del usuario

---

### 👔 **3. Vistas de Empleado (2 vistas)**
- **Dashboard Empleado** 
  - Botón grande para activar/desactivar GPS
  - Estado actual del rastreo
  - Mis dispositivos asignados
  - Última ubicación enviada
  
- **Mis Dispositivos**
  - Lista de dispositivos asignados
  - Estado de cada dispositivo
  - Información básica

---

### 👑 **4. Vistas de Administrador (6 vistas)**

#### **Dashboard Admin**
- Mapa en tiempo real con todas las ubicaciones actuales
- Resumen de estadísticas (usuarios activos, dispositivos activos, etc.)
- Alertas o notificaciones importantes

#### **Gestión de Usuarios**
- Tabla con lista de usuarios
- Crear/Editar/Eliminar usuarios
- Filtros y búsqueda
- Asignar roles

#### **Gestión de Dispositivos**
- Tabla con lista de dispositivos
- Crear/Editar/Eliminar dispositivos
- Cambiar estado (activo/inactivo/mantenimiento)
- Asignar dispositivos a usuarios
- Filtros por estado y usuario

#### **Mapa en Tiempo Real**
- Mapa grande con ubicaciones actuales
- Marcadores por dispositivo
- Info de cada dispositivo al hacer click
- Filtros por usuario/dispositivo
- Auto-refresh cada X segundos

#### **Historial de Rutas**
- Selector de dispositivo
- Selector de rango de fechas
- Mapa con la ruta completa
- Timeline de ubicaciones
- Estadísticas (distancia, duración, puntos)
- Exportar datos

#### **Reportes/Estadísticas**
- Gráficos de uso
- Reportes de actividad
- Estadísticas por usuario/dispositivo
- Exportar reportes

---

## 🎯 **TOTAL: 11 Vistas**

### Desglose:
- **Públicas:** 1 (Login)
- **Comunes:** 2 (Perfil, Configuración)
- **Empleado:** 2 (Dashboard, Mis Dispositivos)
- **Admin:** 6 (Dashboard, Usuarios, Dispositivos, Mapa Tiempo Real, Historial, Reportes)

---

## 🏗️ **ELEMENTOS ESTRUCTURALES PRINCIPALES**

### **Navbar (Barra de Navegación)**
**Descripción:** Barra superior fija que contiene la navegación principal de la aplicación.

**Elementos:**
- Logo de la aplicación (lado izquierdo)
- Menú de navegación principal
- Búsqueda rápida (opcional)
- Notificaciones (badge verde neón)
- Perfil de usuario con dropdown
- Toggle de tema claro/oscuro
- Botón de logout

**Propósito:** Proporcionar acceso rápido a las secciones principales y mantener al usuario orientado en todo momento.

**Diseño:**
- Fondo: Negro (#000000)
- Altura: 64px
- Logo: Verde neón (#C0F11C)
- Items activos: Verde neón con underline
- Items inactivos: Gris claro
- Hover: Verde neón con glow sutil
- Sticky/Fixed: Siempre visible al hacer scroll

**Nota:** El administrador tendrá acceso completo a todas las secciones, mientras que el empleado verá solo las opciones permitidas.

---

### **Sidebar (Barra Lateral)**
**Descripción:** Panel lateral colapsable con navegación secundaria y accesos rápidos.

**Elementos:**
- Menú de navegación vertical
- Iconos con labels
- Indicador de sección activa
- Botón de colapsar/expandir
- Sección de accesos rápidos (admin)

**Propósito:** Organizar la navegación de forma jerárquica y proporcionar acceso rápido a funcionalidades específicas del rol.

**Diseño:**
- Fondo: Negro puro (#000000)
- Ancho expandido: 240px
- Ancho colapsado: 64px
- Items activos: Fondo gris oscuro + borde izquierdo verde neón
- Items hover: Fondo gris oscuro (#1A1A1A)
- Iconos: Verde neón para activos, gris para inactivos

**Nota:** El administrador verá todas las opciones de gestión, el empleado solo verá Dashboard y Mis Dispositivos.

---

### **Hero Section (Sección Principal)**
**Descripción:** La primera sección que ve el usuario al entrar a una vista, con información destacada y llamados a la acción principales.

**Elementos:**
- Título grande y descriptivo
- Subtítulo o descripción breve
- CTA principal (botón verde neón)
- Imagen/ilustración de fondo (opcional)
- Estadísticas rápidas (para admin)

**Propósito:** Captar la atención e informar sobre el valor de la página inmediatamente, orientar al usuario sobre qué puede hacer.

**Aplicaciones:**
- **Dashboard Admin:** Hero con mapa de fondo y estadísticas en cards
- **Dashboard Empleado:** Hero con botón GPS grande y estado actual
- **Login:** Hero con logo grande y formulario centrado
- **Gestión de Usuarios:** Hero con título, descripción y botón "Crear Usuario"

**Diseño:**
- Fondo: Gradiente negro a gris oscuro
- Altura: 200-400px según contenido
- Título: 32-40px, verde neón o blanco
- CTA: Botón verde neón con glow
- Cards de estadísticas: Gris oscuro con números verde neón

**Nota:** El administrador verá heros con más información y opciones, el empleado verá heros simplificados y enfocados en su tarea principal.

---

### **Grid / Rejilla**
**Descripción:** Estructura subyacente que organiza el contenido en filas y columnas de forma consistente.

**Configuración:**
- **Desktop:** 12 columnas
- **Tablet:** 8 columnas
- **Mobile:** 4 columnas
- **Gap:** 16-24px entre elementos
- **Padding:** 16-32px en contenedores

**Propósito:** Asegurar consistencia, alineación y diseño responsive que se adapte a diferentes pantallas.

**Aplicaciones:**
- **Dashboard Admin:** Grid de 3-4 columnas para cards de estadísticas
- **Gestión de Usuarios:** Grid de 1 columna para tabla, 2-3 para cards
- **Gestión de Dispositivos:** Grid flexible para cards de dispositivos
- **Reportes:** Grid de 2 columnas para gráficos

**Diseño:**
- Sistema de grid CSS o framework (Vuetify/Tailwind)
- Breakpoints estándar: 1920px, 1280px, 960px, 600px
- Contenido centrado con max-width: 1440px

**Nota:** El administrador verá grids más complejos con múltiples elementos, el empleado verá layouts más simples.

---

### **Card (Tarjeta)**
**Descripción:** Un contenedor flexible y autosuficiente que agrupa contenido relacionado (imagen, título, texto, botones).

**Elementos:**
- Header (opcional): Título y acciones
- Body: Contenido principal
- Footer (opcional): Acciones secundarias o metadatos
- Imagen/Icono destacado
- Badges de estado

**Propósito:** Presentar información densa o múltiples opciones de forma organizada y escaneable (estadísticas, dispositivos, usuarios, reportes).

**Tipos de Cards:**

#### **1. Card de Estadística (Admin)**
- Icono grande en verde neón
- Número principal grande (verde neón)
- Label descriptivo
- Indicador de cambio (↑↓)
- Fondo: Gris oscuro (#1A1A1A)

#### **2. Card de Dispositivo**
- Icono de dispositivo
- Nombre del dispositivo
- Serial
- Estado (badge verde/gris/amarillo)
- Usuario asignado
- Última ubicación
- Acciones (admin): Editar, Eliminar, Cambiar estado

#### **3. Card de Usuario (Admin)**
- Avatar o inicial
- Nombre completo
- Email
- Rol (badge)
- Dispositivos asignados
- Estado (activo/inactivo)
- Acciones: Editar, Eliminar

#### **4. Card de Ubicación**
- Mini mapa
- Timestamp
- Coordenadas
- Precisión
- Dispositivo
- Usuario

#### **5. Card de Resumen (Dashboard Empleado)**
- Estado GPS (ON/OFF)
- Última ubicación enviada
- Dispositivo activo
- Tiempo de rastreo

**Diseño:**
- Fondo: Gris oscuro (#1A1A1A) o Negro (#0A0A0A)
- Borde: 1px gris medio, verde neón al hover
- Border-radius: 8-12px
- Padding: 16-24px
- Sombra: Sutil, negra con opacidad
- Hover: Elevación + borde verde neón
- Transición: 200ms ease

**Nota:** El administrador verá cards con más información y acciones, el empleado verá cards simplificados con información básica.

---

### **Footer (Pie de Página)**
**Descripción:** Sección inferior de la aplicación con información complementaria y enlaces secundarios.

**Elementos:**
- Logo pequeño
- Copyright y año
- Enlaces legales (Términos, Privacidad)
- Información de contacto
- Versión de la aplicación
- Enlaces a redes sociales (opcional)
- Créditos del desarrollador

**Propósito:** Proporcionar información institucional, legal y de contacto sin interferir con el contenido principal.

**Diseño Desktop:**
- Fondo: Negro puro (#000000)
- Altura: 100px fija
- Texto: Gris claro (#E0E0E0)
- Enlaces: Verde neón al hover
- Separadores: Línea gris oscura superior (1px #2A2A2A)
- Layout: 3 columnas distribuidas equitativamente
- Posición: Estático (no sticky)
- Ancho máximo: 1440px centrado
- Padding: 32px horizontal, 24px vertical

**Estructura de 3 Columnas (Desktop):**
```
[Columna 1 - 33%]              [Columna 2 - 33%]                [Columna 3 - 33%]
Logo + Copyright               Enlaces Legales                  Info de Contacto
```

**Contenido Específico Desktop:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo Verde Neón]              Términos de Uso          Versión 2.0    │
│  ProGPS                         Política de Privacidad   📧 Soporte     │
│  © 2025 Todos los derechos      Ayuda                    support@...    │
│  reservados                     Documentación            🌐 GitHub       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Columna 1 - Branding (Izquierda):**
- Logo pequeño ProGPS (verde neón, 40px)
- Copyright: "© 2025 ProGPS - Todos los derechos reservados"
- Texto: 14px, gris claro
- Alineación: left

**Columna 2 - Enlaces Legales (Centro):**
- "Términos de Uso" (link)
- "Política de Privacidad" (link)
- "Ayuda" (link)
- "Documentación API" (link) - Solo Admin
- Texto: 14px, gris claro
- Hover: Verde neón con underline
- Alineación: center
- Espaciado: 16px entre enlaces

**Columna 3 - Información de Contacto (Derecha):**
- "Versión 2.0.0"
- "📧 Soporte: support@progps.com" (link mailto)
- "🌐 GitHub" (link externo) - opcional
- "Desarrollado por [Tu Nombre]"
- Texto: 14px, gris claro
- Alineación: right

**Interacciones Desktop:**
- Links: cursor pointer
- Hover: color verde neón (#C0F11C) + underline
- Transition: 200ms ease
- Email: abrir cliente de correo
- Links externos: abrir en nueva pestaña

**Comportamiento Desktop:**
- Siempre visible al final de cada página
- No sticky (no se queda fijo al hacer scroll)
- Se mantiene en la parte inferior del contenido
- Si el contenido es corto, usar min-height para que esté al fondo

**Responsive del Footer (FASE POSTERIOR):**
- Desktop (>1280px): 3 columnas ✅ PRIORIDAD
- Tablet (768-1280px): 2 columnas ⏳ FASE 2
- Mobile (<768px): 1 columna, stack vertical ⏳ FASE 3

**Nota:** El footer será igual para todos los usuarios (Admin y Empleado), con información general de la aplicación.

---

## 🧩 **COMPONENTES VISUALES CLAVE**

### 📍 **Mapas (3 tipos)**
1. **Mapa de Tiempo Real** - Múltiples marcadores actualizándose
2. **Mapa de Historial** - Ruta completa con línea conectando puntos
3. **Mapa Mini** - Vista previa pequeña en cards

### 📊 **Tablas de Datos (3 tipos)**
1. **Tabla de Usuarios** - Con acciones CRUD (Admin)
2. **Tabla de Dispositivos** - Con acciones CRUD y cambio de estado (Admin)
3. **Tabla de Ubicaciones** - Timeline del historial (Admin)

### 📈 **Gráficos/Estadísticas (Admin)**
1. **Cards de Resumen** - Total usuarios, dispositivos, ubicaciones
2. **Gráficos de Línea** - Actividad en el tiempo
3. **Gráficos de Dona** - Distribución de estados

### 🎛️ **Controles Especiales**
1. **Toggle GPS** - Botón grande ON/OFF para empleados
2. **Selector de Fechas** - Rango para historial (Admin)
3. **Filtros Avanzados** - Por usuario, dispositivo, estado (Admin)
4. **Auto-refresh Toggle** - Activar/desactivar actualización automática (Admin)

### 🔔 **Notificaciones**
1. **Toast Messages** - Confirmaciones y errores
2. **Badges** - Contadores de notificaciones (navbar)
3. **Alertas** - Dispositivos inactivos, errores GPS (Admin)

---

## 🎨 **DISEÑO Y UX**

### **Layout Principal**
- **Navbar** - Barra superior fija (negro con detalles verde neón)
- **Sidebar** - Navegación lateral colapsable (negro puro)
- **Hero Section** - Sección principal de cada vista
- **Main Content** - Área principal con grid y cards (fondo negro/gris oscuro)
- **Footer** - Información institucional (negro puro)

### **Temas**
- **Modo Oscuro Principal** - Negro predominante con acentos verde neón
- **Modo Claro Alternativo** - Blanco con detalles en negro y verde neón
- Toggle fácil de acceder en navbar

### **🖥️ PRIORIDAD: VERSIÓN DE ESCRITORIO (Desktop First)**

**⚠️ IMPORTANTE:** El desarrollo se enfocará **100% en la versión de escritorio/PC** primero. La versión responsive para tablet y móvil se implementará en una **fase posterior** una vez que la versión de escritorio esté completamente funcional y probada.

#### **Especificaciones Desktop (Resolución objetivo: 1920x1080 y 1366x768)**

**Resoluciones Principales:**
- **Full HD:** 1920x1080px (Óptima)
- **HD:** 1366x768px (Mínima)
- **Contenido máximo:** 1440px centrado

**Layout Desktop Completo:**
- **Navbar:** Altura 64px, siempre visible (sticky)
- **Sidebar:** Ancho 240px expandido, colapsable a 64px
- **Contenido Principal:** Ancho restante (1680px en Full HD con sidebar)
- **Grid:** 12 columnas con gap de 24px
- **Cards:** Mínimo 300px de ancho, máximo 400px
- **Tablas:** Ancho completo con scroll horizontal si es necesario
- **Mapas:** Mínimo 800px de ancho, altura 600px

**Interacciones Desktop:**
- **Mouse hover:** Efectos en todos los elementos interactivos
- **Click:** Feedback visual inmediato
- **Drag & drop:** Para reorganizar elementos (fase avanzada)
- **Shortcuts de teclado:** Ctrl+K para búsqueda, Esc para cerrar modals
- **Scroll:** Suave con wheel del mouse
- **Zoom del mapa:** Mouse wheel + botones

**Navegación Desktop:**
- **Sidebar siempre visible** (no colapsado por defecto)
- **Navbar con todos los items** visibles sin menú hamburguesa
- **Breadcrumbs** en vistas internas
- **Multi-ventana:** Soporte para abrir en múltiples tabs

**Tamaños de Elementos Desktop:**
- **Botones:** Mínimo 120px de ancho, 40px de alto
- **Inputs:** Altura 40px
- **Cards:** Padding 24px
- **Iconos:** 24px por defecto, 32px en acciones principales
- **Texto:** 16px base (legible en pantallas grandes)

---

### **📱 Responsive (FASE POSTERIOR - No priorizar ahora)**

> **NOTA:** Esta sección se implementará **después** de completar la versión desktop al 100%.

**Breakpoints Planeados (Para el futuro):**
- **Desktop (>1280px)** - Layout completo con sidebar expandido ✅ PRIORIDAD
- **Tablet (768-1280px)** - Sidebar colapsable, grid adaptado ⏳ FASE 2
- **Mobile (<768px)** - Menú hamburguesa, vistas simplificadas ⏳ FASE 3

**Comportamiento Responsive Planeado:**

#### **Tablet (768-1280px) - FASE 2**
- Sidebar colapsado por defecto
- Grid de 8 columnas
- Cards en 2 columnas
- Mapas: altura 500px
- Tablas: scroll horizontal

#### **Mobile (<768px) - FASE 3**
- Menú hamburguesa
- Grid de 4 columnas
- Cards en 1 columna (stack vertical)
- Mapas: altura 400px, pantalla completa
- Tablas: convertir a cards verticales
- Botón GPS: 80% del ancho de pantalla
- Touch gestures: swipe, pinch zoom
- Botones: mínimo 44x44px (táctil)
- Navbar: fixed bottom opcional
- Filtros: drawer desde abajo

**Vistas Específicas en Mobile (FUTURO):**
- **Login:** Card centrado, logo más grande
- **Dashboard Admin:** Cards apiladas, mapa primero
- **Dashboard Empleado:** Botón GPS full width, muy grande
- **Gestión Usuarios:** Cards verticales con swipe para acciones
- **Gestión Dispositivos:** Grid 1 columna, cards más compactas
- **Mapa Tiempo Real:** Fullscreen, controles en bottom sheet
- **Historial:** Timeline vertical, mapa colapsable

---

## 🎨 **PALETA DE COLORES**

### **Colores Principales**
- **Negro (#000000 / #0A0A0A)** - Color predominante, fondos principales
- **Verde Neón (#C0F11C)** - Color de marca, acentos, botones principales, estados activos
- **Gris Oscuro (#1A1A1A / #2A2A2A)** - Fondos secundarios, cards, sidebar

### **Colores Complementarios**
- **Blanco (#FFFFFF)** - Textos principales sobre fondos oscuros
- **Gris Claro (#E0E0E0)** - Textos secundarios, descripciones
- **Gris Medio (#808080)** - Bordes, divisores, elementos deshabilitados

### **Estados y Alertas**
- **Activo:** Verde Neón (#C0F11C) - Dispositivos activos, GPS encendido
- **Inactivo:** Gris (#6B6B6B) - Dispositivos apagados
- **Mantenimiento:** Amarillo Neón (#FFE500) - Complementa con el verde
- **Error/Alerta:** Rojo Neón (#FF3B3B) - Errores, alertas críticas
- **Éxito:** Verde Neón (#C0F11C) - Confirmaciones
- **Info:** Cyan Neón (#00E5FF) - Información adicional

### **Gradientes (Opcional)**
- **Primario:** Negro → Verde Neón (#000000 → #C0F11C)
- **Secundario:** Gris Oscuro → Negro (#2A2A2A → #000000)
- **Acento:** Verde Neón con transparencia para efectos glow

### **Efectos Visuales**
- **Glow/Resplandor:** Verde neón con blur para botones importantes
- **Sombras:** Negras con opacidad para profundidad
- **Hover:** Intensificar el verde neón o agregar glow
- **Active:** Verde neón más brillante

---

## 🔤 **TIPOGRAFÍA**

### **Familia Tipográfica Principal**
- **Roboto** (o similar sans-serif geométrica moderna)
- Fuente limpia, moderna y altamente legible en pantallas
- Excelente para interfaces digitales y móviles
- Inspirada en la tipografía de inDrive

### **Jerarquía Tipográfica**

#### **Títulos Principales (H1)**
- **Peso:** Bold (700)
- **Tamaño:** 32-40px
- **Color:** Verde Neón (#C0F11C) o Blanco
- **Uso:** Títulos de páginas principales, hero sections

#### **Títulos Secundarios (H2)**
- **Peso:** Medium (500)
- **Tamaño:** 24-28px
- **Color:** Blanco o Verde Neón
- **Uso:** Secciones importantes, headers de cards

#### **Subtítulos (H3)**
- **Peso:** Regular (400)
- **Tamaño:** 18-20px
- **Color:** Blanco o Gris Claro
- **Uso:** Subsecciones, títulos de cards

#### **Texto de Cuerpo**
- **Peso:** Regular (400)
- **Tamaño:** 14-16px
- **Color:** Gris Claro (#E0E0E0)
- **Espaciado:** Adecuado para legibilidad (1.5-1.6 line-height)
- **Uso:** Contenido general, descripciones

#### **Texto Pequeño**
- **Peso:** Light (300) o Regular (400)
- **Tamaño:** 12-14px
- **Color:** Gris Medio (#808080)
- **Uso:** Metadatos, timestamps, notas

#### **Botones y CTAs**
- **Peso:** Medium (500) o Bold (700)
- **Tamaño:** 14-16px
- **Color:** Negro sobre Verde Neón
- **Transformación:** Uppercase opcional para énfasis
- **Uso:** Acciones principales

### **Características Tipográficas**
- **Espaciado de Letras:** Uniforme, ligeramente amplio para claridad
- **Altura de Línea:** 1.5-1.6 para texto de cuerpo
- **Trazos:** Uniformes y limpios, estilo geométrico
- **Estilo:** Minimalista y moderno
- **Legibilidad:** Optimizada para pantallas digitales y móviles

---

## 🎭 **ESTÉTICA Y FILOSOFÍA DE DISEÑO**

### **Inspiración: inDrive**
La estética visual combina tres pilares fundamentales:

#### **1. Tecnología**
- Diseño moderno y digital
- Interfaces limpias y eficientes
- Uso de colores neón que evocan tecnología avanzada
- Animaciones sutiles y fluidas
- Elementos geométricos y precisos

#### **2. Humanidad**
- Interfaz accesible y comprensible
- Tipografía clara y legible (Roboto)
- Espaciado generoso para facilitar la interacción
- Feedback visual inmediato
- Diseño centrado en el usuario

#### **3. Transparencia**
- Información clara y directa
- Estados visibles (activo/inactivo)
- Datos presentados de forma honesta
- Sin elementos decorativos innecesarios
- Jerarquía visual clara

### **Misión Visual**
- **Desafiar la Injusticia:** Diseño que empodera al usuario
- **Eficiencia:** Cada elemento tiene un propósito
- **Claridad:** Sin confusión, todo es directo
- **Modernidad:** Tecnología de vanguardia
- **Confianza:** Colores y formas que inspiran seguridad

---

## 🔄 **FLUJOS DE USUARIO**

### **Flujo Empleado:**
```
Login → Dashboard (Hero con Toggle GPS) → Activar GPS → Ver Mis Dispositivos (Cards) → Perfil
```

### **Flujo Admin:**
```
Login → Dashboard (Hero con Mapa + Cards de Estadísticas) → Gestionar Usuarios (Hero + Tabla) → 
Gestionar Dispositivos (Hero + Grid de Cards) → Ver Tiempo Real (Mapa Full) → 
Consultar Historial (Hero + Filtros + Mapa) → Ver Reportes (Hero + Grid de Gráficos) → Perfil
```

---

## 🎯 **PRIORIDADES DE DESARROLLO**

### **🖥️ FASE 1 - MVP DESKTOP (100% Escritorio)**

**Objetivo:** Aplicación completamente funcional en Desktop (1920x1080 y 1366x768)

#### **1.1 - Autenticación y Estructura Base**
1. **Login Desktop** - Hero con formulario centrado, fondo negro, botón verde neón
   - Card centrado: 450px de ancho
   - Inputs: 100% ancho del card
   - Logo grande arriba: 80px
   - Botón: ancho completo

2. **Navbar Desktop** - Barra superior fija (64px altura)
   - Logo izquierda
   - Items de navegación centrados
   - Perfil + notificaciones derecha
   - Dropdown de usuario al click

3. **Sidebar Desktop** - Menú lateral colapsable (240px / 64px)
   - Expandido por defecto
   - Iconos + labels
   - Sección activa con borde verde neón
   - Botón collapse arriba

4. **Footer Desktop** - Pie de página (100px altura)
   - 3 columnas
   - Links funcionales
   - Información de contacto

#### **1.2 - Dashboards Desktop**
5. **Dashboard Admin Desktop**
   - Hero: título + 4 cards estadísticas en grid 4 columnas
   - Mapa: 100% ancho, 600px altura
   - Cards adicionales: grid 3 columnas
   - Todo visible sin scroll excesivo

6. **Dashboard Empleado Desktop**
   - Hero centrado: toggle GPS (200x200px)
   - Estado del GPS en card grande
   - Mis dispositivos: grid 2-3 columnas
   - Información resumida en cards

#### **1.3 - Gestión (Solo Admin) Desktop**
7. **Gestión de Usuarios Desktop**
   - Hero: título + botón "Crear Usuario" derecha
   - Tabla: ancho completo, scroll horizontal si necesario
   - 10-20 usuarios por página
   - Columnas: Avatar, Nombre, Email, Rol, Dispositivos, Estado, Acciones
   - Modal de crear/editar: 600px ancho, centrado

8. **Gestión de Dispositivos Desktop**
   - Hero: título + botón "Crear Dispositivo" + filtros rápidos
   - Grid: 3-4 columnas de cards
   - Cards: 300px ancho mínimo
   - Modal de crear/editar: 600px ancho

#### **1.4 - Mapas y Tracking Desktop**
9. **Mapa Tiempo Real Desktop**
   - Mapa: 100% ancho, 700px altura mínima
   - Panel lateral: 300px con lista de dispositivos activos
   - Controles: zoom, capas, fullscreen
   - Auto-refresh toggle arriba derecha

10. **Historial de Rutas Desktop**
    - Hero: selectores de dispositivo + fechas + botón buscar
    - Mapa: 70% ancho, 600px altura
    - Timeline lateral: 30% ancho, scroll vertical
    - Estadísticas abajo: grid 4 columnas

#### **1.5 - Extras Desktop**
11. **Perfil de Usuario Desktop**
    - 2 columnas: Info personal (60%) + Avatar (40%)
    - Form de edición: inputs 100% ancho
    - Botón guardar: esquina inferior derecha

12. **Notificaciones Desktop**
    - Toast: esquina superior derecha
    - Badge en navbar: contador verde neón
    - Panel dropdown: 400px ancho, max 500px altura

---

### **✅ FASE 2 - Funcionalidades Avanzadas Desktop**

**Objetivo:** Completar todas las funcionalidades avanzadas en Desktop

13. **Reportes/Estadísticas Desktop**
    - Hero + filtros de fecha
    - Grid 2 columnas: gráficos grandes
    - Gráficos: 600px ancho cada uno
    - Exportar a PDF/Excel

14. **WebSockets en Tiempo Real Desktop**
    - Actualización automática de mapa
    - Notificaciones push en navbar
    - Indicador de conexión verde neón

15. **Filtros Avanzados Desktop**
    - Sidebar de filtros: 280px
    - Múltiples filtros combinables
    - Aplicar/Limpiar botones

16. **Configuración Avanzada Desktop**
    - Tabs horizontales
    - Preferencias por secciones
    - Toggle tema claro/oscuro

---

### **📱 FASE 3 - Responsive Mobile/Tablet**

**Objetivo:** Adaptar la aplicación desktop a dispositivos móviles

> **⚠️ IMPORTANTE:** Esta fase comienza **SOLO después** de que la FASE 1 y 2 estén 100% completas y probadas en Desktop.

17. **Responsive Tablet (768-1280px)**
    - Adaptar grids a 2 columnas
    - Sidebar colapsado por defecto
    - Ajustar tamaños de cards

18. **Responsive Mobile (<768px)**
    - Menú hamburguesa
    - Cards en columna única
    - Botones táctiles grandes (44x44px)
    - Bottom navigation opcional

19. **Touch Gestures Mobile**
    - Swipe para menús
    - Pull to refresh
    - Pinch zoom en mapas

20. **Optimización Mobile**
    - Lazy loading de imágenes
    - Reducir llamadas API
    - Optimizar mapas para móvil

---

### **📋 Resumen de Fases**

| Fase | Descripción | Prioridad | Plataforma |
|------|-------------|-----------|------------|
| **FASE 1** | MVP Desktop - Funcionalidad completa | 🔴 **CRÍTICA** | 🖥️ Desktop |
| **FASE 2** | Funcionalidades Avanzadas Desktop | 🟡 **ALTA** | 🖥️ Desktop |
| **FASE 3** | Responsive Mobile/Tablet | 🟢 **MEDIA** | 📱 Mobile/Tablet |

**Estimación:**
- FASE 1: 4-6 semanas (Desktop completo)
- FASE 2: 2-3 semanas (Avanzado desktop)
- FASE 3: 3-4 semanas (Responsive)

---

## 💡 **CARACTERÍSTICAS ESPECIALES**

### **Para Empleados:**
- **Hero Section simplificado** con foco en el toggle GPS
- **Botón GPS grande** con efecto glow verde neón cuando está activo
- **Cards básicas** con información esencial
- **Indicador de estado** de conexión (pulso verde neón)
- **Notificación** con borde verde cuando GPS está activo
- **Ver última ubicación** enviada en card oscura

### **Para Admins:**
- **Hero Sections completos** con estadísticas y CTAs múltiples
- **Vista de mapa** como página principal (tema oscuro)
- **Grid complejo** con múltiples cards de estadísticas
- **Tablas avanzadas** con filtros y acciones CRUD
- **Actualización automática** con indicador verde neón pulsante
- **Filtros rápidos** con chips verde neón
- **Estadísticas en cards** oscuras con números en verde neón
- **Historial con reproducción** de ruta (línea verde neón animada)
- **Acceso completo** a todas las funcionalidades

---

## 📱 **ICONOGRAFÍA**

### **Estilo de Iconos**
- **Tipo:** Line icons (contorno)
- **Grosor:** 2px
- **Color:** Verde Neón (#C0F11C) para activos, Gris para inactivos
- **Efecto:** Glow sutil en hover

### **Iconos Principales**
- **GPS:** Marcador de mapa con punto verde neón
- **Usuarios:** Icono de persona con contorno verde
- **Dispositivos:** Icono de celular/tablet con borde verde
- **Historial:** Icono de reloj con manecillas verde neón
- **Reportes:** Icono de gráfico con barras verde neón
- **Configuración:** Icono de engranaje con dientes verde neón
- **Notificaciones:** Campana con badge verde neón
- **Mapa:** Pin de ubicación verde neón
- **Dashboard:** Icono de cuadrícula verde neón
- **Logout:** Icono de salida con flecha

---

## ✨ **EFECTOS Y ANIMACIONES**

### **Microinteracciones**
- **Hover en botones:** Intensificar verde neón + glow
- **Click:** Efecto ripple verde neón
- **Loading:** Spinner con gradiente verde neón
- **Toggle GPS:** Animación de pulso cuando está activo
- **Marcadores en mapa:** Bounce al aparecer
- **Cards:** Elevación al hover con borde verde neón
- **Navbar items:** Underline animado verde neón

### **Transiciones**
- **Cambio de vista:** Fade suave (300ms)
- **Sidebar:** Slide lateral (250ms)
- **Modals:** Scale + fade (200ms)
- **Notificaciones:** Slide desde arriba (300ms)
- **Hero sections:** Fade in al cargar (400ms)
- **Cards en grid:** Stagger animation (escalonado)

### **Estados Activos**
- **GPS Encendido:** Pulso verde neón continuo
- **Actualización en tiempo real:** Onda expansiva verde
- **Nuevo dato:** Flash verde neón sutil
- **Alerta:** Parpadeo rojo neón
- **Item activo en navbar/sidebar:** Borde o fondo verde neón

---

## 🎨 **EJEMPLOS DE APLICACIÓN**

### **Login**
- **Hero Section:** Card central con logo grande verde neón
- Fondo: Negro puro (#000000) con patrón sutil
- Card central: Gris oscuro (#1A1A1A) con borde verde neón sutil
- Inputs: Fondo negro con borde gris, verde neón al focus
- Botón: Verde neón (#C0F11C) con texto negro, glow al hover
- Logo: Verde neón sobre negro

### **Dashboard Admin**
- **Navbar:** Negro con logo verde neón, notificaciones con badge
- **Sidebar:** Negro puro con items, activo en verde neón
- **Hero Section:** Título grande + 4 cards de estadísticas en grid
- **Cards de estadísticas:** Gris oscuro con números en verde neón
- **Mapa:** Tema oscuro con marcadores verde neón
- **Footer:** Negro con enlaces en gris, verde al hover

### **Dashboard Empleado**
- **Navbar:** Igual que admin pero con menos opciones
- **Sidebar:** Solo Dashboard y Mis Dispositivos
- **Hero Section:** Toggle GPS grande centrado
- **Botón OFF:** Gris oscuro con texto gris claro
- **Botón ON:** Verde neón con glow, texto negro
- **Estado activo:** Pulso verde neón continuo
- **Card de resumen:** Última ubicación y tiempo de rastreo

### **Gestión de Usuarios (Admin)**
- **Hero Section:** Título "Gestión de Usuarios" + botón "Crear Usuario" verde neón
- **Grid:** Tabla responsive con usuarios
- **Cards de usuario:** Gris oscuro con avatar, nombre, rol (badge verde)
- **Acciones:** Iconos verde neón (editar, eliminar)
- **Filtros:** Chips verde neón para filtros activos

### **Gestión de Dispositivos (Admin)**
- **Hero Section:** Título + botón "Crear Dispositivo" + filtros rápidos
- **Grid:** 3-4 columnas de cards de dispositivos
- **Cards:** Icono de dispositivo, nombre, serial, estado (badge)
- **Estado activo:** Badge verde neón
- **Estado inactivo:** Badge gris
- **Estado mantenimiento:** Badge amarillo neón
- **Hover:** Borde verde neón + elevación

### **Historial de Rutas (Admin)**
- **Hero Section:** Selectores de dispositivo y fechas + botón "Buscar"
- **Mapa:** Full width con ruta en línea verde neón
- **Timeline lateral:** Cards con ubicaciones ordenadas por tiempo
- **Estadísticas:** Cards con distancia, duración, puntos (números verde neón)

### **Tablas**
- Fondo: Negro o gris muy oscuro
- Headers: Gris oscuro con texto verde neón
- Filas: Alternadas en negro y gris oscuro
- Hover: Borde izquierdo verde neón + fondo gris oscuro
- Acciones: Iconos verde neón
- Paginación: Números en gris, activo en verde neón

---

## 📐 **SISTEMA DE ESPACIADO**

### **Escala de Espaciado**
- **4px** - Espaciado mínimo (entre iconos y texto)
- **8px** - Espaciado pequeño (padding interno)
- **16px** - Espaciado estándar (padding de cards)
- **24px** - Espaciado medio (gap en grids)
- **32px** - Espaciado grande (padding de secciones)
- **48px** - Espaciado extra grande (entre secciones)
- **64px** - Espaciado máximo (hero sections)

### **Aplicación**
- **Cards:** Padding 16-24px
- **Grid gap:** 16-24px
- **Secciones:** Margin 32-48px
- **Hero sections:** Padding 48-64px
- **Navbar:** Height 64px, padding horizontal 24px
- **Sidebar:** Width 240px (expandido), 64px (colapsado)

---

## 📊 **ENDPOINTS DISPONIBLES DEL BACKEND**

### **Base URL:** `http://localhost:8000/api`

### **Autenticación (3 endpoints)**
- `POST /auth/login` - Login y obtener token
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Info del usuario actual

### **Usuarios (5 endpoints - Solo Admin)**
- `GET /users` - Listar usuarios
- `GET /users/{id}` - Ver usuario
- `POST /users` - Crear usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### **Dispositivos (6 endpoints)**
- `GET /devices` - Listar dispositivos (filtrado por rol)
- `GET /devices/{id}` - Ver dispositivo
- `POST /devices` - Crear dispositivo (Admin)
- `PUT /devices/{id}` - Actualizar dispositivo (Admin)
- `DELETE /devices/{id}` - Eliminar dispositivo (Admin)
- `PATCH /devices/{id}/status` - Cambiar estado (Admin)

### **GPS (1 endpoint - Empleado)**
- `POST /gps` - Registrar ubicación GPS

### **Ubicaciones (2 endpoints - Solo Admin)**
- `GET /locations/current` - Ubicaciones actuales de todos
- `GET /locations/history` - Historial con filtros

**Total: 17 Endpoints**

---

## 🎯 **NOTA IMPORTANTE**

**La mayoría de recursos y funcionalidades avanzadas** (gestión de usuarios, dispositivos, reportes, historial completo, mapas en tiempo real) **estarán disponibles para el Administrador**, quien será el encargado de manejar y controlar todo el sistema. 

**El Empleado** tendrá una interfaz simplificada enfocada en su tarea principal: **activar/desactivar el GPS** y ver sus dispositivos asignados.

---

**Documento creado:** 2025-11-13  
**Versión:** 2.0  
**Estado:** Propuesta de diseño completa
