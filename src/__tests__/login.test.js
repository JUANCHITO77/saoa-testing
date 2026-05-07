/**
 * ============================================================
 *  PRUEBAS DE LOGIN — Módulo de Ingreso SAOA
 *  Herramientas: Jest + React Testing Library
 *
 *  Casos cubiertos:
 *    Caso 1 → Login exitoso con credenciales correctas
 *    Caso 2 → Login fallido con contraseña incorrecta
 *    Caso 3 → Login fallido con email no registrado
 * ============================================================
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../Context/AuthContext';
import Ingreso from '../Pages/Ingreso';

// ─── Usuario de prueba pre-registrado en localStorage ─────────────────────────
const USUARIO_PRUEBA = {
  id: '1',
  nombre: 'Juan',
  apellido: 'García',
  email: 'juan@saoa.com',
  password: 'segura123',
};

// ─── Helper: renderiza la página de ingreso con sus proveedores ───────────────
function renderIngreso() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Ingreso />
      </AuthProvider>
    </MemoryRouter>
  );
}

// ─── Helper: rellena y envía el formulario ────────────────────────────────────
function ingresarCredenciales(email, password) {
  fireEvent.change(screen.getByPlaceholderText('Ingrese su correo'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
}

// ─── Suite principal ──────────────────────────────────────────────────────────
describe('MÓDULO: LOGIN', () => {

  beforeAll(() => {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  PRUEBAS DE LOGIN — saoa-front');
    console.log('═══════════════════════════════════════════════════════════════');
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('saoa_users', JSON.stringify([USUARIO_PRUEBA]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 1 | ÉXITO — Credenciales correctas: crea sesión sin exponer contraseña', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 1 → Login exitoso con credenciales correctas');
    console.log('  Tipo   → Prueba funcional (interacción con UI + localStorage)');
    console.log('  Input  → email: juan@saoa.com | password: segura123');

    renderIngreso();
    ingresarCredenciales('juan@saoa.com', 'segura123');

    // Verifica que se guardó la sesión
    const sesion = JSON.parse(localStorage.getItem('saoa_user'));
    expect(sesion).not.toBeNull();
    expect(sesion.email).toBe('juan@saoa.com');
    expect(sesion.nombre).toBe('Juan');

    // La contraseña NUNCA debe estar en la sesión guardada
    expect(sesion.password).toBeUndefined();

    // No debe mostrarse ningún mensaje de error
    expect(screen.queryByText(/incorrectos/i)).not.toBeInTheDocument();

    console.log('  Output → Sesión creada:', JSON.stringify(sesion));
    console.log('  ✅ PASÓ: Login exitoso, sesión guardada, contraseña no expuesta');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 2 | FALLA — Contraseña incorrecta: muestra error y no crea sesión', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 2 → Login fallido con contraseña incorrecta');
    console.log('  Tipo   → Prueba funcional (validación de credenciales)');
    console.log('  Input  → email: juan@saoa.com | password: INCORRECTA');

    renderIngreso();
    ingresarCredenciales('juan@saoa.com', 'INCORRECTA');

    // Debe mostrar mensaje de error en pantalla
    const mensajeError = screen.getByText('Correo o contraseña incorrectos');
    expect(mensajeError).toBeInTheDocument();

    // No debe existir sesión guardada
    expect(localStorage.getItem('saoa_user')).toBeNull();

    console.log('  Output → Mensaje de error visible:', mensajeError.textContent);
    console.log('  Output → localStorage saoa_user:', localStorage.getItem('saoa_user'));
    console.log('  ✅ PASÓ: Error mostrado al usuario, sesión no creada');
  });

  // ══════════════════════════════════════════════════════════════════════════════
  test('CASO 3 | FALLA — Email no registrado: muestra error y no crea sesión', () => {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('  CASO 3 → Login fallido con email que no existe en el sistema');
    console.log('  Tipo   → Prueba unitaria (búsqueda en lista de usuarios)');
    console.log('  Input  → email: fantasma@noexiste.com | password: cualquiera');

    renderIngreso();
    ingresarCredenciales('fantasma@noexiste.com', 'cualquiera');

    // Debe mostrar mensaje de error en pantalla
    const mensajeError = screen.getByText('Correo o contraseña incorrectos');
    expect(mensajeError).toBeInTheDocument();

    // No debe existir sesión guardada
    expect(localStorage.getItem('saoa_user')).toBeNull();

    console.log('  Output → Mensaje de error visible:', mensajeError.textContent);
    console.log('  Output → Usuarios en sistema:', 1, '| Email buscado: no encontrado');
    console.log('  ✅ PASÓ: Sistema rechaza email no registrado correctamente');
  });

});
