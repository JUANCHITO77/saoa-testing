import '../CSS/Modificacion_Usuario.css';

function Modificacion_Usuario() {

    return (

<div class="container">
   
        <div class="search-container">
            <h1>Buscar Usuario</h1>
            <form>
                <div class="form-group">
                    <label for="user-id">Ingrese el ID del usuario a buscar:</label>
                    <input type="text" id="user-id" name="user-id" placeholder="ID del usuario"/>
                </div>
                <div class="form-group">
                    <button type="submit">Buscar</button>
                </div>
            </form>
        </div>


        <div class="form-container">
            <h1>Modificar Usuario</h1>
            <form>
                <div class="form-group">
                    <label for="Nombre">Nombre Completo:</label>
                    <input type="text" id="Nombre" name="Nombre" value="Juan Pérez"/>
                </div>
                <div class="form-group">
                    <label for="Contraseña">Contraseña:</label>
                    <input type="password" id="Contraseña" name="Contraseña" value="Juan Pérez"/>
                </div>
                <div class="form-group">
                    <label for="Email">Correo Electrónico:</label>
                    <input type="Email" id="Email" name="Email" value="juan@example.com"/>
                </div>
                <div class="form-group">
                    <label for="rol">Rol:</label>
                    <select id="rol" name="rol">
                        <option value="Registrador" selected>Registrador</option>
                        <option value="Coordinador_Enlace">Coordinador_Enlace</option>
                        <option value="Operario_Enlace">Operario_Enlace</option>
                        <option value="Operario_RNEC">Operario_RNEC</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit">Modificar</button>
                </div>
            </form>
        </div>
    </div>

    )
}
export default Modificacion_Usuario;