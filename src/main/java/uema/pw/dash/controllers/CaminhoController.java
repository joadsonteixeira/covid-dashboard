package uema.pw.dash.controllers;

import uema.pw.dash.services.RestService;
import uema.pw.dash.repository.RegistroRepositorio;
import uema.pw.dash.models.Registro;


import java.io.IOException;
import java.util.List;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin(origins = "*")
public class CaminhoController {

    @Value("${api.url}")
    private String apiUrl;
    @Value("${api.auth}")
    private String apiAuth;


    private RegistroRepositorio registroRepositorio;

    public CaminhoController(RegistroRepositorio repositorio){
        this.registroRepositorio = repositorio;
    }

    //Inicializar banco
    @EventListener(ContextRefreshedEvent.class)
    public void inicializarBanco() throws IOException{
        RestService restService = new RestService(new RestTemplateBuilder(), registroRepositorio);
        restService.getRegistrosFromUrl(apiUrl, apiAuth);
        System.out.println("Dados carregados com sucesso!");
    }
    
    @GetMapping("/dashboard")
    public String dash(){
        return "views/dashboard.html";
    }

    @GetMapping("/registros")
    @ResponseBody
    public List<Registro> findAll(){
        return registroRepositorio.findAll();
    }


    @GetMapping("/registros/estado/{estado}")
    @ResponseBody
    public List<Registro> findByState(@PathVariable String estado){
        estado = estado.toUpperCase();
        return registroRepositorio.findByState(estado);
    }
}
