import '../CSS/ServiciosT.css';

function Servicios_Totem() {
  return (
    <div className='public-page-wrapper'>
      <div className="services-container">
        <h1>¿Qué opción deseas elegir?</h1>
        <ul>
            <li><a href="#">Confirmar cita asignada</a></li>
            <li><a href="#">Otros servicios OPADI</a></li>
        </ul>
        <div className="footer">
            <p>SAOA - Sistema Agendamiento Opadi Antioquia</p>
        </div>
      </div>
    </div>
  );
}

export default Servicios_Totem;