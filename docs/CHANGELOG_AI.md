# Changelog: Interacciones de Inteligencia Artificial

Este archivo registra los cambios mayores y refactorizaciones arquitectónicas realizadas por los agentes de IA en el proyecto Piano Claro. 
*Importante:* Cualquier agente que finalice una tarea de impacto debe añadir una entrada en este archivo.

## [2026-06-03] - Ajustes UI de Componentes Musicales y Unidad 4
- Feature: Implementación/refinamiento de la Unidad 4 (Alteraciones en el pentagrama) y ejercicios asociados (`AccidentalScopeVisualizer`, etc.).
- UI/UX: Refactorización profunda de `TrebleClefVisualizer` utilizando porcentajes en vez de valores fijos para asegurar diseño responsive sin importar el tamaño de la pantalla.
- UI/UX: Se corrigió el espaciado y legibilidad en `PitchVisualizer` y `AccidentalScopeVisualizer`, implementando cálculo de padding dinámico y "barline multipliers" para garantizar espaciado profesional, resolviendo problemas de "clipping" y empalme de notas y alteraciones.
- Data: Se actualizaron las partituras y notación a estándar Latino (DO, RE, MI...) y se calibraron las coordenadas Y (`yPos`) de notas clave como Fa y Sol en el pentagrama.

## [2026-06-03] - Refactorización de Componentes Compartidos (Shared)
- Architecture: Se creó una nueva estructura de carpetas en `src/components/shared/` para consolidar los componentes reutilizables y dependientes de dominio.
- Directories: Creados `visualizers/`, `interactive/`, `cards/`, `badges/`, `audio/`.
- Data: `notesData.ts` y `rhythmFigures.ts` movidos a `src/lib/music/`.
- Migration: Se movieron ~15 componentes dispersos en módulos (como `TrebleClefVisualizer`, `InteractiveKeyboard`, `NoteCard`, `MeasureBuilder`, etc.) a sus respectivas subcarpetas compartidas.
- Update: Se utilizó un script en Python para actualizar globalmente todos los imports (más de 30 archivos actualizados) garantizando consistencia y cero errores en TypeScript.

## [2026-06-02] - Unidad 3: Notas que se mueven
- Feature: Implementación completa de la Unidad 3 del Módulo 2 para enseñar Sostenidos, Bemoles y Becuadros.
- UI/UX: 10 etapas interactivas combinando `InteractiveKeyboard` y `TrebleClefVisualizer` para conectar alteraciones físicas y notación.
- Componentes: Creación de `AccidentalBadge`, `AccidentalMovementVisualizer`, y `EnharmonicPairCard`.
- Logic: Archivo `accidentalsExercises.ts` creado con generador dinámico de +30 ejercicios de identificación de notas alteradas (caza de sostenidos y bemoles).
- Route: Añadida la página en App Router `/modulos/2/unidad-3`.

## [2026-06-02] - Bugfix: Visualización de Teclado Interactivo y Puntuación
- Bugfix: Se agregó `whitespace-nowrap` a las etiquetas de las teclas negras en `InteractiveKeyboard.tsx` para evitar que textos como "DO#" se corten en múltiples líneas.
- Bugfix: Corrección lógica en `Unit2MusicalDistances.tsx` que permitía obtener un puntaje mayor al 100% de precisión al no contabilizar ejercicios finales y permitir múltiples clics al momento de tener la respuesta correcta.

## [2026-06-02] - Unidad 2: Las distancias musicales

### Añadido
- Nuevo Componente Compartido: `DistanceVisualizer` para mostrar la distancia visual entre dos notas.
- Nuevo Componente Compartido: `IntervalStepper` para animar saltos o secuencias de notas en el teclado.
- Base de datos local: `distanceExercises.ts` con ejercicios básicos de tonos y semitonos.
- Funcionalidad: Implementación de la Unidad 2 ("Las distancias musicales") con un flujo de 10 etapas para descubrir empíricamente semitonos y tonos.

## [2026-06-01] - Expansión del Sistema de Módulos
- Nuevo Componente Core: Desarrollo de `InteractiveKeyboard` con soporte para Tone.js, eventos táctiles y de ratón, resaltado de notas e integración con `PianoAudioEngine`.
- Funcionalidad: Implementación de la Unidad 1 ("El mapa del teclado") con un flujo de 9 etapas de exploración interactiva.
- Bugfix: Resolución de opacidad baja y contraste en la Unit 2 (Score y botones A y B en modo claro).

## [2026-06-01] - Inicialización del Sistema de Documentación IA

### Añadido
- Framework completo de documentación en `/docs` pensado para agentes automatizados (`PROJECT_CONTEXT.md`, `ROADMAP.md`, `SESSION_HANDOVER.md`, `CHANGELOG_AI.md`).
- Reglas inquebrantables de ejecución y estilo en `AGENTS.md` y `GUIA_CODING_AI.md`.

### Refactorización Previa (Terminada Hoy)
- **Migración a Legacy:** Todos los prototipos experimentales y código sin estructurar fueron aislados en la carpeta `src/app/legacy/`.
- **Estructura Escalable:** Creación del hub estandarizado para módulos interactivos en `src/app/modulos/1/`.
- **Estética Premium ("Midnight Blue"):** Reescritura del `page.tsx` principal (Home) para incorporar un diseño Glassmorphic oscuro con fondos 3D generados y activos visuales de alto nivel (piano, metrónomo, partitura), alejándose de la estética de wireframe anterior.
- **Rutas de Aprendizaje:** Estandarización de las rutas de unidad (e.g. `/modulos/1/unidad-9`) y enlaces correspondientes en el Mega Menú de la aplicación.
