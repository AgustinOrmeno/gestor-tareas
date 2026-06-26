package com.gestortareas.dto;

import com.gestortareas.model.Tarea.Prioridad;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TareaRequest {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;

    private Prioridad prioridad = Prioridad.MEDIA;

    private LocalDate fechaLimite;
}
