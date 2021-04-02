package uema.pw.dash.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uema.pw.dash.models.Custo;

@Repository
public interface CustoRepositorio extends JpaRepository<Custo, Long> {

    Custo findTopByOrderByIdDesc();
    
}
