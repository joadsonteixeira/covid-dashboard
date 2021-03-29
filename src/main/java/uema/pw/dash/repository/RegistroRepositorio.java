package uema.pw.dash.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uema.pw.dash.models.Registro;

@Repository
public interface RegistroRepositorio extends JpaRepository<Registro, Long> {
    
    List<Registro> findByState(String state);

}
