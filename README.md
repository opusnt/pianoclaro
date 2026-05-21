# Piano Claro

MVP conceptual en Next.js App Router para una plataforma en español de aprendizaje de piano leyendo partituras desde el primer día.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
```

La app usa datos mock en `src/data` y deja puntos claros para integrar VexFlow, Tone.js, Web MIDI, autenticación, base de datos y progreso real por usuario.

## Documentación para desarrollo

- [Arquitectura](docs/architecture.md)
- [Guía para desarrolladores externos](docs/developer-guide.md)
- [Checklist de actualización de guía](docs/developer-guide-checklist.md)
- [Política responsive](docs/responsive-policy.md)
- [Sistema pedagógico](docs/learning-system.md)
- [Revisión técnica](docs/technical-review.md)

Antes de cerrar una tanda de arquitectura o un módulo nuevo, revisar
`docs/developer-guide-checklist.md` y ejecutar:

```bash
pnpm typecheck
pnpm test
pnpm run build
```
