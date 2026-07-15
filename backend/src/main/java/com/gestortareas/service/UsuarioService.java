package com.gestortareas.service;

import com.gestortareas.dto.PasswordRequest;
import com.gestortareas.dto.PerfilRequest;
import com.gestortareas.model.Usuario;
import com.gestortareas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Map<String, String> getPerfil() {
        Usuario u = getUsuarioAutenticado();
        return Map.of("nombre", u.getNombre(), "email", u.getEmail());
    }

    public Map<String, String> actualizarNombre(PerfilRequest request) {
        Usuario u = getUsuarioAutenticado();
        u.setNombre(request.getNombre());
        usuarioRepository.save(u);
        return Map.of("nombre", u.getNombre(), "email", u.getEmail());
    }

    public void cambiarPassword(PasswordRequest request) {
        Usuario u = getUsuarioAutenticado();
        if (!passwordEncoder.matches(request.getPasswordActual(), u.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        u.setPassword(passwordEncoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(u);
    }
}
