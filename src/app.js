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

let info;  // Nodo atual
let eventCount = 0; // contador de eventos local, quando chegar em 100, deve parar
let hosts = [];
let availableHosts = [];
let lamportClock = 0;
let running; // para o intervalo
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
    console.log(colors.cyan, 'COMEÇOU!');
    running = setInterval(startProcess, 60);
  }
});

function startProcess() {
  var localOrSend = Math.random();
  
  if (localOrSend <= info.chance) localOrSend = 2;
  else localOrSend = 1;

  if (localOrSend === 1) { // evento local
    lamportClock += 1;
    lamportClock = Number.parseInt(`${lamportClock}${info.id}`);
    
    console.log(colors.yellow,`id: ${info.id} - lamport: ${lamportClock} - l`);
  }
  else if (localOrSend === 2) { // evento externo
    //falta formatar o restante da mensagem
    //calcular um número aleatorio entre 0 ate length-1
    //de acordo com o numero enviar para esse destino
    //valorRelogio_
    const max = hosts.length - 1;
    const min = 0;
    let receivingNode = Math.floor(Math.random()*(max-min+1)+min);

    const { port, port} = hosts[receivingNode];
    sendMessage(`${lamportClock}`, port, port); // envia o valor do relógio local
   
    console.log(colors.yellow,`id: ${info.id} - lamport: ${lamportClock} - s - ${receivingNode}`);
  }
  eventCount++;

  if(eventCount === 100) {
    clearInterval(running);
    process.exit();
  }
}

function ping(){
  for (let i = 0; i < hosts.length; i++) {
      const { host, port } = hosts[i];
      
      let msg = Buffer.from("ENTREI");
			socket_server.send(msg, port, host, function (err, bytes) {
				console.log("Host indisponível");
			});
  }

  // setInterval(sendMessage, 2000);
}

function sendMessage(msg, port, host){
  socket_server.send(msg, port, host, function (err, bytes) {
    console.log("Host indisponível");
  });
}
