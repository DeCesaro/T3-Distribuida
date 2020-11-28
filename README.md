# T3

Trabalho 3 de Programação Distribuída

Trabalho Prático 3 - O terceiro trabalho da disciplina consiste em desenvolver um programa distribuído que implemente o relógio de Lamport para ordenação de eventos (com ordem total). O programa deve receber como entrada um arquivo de configuração e um número que identifica uma das linhas do arquivo de configuração. Todos os processos devem possuir uma cópia desse arquivo.

Como rodar:

* Instalar [NodeJS](https://nodejs.org/en/);
* Instalar [Yarn](https://yarnpkg.com/) - Página de [instalação](https://classic.yarnpkg.com/en/docs/install/);
* Clonar repo;

Instale as dependencias, se for a primeira vez que estiver executando, na `raiz do projeto`:
```
yarn install
```

Para rodar o servidor, informe o ip do servidor:

```
yarn server 192.168.137.1
```

Em outro terminal, para rodar o cliente
```
yarn client
```

Para executar mais de um cliente você precisa especificar uma `porta` diferente e `ip`:
```
yarn client 8083 192.168.137.1
```

Para especificar o nome da pasta onde estão os arquivos do peer, utilize o último argumento (o default é `files`):
```
yarn client 8083 192.168.137.1 files2
```

Para especificar o IP do servidor, utilize o último argumento (em caso de estar em máquinas diferentes, o IP default é `localhost`):
```
yarn client 8083 192.168.137.1 files2 192.168.137.2
```
