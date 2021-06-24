
# Esquilos pretos em NewYork


## Olá meu povo, é isso mesmo, vamos encontrar esquilos raros em NY usando Node e Js.

São raros pois apenas 1 em cada 10.000 esquilos é preto.
<br>  
<br>  
## Ta, mas e como faremos isso?

Primero precisamos de um dataset com os avistamentos de esquilos em NY, podemos pegar esta informação de um site que possui datasets de NY, através do seguinte link.

[https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw/data](https://data.cityofnewyork.us/Environment/2018-Central-Park-Squirrel-Census-Squirrel-Data/vfnx-vebw/data)
<br>  
<br>
## Com o dataset em mãos, podemos começar nosso projeto.

1.  Criamos uma pasta com nome qualquer
2.  Abrimos a pasta
3.  Iniciar um projeto node através do comando abaixo.
4. 

    npm init
    ou
    npm init -y (ignora as perguntas que eles fazem, como versão, nome..)
<br>

## Agora temos que decidir qual módulo CSV iremos utilizar

Entrar no site npmjs.com e pesquisar por csv.

[https://www.npmjs.com/search?q=csv](https://www.npmjs.com/search?q=csv)

  

Após decidirmos qual pacote vamos utilizar, abrimos o link do pacote e copiamos o código da instalação

Eu irei utilizar o csv-parse e seu código de instalação é:

    npm i csv-parse

Então só precisamos ir na pasta do nosso projeto, após o npm init e rodar o código acima.<br><br>

## Após instalado nosso modulo csv, vamos "importar" ele

Para isso precisamos utilizar o require

    const parse = require('csv-parse');
<br><br>
## Além do parse, utilizaremos o 'fs', file system

Utilizaremos o fs para abrir nosso csv como uma "stream" de dados, jajá veremos mais.

    const fs = require('fs');
<br><br>
## Vamos criar um array para armazenar nossos esquilos, além disso vamos criar algumas variáveis para alguns valores.

    const esquilos = []; //Aqui temos um array para armazenarmos nossos esquilos
    var maiorOcorrencia = [undefined, 0], contador = 0, qtdEsquilos = 0;
    // maiorOcorrencia eu irei utilizar para saber qual é a área onde os esquilos raros mais são vistos
    // Contador vai ser usado como um auxiliar para determinar a maiorOcorrencia
    // qtdEsquilos é só para termos um registro de quantos esquilos foram analisados no total.
<br><br>
## Vamos criar uma função para auxiliar no filtro

Passaremos essa função utilizando o argumento data como entrada, onde data será um esquilo qualquer, e se esse esquilo tiver a cor preta retorna true

    function filtraEsquilos(esquilo) {
      return esquilo['Primary Fur Color'] === 'Black';
    }
<br><br>
## Agora vamos ler nosso csv como uma stream de dados

Ah Gui, mas o que é uma stream de dados?, Uma stream de dados é um "Fluxo de dados", ou seja os dados vão sendo processados conforme vão sendo lidos.

  

Ah Gui, mas e porque ler como stream então?, Porque se o projeto que você estiver trabalhando usar uma quantidade de dados muito grande, pode ocorrer lentidão e/ou travamento do projeto, pois tudo teria que ser carregado em memória antes de processar.

  

Explicado isso então, vamos para a leitura do csv -

Aqui estamos criando nossa Stream para ler o csv, além disso estamos conectando uma .pipe em nossa stream, pois conforme vamos lendo este fluxo, passamos a informação através de uma pipe (tubulação), para a saída de dados.

Além disso, podemos passar algumas informações para o nosso parse.

Por exemplo: comments: '#', diria para o parse que tudo que vem antecedido por um # é um comentário.

    fs.createReadStream('esquilos.csv')
      .pipe(parse({
        columns: true
      }))
    //Tem mais código aqui em baixo, continue lendo.
<br><br>
## Ta, mas e a data?

Nosso createReadStream é um EventEmmiter, pois quando ele esta pronto ou sofre alguma alteração que estamos observando, ele emite um sinal, e podemos observar este sinal usando o .on() em javascript.

Aqui dizemos o seguinte, quando recebermos o sinal 'data', pegamos a data e fazemos algo com ela, que no caso é, incrementar qtdEsquilos e filtrar os pretos e adicionar eles no array de esquilos.

    fs.createReadStream('esquilos.csv')
      .pipe(parse({
        columns: true
      }))
    .on('data', (data) => {
        qtdEsquilos+=1;
        if (filtraEsquilos(data))
        esquilos.push(data);
      })
    // Tem mais, não se desespere
<br><br>
## Mas e se acontecer algum erro?

Então podemos "observar" pelo erro, assim como observamos pela data lá em cima.

    fs.createReadStream('esquilos.csv')
      .pipe(parse({
        columns: true
      }))
    .on('data', (data) => {
        qtdEsquilos+=1;
        if (filtraEsquilos(data))
        esquilos.push(data);
      })
    .on('error', (err) => {
        console.log(err)
      })
<br><br>
## E se tudo deu certo?

Então podemos adicionar outro .on que observa o evento 'end'

    .on('end', () => {
        //Aqui eu filtro os hectares dos esquilos pretos
        const hectares = (esquilos.map(x => x.Hectare));
        
        //Aqui eu coloco os hectares em ordem alfabético, assim eu posso contar quantas vezes eles ocorrem em sequência e determinar assim o número de ocorrências de cada
        hectares.sort().reduce(function(old, chr){
          old == chr ? ++contador > maiorOcorrencia[1] && (maiorOcorrencia = [chr, contador]) : (contador = 1)
          return chr
        });
        
        //Imprimindo os resultados
        console.log(`O lugar onde eles mais foram vistos foi no hectare ${maiorOcorrencia[0]}: vistos ${maiorOcorrencia[1]} vezes`);
        console.log(`Dos ${qtdEsquilos} 🐿️🐿️  encontrados, ${esquilos.length} 🐿️🐿️  eram pretos`);
        console.log(`Os 🐿️🐿️  pretos representam ${(esquilos.length*100/qtdEsquilos).toFixed([1])}% da população encontrada`);
      });

Explicando o código acima.

1.  Eu realizo uma filtragem dos hectares pois quero saber qual é o lugar mais propício para encontrar um esquilo preto, então a const hectares vai ter uma lista contendo todos os hectares que esquilos pretos foram vistos.
2.  Após isso eu coloco todos em ordem alfabética, pois assim eu posso contar quantos se repetem em sequência, se eu tenho 'abac', eu teria que verificar todos os elementos e fazer uma contagem mais "complexa", já se eu contar 'aabc', eu posso contar 2 as em sequencia e parar quando o elemento difere do analisado anteriormente.
3.  Após isso eu só imprimo os resultados em tela
<br><br>
## Código completo e saída

    const parse = require('csv-parse');
    const fs = require('fs');
    
    const esquilos = [];
    var maiorOcorrencia = [undefined, 0], contador = 0, qtdEsquilos = 0;
    
    function filtraEsquilos(esquilo) {
      return esquilo['Primary Fur Color'] === 'Black';
    }
    
    fs.createReadStream('esquilos.csv')
      .pipe(parse({
        columns: true
      }))
      .on('data', (data) => {
        qtdEsquilos+=1;
        if (filtraEsquilos(data))
        esquilos.push(data);
      })
      .on('error', (err) => {
        console.log(err)
      })
      .on('end', () => {
        //Aqui eu filtro os hectares dos esquilos pretos
        const hectares = (esquilos.map(x => x.Hectare));
        
        //Aqui eu coloco os hectares em ordem alfabético, assim eu posso contar quantas vezes eles ocorrem em sequência e determinar assim o número de ocorrências de cada
        hectares.sort().reduce(function(old, chr){
          old == chr ? ++contador > maiorOcorrencia[1] && (maiorOcorrencia = [chr, contador]) : (contador = 1)
          return chr
        });
        
        //Imprimindo os resultados
        console.log(`O lugar onde eles mais foram vistos foi no hectare ${maiorOcorrencia[0]}: vistos ${maiorOcorrencia[1]} vezes`);
        console.log(`Dos ${qtdEsquilos} 🐿️🐿️  encontrados, ${esquilos.length} 🐿️🐿️  eram pretos`);
        console.log(`Os 🐿️🐿️  pretos representam ${(esquilos.length*100/qtdEsquilos).toFixed([1])}% da população encontrada`);
      });

  

## Saída

O lugar onde eles mais foram vistos foi no hectare 33D: vistos 8 vezes
Dos 3023 🐿️🐿️  encontrados, 103 🐿️🐿️  eram pretos
Os 🐿️🐿️  pretos representam 3.4% da população encontrada

  

## Conclusão

Espero que vocês tenham se divertido assim como eu me diverti fazendo esse projeto.

Se um dia forem a Nova York me levem ashaiuhba.
