# Historial de Cambios (AI) - Piano Claro

## [2026-06-08] - Integración de Supabase (Base de Datos)
- **SDK & Configuración**: Se instaló `@supabase/supabase-js` y `@supabase/ssr`. Se generaron clientes de Supabase para Browser y Server (`src/lib/supabase/client.ts` y `server.ts`).
- **Página de Autenticación**: Se construyó `/auth` con una interfaz de Login y Registro. Emplea Server Actions nativas (`src/app/auth/actions.ts`).
- **Componente SiteHeader**: Se añadió reactividad al menú principal para detectar sesiones y mostrar dinámicamente el botón "Ingresar" o el email del usuario con un botón de "Log Out".
- **SupabaseProgressProvider**: Se creó un proveedor de estado que sincroniza asincrónicamente el progreso (`mastery`, `stats`, `badges`, `completedLessons`) hacia la tabla PostgreSQL y aplica una estrategia híbrida optimista (LocalStorage + Supabase).
- **Auto-Migración Nube**: Los usuarios invitados que creen una cuenta migrarán instantáneamente su progreso previo sin perderlo.

## [2026-06-08] - Refactorización Estructural y Abstracción de Datos
- **Rutas Dinámicas en Teoría**: Se migró todo el sistema de teoría estático (`/modulos/1`, `/modulos/2`) a un modelo Data-Driven con la ruta dinámica `/teoria/[moduleId]/unidad/[unitId]`.
- **Registro Central (`THEORY_MODULES`)**: Se abstrajo el contenido textual de los índices de teoría hacia una base de datos local `src/data/theory-modules.ts`.
- **Limpieza de Deuda Técnica**: Se eliminó permanentemente la carpeta `src/app/legacy/` y se repararon todos los enlaces entrantes (HomePage, SiteHeader).
- **Abstracción del Proveedor de Progreso**: Se creó la interfaz asíncrona `IProgressProvider` en `src/lib/progress/types.ts`.
- **Migración de Estado**: Se consolidaron 4 variables dispersas de LocalStorage en un solo objeto global (`piano_claro_global_state`) y se implementó lógica de migración automática retroactiva para usuarios existentes.
- **Fusión de Hooks**: `useProgress.ts` fue refactorizado para envolver a `masteryStore.ts`, garantizando sincronía completa entre XP, medallas y unidades completadas.

## [2026-06-09] - Módulo 3 y Gamificación
- **Contenido y Ejercicios**: Añadido el Módulo 3 (Construcción de Acordes) a `theory-modules.ts`. Se implementó `generateChordsQuestion` en el motor de práctica (`exerciseGenerators.ts`) con soporte visual de acordes en el pentagrama usando `PitchNote`.
- **Gamificación Avanzada**: Se expandió `useMastery` para registrar un `practiceHistory` con fechas precisas. Se creó la vista `/perfil` que incluye un Heatmap de estudio mensual (últimos 30 días), cálculo de nivel por XP, panel de rachas de estudio y la Vitrina de Medallas desbloqueables.


## [2026-06-09] - Entrenamiento Auditivo y Escalas (Fases 5 y 6)
- **Ear Training (Fase 5)**: Agregado `generateEarTrainingQuestion` para evaluar la capacidad de diferenciar entre Acordes Mayores, Menores e Intervalos puramente por oído, usando síntesis en tiempo real con Tone.js.
- **Modo Supervivencia**: Creada ruta `/practica/survival` que implementa una versión infinita del TrainingArena con 3 vidas (corazones).
- **Módulo 4 (Fase 6)**: Incorporado Módulo de Escalas y Tonalidades a la BD local, con ejercicios visuales que usan `TrebleClefVisualizer` en modo de notación secuencial espaciando el `xPos` automáticamente para crear Escalas Mayores completas de 8 notas.


## [2026-06-09] - Fases 7 y 8 (Economía Virtual, Analíticas y Ranking)
- **Fase 7 (Repertorio Social)**: 
  - Integración de tabla `repertoire_songs` en Supabase.
  - La página `/repertorio` ahora carga canciones comunitarias.
  - Se implementó un sistema de Economía Virtual donde los usuarios pueden usar su XP para desbloquear canciones de la nube, guardándose la compra en `unlockedSongs`.
- **Fase 8 (Competitividad)**:
  - Instalación de `recharts`.
  - Agregado un **RadarChart** en el Perfil para visualizar el balance de habilidades (Oído, Ritmo, Armonía, Lectura).
  - Creada página `/ranking` conectada a una vista `leaderboard` SQL en Supabase para mostrar el Top 10 de mejores alumnos.
- **Rediseño del Dashboard (`/page.tsx`)**: Refactor completo del Home para integrarlo con el progreso del jugador, eliminando el material antiguo y enrutando directamente hacia los Portales de Teoría, Repertorio, Perfil y Ranking.
- **Bug Fixes Críticos**: Se solucionó la desincronización de rutas dinámicas asíncronas de Next.js 15+ (`params` como Promises) en la sección de Teoría, y se corrigió el enrutamiento cruzado entre canciones bloqueadas del Repertorio hacia el motor de Arcade.

