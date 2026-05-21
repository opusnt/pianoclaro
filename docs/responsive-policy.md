# Política Responsive

Esta política define cómo debe comportarse Piano Claro en mobile, tablet y
desktop. Es obligatoria para páginas nuevas, módulos interactivos y superficies
musicales.

## Objetivo

La app debe funcionar primero en mobile y escalar a desktop sin:

- scroll horizontal global;
- texto cortado en botones o cards;
- paneles superpuestos durante scroll;
- teclados o partituras desalineados;
- controles inaccesibles por tamaño o posición.

## Breakpoints

Usar Tailwind de forma mobile first:

| Rango | Uso |
| --- | --- |
| base | Mobile. Una columna, botones grandes, superficies apiladas. |
| `sm` | Ajustes menores de texto, listas y botones. |
| `md` | Dos columnas cuando la lectura siga siendo clara. |
| `lg` | Layouts de app con sidebar o panel secundario. |
| `xl` | Tres columnas solo si no compromete la práctica musical. |

No usar anchos fijos sin un contenedor responsive.

## Layouts

Reglas:

- Toda página debe tener `max-w-*` o una grilla controlada.
- En mobile, los layouts de app se apilan en una columna.
- En desktop, las páginas de práctica pueden usar dos o tres columnas.
- Los paneles `sticky` solo deben activarse desde `lg`.
- No usar `h-screen` para pantallas con contenido educativo largo; preferir
  `min-h-screen`.

## Superficies Musicales

Partituras, teclados, timelines y visualizadores pueden necesitar más ancho que
el viewport. En esos casos:

- envolver la superficie con `.responsive-scroll`;
- mantener todo lo que debe alinearse dentro del mismo contenedor interno;
- si hay teclas negras absolutas, deben vivir dentro del mismo stage que las
  teclas blancas;
- no permitir que el ancho mínimo escape al viewport global.

Patrón recomendado:

```tsx
<div className="responsive-scroll">
  <div className="relative min-w-[720px]">
    {/* superficie musical completa */}
  </div>
</div>
```

## Texto Y Controles

Reglas:

- Botones y links deben tolerar textos largos en español.
- Las etiquetas dentro de teclas o notas deben poder ocultarse si el espacio no
  alcanza.
- Métricas secundarias no deben competir con el foco principal de práctica.
- No depender solo del color para feedback; incluir texto, icono o estado.

## Global CSS

La base global debe incluir:

- `overflow-x: clip` en `html` y `body`;
- `text-size-adjust: 100%`;
- medios con `max-width: 100%`;
- utilidad `.responsive-scroll` para superficies anchas.

## Guardias Automatizadas

El archivo:

```txt
tests/responsive/static-responsive-guards.test.ts
```

protege estas reglas:

- no usar `overflow-x-auto` directo fuera de casos allowlist;
- no agregar `min-w-[...]` grande sin `.responsive-scroll`;
- no introducir `sticky top-*`, `fixed inset` o `h-screen` en experiencias
  educativas sin revisión explícita.

Si una excepción es legítima, debe quedar en la allowlist del test con una razón
clara en el cambio.

## Checklist Por Cambio

- [ ] Probado en 390px de ancho.
- [ ] Probado en desktop ancho.
- [ ] `document.documentElement.scrollWidth <= window.innerWidth + 2` salvo
      dentro de `.responsive-scroll`.
- [ ] No hay overlays entre paneles durante scroll.
- [ ] Teclas negras y blancas se desplazan juntas si el teclado hace scroll.
- [ ] La partitura mantiene alineación entre notas, compases y pista visual.
- [ ] Los botones principales son tocables y no cortan texto.
- [ ] La UI no depende solo del color para comunicar acierto/error.
- [ ] Pasa `tests/responsive/static-responsive-guards.test.ts`.
