'use strict';

const DEBUG = process.env.DEBUG;
const HOME = process.env.HOME;
const DEFAULT_SUITE_NAME = "EM-SSL-Decoder"; ;
const DEFAULT_EMSSL_PORT = '4000';

let SUITE_NAME = process.env.SUITE_NAME || DEFAULT_SUITE_NAME;
let EMSSL_PORT = process.env.EMSSL_PORT || DEFAULT_EMSSL_PORT;
let SUITE_AUTHOR = 'LinhoSan';
let SUITE_AUTHOR_URL = 'https://bitbucket.org/LinhoSan/cm_underscore/';

const os = require("os");
const express = require ('express');
const multer = require('multer');
const app = express();
const favicon = require('serve-favicon');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');








const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const wlFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${label}] ${message}`;
});

const wlLog = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'INFO' }),
    timestamp({format: 'YYYYMMDD HH:mm:ss'}),
    wlFormat
  ),
  transports: [new transports.Console()]
});
const wlError = createLogger({
  level: 'error',
  format: combine(
    label({ label: 'ERROR' }),
    timestamp({format: 'YYYYMMDD HH:mm:ss'}),
    wlFormat
  ),
  transports: [new transports.Console()]
});
const wlDebug = createLogger({
  level: 'debug',
  format: combine(
    label({ label: 'DEBUG' }),
    timestamp({format: 'YYYYMMDD HH:mm:ss'}),
    wlFormat
  ),
  transports: [new transports.Console()]
});








let connections = [];
server.listen(EMSSL_PORT);

_log(SUITE_NAME, 'Startup', 'Suite Name');
_log('Running on port '+ EMSSL_PORT, 'Startup', 'Status' );

//app.use(favicon(path.join(__dirname, 'img', 'favicon.ico')));
app.use('/favicon.ico', express.static('/img/favicon.ico'));

app.use("/css",  express.static(__dirname + '/css'));
app.use("/img",  express.static(__dirname + '/img'));
app.use("/js",  express.static(__dirname + '/js'));
app.use("/views",  express.static(__dirname + '/views'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});



















function getGlobal(socket) {
	// Esempio: { EMSSL_PORT: '4003', SUITE_NAME: 'EM_SSL_Decoder', SUITE_AUTHOR: 'LinhoSan', SUITE_AUTHOR_URL: 'https://bitbucket.org/LinhoSan/' };
	
	let g = { EMSSL_PORT: EMSSL_PORT, SUITE_NAME: SUITE_NAME, SUITE_AUTHOR: SUITE_AUTHOR, SUITE_AUTHOR_URL: SUITE_AUTHOR_URL };
    _debug  ('', 'getGlobal_Return', 'socket.emit', g);
	socket.emit('getGlobal_Return', g);
}








function crt_Decode(socket, data) {	
	// Esempio:
	//    OK: {  "CN": "Symantec Class 3 Secure Server CA - G4",  "Issuer": "VeriSign Class 3 Public Primary Certification Authority - G5",  "NotBefore": "31 Oct 2013",  "NotAfter": "30 Oct 2023",  "Is_CA": "TRUE",  "Modulus": "B2D805CA1C742DB5175639C54A520996E84BD80CF1689F9A422862C3A530537E5511825B037A0D2FE17904C9B496771981019459F9BCF77A9927822DB783DD5A277FB2037A9C5325E9481F464FC89D29F8BE7956F6F7FDD93A68DA8B4B82334112C3C83CCCD6967A84211A22040327178B1C6861930F0E5180331DB4B5CEEB7ED062ACEEB37B0174EF6935EBCAD53DA9EE9798CA8DAA440E25994A1596A4CE6D02541F2A6A26E2063A6348ACB44CD1759350FF132FD6DAE1C618F59FC9255DF3003ADE264DB42909CD0F3D236F164A8116FBF28310C3B8D6D855323DF1BD0FBD8C52954A16977A522163752F16F9C466BEF5B509D8FF2700CD447C6F4B3FB0F7",  "Modulus_MD5": "ab5be2ac028f8e2e8a37e5f4baf3a005"}
	//    Fail: Il formato del certificato non e' valido!
	//    Usage: getInfo <fileName.crt>
	
	fs.writeFileSync('/tmp/dummy.crt', data, { mode: 0o755 });
    _debug  ('OK'		, 'crt_Decode', 'writeFileSync: Status');
		
	const child = child_process.spawnSync(HOME + '/bin/getInfo', [ '/tmp/dummy.crt' ]);
	
	let cRet = child.stdout.toString().trim() ;
	let cStatus  = cRet.substr( 0, cRet.indexOf(':') ).trim();
	let cMessage = cRet.substr( cRet.indexOf(':') + 2 ).trim();
	
	if (cStatus == 'Fail')
	{
	    _error(cStatus	, 'crt_Decode', 'getInfo: Status');
	    _error(cMessage	, 'crt_Decode', 'getInfo: Message');
	    _error(''	, 'crt_Decode', 'getInfo: Payload', data);
		cm_Avvisi('crt_Decode => getInfo', cStatus, cMessage, socket);
	}
	else if (cStatus == 'OK')
	{
		try {
			let ret = JSON.parse( cMessage );
		    _log(cStatus			, 'crt_Decode', 'getInfo: Status');
		    _debug(ret.CN			, 'crt_Decode', 'getInfo: Message: CN');
		    _debug(ret.Issuer		, 'crt_Decode', 'getInfo: Message: Issuer');
		    _debug(ret.NotBefore	, 'crt_Decode', 'getInfo: Message: NotBefore');
		    _debug(ret.NotAfter		, 'crt_Decode', 'getInfo: Message: NotAfter');
		    _debug(ret.Is_CA		, 'crt_Decode', 'getInfo: Message: Is_CA');
		    _debug(ret.Modulus		, 'crt_Decode', 'getInfo: Message: Modulus');
		    _debug(ret.Modulus_MD5	, 'crt_Decode', 'getInfo: Message: Modulus_MD5');
    		_debug  ('', 'crt_Decode_Return', 'socket.emit', ret);
			socket.emit('crt_Decode_Return', ret);
			
		} catch (err) {
			cm_Exception('crt_Decode', err, socket);
		}
	}	
}














io.sockets.on('connection', function (socket) {
	connections.push(socket);
	_debug(`Connections: ${connections.length}`, 'io.sockets.on', 'NEW');
	_debug(`ID: ${socket.id}`, 'io.sockets.on', 'NEW');

	socket.on('disconnect', function (data){
		connections.splice(connections.indexOf(socket), 1);
		_debug(`Connections: ${connections.length}`, 'io.sockets.on', 'DISCONNECT');
		_debug(`ID: ${socket.id}`, 'io.sockets.on', 'DISCONNECT');
	});
	
	
	
	
	socket.on('getGlobal', function (data) {
		_debug('', 'socket.on', 'getGlobal' );
		getGlobal(socket)
	});
	socket.on('crt_Decode', function (data) {
		_debug(data, 'socket.on', 'crt_Decode' );
		crt_Decode(socket, data)
	});
	
});








function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function truncate(string, length) {
	return string.length > length ? 
    	string.substring(0, length) + ' [...]' :
    	string;
};

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
function cm_Exception(func, err, socket) {
	
	let ret = [];
	ret = {	FUNCTION: func || '' ,
			 MESSAGE: err.message || '',
		 	   STACK: err.stack || '',
		 	    CODE: err.code || '',
		 	   ERRNO: err.errno || '',
		 	    PATH: err.path || ''
		 	    };
	
	_log  (ret.FUNCTION,	'cm_Exception', 'FUNCTION');
	_log  (ret.MESSAGE,		'cm_Exception', 'MESSAGE');
	_log  (ret.STACK,		'cm_Exception', 'STACK');
	_log  (ret.CODE,		'cm_Exception', 'CODE');
	_log  (ret.ERRNO,		'cm_Exception', 'ERRNO');
	_log  (ret.PATH,		'cm_Exception', 'PATH');
	
	_error  ('', 'cm_Exception', 'socket.emit', ret);
	socket.emit('cm_Exception', ret);
}
function cm_Avvisi(func, status, message, socket) {
	
	let ret = [];
	ret = {	FUNCTION: func || '' ,
			  STATUS: status || '' ,
			 MESSAGE: message || ''
		 	    };
	
	_debug  (ret.FUNCTION,	'cm_Avvisi', 'FUNCTION');
	_debug  (ret.STATUS,		'cm_Avvisi', 'STATUS');
	_debug  (ret.MESSAGE,		'cm_Avvisi', 'MESSAGE');
	
	_debug  ('', 'cm_Avvisi', 'socket.emit', ret);
	socket.emit('cm_Avvisi', ret);
}















function _log(messaggio, label1, label2, json) {

	// Esempi:
	// let prova = { A: 'A', B: 'B', C: 'C' };
    //  _log  ('Mess');
    //  _log  ('Mess', 'lbl1');
    //  _log  ('Mess', 'lbl1', 'lbl2');
    //  _log  ('Mess', 'lbl1', 'lbl2', prova);
    //  _log  ('Mess', '', '', prova);
    //  _log  ('Mess', 'lbl1', '', prova);
    //  _log  ('Mess', '', 'lbl2', prova);
    
	wlLog.info(   (label1 ? '[' +label1+ ']' : '')
				+ (label2 ? ' [' +label2+ ']' : '')
				, { message: truncate(messaggio, 130) 
						+ (messaggio.length > 0 ? ' ': '') 
						+ (json ? '[JSON] ' +JSON.stringify(json) : '') 
				  });
}
function _error(messaggio, label1, label2, json) {

	// Esempi:
	// let prova = { A: 'A', B: 'B', C: 'C' };
    //  _error('Mess');
    //  _error('Mess', 'lbl1');
    //  _error('Mess', 'lbl1', 'lbl2');
    //  _error('Mess', 'lbl1', 'lbl2', prova);
    //  _error('Mess', '', '', prova);
    //  _error('Mess', 'lbl1', '', prova);
    //  _error('Mess', '', 'lbl2', prova);
    
	wlError.error(    (label1 ? '[' +label1+ ']' : '')
					+ (label2 ? ' [' +label2+ ']' : '')
					, { message: messaggio
							+ (messaggio.length > 0 ? ' ': '') 
							+ (json ? '[JSON] ' +JSON.stringify(json) : '') 
					  });
}
function _debug(messaggio, label1, label2, json) {

	// Esempi:
	// let prova = { A: 'A', B: 'B', C: 'C' };
    //  _debug('Mess');
    //  _debug('Mess', 'lbl1');
    //  _debug('Mess', 'lbl1', 'lbl2');
    //  _debug('Mess', 'lbl1', 'lbl2', prova);
    //  _debug('Mess', '', '', prova);
    //  _debug('Mess', 'lbl1', '', prova);
    //  _debug('Mess', '', 'lbl2', prova);
    
	if (DEBUG == 'YES')
		wlDebug.debug(    (label1 ? '[' +label1+ ']' : '')
						+ (label2 ? ' [' +label2+ ']' : '')
						, { message: messaggio 
								+ (messaggio.length > 0 ? ' ': '') 
								+ (json ? '[JSON] ' +JSON.stringify(json) : '') 
						  });
}


