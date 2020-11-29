/**
 * Autores: Bernardo, Bianca Camargo, Mayara Oliveira e Mathias Gatti
 * Trabalho 3 de Programação Distribuída
 */
"use strict";
import readConfigFile from './utils/readConfigFile';
/**
 *  dgram é o módulo para trabalhar com Datagram sockets em NodeJS - Para uso na comunicação entre clientes
 * */ 
var dgram = require('dgram');
const os = require('os');
const socket_server = dgram.createSocket({ type:'udp4', reuseAddr: true});
/*** */
/* ============================================================================== */
const multicastAddress = '239.42.42.42';
const multicastPort = 9001;

socket_server.on('error', error => console.log(`Socket error: ${error}`));
socket_server.on('listening', setupSocket);
socket_server.on('message', handleMessage);

socket_server.bind(multicastPort);


function handleMessage(message, rInfo){
	console.log(`Received ${message} from ${JSON.stringify(rInfo)}`);
}

function sendMessage(){
	let message = JSON.stringify({ name: os.hostname() });
	let data = Buffer.from(message);
	socket_server.send(data, 0, data.length, multicastPort, multicastAddress, () => console.log(`Message sent.`));
}

function setupSocket(){
	let interfaces = os.networkInterfaces();
	
	console.log(`Listening on ${JSON.stringify(socket_server.address())}`);
	
	socket_server.setMulticastLoopback(false);
	
	for(let interfaceName in interfaces){
		console.log(`Adding memberships for interface ${interfaceName}`);
		
		//Loop through all addresses.
		for(let interfaceAddress of interfaces[interfaceName]){
			//Some network adapters (for example, that VirtualBox creates)
			//cause EINVAL errors when adding multicast membership. 
			try {
				if(interfaceAddress.family == 'IPv4' && !interfaceAddress.internal){
					socket_server.addMembership(multicastAddress, interfaceAddress.address);
				}
			}
			catch(error) {
				console.log(`Error adding socket membership: ${JSON.stringify(error)}`);
			}
		}
	}
  setInterval(sendMessage, 2000);
}

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
            if (index == configLine) {
              const lineData = content.split(' ');
              info = {
                id: Number.parseInt(lineData[0]),
                host: lineData[1],
                port: Number.parseInt(lineData[2]),
                chance: Number.parseFloat(lineData[3])
              };

              console.log(colors.yellow, `informações: - ID: ${info.id} - HOST: ${info.host} - PORT: ${info.port} - CHANCE: ${info.chance}`);
            }
          })
        } catch (error){
          console.error(`❌ Falha ao ler o arquivo ${fileName}`, error);
        }
      }
    }

    showOptions();
  });
  console.log(colors.cyan, '\n\n*******************\n');
}
