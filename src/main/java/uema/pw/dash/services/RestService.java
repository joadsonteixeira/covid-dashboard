package uema.pw.dash.services;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import uema.pw.dash.models.Registro;
import uema.pw.dash.repository.RegistroRepositorio;

@Service
public class RestService {

    private RegistroRepositorio repositorio;

    public final RestTemplate restTemplate;

    public RestService(RestTemplateBuilder rtb, RegistroRepositorio repositorio) {
        this.restTemplate = rtb.build();
        this.repositorio = repositorio;
    }

    public Registro[] getRegistrosFromUrl(String url, String autorizacao) throws IOException{
        //Configurar cabeçalho
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        //headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        if(autorizacao != null){
            headers.set("Authorization", autorizacao);
        }

        //Requisição HTTP
        HttpEntity<?> requisicao = new HttpEntity<>(headers);
        ResponseEntity<String> res = this.restTemplate.exchange(url, HttpMethod.GET, requisicao, String.class, 1);

        //Tratar dados
        String json = res.getBody();
        JsonParser p = new JsonFactory().createParser(json);
        ObjectMapper mapper = new ObjectMapper();
        String results = "";
        while(p.nextToken() != JsonToken.END_OBJECT){
            if(p.getCurrentName() != null && p.getCurrentName().equals("results")){
                p.nextToken();
                ArrayNode node = mapper.readTree(p);
                results = node.toString();
                break;
            }
        }

        //Json -> Objeto
        Registro[] registros = mapper.readValue(results, Registro[].class);
        for(Registro reg : registros){
            repositorio.save(reg);
        }

        return registros;
    }

}
