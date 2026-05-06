import '../CSS/Otros_Servicios.css';

function Otros_Servicios() {
  return (
    <div className='public-page-wrapper'>
      <div className="others-container">
        <h1>Otros Servicios</h1>
        <ul>
            <li><a href="#">Entrega Documentos</a></li>
            <li><a href="#">Servicio Domiciliario</a></li>
            <li><a href="#">Puesto de Información</a></li>
            <li><a href="#">Atención Prioritaria</a></li>
            <li><a href="#">Certificado Nacionalidad</a></li>
        </ul>
        <div className="footer">
            <p>SAOA - Sistema Agendamiento Opadi Antioquia</p>
        </div>
      </div>
    </div>
  );
}

export default Otros_Servicios;