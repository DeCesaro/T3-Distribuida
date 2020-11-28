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
var socket_server = dgram.createSocket('udp4');
/*** */

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
          
          /* for(let index in data) {
            if(index == configLine) {
              hostData = data[index].replace('\r', '').split('\n');
              const info = hostData[0].split('\n');

              const id = info[0];
              const host = info[1];
              const port = info[2];
              const chance = info[3];

              if(info.length) {
                console.log('info ', info);
                console.log(`ID: ${info[0]} \n HOST: ${info[1]} \n PORT: ${info[2]} \n CHANCE: ${info[3]}`);
              }
            }
          } */
        } catch (error){
          console.error(`❌ Falha ao ler o arquivo ${fileName}`, error);
        }
      }
    }

    showOptions();
  });
  console.log(colors.cyan, '\n\n*******************\n');
}
