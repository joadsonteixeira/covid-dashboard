window.onload = getTodos();
var custo = document.getElementById('custo');
var tempoMedio = document.getElementById('tempo-medio');

function getTodos(){
    $.ajax({
        url: 'http://localhost:8080/registros/ultimos',
        headers: {
            'Content-Type': 'application/json;'
        },
        crossDomain: true,
        method: 'get',
        datatype: "json"
    }).then(function (dados) {
        gerarGraficoPizza(dados);
        gerarCardsCusto(dados);
    });
}

function totalObitos(dados){
    var total = 0;
    for(let i in dados){
        total += dados[i].last_available_deaths;
    }
    return total;
}

function totalConfirmados(dados){
    var total = 0;
    for(let i in dados){
        total += dados[i].last_available_confirmed;
    }
    return total;
}

function gerarGraficoPizza(dados){

    Highcharts.chart('graf-pizza', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Mortalidade'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            name: 'Porcentagem',
            colorByPoint: true,
            data: [{
                name: 'Casos confirmados totais',
                y: totalConfirmados(dados),
                color: "#ffe042",
                sliced: true,
                selected: true
            }, {
                name: 'Óbitos totais',
                y: totalObitos(dados),
                color: "#ff3d3d"
            }]
        }]
    });
}

function gerarCardsCusto(dados){

    var taxaInternacao = 0.20;
    var precoMedioLeitoPorDia = 1764;
    var mediaDiasInternacao = 11.6;
    var casosConfirmados = totalConfirmados(dados);

    var custoInternacoes = casosConfirmados*taxaInternacao*precoMedioLeitoPorDia*mediaDiasInternacao;
    var custoIndividual = precoMedioLeitoPorDia*mediaDiasInternacao;
    var data = JSON.stringify( { "custo": custoInternacoes.toString() } );


    $.ajax({
        url: 'http://localhost:8080/custo',
        headers: {
            'Content-Type': 'application/json;'
        },
        data: data,
        crossDomain: true,
        method: 'post',
        datatype: "json"
    }).then(function (dados) {
        console.log('Dados adicionados ao banco com sucesso')
    });

    custo.innerHTML = 'R$ ' + Math.floor(custoInternacoes) + ',00';
    tempoMedio.innerHTML = 'R$ ' + Math.floor(custoIndividual) + ',00';


}
