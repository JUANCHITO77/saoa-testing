
function DatosCliente() {

  return (

    <div>
<div class="left-form">
            <h1>Datos del Cliente</h1>

            <form>
                <div class="form-group">
                    <label for="documento">Número de Documento:</label>
                    <input type="text" id="documento" name="documento" placeholder="Número de documento"/>
                </div>
                <div class="form-group">
                    <label for="nombre-cliente">Nombre del Cliente:</label>
                    <input type="text" id="nombre-cliente" name="nombre-cliente" placeholder="Nombre del cliente"/>
                </div>
                <div class="form-group">
                    <label for="apellidos-cliente">Apellidos del Cliente:</label>
                    <input type="text" id="apellidos-cliente" name="apellidos-cliente" placeholder="Apellidos del cliente"/>
                </div>
                <div class="form-group">
                    <label for="entidad">Entidad a la cual pertenece:</label>
                    <input type="text" id="entidad" name="entidad" placeholder="Entidad"/>
                </div>
                <div class="form-group">
                    <label for="email">Email del Cliente:</label>
                    <input type="email" id="email" name="email" placeholder="Email del cliente"/>
                </div>
                <div class="form-group">
                    <label for="celular">Celular del Cliente:</label>
                    <input type="tel" id="celular" name="celular" placeholder="Celular del cliente"/>
                </div>
                <div class="form-group">
                    <label for="estado-cliente">Estado del Cliente:</label>
                    <select id="estado-cliente" name="estado-cliente">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
            </form>
        </div>
    </div>
)
}

export default DatosCliente;