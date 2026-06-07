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
- **Siguiente paso lógico:** Avanzar en el roadmap de lecciones, creando los Módulos 2 (Armonía) o puliendo el diseño general de las vistas de cursos.

## Problemas Detectados / Áreas de Atención
- Existen módulos y componentes dentro de `src/components/legacy` o `src/app/legacy` que referencian importaciones que pueden requerir un escaneo de linters (Biome) para asegurar que nada quedó roto tras el encapsulamiento.
- Faltan integraciones reales con un proveedor de Auth y Base de Datos (el progreso actualmente solo se guarda en `localStorage`).

## Deuda Técnica Encontrada
- **Archivos duplicados y muertos en Legacy:** La carpeta `/legacy/` es un almacén temporal. En el futuro, se debe realizar un esfuerzo de extracción de valor (ej: sacar las lógicas de Tone.js que aún sirvan y borrar los archivos sobrantes).

## Próximos Pasos Recomendados (Siguiente Agente)
1. Reemplazar los desafíos de la Unidad 2 (y crear el Módulo 2 de Acordes) con la misma tecnología Arcade desarrollada.
2. Iniciar la fase de arquitectura de datos (elegir proveedor y conectar base de datos real).
3. Desarrollar un sistema de Puntos/Experiencia (XP) global conectado al Dashboard del usuario.
