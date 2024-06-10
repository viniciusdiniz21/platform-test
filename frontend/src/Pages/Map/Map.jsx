import * as React from 'react'
import api from '../../services/api'
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

function Map() {
    const [loading, setLoading] = React.useState(false)
    const [posicoes, setPosicoes] = React.useState([])
    const [somaDistancia, setSomaDistancia] = React.useState(0)

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
    }, [])

    React.useEffect(()=>{
        if(posicoes.length > 0) {
            calculateDistances(posicoes)
        }
    }, [posicoes])

  return (
    <div style={{width:'90vw'}}>
        <div>
            <h1 className='inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mb-4'>Localizações</h1>
        </div>
        {!loading ? 
            <MapContainer center={[-18, -48]} zoom={8} style={{ height: '600px', width: '100%' }}>
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
            </MapContainer>  
         : 
        "Carregando..."}
        <div>
            <h1 className='inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200 mb-4'>Soma das distâncias entre todos os pontos é {somaDistancia.toFixed(2)} km</h1>
        </div>
    </div>
  )
}

export default Map