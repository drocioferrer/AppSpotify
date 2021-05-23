'use strict'
$(document).ready(function(){

	// RECUPERAR HISTORIAL
	var claves = [];
	claves.push(JSON.parse(localStorage.getItem("historial")));
	
	// MOSTRAR HISTORIAL
	var resultado = $("#busquedas");

    claves[0].forEach(elemento => resultado.append(
        '<li class="clave-historial"><a href="#" class="buscar" id='+elemento+' onclick="buscarHistorial()">'+elemento+'</a></li><br>'
    ));
});

async function buscarHistorial() {
    $('.buscar').click(function () {       
        buscarTrack(this.id);
    });
};

async function obtenerToken() {
    var clientId = '62c57ef8558240979a545421a5de70d2';
    var clientSecret = '15752533971743af93e6d705aea177c2';
    var result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    var data = await result.json();
    return data.access_token;
};

async function buscarTrack(clave) {

    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/search?q=' + clave + '&type=track&market=US&limit=10&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    var resultadosTrack = $("#resultados-track");
    document.querySelector("#resultados-track").innerHTML = '';
    $.each(data.tracks.items, function (index, elemento) {
        mostrarTrack(resultadosTrack, elemento.id, elemento.album.images[2].url, elemento.name, elemento.artists[0].name, elemento.duration_ms, elemento.album.release_date);
    });
};

function mostrarTrack(resultadosTrack, id, imagen, name, artist, duration, release_date) {
    var link = "compartir.html";
    resultadosTrack.append(
        '<article>' +
        '<div class="resultado" id="resultado">' +
        '<img class="imagen-track" id="imagen-track" onclick="verDetalle()" src="' + imagen + '"' + '></img>' +
        '<strong>' + name + '</strong>' +
        '<div class="detalle-oculto" id="detalle-oculto">' +
        '<p>By: ' + artist + '</p>' +
        '<p>' + convertirDuracion(duration) + ' min</p>' +
        '<p>Año: ' + (release_date).substr(0, 4) + '</p>' +
        '</div>' +
        '</div>' +
        '<article>'
    );
};

function convertirDuracion(milisegundos) {

    function addZ(n) {
        return (n < 10 ? '0' : '') + n;
    }

    var ms = milisegundos % 1000;
    milisegundos = (milisegundos - ms) / 1000;
    var secs = milisegundos % 60;
    milisegundos = (milisegundos - secs) / 60;
    var mins = milisegundos % 60;

    return addZ(mins) + ':' + addZ(secs);
};

async function verDetalle() {
    /*VER DETALLE TRACK*/
    $('.imagen-track').click(function () {       
        if($(this).siblings('div').css('display') === 'none'){
            $(this).siblings('div').css('display', 'block');
        } else {
            $(this).siblings('div').css('display', 'none');
        }
    });
};