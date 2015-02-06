$(function() {
	
	//Primero crea el socket.
	var socket = io.connect(window.location.href);
	
	//Después crea los controladores de eventos.
	
	//Cuando se haga click en el botón de enviar...
	$(".form-boton").on("click", function(e) {
		
		//Evita que la página se recargue.
		e.preventDefault();
		
		//Crea una referencia a la caja de texto del formulario.
		var $formNuevo=$(".form-nuevo");
		
		//Toma el valor del formulario.
		var contenido=$formNuevo.val();
		
		//Si hay contenido...
		if (contenido!="") {
			
			//Emite un mensaje de tipo "nuevoComentario" al servidor y
			//le envía el contenido del formulario.
			socket.emit("nuevoComentario", {contenido: contenido});
			
			//Crea una referencia al "section.comentarios".
			var $comentarios=$(".comentarios")[0];
			
			//Y le inserta al principio el nuevo comentario.
			$comentarios.innerHTML="<div class='comentarios-item'>"+contenido+"</div>"+$comentarios.innerHTML;
		}
		//Borra el contenido del formulario.
		$formNuevo.val("");
	});

	//Cuando se reciba un mensaje "anteriores" (lo envía el servidor con los comentarios hasta ahora).
	socket.on("anteriores", function(data) {
		
		//Crea una cadena de texto con la defición HTML de los comentarios recibidos.
		var html="";
		for (var n=0; n<data.filas.length; n++) {
			html = "<div class='comentarios-item'>"+data.filas[n].contenido+
				"</div>"+html;
		}
		
		//Y la inserta en el "section.comentarios".
		$(".comentarios")[0].innerHTML=html;
	});

	//Cuando se reciba el mensaje "broadcastNuevoComentario" (lo envía el servidor porque algún otro ha añadido
	//un comentario).
	socket.on("broadcastNuevoComentario", function(data) {
		
		//Lo añade al "section.comentarios".
		var $comentarios=$(".comentarios")[0];
		$comentarios.innerHTML="<div class='comentarios-item'>"+data.contenido+"</div>"+$comentarios.innerHTML;
	});

	//Finalmente, avisa al servidor de que hay un nuevo participante.
	socket.emit("nuevoParticipante", {});
});
