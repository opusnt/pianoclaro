# Sistema de aprendizaje de Piano Claro

## Principio de producto

Piano Claro debe sentirse como un **skill tree musical**, no como un curso
académico lineal. Cada módulo de teoría o lección de piano desbloquea una
habilidad tocable: leer mejor, tocar con más pulso, reconocer sonido, acompañar
una canción o crear una frase.

La experiencia principal se divide en dos carriles:

- **Teoría musical**: módulos interactivos en `/modulos`.
- **Lecciones de piano**: sesiones de lectura, teclado y repertorio en `/lecciones`.

Ambos carriles deben funcionar para aprendizaje autónomo. Si una mejora
pedagógica no aparece como acción, feedback, reparación, autoevaluación o reto
visible para el alumno, todavía no está integrada al producto.

La teoría aparece siempre en este orden:

1. **Observar**: ver el patrón en partitura, teclado o progresión.
2. **Entender**: nombrar el concepto con lenguaje simple.
3. **Tocar**: aplicarlo inmediatamente en piano virtual, teclado físico o MIDI.
4. **Escuchar**: comparar lo esperado con lo que suena.
5. **Usar**: llevarlo a una mini canción, loop, variación o reto creativo.

## Unidad De Aprendizaje

La unidad de aprendizaje es la frontera principal para seguir agregando
contenido sin desconectar lecciones de piano y teoría musical.

Cada unidad vive en:

```txt
src/data/learning-path.ts
```

Una unidad debe definir:

- objetivo corto que el usuario pueda entender;
- resultado observable al terminar;
- lecciones de piano asociadas;
- módulo de teoría musical asociado, si existe;
- habilidades principales que entrena;
- prerequisitos;
- criterios de dominio;
- evidencia que permite considerarla lograda;
- acciones de reparación si el usuario falla.

Regla: una lección de piano guía una sesión de práctica; un módulo de teoría
entrena y evalúa un concepto; la unidad decide por qué ambas piezas existen y
cómo se conectan.

Antes de crear una nueva lección o módulo, agregar o actualizar su unidad de
aprendizaje. Si una experiencia no cabe en una unidad con criterio de dominio,
probablemente está demasiado suelta para entrar al producto.

## Arquitectura Pedagógica General

### Microlecciones

Cada microlección debe durar entre 3 y 8 minutos. Una buena microlección enseña
una sola decisión musical:

- ubicar una nota
- respetar un silencio
- reconocer que la melodía sube
- construir una tríada
- tocar una progresión con pulso

La unidad mínima no es "leer una explicación"; es "comprender algo y tocarlo".

### Práctica inmediata

Toda explicación debe cerrar con una acción:

- tocar una tecla
- completar un patrón
- seguir un ritmo
- elegir una respuesta auditiva
- construir un acorde
- improvisar dentro de límites seguros

Si una pantalla enseña teoría y no pide una acción, probablemente está
demasiado cerca de un libro y demasiado lejos de una app musical.

### Ejercicios interactivos

Los ejercicios deben combinar tres canales:

- **Visual**: partitura, teclado, colores, dirección, distancia.
- **Auditivo**: sonido de nota, intervalo, acorde, pulso o backing track.
- **Táctil**: entrada por teclado virtual, teclado del computador o Web MIDI.

### Feedback automático

El feedback ideal responde cuatro preguntas:

- ¿tocaste la nota correcta?
- ¿tocaste en el momento correcto?
- ¿entendiste el patrón o solo acertaste?
- ¿qué deberías mirar antes de intentarlo de nuevo?

Ejemplo de feedback útil:

> Tocaste Re, pero la partitura sigue en Do. Mira que la nota no subió: se
> mantiene en la misma altura.

### Repetición Espaciada

El sistema debe recomendar repasos por habilidad, no solo por módulo:

- si falla ritmo, volver a patrones de pulso
- si falla lectura, volver a dirección melódica
- si falla oído, volver a comparación auditiva
- si falla acordes, volver a construcción por intervalos

Cada módulo puede generar `nextReviewAt` y una recomendación breve.

### Desbloqueo Progresivo

Los módulos se desbloquean por mezcla de:

- módulos completados
- precisión mínima
- consistencia
- control de tempo
- habilidad mínima en una rama

El desbloqueo no debe ser punitivo. Si el usuario no alcanza criterio, la app
debe ofrecer "ruta de reparación": un ejercicio corto enfocado en la debilidad.

### Aplicación Musical Real

Cada etapa debe incluir aplicación real:

- una mini melodía
- una canción simplificada
- una progresión
- un patrón de acompañamiento
- una improvisación limitada
- una variación o rearmonización

La teoría se valida cuando el usuario puede usarla musicalmente.

### Evaluación Por Habilidad

El avance lineal no basta. El sistema debe medir ramas:

- Teclado
- Ritmo
- Oído
- Lectura
- Escalas
- Acordes
- Armonía
- Canciones
- Improvisación
- Composición / arreglo

Un usuario puede estar avanzado en teclado y débil en ritmo. La UX debe mostrar
esa diferencia sin hacerlo sentir reprobado.

## Etapas

### Etapa 1: Fundamentos Visuales Y Auditivos

**Objetivo:** entender teclado, notas, pulso, ritmo básico e intervalos desde lo
visual, auditivo y táctil.

**Habilidades:** ubicar notas, leer dirección, mantener pulso, escuchar
distancias simples.

**Previos:** ninguno.

**Resultado:** el usuario toca frases de pocas notas entendiendo dónde están,
cuándo suenan y cómo se mueven.

**Ejercicios:** tocar nota indicada, reconocer nota escuchada, seguir ritmo,
encontrar intervalos.

**Feedback ideal:** corrección visual en teclado/partitura, pulso animado,
comparación auditiva y pistas de dirección.

**Relación con piano:** teclado siempre visible; las etiquetas pueden retirarse
progresivamente.

**Gamificación:** rachas de lectura, medallas por tocar sin etiquetas, mini
canciones desbloqueadas.

**Aprobación:** 80% de precisión, pulso estable en negras/silencios, lectura de
dirección ascendente/descendente.

**Errores a detectar:** confundir Do/Mi en pentagrama, tocar antes del pulso,
moverse en dirección contraria.

### Etapa 2: Escalas Y Tonalidad

**Objetivo:** organizar notas en escalas, tonalidades y patrones tocables.

**Habilidades:** construir escalas, reconocer centro tonal, tocar patrones de
tono/semitono.

**Previos:** notas, pulso, intervalos.

**Resultado:** el usuario entiende mayor, menor, armadura inicial y pentatónica.

**Ejercicios:** completar escala, reconocer color mayor/menor, tocar patrón,
crear melodía limitada.

**Feedback ideal:** patrón visual en teclado, comparación auditiva, explicación
de dónde se rompió el patrón.

**Relación con piano:** teclas resaltadas por escala y raíz; digitaciones
sugeridas más adelante.

**Gamificación:** mapa de tonalidades, desbloqueo de escalas, retos sin nombres.

**Aprobación:** construir escalas desde varias raíces, distinguir mayor/menor,
mantener pulso.

**Errores a detectar:** romper tono/semitono, confundir raíz con primera nota
visible, tocar escala sin tempo.

### Etapa 3: Armonía Y Acordes

**Objetivo:** construir, reconocer y usar acordes.

**Habilidades:** tríadas, inversiones, cambios de acorde, campo armónico.

**Previos:** escalas, intervalos, tonalidad.

**Resultado:** el usuario acompaña progresiones simples y entiende de dónde
salen sus acordes.

**Ejercicios:** construir acorde, identificar acorde, tocar progresión, analizar
grados.

**Feedback ideal:** notas faltantes/sobrantes, calidad del acorde, sincronía,
función armónica.

**Relación con piano:** acordes como formas visuales e inversiones como mismas
notas reordenadas.

**Gamificación:** constructor de acordes, insignias por calidad mayor/menor,
desbloqueo de loops.

**Aprobación:** construir tríadas, usar inversiones básicas, tocar I-IV-V-vi.

**Errores a detectar:** omitir tercera, confundir inversión con acorde nuevo,
tocar notas desincronizadas.

### Etapa 4: Música Real

**Objetivo:** conectar teoría con canciones, progresiones, lectura aplicada y
acompañamiento.

**Habilidades:** tocar progresiones, leer frases, detectar patrones, acompañar.

**Previos:** acordes, lectura básica, ritmo simple.

**Resultado:** el usuario practica repertorio por patrones, no por memorización.

**Ejercicios:** tocar progresión, seguir ritmo, analizar progresión, lectura por
frases.

**Feedback ideal:** anticipación de cambios, continuidad de pulso, patrones
repetidos, compases débiles.

**Relación con piano:** modos de práctica: lectura, acordes, acompañamiento.

**Gamificación:** canciones por habilidad, misiones de acompañamiento, backing
tracks lentos.

**Aprobación:** tocar una progresión en tempo, leer una mini pieza, explicar el
patrón principal.

**Errores a detectar:** perder pulso al cambiar acorde, leer nota por nota sin
patrón, no anticipar frases.

### Etapa 5: Expresión Y Creación

**Objetivo:** crear, improvisar, modificar armonías y usar recursos avanzados.

**Habilidades:** improvisación, motivo, rearmonización, tensiones, modulación.

**Previos:** escalas, acordes, progresiones, lectura aplicada.

**Resultado:** el usuario usa teoría como lenguaje creativo.

**Ejercicios:** improvisar con backing track, analizar progresión, rearmonizar,
elegir tensiones.

**Feedback ideal:** notas objetivo, resolución, coherencia de frase, tensión vs.
melodía.

**Relación con piano:** zonas seguras, tensiones disponibles, rutas de
modulación.

**Gamificación:** laboratorio creativo, comparación de versiones, retos de
variación.

**Aprobación:** crear una frase con motivo, rearmonizar una cadencia simple,
explicar una decisión musical.

**Errores a detectar:** improvisar sin cierre, tensiones que chocan con melodía,
modular sin preparación.

## Modelo De Módulo Estándar

Todo módulo futuro debe definirse con:

- `id`
- `stageId`
- `name`
- `objective`
- `mainConcepts`
- `practicalSkill`
- `keyboardVisualization`
- `auditoryExercises`
- `executionExercises`
- `recognitionExercises`
- `creativeMiniChallenge`
- `finalAssessment`
- `unlockCriteria`
- `contributesToSkills`
- `estimatedMinutes`
- `difficulty`
- `prerequisites`

Este modelo está implementado en `src/types/curriculum.ts` y alimentado en
`src/data/curriculum.ts`.

## Reglas UX

- Mostrar siempre qué habilidad se está entrenando.
- Evitar pantallas largas de teoría sin acción.
- Usar "mirar -> entender -> tocar -> escuchar" como flujo base.
- Permitir repetir sin castigo.
- Separar error de nota, error de ritmo y error conceptual.
- Mostrar progreso por habilidades, no solo porcentaje global.
- Usar canciones como recompensa práctica, no solo como biblioteca.

## Gamificación Recomendada

- XP por habilidad, no solo XP global.
- Rachas cortas de práctica útil.
- Insignias por hitos musicales reales: "Primer silencio limpio", "Primer I-V-vi-IV".
- Desbloqueo de canciones por habilidades requeridas.
- Retos creativos opcionales para usuarios curiosos.
- Repaso inteligente como "misión de mantenimiento", no como castigo.

## Estructura Técnica

Tipos principales:

- `CurriculumStage`
- `ModuleBlueprint`
- `SkillBranch`
- `ExerciseTypeDefinition`
- `UnlockRule`
- `UserLearningProgress`

Datos principales:

- `skillBranches`
- `curriculumStages`
- `moduleBlueprints`
- `exerciseTypes`

Repositorio:

- `contentRepository.getCurriculumStages()`
- `contentRepository.getSkillBranches()`
- `contentRepository.getModuleBlueprints()`
- `contentRepository.getExerciseTypes()`

## Ejemplo De Progreso De Usuario

```ts
const progress = {
  userId: "demo-user",
  completedModuleIds: ["tus-primeras-5-notas"],
  weakSkillIds: ["rhythm"],
  masteredSkillIds: ["keyboard"],
  recommendations: [
    {
      type: "repair-skill",
      targetId: "basic-rhythm",
      reason: "Tu precisión de nota es buena, pero el pulso cae en silencios.",
    },
  ],
};
```

## Criterio Para Próximos Prompts

Cuando desarrollemos un módulo específico, el prompt debería pedir:

1. objetivo del módulo
2. microlecciones
3. ejercicios por tipo
4. criterios de aprobación
5. errores detectables
6. datos mock
7. UI necesaria
8. feedback esperado
9. cómo actualiza el skill tree

Así cada módulo nuevo se suma al sistema sin romper la arquitectura pedagógica.
