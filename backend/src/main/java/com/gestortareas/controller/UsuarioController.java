package com.gestortareas.controller;

import com.gestortareas.dto.PasswordRequest;
import com.gestortareas.dto.PerfilRequest;
import com.gestortareas.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<Map<String, String>> getPerfil() {
        return ResponseEntity.ok(usuarioService.getPerfil());
    }

    @PutMapping("/perfil")
    public ResponseEntity<Map<String, String>> actualizarNombre(@Valid @RequestBody PerfilRequest request) {
        return ResponseEntity.ok(usuarioService.actualizarNombre(request));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> cambiarPassword(@Valid @RequestBody PasswordRequest request) {
        try {
            usuarioService.cambiarPassword(request);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
