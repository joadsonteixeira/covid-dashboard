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
        gerarMapa(dados);
    });
}

function getNumeroDeCasosPorUF(uf){
    var ret = '';
    jQuery.ajax({
        url: 'http://localhost:8080/registros/estado/'+ uf,
        headers: {
            'Content-Type': 'application/json;'
        },
        crossDomain: true,
        method: 'get',
        datatype: "json"
    }).then(function (data) {
        ret =  data[0].last_available_confirmed;
    });
    return ret;
}


function getCor(d) {
    return d > 1000000 ? '#800026' :
           d > 500000  ? '#BD0026' :
           d > 100000  ? '#E31A1C' :
           d > 50000  ? '#FC4E2A' :
           d > 10000   ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 1000   ? '#FED976' :
                      '#FFEDA0';
}

//Colorir mapa
function estilo(feature) {
    return {
        fillColor: getCor(feature.properties.NUM_CASOS),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function gerarMapa(dados){

    //Adicionar numero de casos ao geoJson (uf)
    for(let i in dados){
        uf.features.forEach(function (feature){
            if(feature.properties.UF_05 == dados[i].state){
                feature.properties['NUM_CASOS'] = dados[i].last_available_confirmed;
            }
        });
    }
    
    var geoJson; //Variável para controle do mapa

    //Criação do mapa
    var mapboxToken = 'pk.eyJ1Ijoiam9hZHNvbnRlaXhlaXJhIiwiYSI6ImNrbXVlbW1saDA0MzYydXFzc3czdHhoanUifQ.MxrQOEen_Trt3FEdh3uhSg'; //Token de acesso ao mapbox
    var mapa = L.map('map').setView([-15.0040939, -54.1760112], 4);

    // Estilização do mapa
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, {
    id: 'mapbox/light-v9',
    attribution: '',
    tileSize: 512,
    zoomOffset: -1
    }).addTo(mapa);

    // Delimitação dos estados através do geoJson uf
    geoJson = L.geoJson(uf, {style: estilo}).addTo(mapa);

    //Info Controll
    var cardDeInformacao = L.control();

    // Criar div para exibição do número de casos
    cardDeInformacao.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    // Atualização interativa do card de informação
    cardDeInformacao.update = function (props) {
        this._div.innerHTML = '<h4>Número de Casos</h4>' +  (props ?
            '<b>' + props.NOME_UF + '</b><br />' + props.NUM_CASOS + ' casos totais'
            : 'Passe o mouse sobre o estado');
    };

    // Aplicar card ao mapa
    cardDeInformacao.addTo(mapa);

    // Destacar estado selecionado
    function destacarEstado(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        cardDeInformacao.update(layer.feature.properties);
    }
    
    //Aplicar zoom sobre o estado selecionado
    function zoomEstado(e) {
        mapa.fitBounds(e.target.getBounds());
    }
    
    //Remover destaque
    function removerDestaqueEstado(e) {
        geojson.resetStyle(e.target);
        cardDeInformacao.update();
    }
    
    // Controle de ações
    function controleDeIteracao(feature, layer) {
        layer.on({
            mouseover: destacarEstado,
            mouseout: removerDestaqueEstado,
            click: zoomEstado
        });
    }

    //Criar Legenda
    var legenda = L.control({position: 'bottomright'});

    //Legenda de cores
    legenda.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getCor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    // Adicionar legenda ao mapa
    legenda.addTo(mapa);

    //Configurar função de interação com o mapa
    geojson = L.geoJson(uf, {
        style: estilo,
        onEachFeature: controleDeIteracao
    }).addTo(mapa);
}