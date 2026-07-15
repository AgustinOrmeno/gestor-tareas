package com.gestortareas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordRequest {
    @NotBlank
    private String passwordActual;

    @NotBlank
    @Size(min = 6)
    private String passwordNueva;
}
