import { IoMdPerson } from "react-icons/io";
import { FaLock } from "react-icons/fa6";
import '../CSS/Ingreso.css';

function IngresoC() {

    return (
  
        <div>
            
        <h1>Ingreso SAOA</h1>
        <form>
            <div class="form-group">
                <label for="username">Usuario:</label>
                <div class="input-wrapper">
                    <span class="material-icons"><IoMdPerson/></span>
                    <input type="text" id="username" name="username" placeholder="Usuario"/>
                    
                </div>
            </div>
            <div class="form-group">
                <label for="password">Contraseña:</label>
                <div class="input-wrapper">
                    <span class="material-icons"><FaLock/></span>
                    <input type="password" id="password" name="password" placeholder="Contraseña"/>
                </div>
            </div>
            <div class="form-group">
                <button type="submit">Ingresar</button>
            </div>
            <div class="form-links">
                <a href="Recuperacion">Olvidé mi contraseña</a>
            </div>
        </form>
    </div>
  )
  }
  
  export default IngresoC;