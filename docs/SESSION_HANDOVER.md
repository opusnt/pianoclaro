# Traspaso de Sesión (Session Handover)

Este documento es una "foto" del estado actual del proyecto al finalizar una sesión de trabajo con IA. Permite retomar el hilo rápidamente.

## Estado Actual del Proyecto
- **Motor Arcade V5 (Modo Cascada & Polifonía)**: El proyecto cuenta ahora con un avanzado Motor Arcade (`ArcadeEngine.tsx`) capaz de leer partituras MusicXML. Soporta:
  - Dos vistas: Tradicional (Staff) y Cascada (Waterfall tipo Synthesia).
  - Silenciamiento de manos individuales (Muting staffs), permitiendo a la app auto-reproducir la mano no tocada y funcionar como un auto-acompañamiento para el alumno.
  - Indicadores de digitación sobre/bajo las notas.
  - Dibujo de estelas dinámicas (duración) y colas musicales.
- **Gamificación (V6 - Fases 14, 15, 16)**:
  - Fase 14: El motor retorna y visualiza una pantalla "Level Clear" con un porcentaje de precisión y un rating de 1 a 3 Estrellas de oro.
  - Fase 15: Integración del motor en la currícula. El test final del Módulo 1 ha sido reemplazado por el motor en "Wait Mode", exigiendo que el alumno toque la melodía en el teclado virtual/físico en lugar de contestar trivias teóricas.
  - Fase 16: El Repertorio (Songbook) `/repertorio` incluye la opción de reproducir canciones clásicas y subidas por los usuarios directamente en el Motor Arcade.
  - Soporte de Letras (Lyrics): Agregado el parseo de la etiqueta `<lyric><text>` y renderizado debajo de las notas.
- **Motor Arcade AAA (V7)**:
  - Renderizado nativo de alteraciones (♯ y ♭) junto a las notas en el pentagrama extrayendo el tag `<alter>`.
  - Animación de "Count-In" (3.. 2.. 1..) introducida antes de que la partitura comience a reproducirse o avanzar.
  - Motor de físicas 2D en Canvas introducido para disparar un sistema de partículas (fuegos artificiales) al obtener calificaciones perfectas.
- **Bifurcación de Aprendizaje (V8)**:
  - Estricta separación de responsabilidades: `/teoria` aloja el aprendizaje de Lenguaje Musical (Módulo 1 y 2), y `/cursos` aloja el entrenamiento físico (Memoria Muscular).
  - Hub de Teoría premium (Midnight Blue) con listado dinámico de Módulos de aprendizaje en lugar del index viejo.
  - El motor de audio para teoría (`useAudioSequencer.ts`) ahora se apoya enteramente en `Tone.js` utilizando *Samplers* con sonido real de Piano de Cola y Batería Acústica, incrementando drásticamente el valor de la producción.
- **Siguiente paso lógico:** Iniciar el diseño y desarrollo de las lecciones del Curso Práctico de Piano aprovechando la tecnología desarrollada en el Motor Arcade.

## Problemas Detectados / Áreas de Atención
- El proyecto contiene más de 180 errores y 90 advertencias de accesibilidad (a11y) detectados por el linter Biome. No rompen la aplicación en tiempo real, pero requieren atención (por ejemplo: agregar `type="button"`, usar roles adecuados, agregar manejadores de teclado a divs con `onClick`).
- Faltan integraciones reales con un proveedor de Auth y Base de Datos (el progreso actualmente solo se guarda en `localStorage`).

## Deuda Técnica Encontrada
- **Archivos duplicados y muertos en Legacy:** La carpeta `/legacy/` es un almacén temporal. En el futuro, se debe realizar un esfuerzo de extracción de valor (ej: sacar las lógicas de Tone.js que aún sirvan y borrar los archivos sobrantes).

## Próximos Pasos Recomendados (Siguiente Agente)
1. Iniciar el desarrollo del "Curso Práctico de Piano" construyendo niveles progresivos guiados por el Motor Arcade.
2. Hacer un barrido general de limpieza de deuda técnica (Linter Biome a11y) si el usuario así lo autoriza.
3. Iniciar la fase de arquitectura de datos (elegir proveedor y conectar base de datos real).
