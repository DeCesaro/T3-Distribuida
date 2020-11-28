# T3

Trabalho 3 de Programação Distribuída

Trabalho Prático 3 - O terceiro trabalho da disciplina consiste em desenvolver um programa distribuído que implemente o relógio de Lamport para ordenação de eventos (com ordem total). O programa deve receber como entrada um arquivo de configuração e um número que identifica uma das linhas do arquivo de configuração. Todos os processos devem possuir uma cópia desse arquivo.

Como rodar:

* Instalar [NodeJS](https://nodejs.org/en/);
* Instalar [Yarn](https://yarnpkg.com/) - Página de [instalação](https://classic.yarnpkg.com/en/docs/install/);
* Clonar repo;

Instale as dependências, se for a primeira vez que estiver executando, na `raiz do projeto`:
```
yarn install
```

Para iniciar o host:

```
yarn dev
```
Utilizando as intâncias EC2 da AWS:

Os comandos a seguir são para _Windows_ já que para linux já está descrito na aba de _connect to instance_ do console AWS.

No diretório onde você tem a chave de acesso (_host1.pem_ neste caso) e no _Windows Powershell_:

```
icacls.exe .\host1.pem /reset
```

```
icacls.exe .\host1.pem /grant:r "$($env:username):(r)"
```

```
icacls.exe .\host1.pem /inheritance:r
```

```
ssh -i "host1.pem" ubuntu@ec2-3-93-194-248.compute-1.amazonaws.com
```

Testando a conexão com o _host1_:

```
ping ec2-3-93-194-248.compute-1.amazonaws.com
```
