'use strict'

window.addEventListener('load', function(){

    var formulario = document.querySelector("#form");
	
    // EXP REG PARA ACEPTAR "a-z" Y "A-Z"
    let expLetras = (/^[A-Za-z]+$/);

    // EXP REG PARA EMAIL
    let expEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
    var cancion, artista, emisor, destinatario, asunto, comentario;
	
    formulario.addEventListener('submit', function(){
		
        var campos = document.getElementById("form").elements;

        // VALIDACION EMISOR
        if(campos[2].value =='' && campos[2].type == 'text'){
			alert("El campo Email emisor es obligatorio");
			return false;
		} else if (!campos[2].value.match(expEmail)) {
			alert("El formato del campo Email emisor no es válido.");
			    return false;
		}

        // VALIDACION DESTINATARIO  
        if(campos[3].value =='' && campos[3].type == 'text'){
			alert("El campo Email destinatario es obligatorio");
			return false;
		} else if (!campos[3].value.match(expEmail)) {
			alert("El formato del campo Email destinatario no es válido.");
			    return false;
		}
		
        // VALIDACION ASUNTO
        if(campos[4].value == '' && campos[4].type == 'text'){
			alert("El campo Asunto es obligatorio.");
			return false;
		} else if (!campos[4].value.match(expLetras)) {
			alert("El formato del campo Asunto no es válido.");
			return false;
		}
		
		var cancion = $("#cancion").val();
		var artista = $("#artista").val();
		var destinatario = $("#destinatario").val();
		var asunto = $("#asunto").val();
		var mensaje = $("#mensaje").val();
		var body = "El artista es: " + artista + "\nLa canción se llama: " + cancion + "\n" + mensaje;

    	document.location.href = "mailto:"+destinatario+"?subject="+asunto+""
        + "&body=" + encodeURIComponent(body);	
	});

    document.getElementById("cancelar").addEventListener("click", function(){
		window.history.back();
	});
});