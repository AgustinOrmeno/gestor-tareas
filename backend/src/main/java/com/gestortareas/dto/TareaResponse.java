package com.gestortareas.dto;

import com.gestortareas.model.Tarea;
import com.gestortareas.model.Tarea.Estado;
import com.gestortareas.model.Tarea.Prioridad;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TareaResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private Prioridad prioridad;
    private Estado estado;
    private LocalDate fechaLimite;
    private LocalDateTime fechaCreacion;
    private String usuarioNombre;

    public static TareaResponse fromEntity(Tarea tarea) {
        TareaResponse response = new TareaResponse();
        response.setId(tarea.getId());
        response.setTitulo(tarea.getTitulo());
        response.setDescripcion(tarea.getDescripcion());
        response.setPrioridad(tarea.getPrioridad());
        response.setEstado(tarea.getEstado());
        response.setFechaLimite(tarea.getFechaLimite());
        response.setFechaCreacion(tarea.getFechaCreacion());
        response.setUsuarioNombre(tarea.getUsuario().getNombre());
        return response;
    }
}
