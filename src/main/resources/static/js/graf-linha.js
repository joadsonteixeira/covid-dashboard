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
        gerarGraficoLinhas(dados);
    });
}

function confirmadosTotaisPorMes(dados, data){
    var total = 0;
    for(let i in dados){
        if(dados[i].date == data){
            total += dados[i].last_available_confirmed;
        }
    }
    return total;
}

function obitosTotaisPorMes(dados, data){
    var total = 0;
    for(let i in dados){
        if(dados[i].date == data){
            total += dados[i].last_available_deaths;
        }
    }
    return total;
}

function gerarGraficoLinhas(dados){
    var acum = [confirmadosTotaisPorMes(dados, '2020-10-28'),
                confirmadosTotaisPorMes(dados, '2020-11-28'),
                confirmadosTotaisPorMes(dados, '2020-12-28'),
                confirmadosTotaisPorMes(dados, '2021-01-28'),
                confirmadosTotaisPorMes(dados, '2021-02-28'),
                confirmadosTotaisPorMes(dados, '2021-03-28')];
                
    var obitos = [obitosTotaisPorMes(dados, '2020-10-28'),
                obitosTotaisPorMes(dados, '2020-11-28'),
                obitosTotaisPorMes(dados, '2020-12-28'),
                obitosTotaisPorMes(dados, '2021-01-28'),
                obitosTotaisPorMes(dados, '2021-02-28'),
                obitosTotaisPorMes(dados, '2021-03-28')];

    Highcharts.chart('graf-linha', {

        title: {
          text: 'Número de casos e óbitos acumulados 10/2020 a 03/2021'
        },
      
        yAxis: {
          title: {
            text: 'Número de pessoas'
          }
        },
      
        xAxis: {
            categories: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
        },
      
        series: [{
          name: 'Casos confirmados',
          data: [acum[0], acum[1], acum[2], acum[3], acum[4], acum[5], acum[6]],
          color: '#ffe042'
        }, {
          name: 'Óbitos',
          data: [obitos[0], obitos[1], obitos[2], obitos[3], obitos[4], obitos[5], obitos[6]],
          color: '#ff3d3d'
        }]
      
      });
}