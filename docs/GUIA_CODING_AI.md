# Guía de Codificación para IA

Esta guía contiene mejores prácticas y directrices de código específicas para agentes automatizados operando en el proyecto **Piano Claro**.

## 1. Patrones de UI y Estilos (Tailwind v4)
- Respeta la dirección artística de la aplicación. Existen dos "mundos" visuales definidos:
  - **Dashboard (Home):** Usa una estética premium "Midnight Blue" con `bg-[#070b14]`, colores ricos y efectos de `backdrop-blur` (Glassmorphism). Los iconos deben ser activos 3D en `public/`.
  - **Módulos / Lecciones:** Usan una estética clara "Ivory/Slate", de alta visibilidad pedagógica (fondos `bg-white` o `bg-slate-50`).
- No introduzcas CSS customizado a menos que sea inevitable. Prioriza las utilidades de Tailwind CSS.

## 2. Uso de Dependencias Externas (Web Audio)
- Piano Claro utiliza `Tone.js` y repositorios personalizados para el manejo del audio. **No instales** ni intentes usar librerías de audio distintas (ej. `howler`, Web Audio puro, etc.) sin justificarlo como un gran rediseño arquitectónico.
- Al interactuar con los motores (`src/lib/`), utiliza los *Hooks* ya construidos en la UI en lugar de invocar la lógica directamente.

## 3. Pruebas y Linters (Biome)
- Piano Claro no usa Prettier ni ESLint, usa **Biome**.
- Cuando modifiques código, si ocurre un error sintáctico, confía en `pnpm lint` en lugar de herramientas tradicionales para debuggear estilos y sintaxis de JavaScript/TypeScript.

## 4. Estructura de Directorios (Aislamiento de Legacy)
- Las rutas antiguas no estandarizadas, prototipos sueltos y scripts de prueba tempranos se encuentran en `/legacy/`.
- **Nunca importes código de `/legacy/` hacia `/modulos/` ni hacia `src/app/page.tsx`**. La relación de dependencia es en un solo sentido: el código de producción moderno es la fuente de la verdad, y el código legacy es obsoleto o de mero apoyo referencial.

## 5. Prevención de Alucinaciones en Edición
- Siempre usa la herramienta `grep_search` para buscar referencias exactas de un componente o clase musical antes de sobrescribir archivos complejos (ej. `NotationViewer.tsx`).
- No reemplaces bloques enteros de código si puedes hacer un parche (`multi_replace_file_content` o regex). Múltiples reescrituras de archivos grandes causan regresiones de código.
