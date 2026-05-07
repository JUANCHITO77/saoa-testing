# SAOA OPADI — Sistema de Administración de Citas (Frontend)

Aplicación web desarrollada con **React** para gestionar citas. Funciona completamente sin backend: el login, el registro y el CRUD de citas se persisten en **localStorage** del navegador.

---

## Tabla de contenido

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Cómo usar la aplicación](#cómo-usar-la-aplicación)
4. [Ejecutar las pruebas](#ejecutar-las-pruebas)
   - [Qué se prueba](#qué-se-prueba)
   - [Comandos para correr las pruebas](#comandos-para-correr-las-pruebas)
   - [Entender el resultado en consola](#entender-el-resultado-en-consola)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Tecnologías](#tecnologías)

---

## Requisitos

| Herramienta | Versión mínima | Cómo verificar |
|-------------|---------------|----------------|
| Node.js | 18.0.0 | `node --version` |
| pnpm | 8.0.0 | `pnpm --version` |
| Navegador | Moderno (Chrome, Firefox, Edge) | — |

> Si no tienes **pnpm** instalado: `npm install -g pnpm`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JUANCHITO77/saoa-testing.git
cd saoa-testing

# 2. Instalar dependencias
pnpm install

# 3. Iniciar la aplicación
pnpm start
```

La aplicación abre en **http://localhost:3000**
(si el puerto está ocupado, React preguntará si usar el siguiente disponible).

---

## Cómo usar la aplicación

La aplicación tiene tres pantallas principales:

### 1. Registro (`/registro`)
Crea tu usuario la primera vez. Completa nombre, apellido, correo y contraseña.
Los datos se guardan en `localStorage` bajo la clave `saoa_users`.

### 2. Login (`/ingreso`)
Ingresa con el correo y contraseña que registraste.
Al autenticarte, la sesión queda en `localStorage` bajo la clave `saoa_user`.

### 3. Citas (`/asignacion-citas`)
Módulo CRUD completo de citas:
- **Crear** — botón "Asignar Nueva Cita"
- **Editar** — botón "Editar" en cada fila
- **Eliminar** — botón "Eliminar" en cada fila (pide confirmación)

Los datos se guardan en `localStorage` bajo la clave `saoa_citas`.

---

## Ejecutar las pruebas

### Qué se prueba

El proyecto tiene **9 casos de prueba** organizados en dos archivos dentro de `src/__tests__/`:

#### `login.test.js` — Módulo de Login (3 casos)

| Caso | Descripción | Tipo |
|------|-------------|------|
| 1 | Login con credenciales correctas crea sesión sin exponer la contraseña | Funcional |
| 2 | Login con contraseña incorrecta muestra error y no crea sesión | Funcional |
| 3 | Login con email no registrado muestra error y no crea sesión | Unitaria |

#### `citas.test.js` — Módulo de Citas (6 casos)

| Caso | Descripción | Tipo |
|------|-------------|------|
| 1 | Lista vacía muestra mensaje informativo al usuario | Unitaria |
| 2 | Crear cita: aparece en tabla y persiste en localStorage | Funcional |
| 3 | Eliminar cita: desaparece de tabla y de localStorage | Funcional |
| 4 | Editar cita: los cambios (estado + respuesta) se reflejan en tabla y localStorage | Funcional |
| 5 | Cancelar eliminación: la cita permanece intacta | Funcional |
| 6 | Formulario incompleto: la validación rechaza la creación | Unitaria |

---

### Comandos para correr las pruebas

#### Opción A — Modo recomendado (resultado limpio en consola, una sola ejecución)

```bash
CI=true pnpm test --testPathPattern="__tests__" --verbose
```

- `CI=true` → desactiva el modo interactivo (watch) y ejecuta las pruebas una sola vez.
- `--testPathPattern="__tests__"` → apunta exactamente a la carpeta con los tests.
- `--verbose` → muestra cada caso de prueba con su nombre y resultado.

#### Opción B — Solo pruebas de Login

```bash
CI=true pnpm test --testPathPattern="login" --verbose
```

#### Opción C — Solo pruebas de Citas

```bash
CI=true pnpm test --testPathPattern="citas" --verbose
```

#### Opción D — Modo watch (útil mientras desarrollas)

```bash
pnpm test
```

Jest queda en modo interactivo. Presiona `a` para correr todos los tests,
`q` para salir.

---

### Entender el resultado en consola

Al ejecutar con `--verbose`, verás una salida como esta:

```
═══════════════════════════════════════════════════════════════
  PRUEBAS DE LOGIN — saoa-front
═══════════════════════════════════════════════════════════════

───────────────────────────────────────────────────────────────
  CASO 1 → Login exitoso con credenciales correctas
  Tipo   → Prueba funcional (interacción con UI + localStorage)
  Input  → email: juan@saoa.com | password: segura123
  Output → Sesión creada: {"id":"1","nombre":"Juan","email":"juan@saoa.com"}
  ✅ PASÓ: Login exitoso, sesión guardada, contraseña no expuesta

  CASO 2 → Login fallido con contraseña incorrecta
  Tipo   → Prueba funcional (validación de credenciales)
  Input  → email: juan@saoa.com | password: INCORRECTA
  Output → Mensaje de error visible: Correo o contraseña incorrectos
  ✅ PASÓ: Error mostrado al usuario, sesión no creada
...

PASS src/__tests__/login.test.js
  MÓDULO: LOGIN
    ✓ CASO 1 | ÉXITO — Credenciales correctas: crea sesión sin exponer contraseña
    ✓ CASO 2 | FALLA — Contraseña incorrecta: muestra error y no crea sesión
    ✓ CASO 3 | FALLA — Email no registrado: muestra error y no crea sesión

PASS src/__tests__/citas.test.js
  MÓDULO: CITAS
    ✓ CASO 1 | LISTA VACÍA — Sin citas muestra mensaje informativo
    ✓ CASO 2 | CREAR — Nueva cita aparece en tabla y persiste en localStorage
    ✓ CASO 3 | ELIMINAR — Cita eliminada desaparece de tabla y de localStorage
    ✓ CASO 4 | EDITAR — Cita actualizada refleja cambios en tabla y localStorage
    ✓ CASO 5 | CANCELAR ELIMINACIÓN — Cita permanece intacta al cancelar
    ✓ CASO 6 | VALIDACIÓN — Formulario incompleto no crea la cita

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Time:        ~2 s
```

**Significado de los símbolos:**

| Símbolo | Significado |
|---------|-------------|
| `✓` | El caso de prueba pasó correctamente |
| `✕` | El caso de prueba falló (se imprime el error detallado abajo) |
| `PASS` | Todos los casos del archivo pasaron |
| `FAIL` | Al menos un caso del archivo falló |

**Cada caso imprime en consola:**
- **Input** → los datos de entrada que se usaron en esa prueba
- **Output** → qué devolvió o mostró la aplicación
- **✅ PASÓ / ❌ FALLÓ** → veredicto explicado en lenguaje natural

---

## Estructura del proyecto

```
saoa-front/
├── public/                   # Archivos estáticos (HTML, íconos)
├── src/
│   ├── __tests__/            # ← PRUEBAS AUTOMATIZADAS
│   │   ├── login.test.js     #   Tests del módulo de Login (3 casos)
│   │   └── citas.test.js     #   Tests del módulo de Citas (6 casos)
│   ├── Components/
│   │   ├── Layout.js         # Contenedor principal con sidebar
│   │   ├── Sidebar.js        # Menú lateral de navegación
│   │   └── ProtectedRoute.js # Protección de rutas privadas
│   ├── Context/
│   │   └── AuthContext.js    # Estado global de autenticación (localStorage)
│   ├── Pages/
│   │   ├── Ingreso.js        # Página de login
│   │   ├── Registro.js       # Página de registro de usuario
│   │   └── Asignacion_citas.js # CRUD de citas
│   ├── App.js                # Rutas de la aplicación
│   └── index.js              # Punto de entrada
├── package.json
└── pnpm-lock.yaml
```

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| React 18 | Framework principal |
| React Router DOM v6 | Navegación entre páginas |
| Jest | Framework de pruebas |
| React Testing Library | Pruebas de componentes React |
| localStorage | Persistencia de datos (sin backend) |
| pnpm | Gestor de paquetes |

---

## Autor

Juan Guillermo Hoyos — juanguillermolt@gmail.com
