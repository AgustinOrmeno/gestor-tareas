package com.gestortareas.controller;

import com.gestortareas.dto.TareaRequest;
import com.gestortareas.dto.TareaResponse;
import com.gestortareas.model.Tarea.Estado;
import com.gestortareas.model.Tarea.Prioridad;
import com.gestortareas.service.TareaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas")
@RequiredArgsConstructor
public class TareaController {

    private final TareaService tareaService;

    @GetMapping
    public ResponseEntity<List<TareaResponse>> listar(
            @RequestParam(required = false) Estado estado,
            @RequestParam(required = false) Prioridad prioridad) {
        return ResponseEntity.ok(tareaService.listar(estado, prioridad));
    }

    @PostMapping
    public ResponseEntity<TareaResponse> crear(@Valid @RequestBody TareaRequest request) {
        return ResponseEntity.ok(tareaService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TareaResponse> editar(
            @PathVariable Long id,
            @Valid @RequestBody TareaRequest request) {
        return ResponseEntity.ok(tareaService.editar(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TareaResponse> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Estado nuevoEstado = Estado.valueOf(body.get("estado"));
        return ResponseEntity.ok(tareaService.cambiarEstado(id, nuevoEstado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
