# Roadmap: Piano Claro

Este documento categoriza el estado de las funcionalidades del proyecto para entender qué se ha logrado y qué pasos siguen en el desarrollo.

## Funcionalidades Terminadas

*   **Arquitectura Base:** Monolito modular con Next.js 16 y React 19.
*   **Motor de Audio (Mock/Simple):** Reproducción de notas y secuencias usando Tone.js.
*   **Estética Global (V2):** Home page interactivo con estética "Midnight Blue", assets 3D, y glassmorphism.
*   **Aislamiento de Legacy:** Movimiento de todos los prototipos iniciales a `/legacy/` para evitar deuda visual/funcional.
*   **Estructura de Módulos (Escalabilidad):** Enrutamiento de `/modulos/[id]/unidad-[id]` preparado para escalar automáticamente.
*   **Módulo 1 (Fundamentos):**
    *   Teoría del sonido.
    *   Diferenciación entre Melodía, Armonía y Ritmo.
    *   Reconocimiento de las líneas del pentagrama.
    *   Visualizadores musicales interactivos (Teclado, Clave de Sol, Notas).
    *   Evaluación visual de compases y ligaduras.

## Funcionalidades en Desarrollo

*   **Sistema de Evaluación (Entrenamiento):** Ajuste fino de la lección 9 (Mastery Review) para evaluar notas y ligaduras con precisión rítmica.
*   **Adaptación de UI a Dispositivos Móviles:** Refinamiento de la experiencia responsiva de los visualizadores de partituras y teclados.

## Funcionalidades Faltantes

*   **Autenticación de Usuarios:** Integración de un sistema real (ej. NextAuth, Clerk, Supabase).
*   **Base de Datos y Progreso Real:** Reemplazar el `localStorage` por persistencia remota para sincronizar avance entre dispositivos.
*   **Módulo 2 (Acordes y Armonía):** Construcción del currículo y las unidades interactivas para enseñar construcción de acordes.
*   **Integración Web MIDI:** Soporte para conectar pianos/teclados físicos y recibir notas directamente del hardware en tiempo real.

## Posibles Mejoras Futuras

*   **Integración de VexFlow:** Reemplazar los mocks SVG personalizados (`NotationViewer`) por un renderizador profesional como VexFlow para partituras complejas.
*   **Importación MusicXML/MIDI:** Permitir la carga de partituras externas personalizadas.
*   **Sistema de Logros:** Gamificación con recompensas y medallas conectadas al perfil del usuario.
*   **Soporte Multi-idioma:** Preparar la plataforma (i18n) para soportar lecciones en inglés y otros idiomas.
