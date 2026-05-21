# Módulo 1: El Teclado Y Las Notas

## 1. Estructura General

**Nombre:** El teclado y las notas  
**Subtítulo:** Descubre el mapa visual del piano  
**Duración estimada:** 25 a 30 minutos  
**Dificultad:** Inicial  
**Prerrequisitos:** ninguno  

**Descripción corta:**  
Una experiencia interactiva para que el usuario deje de ver el piano como una
fila intimidante de teclas y empiece a verlo como un patrón repetido, navegable
y sonoro.

**Resultado esperado:**  
Al terminar, el usuario puede encontrar Do rápidamente, identificar notas
naturales, reconocer grupos de 2 y 3 teclas negras, entender octavas y asociar
izquierda/derecha con grave/agudo.

**Habilidades involucradas:**

- Teclado
- Oído
- Lectura visual inicial sin pentagrama
- Memoria espacial
- Exploración creativa

**Habilidades desbloqueadas después:**

- Ritmo básico
- Intervalos visuales
- Primeras melodías con 3 a 5 notas
- Lectura inicial con partitura

## 2. Microlecciones

Las microlecciones deben sentirse como rondas cortas. La explicación nunca debe
ser el centro; la acción sí.

| ID | Nombre | Objetivo | Duración | Concepto | Interacción | Éxito |
| --- | --- | --- | --- | --- | --- | --- |
| `keyboard-map` | El patrón secreto | Ver grupos de 2 y 3 negras | 2 min | Patrón visual | Tocar grupos iluminados | 4 grupos correctos |
| `find-c` | Encontrando Do | Ubicar Do desde 2 negras | 3 min | Do como ancla | Tocar Do antes del grupo de 2 | 5 Do, 80% precisión |
| `white-notes` | Las siete teclas blancas | Tocar Do Re Mi Fa Sol La Si | 4 min | Notas naturales | Secuencia ascendente/descendente | Secuencia completa |
| `black-keys-orientation` | Las negras son señales | Usar negras como mapa | 2 min | Orientación visual | Encontrar Re/Fa por referencia | 80% precisión |
| `octaves` | Mismo nombre, otra altura | Entender octavas | 3 min | Octava | Tocar pares de Do | 4 pares correctos |
| `low-high` | Grave a agudo | Asociar sonido y posición | 3 min | Registro | Elegir si sube o baja | 80% auditivo |
| `fast-note-hunt` | Caza de notas | Automatizar búsqueda | 4 min | Velocidad visual | Ronda de 20 s | 10 aciertos |
| `first-motif` | Tu primera firma sonora | Crear con 3 notas | 4 min | Aplicación musical | Elegir y repetir patrón | Repite idea 2 veces |

## 3. Experiencia UX Y Flujo

### Entrada

El usuario entra desde el skill tree. El nodo se presenta como una puerta:

> Aprende el mapa del piano en menos de 30 minutos.

La primera pantalla no muestra teoría. Muestra un teclado grande, dos grupos de
teclas negras iluminados y un CTA:

> Descubrir el patrón

### Flujo

1. Ver patrón.
2. Tocar patrón.
3. Descubrir Do.
4. Practicar notas blancas.
5. Comparar octavas.
6. Escuchar grave/agudo.
7. Hacer ronda rápida.
8. Crear mini firma sonora.

### Conceptos

Cada concepto aparece como microcopy sobre la acción:

- "Busca dos negras."
- "Do está justo antes."
- "A la derecha, el sonido sube."
- "El mismo nombre vuelve en otra octava."

### Animaciones

- Tecla objetivo: glow dorado suave.
- Correcto: rebote mínimo y color teal.
- Error: borde rojo breve, sin sacudida agresiva.
- Octava: arco luminoso entre dos teclas.
- Grave/agudo: barrido horizontal izquierda/derecha.

### Audio

El audio aparece desde el primer toque. Cada tecla debe sonar. El sonido de
feedback nunca debe tapar el piano; debe acompañarlo.

### Carga Cognitiva

Reglas:

- no pentagrama todavía
- no sostenidos/bemoles
- no más de una consigna a la vez
- etiquetas visibles al inicio, luego se desvanecen
- si falla varias veces, vuelve la pista visual

## 4. Teclado Interactivo

### Desktop

- 2 octavas visibles.
- Sin scroll horizontal.
- Mouse, teclado del computador y futura entrada MIDI.
- Teclas amplias, con zonas clicables claras.

### Mobile

- 1 octava visible.
- Scroll horizontal asistido.
- Botón "centrar Do".
- Teclas altas y cómodas para pulgar.

### Etiquetas

Modo recomendado: `fade`.

1. Primero visibles.
2. Luego semitransparentes.
3. Luego solo aparecen como pista.
4. Finalmente se ocultan en desafíos.

### Colores

- Teclas blancas: marfil limpio.
- Teclas negras: azul casi negro.
- Objetivo: dorado suave.
- Correcto: teal suave.
- Error: rojo cálido breve.
- Pista: azul claro.

## 5. Sistema De Ejercicios

### Detecta El Patrón

**Objetivo:** reconocer grupos de 2 y 3 negras.  
**Mecánica:** tocar grupos pedidos.  
**Input:** teclado virtual o MIDI.  
**Feedback:** grupo completo se ilumina; si falla, se aisla visualmente el grupo correcto.  
**Variables:** cantidad de octavas, pista previa, límite de tiempo.

### Encuentra Los Do

**Objetivo:** ubicar Do desde grupos de 2 negras.  
**Mecánica:** la app ilumina dos negras; usuario toca el Do anterior.  
**Feedback:** flecha desde las negras hacia Do.  
**Criterio:** 5 Do correctos y 80% precisión.

### Escalera Blanca

**Objetivo:** aprender Do Re Mi Fa Sol La Si.  
**Mecánica:** tocar secuencia ascendente y descendente.  
**Feedback:** cada nota correcta avanza la escalera visual.  
**Variables:** con etiquetas, etiquetas parciales, sin etiquetas.

### Grave O Agudo

**Objetivo:** relacionar sonido y ubicación.  
**Mecánica:** suenan dos notas; usuario elige si la segunda sube o baja.  
**Feedback:** animación horizontal.  
**Variables:** distancia grande, media, pequeña.

### Octava Gemela

**Objetivo:** entender mismo nombre en otra altura.  
**Mecánica:** se muestra Do; usuario busca otro Do grave/agudo.  
**Feedback:** arco y playback.  
**Variables:** solo Do, varias notas, sin etiqueta.

### Caza Rápida

**Objetivo:** memoria espacial y velocidad.  
**Mecánica:** ronda de 20 segundos.  
**Feedback:** combo, precisión, mejora vs intento anterior.  
**Variables:** notas disponibles, octavas, temporizador.

### Memoria Del Mapa

**Objetivo:** responder sin etiquetas.  
**Mecánica:** etiquetas aparecen 3 segundos y desaparecen.  
**Feedback:** si falla dos veces, vuelve pista contextual.  
**Variables:** cantidad de notas y tiempo visible.

### Firma Sonora

**Objetivo:** aplicar musicalmente lo aprendido.  
**Mecánica:** crear patrón de 3 notas y repetirlo.  
**Feedback:** playback y celebración.  
**Criterio:** repetir una idea propia dos veces.

## 6. Gamificación

### XP

- +5 XP por acierto normal.
- +10 XP por acierto sin pista.
- +20 XP por completar microlección.
- +50 XP por ronda perfecta.

### Estrellas

- 1 estrella: completar.
- 2 estrellas: 80% precisión.
- 3 estrellas: 90% precisión y sin ayuda final.

### Combos

Cada 5 aciertos seguidos activa un brillo corto y suma bonus. El combo se rompe
con error, pero no se muestra como castigo.

### Logros

- **Encuentra 10 Do seguidos**
- **Perfecto sin errores**
- **Explorador del teclado**
- **Oído despierto**
- **Primera idea musical**

### Rankings Internos

No usar ranking global todavía. Usar "tu mejor marca":

- mejor precisión
- mayor combo
- menor tiempo para encontrar Do

## 7. Sistema De Audio

### Piano

MVP: Web Audio actual sirve si responde rápido.  
Futuro: samples reales con velocity suave.

### Feedback

- éxito: campana suave tonal
- error: click cálido y bajo
- combo: brillo breve

### Voz Guiada

Opcional. Mejor usar microcopy. La voz puede servir en onboarding o
accesibilidad, pero no debe ralentizar a usuarios rápidos.

### Entrenamiento Auditivo

Primero no se pide reconocer nombres por oído. Se pide distinguir:

- grave/agudo
- mismo nombre en otra octava
- dirección sonora

Esto prepara oído sin frustración.

## 8. Adaptabilidad

### Frustración

Detectar:

- 3 errores consecutivos
- precisión menor a 55%
- tiempo de respuesta subiendo
- abandono de ronda

### Bajar Dificultad

- reducir a una octava
- mostrar etiquetas
- iluminar grupo de negras
- quitar temporizador

### Subir Dificultad

- ocultar etiquetas
- agregar segunda octava
- reducir pistas
- activar caza rápida

### Repetición

Si precisión < 70%, repetir con ayuda.  
Si precisión entre 70% y 85%, avanzar pero sugerir repaso.  
Si precisión > 90%, desbloquear modo desafío.

## 9. Errores Comunes

### Confundir Grupos Negros

Corrección: aislar solo negras y pedir clasificar 2 vs 3.

### Perder Orientación En Otra Octava

Corrección: mostrar arco entre patrones repetidos.

### Confundir Do Con Re O Mi

Corrección: flecha desde grupo de 2 negras hacia la tecla anterior.

### Confundir Grave Y Agudo

Corrección: barrido visual y sonoro izquierda/derecha.

### Depender De Etiquetas

Corrección: modo `on-hint`, donde la etiqueta aparece después del intento.

## 10. Diseño Pedagógico Profundo

Este orden funciona porque empieza con percepción antes que teoría.

El principiante no necesita primero saber "qué es una nota"; necesita poder
orientarse. Los grupos de teclas negras entregan una estructura visual fácil de
reconocer. Do se convierte en ancla. Desde esa ancla, las demás notas se aprenden
por vecindad.

La memoria visual se refuerza con memoria motora: tocar la tecla correcta crea
asociación física. La memoria auditiva aparece al mismo tiempo: cada acción
suena. La teoría, por lo tanto, no se siente abstracta.

La carga cognitiva se controla al excluir pentagrama, alteraciones y digitación
formal. El usuario solo aprende el mapa. Luego se retiran etiquetas para evitar
dependencia.

La recompensa inmediata importa: incluso una acción simple como encontrar Do
debe sentirse como progreso. La mini firma sonora final transforma ubicación de
teclas en música.

## 11. Estructura De Datos

La versión estructurada vive en:

- `src/types/curriculum.ts`
- `src/data/modules/keyboard-notes-module.ts`

Incluye:

- módulo
- microlecciones
- ejercicios
- teclado
- audio
- adaptabilidad
- errores comunes
- logros
- evaluación final

## 12. Recomendaciones Visuales

Estética: clara, premium, cálida, no infantil.

Referencias:

- Duolingo: ciclos cortos, feedback inmediato.
- Simply Piano: teclado protagonista.
- Yousician: sensación de práctica musical.
- Videojuegos casuales premium: recompensas suaves y progreso visible.

Principios:

- teclado como escenario principal
- textos cortos
- tarjetas compactas
- motion sutil
- colores consistentes por estado
- cero saturación de elementos

## 13. Final Del Módulo

### Evaluación Final: Mapa Del Teclado

Tareas:

1. encontrar 5 Do
2. tocar Do Re Mi
3. distinguir grave/agudo
4. encontrar una octava de Do
5. crear firma sonora de 3 notas

### Criterio

- 80% precisión global
- 3 Do correctos mínimo
- 3 de 4 aciertos en grave/agudo
- firma sonora repetida

### Cierre

Celebración:

> Ya no estás mirando teclas sueltas. Estás leyendo el mapa del piano.

Teaser:

> Ahora que sabes dónde están las notas, vamos a aprender cuándo tocarlas:
> Ritmo básico.
