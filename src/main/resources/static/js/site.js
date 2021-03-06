var casos = document.getElementById('casos');
var obitos = document.getElementById('obitos');
var loadingSpinner = document.getElementById('loadingSpinner');
window.onload = casosFull();

function casosFull() {
    $.ajax({
        url: 'https://api.brasil.io/v1/dataset/covid19/caso_full/data/',
        headers: {
            Authorization: "Token 59d25c9e10d86111d7385204dd42ee3a99b7ec1b"
        },
        data: {
            place_type: "state",
            is_last: "True"
        },
        method: 'get',
        datatype: "json",
        beforeSend: function () {
            loadingSpinner.style.display = "";
        },
        complete: function () {
            loadingSpinner.style.display = "none";
        }
    }).then(function (data) {
        feedCards(data);
        topCasosEstados(data);
        topObitos(data);
        preparaDados(data);
    });
}

function feedCards(data) {
    var qtdObitos = 0;
    var qtdCasos = 0;
    for (let i in data) {
        for (let j in data[i]) {
            qtdObitos += data[i][j].new_deaths;
            qtdCasos += data[i][j].new_confirmed;
        }
    }
    casos.innerHTML = qtdCasos + ' Casos Totais';
    obitos.innerHTML = qtdObitos + ' Óbitos Totais';
}

function topCasosEstados(data) {
    var casos = [];
    for (let i in data) {
        for (let j in data[i]) {
            casos.push({
                casos: data[i][j].new_confirmed,
                estado: data[i][j].state
            });
        }
    }
    var sortedCasos = casos.sort(function (a, b) { return b.casos - a.casos }).slice(0, 5);
    graficoTopCasos(sortedCasos);
}

function topObitos(data) {
    var obitos = [];
    for (let i in data) {
        for (let j in data[i]) {
            obitos.push({
                obitos: data[i][j].new_deaths,
                estado: data[i][j].state
            });
        }
    }
    var sortedObitos = obitos.sort(function (a, b) { return b.obitos - a.obitos }).slice(0, 5);
    graficoTopObitos(sortedObitos);
}

function graficoTopCasos(casos) {
    const chart = Highcharts.chart('topCasosConfirmados', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Estados com Mais Casos Confirmados'
        },
        xAxis: {
            categories: [casos[0].estado, casos[1].estado, casos[2].estado, casos[3].estado, casos[4].estado]
        },
        yAxis: {
            title: {
                text: 'Casos Confirmados'
            }
        },
        series: [{
            name: casos[0].estado,
            data: [casos[0].casos],
        },{
            name: casos[1].estado,
            data: [casos[1].casos],
        },{
            name: casos[2].estado,
            data: [casos[2].casos],
        },{
            name: casos[3].estado,
            data: [casos[3].casos],
        },{
            name: casos[4].estado,
            data: [casos[4].casos],
        }]
    });
}

function graficoTopObitos(obitos) {
    const chart = Highcharts.chart('topObitos', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Estados com Mais Óbitos'
        },
        xAxis: {
            categories: [obitos[0].estado, obitos[1].estado, obitos[2].estado, obitos[3].estado, obitos[4].estado]
        },
        yAxis: {
            title: {
                text: 'Óbitos'
            }
        },
        series: [{
            name: obitos[0].estado,
            data: [obitos[0].obitos],
        },{
            name: obitos[1].estado,
            data: [obitos[1].obitos],
        },{
            name: obitos[2].estado,
            data: [obitos[2].obitos],
        },{
            name: obitos[3].estado,
            data: [obitos[3].obitos],
        },{
            name: obitos[4].estado,
            data: [obitos[4].obitos],
        }]
    });
}

function preparaDados(data){
    var dados = [];
    for (let i in data) {
        for (let j in data[i]) {
            dados.push({
                estado: data[i][j].state,
                casos: data[i][j].new_confirmed,
                obitos: data[i][j].new_deaths,
                date: data[i][j].date,
            });
        }
    }
    feedTabela(dados);
}

function feedTabela(data) {
    $('#table').DataTable({
        data: data,
        destroy: true,
        order: [[0, "asc"]],
        pageLength: 10,
        lengthMenu: [[10, 50, -1], [25, 50, 100, "All"]],
        pagingType: "full_numbers",
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csv',
                text: 'CSV',
            },
            {
                extend: 'excel',
                text: 'XLS',
            }
        ],
        language: {
            url: '../lib/datatables/language.json'
        },
        columns: [
            { data: 'estado' },
            { data: 'casos' },
            { data: 'obitos' },
            { data: 'date' },
        ],
    });
}