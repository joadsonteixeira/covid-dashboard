package uema.pw.dash.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uema.pw.dash.models.Previsao;

@Repository
public interface PrevisaoRepositorio extends JpaRepository<Previsao, Long>{
    
    Previsao findTopByOrderByIdDesc();
}
