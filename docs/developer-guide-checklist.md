# Checklist De Actualización De Guía

Usar este checklist en cada tanda de arquitectura o módulo nuevo.

## Cuando Agregues Un Módulo Jugable

- [ ] Existe `src/types/<module>.ts`.
- [ ] Existe `src/data/<module>.ts`.
- [ ] Existe `src/data/modules/<module>-module.ts`.
- [ ] Existe dominio en `src/lib/<module>/`.
- [ ] Existe UI en `src/components/modules/<module>/`.
- [ ] Está registrado en `src/lib/modules/playable-module-registry.tsx`.
- [ ] Tiene tests de teoría.
- [ ] Tiene tests de preguntas, scoring y progreso.
- [ ] Respeta `docs/responsive-policy.md`.
- [ ] Las superficies musicales anchas usan `.responsive-scroll`.
- [ ] Fue revisado en mobile de 390px y desktop ancho.
- [ ] `docs/developer-guide.md` sigue describiendo el patrón vigente.

## Cuando Cambies UI O Responsive

- [ ] No aparece scroll horizontal global.
- [ ] Teclados, partituras y timelines mantienen overlays alineados dentro del
      mismo contenedor de scroll.
- [ ] Los paneles `sticky` no se activan antes de `lg`.
- [ ] Botones y cards toleran textos largos en español.
- [ ] El feedback no depende solo del color.
- [ ] Se actualizó `docs/responsive-policy.md` si cambió el método.
- [ ] Pasa `tests/docs/responsive-policy.test.ts`.
- [ ] Pasa `tests/responsive/static-responsive-guards.test.ts`.

## Cuando Cambies Seguridad O Backend

- [ ] Validación backend repetida aunque exista validación frontend.
- [ ] No se acepta `userId`, `role`, `roles`, `isAdmin` ni `ownerUserId` desde cliente.
- [ ] Cada operación sensible valida sesión.
- [ ] Cada operación sensible valida rol o ownership.
- [ ] Los errores devueltos al cliente son seguros.
- [ ] Existe test para sesión expirada.
- [ ] Existe test para rol insuficiente.
- [ ] Existe test para acceso a recurso ajeno.
- [ ] `docs/developer-guide.md` fue actualizado.

## Cuando Cambies Persistencia

- [ ] La UI no depende directamente de la implementación.
- [ ] Hay repositorio o adapter.
- [ ] Hay ownership si el dato pertenece a un usuario.
- [ ] Hay pruebas de acceso cruzado entre usuarios.
- [ ] No se usa `localStorage` como fuente de verdad oficial.

## Cuando Cambies Dependencias

- [ ] La dependencia está justificada.
- [ ] No duplica una capacidad ya existente.
- [ ] Se revisó impacto de bundle si corre en frontend.
- [ ] Se ejecutó `pnpm typecheck`.
- [ ] Se ejecutó `pnpm test`.
- [ ] Se ejecutó `pnpm run build`.

## Regla De Cierre

Una tanda no debe considerarse cerrada si:

- cambió arquitectura y la guía no fue revisada;
- cambió seguridad y no hay test;
- cambió responsive y no se revisó `docs/responsive-policy.md`;
- cambió registry de módulos y no pasa `tests/modules/playable-module-registry.test.ts`;
- cambió server modular y no pasan los tests en `tests/server`.
