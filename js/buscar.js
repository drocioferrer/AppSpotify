'use strict'
var clave;
var type;
var favorito = [];
var historial = [];
var compartido = [];

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
        '<a href=' + link + '><button class="button-compartir" id=' + id + '>Compartir <i class="fas fa-share"></i></button></a>' +
        '<button class="button-favoritos" id=' + id + ' onclick="favoritos(this.id)">Favoritos <i class="fas fa-plus"></i></button>' +
        '</div>' +
        '</div>' +
        '<article>'
    );
};

function mostrarArtista(detalleArtista, name, imagen) {

    detalleArtista.append(
        '<article>' +
        '<div class="resultado">' +
        '<img class="imagen-artist" id="imagen-artist" src="' + imagen + '"' + '></img>' +
        '<strong>' + name + '</strong>' +
        '</div>' +
        '<article>'
    );
};

async function buscarTrack() {

    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/search?q=' + clave + '&type=track&market=US&limit=10&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    if (data.tracks.total > 0) {
        $("#encabezado-track").append(
            '<h2>Canciones</h2>'
        );
    }

    var resultadosTrack = $("#resultados-track");
    $.each(data.tracks.items, function (index, elemento) {
        mostrarTrack(resultadosTrack, elemento.id, elemento.album.images[2].url, elemento.name, elemento.artists[0].name, elemento.duration_ms, elemento.album.release_date);
    });

    if (data.tracks.total > 10) {
        resultadosTrack.append(
            '<button class="verMasTracks" id="verMasTracks" onclick="verMasTracks();">Ver más</button>'
        );
    }
};

async function verMasTracks() {

    $("#verMasTracks").hide()
    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/search?q=' + clave + '&type=track&market=US&limit=10&offset=10', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    var resultadosTrack = $("#resultados-track");
    $.each(data.tracks.items, function (index, elemento) {
        mostrarTrack(resultadosTrack, elemento.id, elemento.album.images[2].url, elemento.name, elemento.artists[0].name, elemento.duration_ms, elemento.album.release_date);
    });

};

async function buscarArtista() {

    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/search?q=' + clave + '&type=artist&market=US&limit=10&offset=0', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    if (data.artists.total > 0) {
        $("#encabezado-artista").append(
            '<h2>Artistas</h2>'
        );
    }

    var detalleArtista = $("#resultados-artista");

    $.each(data.artists.items, function (index, elemento) {
        mostrarArtista(detalleArtista, elemento.name, elemento.images[0].url);
    });

    if (data.artists.total > 10) {
        detalleArtista.append(
            '<button class="verMasArtistas" id="verMasArtistas" onclick="verMasArtistas();">Ver más</button>'
        );
    }
};

async function verMasArtistas() {
    $("#verMasArtistas").hide()
    var token = await obtenerToken();
    var result = await fetch('https://api.spotify.com/v1/search?q=' + clave + '&type=artist&market=US&limit=10&offset=10', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    var detalleArtista = $("#resultados-artista");

    $.each(data.artists.items, function (index, elemento) {
        mostrarArtista(detalleArtista, elemento.name, elemento.images[0].url);
    });
};

async function compartir(id) {
    var compartidos = JSON.parse(localStorage.getItem("comp"));
        if (compartidos !== null) {
            compartido = compartidos.slice();
        }
        compartido.push(id);
        localStorage.setItem("comp", JSON.stringify(compartido));
};

async function compartirrr(elemento) {
    var cond = true;
    var canciones = JSON.parse(localStorage.getItem("favoritos"));
    if (canciones !== null) {
        favorito = canciones.slice();
    }
    var token = await obtenerToken();
    var result = await fetch("https://api.spotify.com/v1/tracks/" + elemento + "?market=US", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    $.each(favorito, function (index, elemento) {
        if (elemento != null) {
            if (data.album.id == elemento.id) {
                cond = false;
                alert("La canción no se ha podido agregar a favoritos. Puede ser que ya esté agregada.");
            }
        }
    });
    if (cond == true) {
        favorito.push(data.album);
        localStorage.setItem("favoritos", JSON.stringify(favorito));
        alert("Añadida a favoritos");
    }
};

async function favoritos(elemento) {
    var cond = true;
    var canciones = JSON.parse(localStorage.getItem("favoritos"));
    if (canciones !== null) {
        favorito = canciones.slice();
    }
    var token = await obtenerToken();
    var result = await fetch("https://api.spotify.com/v1/tracks/" + elemento + "?market=US", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    var data = await result.json();

    $.each(favorito, function (index, elemento) {
        if (elemento != null) {
            if (data.album.id == elemento.id) {
                cond = false;
                alert("La canción no se ha podido agregar a favoritos. Puede ser que ya esté agregada.");
            }
        }
    });
    if (cond == true) {
        favorito.push(data.album);
        localStorage.setItem("favoritos", JSON.stringify(favorito));
        alert("Añadida a canciones favoritas");
    }
};

$(document).ready(function () {

    let Checked = null;
    // VERIFICAR EL FILTRO SELECCIONADO
    for (let CheckBox of document.getElementsByClassName('only-one')) {
        CheckBox.onclick = function () {
            if (Checked != null) {
                Checked.checked = false;
                Checked = CheckBox;
            }
            Checked = CheckBox;
        }
    }

    var formulario = document.querySelector("#formulario");

    formulario.addEventListener('submit', function () {

        type = null;

        document.querySelector("#resultados-track").innerHTML = '';
        document.querySelector("#resultados-artista").innerHTML = '';
        document.querySelector("#encabezado-track").innerHTML = '';
        document.querySelector("#encabezado-artista").innerHTML = '';

        $('input[type=checkbox]:checked').each(function () {
            type = $(this).val();
        });

        var campos = document.getElementById("formulario").elements;
        clave = campos[0].value;
        
        // HISTORIAL
        var claves = JSON.parse(localStorage.getItem("historial"));
        if (claves !== null) {
            historial = claves.slice();
        }
        historial.push(clave);
        localStorage.setItem("historial", JSON.stringify(historial));

        if (type == null) {
            buscarArtista();
            buscarTrack();
        } else if (type == "track") {
            buscarTrack();
        } else if (type == "artist") {
            buscarArtista();
        }

    });

});

async function verDetalle() {
    // VER DETALLE TRACK
    $('.imagen-track').click(function () {       
        if($(this).siblings('div').css('display') === 'none'){
            $(this).siblings('div').css('display', 'block');
        } else {
            $(this).siblings('div').css('display', 'none');
        }
    });
};