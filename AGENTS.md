# Piano Claro - Guía para Agentes de IA (Codex, Claude, etc.)

## Descripción del Proyecto
Plataforma educativa interactiva que enseña piano y teoría musical mediante ejercicios prácticos gamificados.
Construida en **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y motores de audio como **Tone.js**.

## Comandos del Proyecto

El gestor de paquetes es **PNPM**.

- **Instalación:** `pnpm install`
- **Desarrollo:** `pnpm dev`
- **Build (Producción):** `pnpm build`
- **Test (Unitarios):** `pnpm test`
- **Lint & Format (Biome):** `pnpm lint` / `pnpm format`

## Reglas Obligatorias (Restricciones Inquebrantables)

1. **NO BORRAR ARCHIVOS SIN AUTORIZACIÓN:** Si consideras que un archivo es obsoleto o redundante, muévelo a `src/legacy/` o pide autorización expresa al usuario humano antes de invocar un comando de eliminación.
2. **NO MODIFICAR LÓGICA DE NEGOCIO:** La capa de dominio (`src/lib/music`, motores de práctica) no debe ser alterada a menos que el ticket/requerimiento lo exija explícitamente. No refactorices código existente "por mejorarlo" si no se te ha pedido.
3. **NO MODIFICAR DISEÑO GLOBAL:** Evita alterar `globals.css` que pueda afectar todo el sitio, a menos que el plan haya sido aprobado. Usa clases de utilidad o CSS modular encapsulado.
4. **NO INSTALAR DEPENDENCIAS:** No utilices `pnpm add` o introduzcas paquetes nuevos sin antes proponer el plan y recibir confirmación del usuario humano.
5. **PLANIFICACIÓN OBLIGATORIA:** Antes de cambios grandes o reestructuraciones arquitectónicas, crea un archivo `implementation_plan.md` y solicita aprobación.
6. **BUILD ANTES DE FINALIZAR:** Ejecutar `pnpm build` y/o `pnpm typecheck` o `pnpm lint` al terminar cambios pesados para comprobar que el código tipado no se haya roto.
7. **CHANGELOG:** Después de cada tarea importante o sesión terminada, actualiza `docs/CHANGELOG_AI.md` y `docs/SESSION_HANDOVER.md`.
8. **MOSTRAR CAMBIOS:** Comunica siempre al usuario de forma clara qué archivos exactos modificaste al final de tu turno.

## Definición de "Tarea Terminada" (DoD)
Una tarea se considera terminada si y sólo si:
- El código cumple con las directrices de `docs/GUIA_CODING_AI.md`.
- El código compila sin errores TypeScript (`pnpm typecheck` exitoso).
- El proyecto pasa los linters con Biome (`pnpm lint` exitoso).
- La interfaz se ha verificado manual o visualmente y no hay roturas en el layout o consolas con errores de dependencias de React/Next.
- Se actualizaron el Changelog y el Session Handover.
