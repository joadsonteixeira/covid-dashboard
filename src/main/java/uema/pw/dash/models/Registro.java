package uema.pw.dash.models;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Registro{
    @Id
    Long city_ibge_code;
    String city;
    String date;
    Long epidemiological_week;
    Long estimated_population;
    Long estimated_population_2019;
    Boolean is_last;
    Boolean is_repeated;
    Long last_available_confirmed;
    Float last_available_confirmed_per_100k_inhabitants;
    String last_available_date;
    Float last_available_death_rate;
    Long last_available_deaths;
    Long new_confirmed;
    Long new_deaths;
    Long order_for_place;
    String place_type;
    String state;
}
