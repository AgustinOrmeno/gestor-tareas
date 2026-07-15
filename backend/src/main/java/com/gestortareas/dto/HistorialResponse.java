package com.gestortareas.dto;

import com.gestortareas.model.HistorialEstado;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
public class HistorialResponse {
    private Long id;
    private String estadoAnterior;
    private String estadoNuevo;
    private String usuario;
    private String fecha;
    private String tareaTitulo;
    private Long tareaId;

    public static HistorialResponse fromEntity(HistorialEstado h) {
        HistorialResponse r = new HistorialResponse();
        r.setId(h.getId());
        r.setEstadoAnterior(h.getEstadoAnterior() != null ? h.getEstadoAnterior().name() : null);
        r.setEstadoNuevo(h.getEstadoNuevo().name());
        r.setUsuario(h.getUsuario().getNombre());
        r.setFecha(h.getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        r.setTareaTitulo(h.getTarea().getTitulo());
        r.setTareaId(h.getTarea().getId());
        return r;
    }
}
