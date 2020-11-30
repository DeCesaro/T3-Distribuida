/**
 * Autores: Bernardo, Bianca Camargo, Mayara Oliveira e Mathias Gatti
 * Trabalho 3 de Programação Distribuída
 */
"use strict";
/**
 *  dgram é o módulo para trabalhar com Datagram sockets em NodeJS - Para uso na comunicação entre clientes
 * */ 
var dgram = require('dgram');
let socket_server = dgram.createSocket('udp4');
/* ============================================================================== */

/**
 * Lista de hosts disponíveis no arquivo config.txt
 */
let hosts = [];
let availableHosts = [];
/* ================================================================================ */

// Para ler do terminal as solicitações de arquivo
const readline = require('readline');

// Para ler e escrever arquivo
const fs = require('fs');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/** Lendo os argumentos */
const args = process.argv.slice(2);

/** Valores default, se nada for informado por linha de comando */
var fileName = "config.txt";
let configLine = 0;

if(args.length) {
  fileName = args[0];
  configLine = 0;
}


const colors = {
  cyan: '\x1b[36m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
};

showOptions();

async function showOptions() {
  console.log(colors.cyan, '\n*******************\n');
  reader.question('Informe o NOME DO ARQUIVO de configuração e a LINHA para este host OU digite default para usar a configuração padrão', (answer) => {
    if (answer.length) {

      if (answer !== 'default') {
        const info = answer.split(' ');
        fileName = info[0];
        configLine = info[1];
      }

      if (fileName) {
        try {

          const folderName = "files";  
          const dirname = `./src/${folderName}/`;

          let data = fs.readFileSync(`${dirname}${fileName}`, 'utf8').toString().split("\n");
          let info;

          data.forEach((content, index) => {
            const hostsData = content.split(' ');
            if (index == configLine) {
              const lineData = content.split(' ');
              info = {
                id: Number.parseInt(lineData[0]),
                host: lineData[1],
                port: Number.parseInt(lineData[2]),
                chance: Number.parseFloat(lineData[3])
              };

              socket_server.bind(info.port); // define a porta que o socket usa

              console.log(colors.yellow, `informações: - ID: ${info.id} - HOST: ${info.host} - PORT: ${info.port} - CHANCE: ${info.chance}`);
            }

            hosts.push({
              id: Number.parseInt(hostsData[0]),
              host: hostsData[1],
              port: Number.parseInt(hostsData[2]),
              chance: Number.parseFloat(hostsData[3])
            });
          })
          console.log(hosts);
        } catch (error){
          console.error(`❌ Falha ao ler o arquivo ${fileName}`, error);
        }
      }
    }
  });
  console.log(colors.cyan, '\n\n*******************\n');
}

let setup;
socket_server.on('listening', function() {
	setup = setInterval(ping, 50);
});

socket_server.on('message', function(message, remote) {
  let messageContent = message.toString('utf8').trim();

  const fromHost = `${remote.address}:${remote.port}`;
  if (messageContent == 'ENTREI') {
    if(!availableHosts.includes(fromHost))
      availableHosts.push(fromHost);
  }

  if (availableHosts.length == hosts.length) {
    clearInterval(setup);
    console.log('PODE COMEÇAR!');
    // faz as coisas do programa;
  }
});

function startProcess() {
  var localOrSend = Math.random();
  if (localOrSend <= nodo.chance){
      localOrSend = 2;
  }else localOrSend = 1;

  // Local event
  if (localOrSend === 1) {
    clock += clock+1;
    var message = Date.now+''+nodo.id+''+clock+''+nodo.id;
    console.log(message);
  }
  else if (localOrSend === 2) {
    //falta formatar o restante da mensagem
    //calcular um número aleatorio entre 0 ate length-1
    //de acordo com o numero enviar para esse destino
    //valorRelogio_
    var receivingNode = nodes[randomInteger(0,nodes.length-1)];
    var receivingId = receivingNode[0];
    var receivingHost = receivingNode[1];
    var receivingPort = receivingNode[2];

    var syncMsg = new Buffer('s ' + id + ' ' + clock);
    server.send(syncMsg, 0, syncMsg.length, receivingPort, receivingHost, function (err, bytes) {
      if (err) throw err;
    });

    var out = 's ' + receivingId + ' ' + clock
    console.log(out);
  }
  eventCount++;
}

function ping(){
  for (let i = 0; i < hosts.length; i++) {
      const { host, port } = hosts[i];
      
      let msg = Buffer.from("ENTREI");
			socket_server.send(msg, port, host, function (err, bytes) {
				console.log("Host indisponível");
			});
  }

  setInterval(sendMessage, 2000);
}

function sendMessage(){}
