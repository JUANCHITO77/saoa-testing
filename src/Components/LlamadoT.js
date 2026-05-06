import '../CSS/Llamado_Turnos.css';

function Llamado_Turnos() {

    return (

<div class="alert-container">
        <h1>Llamado de Turnos</h1>


        <table>
            <thead>
                <tr>
                    <th>Turno</th>
                    <th>ID Cliente</th>
                    <th>Nombre Cliente</th>
                    <th>Apellido Cliente</th>
                    <th>Fecha Asistencia</th>
                    <th>Hora Asistencia</th>
                    <th>Estado Cliente</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>001</td>
                    <td>12345</td>
                    <td>Juan</td>
                    <td>Pérez</td>
                    <td>2024-11-25</td>
                    <td>10:30</td>
                    <td>Activo</td>
                </tr>
                <tr>
                    <td>002</td>
                    <td>67890</td>
                    <td>Ana</td>
                    <td>Gómez</td>
                    <td>2024-11-25</td>
                    <td>11:00</td>
                    <td>Inactivo</td>
                </tr>
            </tbody>
        </table>


        <div class="form-container">
            <h2>Realizar Llamado</h2>
            <div class="form-group">
                <label for="turno-seleccionado">Turno Seleccionado:</label>
                <input type="text" id="turno-seleccionado" name="turno-seleccionado" placeholder="Número de turno"/>
            </div>
            <div class="form-group">
                <label for="id-cliente">ID Cliente:</label>
                <input type="text" id="id-cliente" name="id-cliente" placeholder="ID del cliente"/>
            </div>
            <div class="form-group">
                <button type="button">Realizar Llamado</button>
            </div>
        </div>


        <div class="form-container">
            <h2>Guardar Estado del Cliente</h2>
            <div class="form-group">
                <label for="estado-cliente">Estado Cliente:</label>
                <select id="estado-cliente" name="estado-cliente">
                    <option value="exitoso">Exitoso</option>
                    <option value="fallido">Fallido</option>
                    <option value="pendiente">Pendiente</option>
                </select>
            </div>
            <div class="form-group">
                <button type="button">Guardar Estado</button>
            </div>
        </div>


        <div class="footer">
            <p>SAOA - Sistema Agendamiento Opadi Antioquia</p>
        </div>
    </div>

    )
}
export default Llamado_Turnos;