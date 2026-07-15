package com.gestortareas.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PerfilRequest {
    @NotBlank
    private String nombre;
}
