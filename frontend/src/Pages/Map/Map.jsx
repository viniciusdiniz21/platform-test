import * as React from 'react'
import api from '../../services/api'
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import marker from '../../assets/marker.png'

const customIcon = new L.Icon({
    iconUrl: marker, // Caminho para o ícone personalizado
    iconSize: [35, 35], // Tamanho do ícone
    iconAnchor: [12, 41], // Ponto de ancoragem do ícone (base do ícone)
    popupAnchor: [1, -34], // Ponto de ancoragem do popup em relação ao ícone
    shadowSize: [41, 41], // Tamanho da sombra
  });

function DraggableMarker({
    pos,
    setPositionToSend,
  }) {
    const [position, setPosition] = React.useState(pos);
  
    React.useEffect(() => {
      setPositionToSend(position);
    }, [position]);
  
    const markerRef = React.useRef(null);
    const eventHandlers = React.useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const posit = marker.getLatLng();
            setPosition([posit.lat, posit.lng]);
          }
        },
      }),
      []
    );
  
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={customIcon}
      >
        <Popup minWidth={90} >
          <span>Nova Marcação!</span>
        </Popup>
      </Marker>
    );
  }
  

function Map() {
    const [loading, setLoading] = React.useState(false)
    const [loadingSave, setLoadingSave] = React.useState(false)
    const [posicoes, setPosicoes] = React.useState([])
    const [somaDistancia, setSomaDistancia] = React.useState(0)
    const [position, setPosition] = React.useState([-18, -50])
    const [refresh, setRefresh] = React.useState(false)

    const HandleSave = async (ev) => {
      ev.preventDefault()
      setLoadingSave(true)
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);

      try {
          const response = await api.post("position", {
              latitude: position[0], 
              longitude: position[1],
              date_time: today
          })
          alert('Ponto adicionado')
          setRefresh(!refresh)
          return response
      } catch (error) {
          console.error(error)
      } finally {
        setLoadingSave(false)
      }
  }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
      }
      
      function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        const R = 6371; // Raio da Terra em quilômetros
        const dLat = deg2rad(lat2-lat1);
        const dLon = deg2rad(lon2-lon1); 
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distância em km
        return d;
      }
      
      function calculateDistances(points) {
        let soma = 0;
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const distance = getDistanceFromLatLonInKm(
              points[i].latitude,
              points[i].longitude,
              points[j].latitude,
              points[j].longitude
            );
            soma += distance;
          }
        }
        setSomaDistancia(soma)
      }

    async function GetLocations() {
        setLoading(true)
        try {
            const response = await api.get('/')
            
            setPosicoes(response.data)
            return response
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(()=>{
        GetLocations()
    }, [refresh])

    React.useEffect(()=>{
        if(posicoes.length > 0) {
            calculateDistances(posicoes)
        }
    }, [posicoes])

  return (
    <body>
      <div style={{width:'70vw', margin:'0 auto'}} className='p-4 border-solid border-2 border-indigo-600 rounded-md shadow-lg'>
          <div>
              <h1 className='inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mb-4 text-indigo-700'>Localizações</h1>
          </div>
          <div>
              <h1 className='inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mb-4'>Soma das distâncias entre todos os pontos é {somaDistancia.toFixed(2)} km</h1>
          </div>
          {!loading ? 
              <MapContainer center={[-18, -48]} zoom={6} style={{ height: '500px', width: '100%', }}>
                  <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                      {posicoes.map((pos)=>{
                          console.log(pos)
                          return(
                          <Marker position={[pos.latitude, pos.longitude]}>
                              <Popup>
                                  Ponto do Mapa
                              </Popup>
                          </Marker>
                  )})}
                  <DraggableMarker pos={position} setPositionToSend={setPosition} />
              </MapContainer>  
          : 
          "Carregando..."}
          
          <div>
              <h1 className='inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mt-4'>Arraste o icone de marcação vermelho e clique no botão para salvar um novo ponto no mapa!</h1>
          </div>
          <button
            onClick={(ev)=>{HandleSave(ev)}}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
            >
            {loadingSave ? "Carregando..." : "Salvar"}
          </button>
      </div>
    </body>
  )
}

export default Map