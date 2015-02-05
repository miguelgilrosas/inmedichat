//InmediChat
//App demo para la clase de DAM.

//Autor: Miguel Gil Rosas.

// Cargamos módulos Node
var express = require('express');
var http = require('http');

// Creamos aplicación, servidor, socket y conexión a MySQL.
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');

// Configuramos la aplicación, ver http://expressjs.com/api.html
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

// Enrutando.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/vista.html');
});

io.sockets.on("connection", function(socket) {

	socket.on("nuevoParticipante", function(data) {
		var conn = mysql.createConnection({
			host: "127.0.0.1",
			user: "root",
			password: "root"
		});
		conn.connect();
		conn.query("use chat");
		conn.query("select * from comentarios", function(err, filas) {
			if (err) {
				throw err;
			}
			else {
				socket.emit("anteriores", {filas: filas});
			}
		});
		conn.end();
	});

	socket.on("nuevoComentario", function(data) {
		var conn = mysql.createConnection({
			host: "127.0.0.1",
			user: "root",
			password: "root"
		});
		conn.connect();
		conn.query("use chat");
		conn.query("insert into comentarios values (null, '"+data.contenido+"')",
				function(err, filas) {
			if (err) {
				throw err;
			}
			else {
				socket.broadcast.emit("broadcastNuevoComentario", {contenido: data.contenido});
			}
		});
		conn.end();
	});

});

//Iniciamos servidor
server.listen(8080); //En producción el puerto debe ser el 80.

console.log('Servidor funcionando en http://localhost:8080');
