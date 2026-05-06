function AgendaCitas() {
    return (
  
  <div class="middle-form">
            <h1>Agenda de Cita</h1>
            <form>
                <div class="form-group">
                    <label for="servicio">Servicio Agendado:</label>
                    <select id="servicio" name="servicio">
                        <option value="Primera Vez CC">Primera Vez CC</option>
                        <option value="Duplicado CC Convencional">Duplicado CC Convencional</option>
                        <option value="Cedula Digital">Cedula Digital</option>
                        <option value="Rectificación CC">Rectificación CC</option>
                        <option value="Renovación CC">Renovación CC</option>
                        <option value="Primera Vez TI">Primera Vez TI</option>
                        <option value="Duplicado TI">Duplicado TI</option>
                        <option value="Rectificación TI">Rectificación TI</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="fecha-cita">Fecha de Cita:</label>
                    <input type="date" id="fecha-cita" name="fecha-cita">
                    </input>
                </div>
            </form>

      </div>
    );
  }
  
  export default AgendaCitas;