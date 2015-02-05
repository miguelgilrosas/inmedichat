$(function() {
	var socket = io.connect(window.location.href);

	$(".form-boton").on("click", function(e) {
		e.preventDefault();
		var $formNuevo=$(".form-nuevo");
		var contenido=$formNuevo.val();
		if (contenido!="") {
			socket.emit("nuevoComentario", {contenido: contenido});
			var $comentarios=$(".comentarios")[0];
			$comentarios.innerHTML="<div class='comentarios-item'>"+contenido+"</div>"+$comentarios.innerHTML;
		}
		$formNuevo.val("");
	});

	socket.on("anteriores", function(data) {
		var html="";
		for (var n=0; n<data.filas.length; n++) {
			html = "<div class='comentarios-item'>"+data.filas[n].contenido+
				"</div>"+html;
		}
		$(".comentarios")[0].innerHTML=html;
	});

	socket.on("broadcastNuevoComentario", function(data) {
		var $comentarios=$(".comentarios")[0];
		$comentarios.innerHTML="<div class='comentarios-item'>"+data.contenido+"</div>"+$comentarios.innerHTML;
	});

	socket.emit("nuevoParticipante", {});
});


//socket.broadcast.emit("evento", data)