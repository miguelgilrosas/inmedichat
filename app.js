//InmediChat
//App demo para la clase de DAM.

//Autor: Miguel Gil Rosas.

//Carga módulos Node
var express = require('express');
var http = require('http');

//Crea aplicación, servidor, socket y conexión a MySQL.
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');

//Configura la aplicación, ver http://expressjs.com/api.html
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

//Enruta.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/vista.html');
});

//Crea controladores de eventos.

//Cuando el cliente inicie el socket...
io.sockets.on("connection", function(socket) {

	//Cuando se reciba mensaje "nuevoParticipante" (que envían
	//los clientes cuando se conectan)...
	socket.on("nuevoParticipante", function(data) {
		
		//Como el cliente es nuevo hay que mandarle todos los comentarios anteriores.
		
		//Crea conexión con BD.
		var conn = mysql.createConnection({
			
			//La BD es local.
			host: "127.0.0.1",
			
			//Se debería crear un usuario para la aplicación y no usar root.
			user: "root",
			
			//Usar esta clave es de juzgado de guardia.
			password: "root"
		});
		
		//Se conecta a la BD.
		conn.connect();
		
		//Hace consulta.
		conn.query("use chat");
		
		//Hace consulta y procesa el resultado.
		conn.query("select * from comentarios", function(err, filas) {
			if (err) {
				throw err;
			}
			else {
				//Si no hay error, envía los comentarios antiguos
				//al nuevo cliente.
				socket.emit("anteriores", {filas: filas});
			}
		});
		
		//Termina la conexión con la BD.
		conn.end();
	});

	//Cuando llegue el mensaje "nuevoComentario" (lo envía el cliente porque 
	//tiene un comentario nuevo)...
	socket.on("nuevoComentario", function(data) {
		
		//Si el cliente tiene un comentario nuevo, hay que guardarlo y avisar
		//a todos los demás.
		
		//BD
		var conn = mysql.createConnection({
			host: "127.0.0.1",
			user: "root",
			password: "root"
		});
		conn.connect();
		conn.query("use chat");
		
		//Inserta nuevo comentario en la BD.
		conn.query("insert into comentarios values (null, '"+data.contenido+"')",
				function(err, filas) {
			if (err) {
				throw err;
			}
			else {
				//Envía un mensaje a todos los demás clientes, no a éste.
				socket.broadcast.emit("broadcastNuevoComentario", {contenido: data.contenido});
			}
		});
		conn.end();
	});

});

//Iniciamos servidor
server.listen(8080); //En producción el puerto debe ser el 80.

console.log('Servidor funcionando en http://localhost:8080');
