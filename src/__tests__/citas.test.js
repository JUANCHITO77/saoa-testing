/**
 * ============================================================
 *  PRUEBAS DEL MÓDULO DE CITAS — saoa-front
 *  Herramientas: Jest + React Testing Library
 *
 *  Casos cubiertos:
 *    Caso 1 → Lista vacía muestra mensaje informativo
 *    Caso 2 → Crear cita: persiste en localStorage y aparece en tabla
 *    Caso 3 → Eliminar cita: desaparece de tabla y de localStorage
 *    Caso 4 → Editar cita: campos actualizados en tabla y localStorage
 *    Caso 5 → Cancelar eliminación: cita permanece intacta
 *    Caso 6 → Formulario incompleto: no se crea la cita
 * ============================================================
 */

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../Context/AuthContext';
import AsignacionCitas from '../Pages/Asignacion_citas';

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const USUARIO_SESION = {
  id: '1',
  nombre: 'María',
  apellido: 'López',
  email: 'maria@saoa.com',
};

const CITA_EXISTENTE = {
  Id_cita: '9999',
  Servicio_Agendado: 'PRIMERA VEZ C.C.',
  Fecha_cita: '2026-06-15',
  Identificacion_Cliente: '12345678',
  Nombre_Cliente: 'Carlos Pérez',
  Observaciones: 'Traer documentos originales',
  Entidad: 'OPADI',
  EstadoCita: 'Agendado',
  Respuesta_Atencion: '',
  Usuario: 'María López',
  Id_Usuario: '1',
  createdAt: new Date().toISOString(),
};

// ─── Helper: renderiza el módulo de citas con sus proveedores ─────────────────
function renderCitas() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AsignacionCitas />
      </AuthProvider>
    </MemoryRouter>
  );
}

// ─── Helper: abre el modal y llena el formulario de nueva cita ────────────────
function abrirYLlenarFormulario({ servicio, fecha, identificacion, nombre }) {
  fireEvent.click(screen.getByText('Asignar Nueva Cita'));

  if (servicio) {
    fireEvent.change(screen.getByLabelText(/servicio \*/i), {
      target: { value: servicio },
    });
  }
  if (fecha) {
    fireEvent.change(screen.getByLabelText(/fecha de cita \*/i), {
      target: { value: fecha },
    });
  }
  if (identificacion) {
    fireEvent.change(screen.getByLabelText(/identificación del cliente \*/i), {
      target: { value: identificacion },
    });
  }
  if (nombre) {
    fireEvent.change(screen.getByLabelText(/nombre del cliente \*/i), {
      target: { value: nombre },
    });
  }
}

// ─── Suite principal ──────────────────────────────────────────────────────────
describe('MÓDULO: CITAS', () => {

  beforeAll(() => {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  PRUEBAS DE CITAS — saoa-front');
    console.log('═══════════════════════════════════════════════════════════════');
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('saoa_user', JSON.stringify(USUARIO_SESION));
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 1 | LISTA VACÍA — Sin citas muestra mensaje informativo', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 1 → Lista vacía');
    console.log('  Tipo   → Prueba unitaria (estado inicial del componente)');
    console.log('  Input  → localStorage "saoa_citas" vacío');

    renderCitas();

    const mensaje = screen.getByText(/No hay citas registradas/i);
    expect(mensaje).toBeInTheDocument();

    const citasGuardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(citasGuardadas).toHaveLength(0);

    console.log('  Output → Mensaje en pantalla:', mensaje.textContent.trim());
    console.log('  Output → Citas en localStorage:', citasGuardadas.length);
    console.log('  ✅ PASÓ: Lista vacía muestra mensaje apropiado al usuario');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 2 | CREAR — Nueva cita aparece en tabla y persiste en localStorage', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 2 → Crear nueva cita');
    console.log('  Tipo   → Prueba funcional (flujo completo de creación)');
    console.log('  Input  → Servicio: DUPLICADO C.C. | Cliente: Ana Torres | Fecha: 2026-08-20');

    renderCitas();

    abrirYLlenarFormulario({
      servicio: 'DUPLICADO C.C.',
      fecha: '2026-08-20',
      identificacion: '87654321',
      nombre: 'Ana Torres',
    });

    fireEvent.click(screen.getByRole('button', { name: /^Crear$/i }));

    // Verificar que aparece en la tabla
    expect(screen.getByText('Ana Torres')).toBeInTheDocument();
    expect(screen.getByText('DUPLICADO C.C.')).toBeInTheDocument();
    expect(screen.getByText('20/08/2026')).toBeInTheDocument();

    // Verificar persistencia en localStorage
    const guardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(guardadas).toHaveLength(1);
    expect(guardadas[0].Nombre_Cliente).toBe('Ana Torres');
    expect(guardadas[0].Servicio_Agendado).toBe('DUPLICADO C.C.');
    expect(guardadas[0].EstadoCita).toBe('Agendado');
    expect(guardadas[0].Id_cita).toBeTruthy();

    console.log('  Output → Cita creada en localStorage:', {
      id: guardadas[0].Id_cita,
      cliente: guardadas[0].Nombre_Cliente,
      servicio: guardadas[0].Servicio_Agendado,
      estado: guardadas[0].EstadoCita,
    });
    console.log('  Output → Visible en tabla: SÍ');
    console.log('  ✅ PASÓ: Cita creada, visible en tabla y persistida en localStorage');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 3 | ELIMINAR — Cita eliminada desaparece de tabla y de localStorage', () => {
    localStorage.setItem('saoa_citas', JSON.stringify([CITA_EXISTENTE]));

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 3 → Eliminar cita existente');
    console.log('  Tipo   → Prueba funcional (flujo completo de eliminación)');
    console.log('  Input  → Cita preexistente: Carlos Pérez | PRIMERA VEZ C.C. | ID: 9999');

    renderCitas();

    // Verificar que la cita está en tabla antes de eliminar
    expect(screen.getByText('Carlos Pérez')).toBeInTheDocument();

    // Abrir modal de confirmación
    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();

    // Confirmar eliminación dentro del modal (evitar ambigüedad con el botón de la fila)
    const modalContent = screen.getByText('Confirmar Eliminación').closest('.modal-content');
    const botonConfirmar = within(modalContent).getByText('Eliminar');
    fireEvent.click(botonConfirmar);

    // Verificar que desapareció de la tabla
    expect(screen.queryByText('Carlos Pérez')).not.toBeInTheDocument();
    expect(screen.getByText(/No hay citas registradas/i)).toBeInTheDocument();

    // Verificar eliminación en localStorage
    const guardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(guardadas).toHaveLength(0);
    expect(guardadas.find(c => c.Id_cita === '9999')).toBeUndefined();

    console.log('  Output → Citas restantes en localStorage:', guardadas.length);
    console.log('  Output → Carlos Pérez visible en tabla: NO');
    console.log('  ✅ PASÓ: Cita eliminada del DOM y del localStorage');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 4 | EDITAR — Cita actualizada refleja cambios en tabla y localStorage', () => {
    localStorage.setItem('saoa_citas', JSON.stringify([CITA_EXISTENTE]));

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 4 → Editar cita existente');
    console.log('  Tipo   → Prueba funcional (flujo completo de edición)');
    console.log('  Input  → Cambiar estado a "Atendido" + agregar respuesta de atención');

    renderCitas();

    // Abrir modal de edición
    fireEvent.click(screen.getByText('Editar'));
    expect(screen.getByText('Editar Cita')).toBeInTheDocument();

    // Cambiar el estado de la cita
    fireEvent.change(screen.getByLabelText(/^Estado$/i), {
      target: { value: 'Atendido' },
    });

    // Agregar respuesta de atención (solo visible en modo edición)
    fireEvent.change(screen.getByLabelText(/respuesta atención/i), {
      target: { value: 'Cédula entregada exitosamente al ciudadano' },
    });

    // Guardar cambios
    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    // Verificar actualización en tabla
    expect(screen.getByText('Atendido')).toBeInTheDocument();

    // Verificar actualización en localStorage
    const guardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(guardadas).toHaveLength(1);
    expect(guardadas[0].EstadoCita).toBe('Atendido');
    expect(guardadas[0].Respuesta_Atencion).toBe('Cédula entregada exitosamente al ciudadano');
    expect(guardadas[0].Id_cita).toBe('9999'); // Mismo ID, no se creó una nueva

    console.log('  Output → Cita actualizada en localStorage:', {
      id: guardadas[0].Id_cita,
      estadoAntes: 'Agendado',
      estadoDespues: guardadas[0].EstadoCita,
      respuesta: guardadas[0].Respuesta_Atencion,
    });
    console.log('  ✅ PASÓ: Cita editada correctamente, misma cantidad en localStorage');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 5 | CANCELAR ELIMINACIÓN — Cita permanece intacta al cancelar', () => {
    localStorage.setItem('saoa_citas', JSON.stringify([CITA_EXISTENTE]));

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 5 → Cancelar flujo de eliminación');
    console.log('  Tipo   → Prueba funcional (validación de flujo de cancelación)');
    console.log('  Input  → Click Eliminar → modal abre → Click Cancelar');

    renderCitas();

    // Verificar que la cita existe
    expect(screen.getByText('Carlos Pérez')).toBeInTheDocument();

    // Abrir modal de confirmación
    fireEvent.click(screen.getByText('Eliminar'));
    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();

    // Cancelar dentro del modal
    const modalContent = screen.getByText('Confirmar Eliminación').closest('.modal-content');
    const botonCancelar = within(modalContent).getByText('Cancelar');
    fireEvent.click(botonCancelar);

    // Verificar que el modal cerró
    expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();

    // Verificar que la cita sigue en tabla
    expect(screen.getByText('Carlos Pérez')).toBeInTheDocument();

    // Verificar que sigue en localStorage
    const guardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(guardadas).toHaveLength(1);
    expect(guardadas[0].Id_cita).toBe('9999');

    console.log('  Output → Modal cerrado: SÍ');
    console.log('  Output → Carlos Pérez sigue en tabla: SÍ');
    console.log('  Output → Citas en localStorage:', guardadas.length);
    console.log('  ✅ PASÓ: Cita conservada al cancelar eliminación');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 6 | VALIDACIÓN — Formulario incompleto no crea la cita', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 6 → Validación de campos requeridos');
    console.log('  Tipo   → Prueba unitaria (lógica de validación del formulario)');
    console.log('  Input  → Formulario enviado sin seleccionar Servicio ni Nombre');

    renderCitas();

    // Abrir modal y enviar sin completar campos requeridos
    abrirYLlenarFormulario({
      fecha: '2026-09-01',
      identificacion: '11111111',
      // Servicio y Nombre_Cliente intencionalmente vacíos
    });

    fireEvent.click(screen.getByRole('button', { name: /^Crear$/i }));

    // El modal debe seguir abierto (no se procesó el formulario)
    expect(screen.getByText('Nueva Cita')).toBeInTheDocument();

    // Debe mostrarse mensaje de error de validación
    expect(screen.getByText(/Complete todos los campos requeridos/i)).toBeInTheDocument();

    // No debe haberse guardado ninguna cita
    const guardadas = JSON.parse(localStorage.getItem('saoa_citas') || '[]');
    expect(guardadas).toHaveLength(0);

    console.log('  Output → Modal sigue abierto: SÍ');
    console.log('  Output → Mensaje de error mostrado: SÍ');
    console.log('  Output → Citas guardadas en localStorage:', guardadas.length);
    console.log('  ✅ PASÓ: Formulario inválido rechazado, cita no creada');
  });

});
