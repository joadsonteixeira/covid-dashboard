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

var database = [];
function getNumCasos(uf){
    database.forEach(function (registro){
        if(registro.state == uf){
            return registro.last_available_confirmed;
        }
    })
}

function getColor(d) {
    return d > 1000000 ? '#800026' :
           d > 500000  ? '#BD0026' :
           d > 100000  ? '#E31A1C' :
           d > 50000  ? '#FC4E2A' :
           d > 10000   ? '#FD8D3C' :
           d > 5000   ? '#FEB24C' :
           d > 1000   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.NUM_CASOS),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}



function gerarMapa(dados){

    //Adicionar numero de casos ao geoJson
    for(let i in dados){
        uf.features.forEach(function (feature){
            if(feature.properties.UF_05 == dados[i].state){
                feature.properties['NUM_CASOS'] = dados[i].last_available_confirmed;
            }
        });
    }
    
    var geoJson;

    var mapboxAccessToken = 'pk.eyJ1Ijoiam9hZHNvbnRlaXhlaXJhIiwiYSI6ImNrbXVlbW1saDA0MzYydXFzc3czdHhoanUifQ.MxrQOEen_Trt3FEdh3uhSg';
    var map = L.map('map').setView([-15.0040939, -54.1760112], 4);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: '',
    tileSize: 512,
    zoomOffset: -1
    }).addTo(map);
    geoJson = L.geoJson(uf, {style: style}).addTo(map);

    //Info Controll
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Número de Casos</h4>' +  (props ?
            '<b>' + props.NOME_UF + '</b><br />' + props.NUM_CASOS + ' casos'
            : 'Passe o mouse sobre o estado');
    };

    info.addTo(map);

    function highlightFeature(e) {
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
        info.update(layer.feature.properties);
    }
    
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }
    
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    //Adicionar Legendar
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

    //Hover
    geojson = L.geoJson(uf, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
}