'use strict'

$(document).ready(function(){

	// Recuperar canciones
	var canciones = [];
	canciones.push(JSON.parse(localStorage.getItem("favoritos")));
	
	// MOSTRAR CANCIONES
	var resultado = $("#tracks-favoritos");
	$.each(canciones[0], function(index, elemento){
		if(elemento !== null){
			resultado.append(
                '<article>' +
                '<div class="resultado" id="resultado">' +
                '<img class="imagen-track" id="imagen-track" src="' + elemento.images[2].url + '"' + '></img>' +
                '<strong>' + elemento.name + '</strong>' +
                '<p>' + elemento.artists[0].name + '</p>' +
                '<button class="button-favoritos" id='+elemento.id+' onclick="eliminarFavoritos(this.id)">Favoritos <i class="fas fa-minus"></i></button>' +                
                '</div>' +
                '<article>'
			);
		}
    });
});

// QUITAR DE FAVORITOS
function eliminarFavoritos(id){
	let cancion = [];
	cancion.push(JSON.parse(localStorage.getItem("favoritos")));
	var cond = true;
	$.each(cancion[0], function(index, elemento){
		if (id == elemento.id){
			if(index == 1 || index == 0){
				cancion[0].splice(index, 1);
			}else{
				cancion[0].splice(index, index-1);
			}
			localStorage.setItem("favoritos", JSON.stringify(cancion[0]));
			alert("Eliminada de favoritos.");
			return false;
		}
	});
	window.location.reload(true);
}