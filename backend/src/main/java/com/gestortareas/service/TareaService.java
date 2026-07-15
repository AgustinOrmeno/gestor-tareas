package com.gestortareas.service;

import com.gestortareas.dto.HistorialResponse;
import com.gestortareas.dto.TareaRequest;
import com.gestortareas.dto.TareaResponse;
import com.gestortareas.model.HistorialEstado;
import com.gestortareas.model.Tarea;
import com.gestortareas.model.Tarea.Estado;
import com.gestortareas.model.Tarea.Prioridad;
import com.gestortareas.model.Usuario;
import com.gestortareas.repository.HistorialEstadoRepository;
import com.gestortareas.repository.TareaRepository;
import com.gestortareas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialEstadoRepository historialRepository;

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
        Tarea saved = tareaRepository.save(tarea);

        HistorialEstado h = new HistorialEstado();
        h.setTarea(saved);
        h.setEstadoAnterior(null);
        h.setEstadoNuevo(Estado.PENDIENTE);
        h.setUsuario(usuario);
        historialRepository.save(h);

        return TareaResponse.fromEntity(saved);
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
        Usuario usuario = getUsuarioAutenticado();
        Estado estadoAnterior = tarea.getEstado();
        tarea.setEstado(nuevoEstado);
        Tarea saved = tareaRepository.save(tarea);

        HistorialEstado h = new HistorialEstado();
        h.setTarea(saved);
        h.setEstadoAnterior(estadoAnterior);
        h.setEstadoNuevo(nuevoEstado);
        h.setUsuario(usuario);
        historialRepository.save(h);

        return TareaResponse.fromEntity(saved);
    }

    public void eliminar(Long id) {
        Tarea tarea = getTareaDelUsuario(id);
        historialRepository.deleteAll(historialRepository.findByTareaOrderByFechaDesc(tarea));
        tareaRepository.delete(tarea);
    }

    public List<HistorialResponse> getHistorial(Long tareaId) {
        Tarea tarea = getTareaDelUsuario(tareaId);
        return historialRepository.findByTareaOrderByFechaDesc(tarea)
                .stream().map(HistorialResponse::fromEntity).toList();
    }

    public List<HistorialResponse> getHistorialCompleto() {
        Usuario usuario = getUsuarioAutenticado();
        return historialRepository.findByTarea_UsuarioOrderByFechaDesc(usuario)
                .stream().map(h -> {
                    HistorialResponse r = HistorialResponse.fromEntity(h);
                    return r;
                }).toList();
    }

    public Map<String, Object> getReporte() {
        Usuario usuario = getUsuarioAutenticado();
        List<Tarea> todas = tareaRepository.findByUsuario(usuario);
        long total = todas.size();
        long pendientes = todas.stream().filter(t -> t.getEstado() == Estado.PENDIENTE).count();
        long enProgreso = todas.stream().filter(t -> t.getEstado() == Estado.EN_PROGRESO).count();
        long completadas = todas.stream().filter(t -> t.getEstado() == Estado.COMPLETADA).count();
        long alta = todas.stream().filter(t -> t.getPrioridad() == Prioridad.ALTA).count();
        long media = todas.stream().filter(t -> t.getPrioridad() == Prioridad.MEDIA).count();
        long baja = todas.stream().filter(t -> t.getPrioridad() == Prioridad.BAJA).count();
        double pct = total > 0 ? Math.round((completadas * 100.0 / total) * 10.0) / 10.0 : 0;

        return Map.of(
            "total", total,
            "pendientes", pendientes,
            "enProgreso", enProgreso,
            "completadas", completadas,
            "alta", alta,
            "media", media,
            "baja", baja,
            "porcentajeCompletado", pct
        );
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
