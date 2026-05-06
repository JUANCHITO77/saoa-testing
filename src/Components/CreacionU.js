import '../CSS/Creacion_Usuario.css';

function Creacion_Usuario() {

    return (

        <div class="form-container">
        <h1>Crear Usuario</h1>
        <form>
            <div class="form-group">
                <label for="documento">Número de Documento:</label>
                <input type="text" id="documento" name="documento" placeholder="Ingrese el número de documento" required/>
            </div>
            <div class="form-group">
                <label for="nombres">Nombres:</label>
                <input type="text" id="nombres" name="nombres" placeholder="Ingrese los nombres" required/>
            </div>
            <div class="form-group">
                <label for="apellidos">Apellidos:</label>
                <input type="text" id="apellidos" name="apellidos" placeholder="Ingrese los apellidos" required/>
            </div>
            <div class="form-group">
                <label for="entidad">Entidad a la cual pertenece:</label>
                <input type="text" id="entidad" name="entidad" placeholder="Ingrese la entidad" required/>
            </div>
            <div class="form-group">
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" placeholder="Ingrese el correo electrónico" required/>
            </div>
            <div class="form-group">
                <label for="celular">Celular:</label>
                <input type="tel" id="celular" name="celular" placeholder="Ingrese el celular" required/>
            </div>
            <div class="form-group">
                <label for="tipo-usuario">Tipo de Usuario:</label>
                <select id="tipo-usuario" name="tipo-usuario" required>
                    <option value="admin">Administrador</option>
                    <option value="coordinador">Coordinador</option>
                    <option value="operador">Operador</option>
                </select>
            </div>
            <div class="form-group">
                <label for="estado">Estado:</label>
                <select id="estado" name="estado" required>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
            <div class="form-group">
                <button type="submit">Guardar</button>
            </div>
        </form>
    </div>
    )
}
export default Creacion_Usuario;