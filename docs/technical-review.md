# Revisión técnica de Piano Claro

## Resumen ejecutivo

La base actual es buena para un MVP: el proyecto ya tiene módulos reconocibles,
contenido desacoplado de la UI y una primera capa de dominio musical. La mayor
deuda no está en la infraestructura sino en la **concentración de lógica** y en
la **convivencia entre una implementación antigua y otra nueva**.

## Hallazgos priorizados

### Resuelto - Se retiraron los modelos y componentes legacy de lección

Hoy conviven:

- `src/types/learning.ts`
- `src/types/lesson.ts`
- componentes legacy en `src/components/*`
- componentes actuales en `src/components/lesson/*`

Esto aumenta el riesgo de:

- importar el tipo equivocado
- corregir una vista y dejar otra inconsistente
- mantener dos soluciones de score/piano/progreso en paralelo

La familia legacy ya fue retirada y el modelo activo de lección quedó unificado
en `src/types/lesson.ts`. Las primitivas musicales base quedaron además
separadas en `src/types/music.ts`, evitando que el dominio musical dependa del
modelo de lecciones.

### Resuelto - La autoría de compases dejó de duplicarse en los datos

Lecciones y canciones usaban helpers casi idénticos para recomponer `notes`,
`solfege` y `rhythm`. Esa lógica vive ahora en `score-authoring.ts`, que genera
eventos normalizados y mantiene las proyecciones necesarias para las vistas
actuales.

### Resuelto - `LessonLayout` dejó de concentrar la lógica de práctica

`LessonLayout` coordina:

- navegación de pasos
- reproducción
- estado de audio
- feedback
- teclado físico
- persistencia local
- secuencia esperada
- modal final

La UI aún funciona, pero el archivo se está convirtiendo en un controlador
grande difícil de probar y modificar.

La pantalla ahora delega progreso, teclado físico y práctica a hooks dedicados,
y su composición visual se separó en componentes de sección.

### En curso - La notación sigue siendo mock, pero ya tiene frontera reemplazable

`ScoreViewer` mejoró, pero aún implementa layout musical a mano. Esto será caro
de sostener cuando entren:

- silencios
- corcheas
- alteraciones
- ligaduras
- dos manos
- compases reales

`NotationViewer`, `NotationRendererProps` y el registro de renderers ya aíslan
la implementación SVG actual. Además, el dominio ya puede expresar eventos de
notación con notas o silencios, `notation-layout.ts` calcula su posición por
duración y el renderer ya distingue `NoteGlyph` de `RestGlyph`. El próximo salto
sigue siendo integrar VexFlow detrás de esa frontera.

### Resuelto - La práctica ya no pierde los silencios

`PracticeSong` conserva ahora dos vistas complementarias:

- `events`, para las notas que el alumno debe tocar
- `timelineEvents`, para la cronología completa de notas y silencios

Esto permite que la guía visual y el futuro evaluador rítmico compartan el mismo
reloj sin convertir un silencio en una tecla que el usuario deba pulsar.

### En curso - Cobertura automatizada del dominio

Los módulos más delicados no tienen tests:

- cálculo de beats y duración
- foco de lección
- posiciones de pentagrama
- secuencia esperada
- evaluación de notas

Ya existen pruebas unitarias iniciales para:

- modelo de canción practicable
- autoría y layout de notación
- foco de lección
- rutina pedagógica
- posiciones de pentagrama

Conviene ampliarlas antes de sumar más ritmos o importación MIDI.

### Resuelto - Persistencia y contenido ya tienen fronteras reemplazables

La app consume ahora:

- `lessonProgressRepository`
- `contentRepository`

La implementación sigue usando `localStorage` y TypeScript mock, pero páginas y
hooks ya no dependen directamente de esas decisiones.

### Resuelto - El tempo ya vive en los datos

Ejemplo: el tempo por lección se decide con un `if` por slug.

Cada lección define ahora su `tempoBpm`, evitando reglas por `slug`.

## Riesgos de robustez

| Riesgo | Estado |
| --- | --- |
| Imports ambiguos entre tipos legacy/nuevos | Medio |
| Lógica de sesión difícil de testear | Medio |
| Renderer mock frágil ante más notación | Alto |
| Progreso local sin sincronización | Bajo hoy, alto al sumar cuentas |
| Audio simple no representativo de piano real | Bajo para MVP conceptual |

## Revisión de seguridad

Hoy la superficie es pequeña:

- sin backend
- sin auth
- sin datos sensibles
- persistencia local simple

Los riesgos actuales son bajos. Al agregar backend, habrá que revisar:

- autenticación y autorización
- validación de entradas
- protección de rutas
- privacidad del progreso
- manejo de archivos MIDI/MusicXML subidos por usuarios

## Plan recomendado

### Próxima iteración

1. ampliar tests de dominio
2. integrar VexFlow
3. preparar repositorios remotos cuando llegue autenticación

### Después

1. integrar VexFlow
2. preparar importación de MIDI/MusicXML
3. conectar progreso remoto y contenido administrable

## Checklist recurrente

Revisar cada cierto tiempo:

- ¿la UI conoce demasiados detalles del dominio?
- ¿hay tipos duplicados?
- ¿se agregaron excepciones por slug?
- ¿los módulos críticos tienen tests?
- ¿la persistencia sigue detrás de una frontera reemplazable?
- ¿la notación nueva entra por el renderer, no rompiendo toda la app?
