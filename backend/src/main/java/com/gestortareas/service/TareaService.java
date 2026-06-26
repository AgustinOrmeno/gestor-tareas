package com.gestortareas.service;

import com.gestortareas.dto.TareaRequest;
import com.gestortareas.dto.TareaResponse;
import com.gestortareas.model.Tarea;
import com.gestortareas.model.Tarea.Estado;
import com.gestortareas.model.Tarea.Prioridad;
import com.gestortareas.model.Usuario;
import com.gestortareas.repository.TareaRepository;
import com.gestortareas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<TareaResponse> listar(Estado estado, Prioridad prioridad) {
        Usuario usuario = getUsuarioAutenticado();

        if (estado != null) {
            return tareaRepository.findByUsuarioAndEstado(usuario, estado)
                    .stream().map(TareaResponse::fromEntity).toList();
        }
        if (prioridad != null) {
            return tareaRepository.findByUsuarioAndPrioridad(usuario, prioridad)
                    .stream().map(TareaResponse::fromEntity).toList();
        }
        return tareaRepository.findByUsuario(usuario)
                .stream().map(TareaResponse::fromEntity).toList();
    }

    public TareaResponse crear(TareaRequest request) {
        Usuario usuario = getUsuarioAutenticado();

        Tarea tarea = new Tarea();
        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setPrioridad(request.getPrioridad());
        tarea.setFechaLimite(request.getFechaLimite());
        tarea.setEstado(Estado.PENDIENTE);
        tarea.setUsuario(usuario);

        return TareaResponse.fromEntity(tareaRepository.save(tarea));
    }

    public TareaResponse editar(Long id, TareaRequest request) {
        Tarea tarea = getTareaDelUsuario(id);
        tarea.setTitulo(request.getTitulo());
        tarea.setDescripcion(request.getDescripcion());
        tarea.setPrioridad(request.getPrioridad());
        tarea.setFechaLimite(request.getFechaLimite());
        return TareaResponse.fromEntity(tareaRepository.save(tarea));
    }

    public TareaResponse cambiarEstado(Long id, Estado nuevoEstado) {
        Tarea tarea = getTareaDelUsuario(id);
        tarea.setEstado(nuevoEstado);
        return TareaResponse.fromEntity(tareaRepository.save(tarea));
    }

    public void eliminar(Long id) {
        Tarea tarea = getTareaDelUsuario(id);
        tareaRepository.delete(tarea);
    }

    private Tarea getTareaDelUsuario(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        if (!tarea.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No tenés permiso para modificar esta tarea");
        }
        return tarea;
    }
}
