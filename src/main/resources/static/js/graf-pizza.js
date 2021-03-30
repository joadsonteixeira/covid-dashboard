window.onload = getTodos();
function getTodos(){
    $.ajax({
        url: 'http://localhost:8080/registros',
        headers: {
            'Content-Type': 'application/json;'
        },
        crossDomain: true,
        method: 'get',
        datatype: "json"
    }).then(function (dados) {
        gerarGraficoPizza(dados);
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
