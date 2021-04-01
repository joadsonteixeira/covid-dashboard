package uema.pw.dash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import uema.pw.dash.models.Registro;

@Repository
public interface RegistroRepositorio extends JpaRepository<Registro, Long> {
    
    List<Registro> findByState(String state);

    List<Registro> findByDate(String date);

    List<Registro> findByDateContaining(String date);

    List<Registro> findByStateAndDateContaining(String State, String date);

    @Query(value = "SELECT u FROM Registro u WHERE u.is_last = true")
    List<Registro> findUltimosRegistros();
}
