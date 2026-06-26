package com.gestortareas.repository;

import com.gestortareas.model.Tarea;
import com.gestortareas.model.Tarea.Estado;
import com.gestortareas.model.Tarea.Prioridad;
import com.gestortareas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Todas las tareas de un usuario
    List<Tarea> findByUsuario(Usuario usuario);

    // Filtrar por estado
    List<Tarea> findByUsuarioAndEstado(Usuario usuario, Estado estado);

    // Filtrar por prioridad
    List<Tarea> findByUsuarioAndPrioridad(Usuario usuario, Prioridad prioridad);
}
