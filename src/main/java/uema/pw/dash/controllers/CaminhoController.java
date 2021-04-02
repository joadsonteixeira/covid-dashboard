package uema.pw.dash.controllers;

import uema.pw.dash.services.RestService;
import uema.pw.dash.repository.CustoRepositorio;
import uema.pw.dash.repository.PrevisaoRepositorio;
import uema.pw.dash.repository.RegistroRepositorio;
import uema.pw.dash.models.Custo;
import uema.pw.dash.models.Previsao;
import uema.pw.dash.models.Registro;


import java.io.IOException;
import java.util.List;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    private CustoRepositorio custoRepositorio;
    private PrevisaoRepositorio previsaoRepositorio;


    public CaminhoController(RegistroRepositorio repositorio, CustoRepositorio custo, PrevisaoRepositorio previsao){
        this.registroRepositorio = repositorio;
        this.custoRepositorio = custo;
        this.previsaoRepositorio = previsao;
    }

    //Inicializar banco
    @EventListener(ContextRefreshedEvent.class)
    public void inicializarBanco() throws IOException{
        RestService restService = new RestService(new RestTemplateBuilder(), registroRepositorio);
        restService.getTodosRegistrosFromUrl(apiUrl, apiAuth);
        System.out.println("Dados carregados com sucesso!");
    }
    
    //Tela principal
    @GetMapping("/dashboard")
    public String dash(){
        return "views/dashboard.html";
    }

    //EndPoints para Banco de dados
    //Registros da API
    @GetMapping("/registros")
    @ResponseBody
    public List<Registro> findAll(){
        return registroRepositorio.findAll();
    }

    @GetMapping("/registros/ultimos")
    @ResponseBody
    public List<Registro> findUltimosRegistros(){
        return registroRepositorio.findUltimosRegistros();
    }


    @GetMapping("/registros/estado/{estado}")
    @ResponseBody
    public List<Registro> findByState(@PathVariable String estado){
        estado = estado.toUpperCase();
        return registroRepositorio.findByState(estado);
    }

    @GetMapping("/registros/{date}")
    @ResponseBody
    public List<Registro> findByDate(@PathVariable String date){
        System.out.println(date);
        return registroRepositorio.findByDateContaining(date);
    }

    @GetMapping("/registros/{state}/{date}")
    @ResponseBody
    public List<Registro> findByStateAndDate(@PathVariable String state, @PathVariable String date){
        return registroRepositorio.findByStateAndDateContaining(state, date);
    }

    //EndPoints para custo
    @PostMapping("/custo")
    @ResponseBody
    public Custo postCusto(@RequestBody Custo custo){
        return custoRepositorio.save(custo);
    }

    @GetMapping("/custo")
    @ResponseBody
    public Custo getCusto(){
        return custoRepositorio.findTopByOrderByIdDesc();
    }

    //Endpoints para previsao
    @GetMapping("/previsao")
    @ResponseBody
    public Previsao getPredicao(){
        return previsaoRepositorio.findTopByOrderByIdDesc();
    }

    @PostMapping("/previsao")
    @ResponseBody
    public Previsao postPrevisao(@RequestBody Previsao previsao){
        return previsaoRepositorio.save(previsao);
    }

}
