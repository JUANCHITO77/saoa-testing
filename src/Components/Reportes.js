import '../CSS/Reportes.css';

function Reportesp() {

    return (

        <div class="report-container">
        <div class="search-container">
            <h1>Generar Reporte</h1>
            <form>
                <div class="form-group">
                    <label for="user-id">ID Usuario:</label>
                    <input type="text" id="user-id" name="user-id" placeholder="Ingrese el ID del usuario"/>
                </div>
                <div class="form-group">
                    <label for="reporte">Seleccione Reporte:</label>
                    <select id="reporte" name="reporte">
                        <option value="usuarios">Reporte de Usuarios</option>
                        <option value="ventas">Reporte de Ventas</option>
                        <option value="citas">Reporte de Citas</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fecha-inicio">Fecha Inicial:</label>
                    <input type="date" id="fecha-inicio" name="fecha-inicio"/>
                </div>
                <div class="form-group">
                    <label for="fecha-fin">Fecha Final:</label>
                    <input type="date" id="fecha-fin" name="fecha-fin"/>
                </div>
                <div class="form-group">
                    <button type="submit">Consultar</button>
                </div>
            </form>
        </div>
        <div class="table-container">
            <h1>Reportes Disponibles</h1>
            <table>
                <thead>
                    <tr>
                        <th>Reporte</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Reporte de Usuarios</td>
                        <td>2024-11-01</td>
                        <td><button>Descargar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    )
}
export default Reportesp;