package com.gestortareas.repository;

import com.gestortareas.model.HistorialEstado;
import com.gestortareas.model.Tarea;
import com.gestortareas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findByTareaOrderByFechaDesc(Tarea tarea);
    List<HistorialEstado> findByTarea_UsuarioOrderByFechaDesc(Usuario usuario);
}
