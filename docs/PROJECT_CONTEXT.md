# Contexto del Proyecto: Piano Claro

Este documento sirve como resumen ejecutivo del estado técnico y funcional del proyecto para que cualquier Agente de IA pueda comprender el sistema rápidamente antes de modificarlo.

## Objetivo del Proyecto

Piano Claro es una plataforma educativa interactiva diseñada para enseñar a tocar el piano y leer partituras desde el primer día, conectando la teoría musical con la práctica a través de ejercicios gamificados y visuales interactivos.

## Stack Tecnológico

*   **Framework Frontend:** Next.js 16 (App Router) + React 19
*   **Lenguaje:** TypeScript
*   **Estilos y UI:** Tailwind CSS v4, componentes modulares con soporte para estética "Midnight Blue" (Dashboard) y "Ivory" (Lecciones).
*   **Motor de Audio/Música:** Tone.js (síntesis de audio), OpenSheetMusicDisplay (renderizado de partituras), Pitchfinder (detección).
*   **Iconografía:** `lucide-react`
*   **Calidad de Código:** Biome (para linting y formateo ultrarrápido).
*   **Testing:** Playwright (tests E2E) y Node Native Test Runner (`tsx --test` para unit tests).
*   **Gestor de Paquetes:** PNPM.

## Arquitectura Detectada

*   **Monolito Modular:** El proyecto se ejecuta como un solo frontend pero separa estrictamente la capa de presentación de la capa de dominio musical.
*   **App Router:** Las rutas principales residen en `src/app/`, divididas en la experiencia moderna (`/modulos/[id]`) y los prototipos antiguos (`/legacy/`).
*   **Dominio Encapsulado:** La lógica pesada de lectura de partituras, motor de práctica y evaluación de notas reside en `src/lib/`.
*   **Sistema de Progresión:** Actualmente simulado o gestionado localmente, sin dependencia fuerte en una base de datos.

## Carpetas Principales

*   `/src/app/`: Rutas, layouts y páginas (App Router).
*   `/src/components/`: Componentes UI reutilizables.
*   `/src/lib/`: Lógica de dominio, motores de audio, utilidades musicales.
*   `/src/server/`: Lógica de backend (auth, progreso, validadores).
*   `/src/data/`: Datos estáticos y simulados (mocks de currículo).
*   `/tests/` y `/tests-e2e/`: Suites de pruebas unitarias y de integración.
*   `/docs/`: Documentación del proyecto y guías para IA.

## Sistema de Autenticación y Base de Datos

*   **Autenticación:** El sistema está preparado en `src/server/auth` pero actualmente utiliza tipos simulados. No se detectan dependencias pesadas como NextAuth, Supabase o Clerk en `package.json`.
*   **Base de Datos:** No se detectan ORMs (Prisma, Drizzle) ni clientes de bases de datos. El progreso se maneja mediante `localStorage` de manera encapsulada a través de un repositorio de progreso.

## Servicios Externos Detectados

*   **Pagos/Suscripciones:** No se detectan integraciones (ej. Stripe).
*   **BaaS:** No se detectan integraciones activas (Firebase, Supabase).

## Decisiones Técnicas Relevantes

1.  **Adopción de Biome:** Se prioriza la velocidad usando Biome en lugar de la combinación tradicional de ESLint + Prettier.
2.  **Testing Nativo:** Uso del test runner nativo de Node.js en lugar de Jest/Vitest.
3.  **UI Evolutiva:** La UI de presentación consume el dominio musical, pero el dominio musical no tiene dependencias de UI, permitiendo su escalabilidad.
4.  **Aislamiento de Legacy:** Todo el código antiguo o experimental se mueve a `/legacy/` para mantener limpio el flujo de `/modulos/`.
