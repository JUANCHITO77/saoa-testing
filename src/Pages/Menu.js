import '../CSS/MenuP.css';

function Menu() {
  return (
    <div className="menu-container">
        <div className="video-container">
            <h2>Más sobre OPADI</h2>
            <iframe width="100%"
                height="100%" 
                src="https://www.youtube.com/embed/ca_wKmUKGTo?si=2r64IMOHRh1g2jjJ" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
            </iframe>
        </div>
    </div>
  );
}

export default Menu;