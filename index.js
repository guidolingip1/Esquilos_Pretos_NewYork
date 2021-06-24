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