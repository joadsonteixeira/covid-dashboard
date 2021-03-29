package uema.pw.dash.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class Resposta {
    String count;
    String next;
    String previous;
    List<Registro> results;
}
