'use strict'

function mostrarSaludo() {
    var fecha = new Date();
    var hora = fecha.getHours();
    var texto;

    if(hora >= 0 && hora < 12) {
        texto = "¡Buenos días!";
    }
    if(hora >= 12 && hora < 19) {
        texto = "¡Buenas tardes!";
    }
    if(hora >= 19 && hora < 24) {
        texto = "¡Buenas noches!";
    }

    document.getElementById('txtSaludo').innerHTML = texto;
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

async function buscarLanzamientos() {

    var colores = ['rgb(39, 133, 106)','rgb(141, 103, 171)','rgb(232, 17, 91)',
    'rgb(20, 138, 8)','rgb(245, 155, 35)'];

    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/browse/new-releases?country=US&limit=5&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    var resultadosLanzamientos = $("#resultados-lanzamientos");
    $.each(data.albums.items, function (index, elemento) {
        mostrarLanzamientos(resultadosLanzamientos, elemento.artists[0].name, elemento.images[1].url, 
            elemento.name, colores[index]);
    });
    
};

function mostrarLanzamientos(resultadosLanzamientos, artista, imagen, name, color) {
    resultadosLanzamientos.append(

        '<article>' +
        '<div class="resultado" id="resultado" style="background-color:'+color+';">' +
        '<img class="imagen-track" id="imagen-track" src="' + imagen + '"' + '></img>' +
        '<strong>' + name + '</strong>' +
        '<p>' + artista + '</p>' +
        '</div>' +
        '<article>'
    );
};

async function buscarDestacadas() {

    var colores = ['rgb(225, 51, 0)','rgb(220, 20, 140)','rgb(13, 115, 236)','rgb(140, 25, 50)',
    'rgb(255, 200, 100)'];
    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/browse/featured-playlists?country=SE&timestamp=2021-05-22T09%3A00%3A00.000Z&limit=5&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    var resultadosDestacadas = $("#resultados-destacadas");
    $.each(data.playlists.items, function (index, elemento) {
        mostrarDestacadas(resultadosDestacadas, elemento.name, elemento.images[0].url, elemento.description, colores[index]);
    });
    
};

function mostrarDestacadas(resultadosDestacadas, name, imagen, description, color) {
    resultadosDestacadas.append(
        '<article>' +
        '<div class="resultado" id="resultado"style="background-color:'+color+';">'+
        '<img class="imagen-track" id="imagen-track" src="' + imagen + '"' + '></img>' +
        '<strong>' + name + '</strong>' +
        '<p>' + description + '</p>' +
        '</div>' +
        '<article>'
    );
};

$(document).ready(function () {
    buscarLanzamientos();
    buscarDestacadas();
});