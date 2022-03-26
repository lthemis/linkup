// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LuEvent } from '../../utilities/types/Event';
import eventMarker from '../../assets/IoLocationSharp.svg';
import userMarker from '../../assets/BiCurrentLocation.svg';
import './MapLarge.css';

interface eventProps {
  eventList : LuEvent[];
}

export default function MapLarge({ eventList } : eventProps) {
  // const [events, setEvents] = useState(eventList);

  const events = eventList;

  console.log(events, 'these are the events from the map');

  const mapRef = useRef<any>();
  const markerRef = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      const lat : number = location.coords.latitude;
      const lng : number = location.coords.longitude;
      mapRef.current = L.map('map').setView([lat, lng], 13);

      const myLocationIcon = L.divIcon({
        className: 'my-div-icon',
        html: `<div><img src=${userMarker} alt="marker" style="width:30px;" /></div>`,
      });

      setTimeout(() => {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current);

        L.marker([lat, lng], { icon: myLocationIcon }).addTo(mapRef.current)
          .bindPopup('Current location')
          .openPopup();
      }, 100);

      const myIcon = L.divIcon({
        className: 'my-div-icon',
        html: `<div> <img src=${eventMarker} alt="marker" style="width:30px;"/></div>`,
      });

      events.forEach((event) => {
        const eventLat = typeof event.lat === 'string' ? parseFloat(event.lat) : event.lat;
        const eventLng = typeof event.lng === 'string' ? parseFloat(event.lng) : event.lng;
        const marker = L.marker([eventLat, eventLng], { icon: myIcon }).addTo(mapRef.current).bindPopup(`${event.title} <br> ${event.date}`).openPopup();
      });
    });
  }, []);

  const executedOnce = useRef<boolean>();

  console.log(events, 'After first useEffect');

  useEffect(() => {
    console.log('second useEffect first call');
    if (typeof executedOnce.current === 'undefined') {
      executedOnce.current = true;
      return;
    }

    mapRef.current.eachLayer((layer:any) => {
      console.log(layer, 'Delete Layers');
      mapRef.current.removeLayer(layer);
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapRef.current);

    console.log(events, 'Second layer after tile');

    events.forEach((event) => {
      console.log('Second useEffect, markers');
      const myIcon = L.divIcon({
        className: 'my-div-icon',
        html: `<div data-event-id=${event.id_event}> <img src=${eventMarker} alt="marker" style="width:30px;"/></div>`,
      });
      const eventLat = typeof event.lat === 'string' ? parseFloat(event.lat) : event.lat;
      const eventLng = typeof event.lng === 'string' ? parseFloat(event.lng) : event.lng;
      return L.marker([eventLat, eventLng], { icon: myIcon }).addTo(mapRef.current).bindPopup(`${event.title} <br> ${event.date}`).openPopup();
    });
  }, [eventList]);

  return (

    <div className="map-container">

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <script
        src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossOrigin=""
      />
      <div id="map" />
    </div>
  );
}