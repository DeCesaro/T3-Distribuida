/**
 * Autores: Bernardo, Bianca Camargo, Mayara Oliveira e Mathias Gatti
 * Trabalho 3 de Programação Distribuída
 */

const fs = require('fs');

let folderName = "files";  

const dirname = `./src/${folderName}/`;
const readConfigFile = (fileName = "config.txt") => {
  fs.readFile(`${dirname}${fileName}`, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
};

export default readConfigFile;