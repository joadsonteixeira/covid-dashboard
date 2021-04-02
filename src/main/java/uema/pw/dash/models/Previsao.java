package uema.pw.dash.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Previsao {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    Long id;
    Long casosPrevistos;
    Long obitosPrevistos;
}
