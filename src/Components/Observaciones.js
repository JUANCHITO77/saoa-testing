import Guardar from "./Guardar";

function Observaciones() {
    return (
      
  <div class="right-form">
            <h1>Observaciones</h1>
            <form>
                <div class="form-group">
                    <label for="observaciones">Observaciones a tener en cuenta:</label>
                    <textarea id="observaciones" name="observaciones" placeholder="Escriba las observaciones" rows="4"></textarea>
                </div>
                <Guardar/>
            </form>
  </div>
    );
  }
  
  export default Observaciones;