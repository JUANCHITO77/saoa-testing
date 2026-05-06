import '../CSS/Totem.css';

function Totem_Cliente() {

    return (

        <div class="totem-container">
        <div class="left-side">
            <h1>SAOA</h1>
            <p>Sistema Agendamiento Opadi Antioquia</p>
            <p>Módulo de Confirmación de Citas y Otras Atenciones</p>
        </div>

        <div class="right-side">
            <h2>Ingrese su número de documento</h2>
            <form>
                <div class="form-group">
                    <input type="text" id="documento" name="documento" placeholder="Número de documento" />
                </div>
                <div class="button-group">
                    <button type="button" class="number-button">1</button>
                    <button type="button" class="number-button">2</button>
                    <button type="button" class="number-button">3</button><br />
                    <button type="button" class="number-button">4</button>
                    <button type="button" class="number-button">5</button>
                    <button type="button" class="number-button">6</button><br />
                    <button type="button" class="number-button">7</button>
                    <button type="button" class="number-button">8</button>
                    <button type="button" class="number-button">9</button><br />
                    <button type="button" class="number-button">0</button>
                </div>
                <div class="form-group">
                    <button type="submit" class="validate-button">Validar</button>
                </div>
            </form>
        </div>
    </div>

    )
}
export default Totem_Cliente;