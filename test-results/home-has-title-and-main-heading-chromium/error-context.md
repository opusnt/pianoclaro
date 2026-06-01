# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> has title and main heading
- Location: tests-e2e/home.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a').filter({ hasText: 'Comenzar gratis' })
Expected: visible
Error: strict mode violation: locator('a').filter({ hasText: 'Comenzar gratis' }) resolved to 2 elements:
    1) <a href="/rutas" class="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition bg-blue-deep text-white shadow-soft hover:bg-[#0d2949] focus-visible:outline-blue-deep ">…</a> aka getByRole('link', { name: 'Comenzar gratis' }).first()
    2) <a href="/rutas" class="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition bg-blue-deep text-white shadow-soft hover:bg-[#0d2949] focus-visible:outline-blue-deep mt-7 ">Comenzar gratis</a> aka getByRole('link', { name: 'Comenzar gratis' }).nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a').filter({ hasText: 'Comenzar gratis' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Ir al inicio de Piano Claro" [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e9]:
          - generic [ref=e10]: Piano Claro
          - generic [ref=e11]: Aprende entendiendo
      - navigation "Navegación principal" [ref=e12]:
        - button "Abrir menú de aprendizaje" [ref=e14]:
          - img [ref=e15]
          - generic [ref=e17]: Aprender
          - img [ref=e18]
        - link "Biblioteca" [ref=e20] [cursor=pointer]:
          - /url: /biblioteca
          - img [ref=e21]
          - generic [ref=e23]: Biblioteca
        - link "Progreso" [ref=e24] [cursor=pointer]:
          - /url: /progreso
          - img [ref=e25]
          - generic [ref=e27]: Progreso
        - link "Planes" [ref=e28] [cursor=pointer]:
          - /url: /pricing
          - img [ref=e29]
          - generic [ref=e33]: Planes
      - button "Perfil de usuario" [ref=e34]: TU
  - main [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e39]:
          - generic [ref=e45]: Do
          - generic [ref=e46]: Re
          - generic [ref=e47]: Mi
          - generic [ref=e48]: Fa
          - generic [ref=e49]: Sol
        - generic [ref=e51]:
          - generic [ref=e52]: Do
          - generic [ref=e53]: Re
          - generic [ref=e54]: Mi
          - generic [ref=e55]: Fa
          - generic [ref=e56]: Sol
          - generic [ref=e57]: La
          - generic [ref=e58]: Si
      - generic [ref=e65]:
        - paragraph [ref=e66]: Piano Claro
        - heading "Aprende piano leyendo música desde el primer día" [level=1] [ref=e67]
        - paragraph [ref=e68]: Una plataforma en español para tocar, leer partituras y entender la música paso a paso.
        - generic [ref=e69]:
          - link "Comenzar gratis" [ref=e70] [cursor=pointer]:
            - /url: /rutas
            - img [ref=e71]
            - text: Comenzar gratis
          - link "Ver cómo funciona" [ref=e73] [cursor=pointer]:
            - /url: "#como-funciona"
            - img [ref=e74]
            - text: Ver cómo funciona
    - generic [ref=e77]:
      - generic [ref=e78]:
        - paragraph [ref=e79]: Método
        - heading "No memorices teclas, entiende música" [level=2] [ref=e80]
        - paragraph [ref=e81]: "Piano Claro organiza la lectura musical como una experiencia práctica: ves la nota, encuentras la tecla, escuchas el pulso y entiendes por qué esa decisión musical importa."
      - generic [ref=e82]:
        - article [ref=e83]:
          - img [ref=e85]
          - heading "Toca" [level=3] [ref=e89]
          - paragraph [ref=e90]: Practica con una partitura pequeña, un teclado visual y pasos que se sienten alcanzables.
        - article [ref=e91]:
          - img [ref=e93]
          - heading "Lee" [level=3] [ref=e95]
          - paragraph [ref=e96]: Conecta notas, pentagrama y ritmo desde el primer día, sin separar teoría y práctica.
        - article [ref=e97]:
          - img [ref=e99]
          - heading "Entiende" [level=3] [ref=e101]
          - paragraph [ref=e102]: Cada canción introduce el concepto musical justo cuando lo necesitas para tocar mejor.
    - generic [ref=e104]:
      - generic [ref=e105]:
        - generic [ref=e106]:
          - paragraph [ref=e107]: Rutas
          - heading "Elige una forma clara de avanzar" [level=2] [ref=e108]
        - link "Ver todas las rutas" [ref=e109] [cursor=pointer]:
          - /url: /rutas
          - img [ref=e110]
          - text: Ver todas las rutas
      - generic [ref=e112]:
        - article [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: Inicial
            - generic [ref=e116]: 32%
          - heading "Piano desde cero" [level=3] [ref=e117]
          - paragraph [ref=e118]: Construye postura, ubicación en el teclado y lectura inicial sin saltarte fundamentos.
          - generic [ref=e119]:
            - generic [ref=e120]:
              - img [ref=e121]
              - text: 4 semanas
            - generic [ref=e124]:
              - img [ref=e125]
              - text: 3 lecciones
          - link "Entrar" [ref=e130] [cursor=pointer]:
            - /url: /rutas/piano-desde-cero
            - text: Entrar
            - img [ref=e131]
        - article [ref=e133]:
          - generic [ref=e134]:
            - generic [ref=e135]: Principiante
            - generic [ref=e136]: 18%
          - heading "Lectura de partituras" [level=3] [ref=e137]
          - paragraph [ref=e138]: Relaciona pentagrama, ritmo y digitación con ejercicios cortos y progresivos.
          - generic [ref=e139]:
            - generic [ref=e140]:
              - img [ref=e141]
              - text: 5 semanas
            - generic [ref=e144]:
              - img [ref=e145]
              - text: 22 lecciones
          - link "Entrar" [ref=e150] [cursor=pointer]:
            - /url: /rutas/lectura-de-partituras
            - text: Entrar
            - img [ref=e151]
        - article [ref=e153]:
          - generic [ref=e154]:
            - generic [ref=e155]: Principiante
            - generic [ref=e156]: 8%
          - heading "Acompañamiento con acordes" [level=3] [ref=e157]
          - paragraph [ref=e158]: Aprende patrones útiles para tocar canciones con cifrado y mano izquierda clara.
          - generic [ref=e159]:
            - generic [ref=e160]:
              - img [ref=e161]
              - text: 6 semanas
            - generic [ref=e164]:
              - img [ref=e165]
              - text: 20 lecciones
          - link "Entrar" [ref=e170] [cursor=pointer]:
            - /url: /rutas/acompanamiento-con-acordes
            - text: Entrar
            - img [ref=e171]
        - article [ref=e173]:
          - generic [ref=e174]:
            - generic [ref=e175]: Base
            - generic [ref=e176]: 24%
          - heading "Técnica útil" [level=3] [ref=e177]
          - paragraph [ref=e178]: Ejercicios breves para coordinación, independencia y sonido sin convertirlo en gimnasia.
          - generic [ref=e179]:
            - generic [ref=e180]:
              - img [ref=e181]
              - text: 3 semanas
            - generic [ref=e184]:
              - img [ref=e185]
              - text: 12 lecciones
          - link "Entrar" [ref=e190] [cursor=pointer]:
            - /url: /rutas/tecnica-util
            - text: Entrar
            - img [ref=e191]
    - generic [ref=e194]:
      - generic [ref=e195]:
        - paragraph [ref=e196]: Diferenciación
        - heading "Diseñado para aprender con contexto" [level=2] [ref=e197]
        - paragraph [ref=e198]: El MVP ya deja preparada la arquitectura para convertir partituras mock en lectura real, práctica con audio y feedback desde teclado digital.
      - generic [ref=e199]:
        - generic [ref=e200]:
          - img [ref=e201]
          - generic [ref=e204]: Español nativo
        - generic [ref=e205]:
          - img [ref=e206]
          - generic [ref=e209]: Partitura guiada
        - generic [ref=e210]:
          - img [ref=e211]
          - generic [ref=e214]: Teoría dentro de canciones
        - generic [ref=e215]:
          - img [ref=e216]
          - generic [ref=e219]: Repertorio latino y popular
        - generic [ref=e220]:
          - img [ref=e221]
          - generic [ref=e224]: Feedback futuro con MIDI/audio
    - generic [ref=e226]:
      - generic [ref=e227]:
        - paragraph [ref=e228]: Pricing
        - heading "Comienza simple, crece después" [level=2] [ref=e229]
      - generic [ref=e230]:
        - article [ref=e231]:
          - generic [ref=e232]:
            - paragraph [ref=e233]: Gratis
            - generic [ref=e234]:
              - generic [ref=e235]: $0
              - generic [ref=e236]: para comenzar
            - paragraph [ref=e237]: Primeras rutas, ejercicios guiados y progreso básico.
          - list [ref=e238]:
            - listitem [ref=e239]:
              - img [ref=e240]
              - text: Acceso a lecciones iniciales
            - listitem [ref=e242]:
              - img [ref=e243]
              - text: Mini partituras guiadas
            - listitem [ref=e245]:
              - img [ref=e246]
              - text: Teclado visual
            - listitem [ref=e248]:
              - img [ref=e249]
              - text: Progreso local ficticio
          - link "Comenzar gratis" [ref=e251] [cursor=pointer]:
            - /url: /rutas
        - article [ref=e252]:
          - generic [ref=e253]:
            - paragraph [ref=e254]: Estudiante
            - generic [ref=e255]:
              - generic [ref=e256]: $8
              - generic [ref=e257]: al mes
            - paragraph [ref=e258]: Para estudiar con continuidad, repertorio y rutas completas.
          - list [ref=e259]:
            - listitem [ref=e260]:
              - img [ref=e261]
              - text: Todas las rutas base
            - listitem [ref=e263]:
              - img [ref=e264]
              - text: Biblioteca por nivel
            - listitem [ref=e266]:
              - img [ref=e267]
              - text: Ejercicios de lectura y ritmo
            - listitem [ref=e269]:
              - img [ref=e270]
              - text: Seguimiento de práctica
          - link "Elegir estudiante" [ref=e272] [cursor=pointer]:
            - /url: /rutas
        - article [ref=e273]:
          - generic [ref=e274]:
            - paragraph [ref=e275]: Premium
            - generic [ref=e276]:
              - generic [ref=e277]: $18
              - generic [ref=e278]: al mes
            - paragraph [ref=e279]: Incluye una futura capa de revisión humana y feedback avanzado.
          - list [ref=e280]:
            - listitem [ref=e281]:
              - img [ref=e282]
              - text: Todo lo de Estudiante
            - listitem [ref=e284]:
              - img [ref=e285]
              - text: Revisión humana futura
            - listitem [ref=e287]:
              - img [ref=e288]
              - text: Feedback MIDI/audio futuro
            - listitem [ref=e290]:
              - img [ref=e291]
              - text: Plan de estudio personalizado
          - link "Ver premium" [ref=e293] [cursor=pointer]:
            - /url: /rutas
  - button "Open Next.js Dev Tools" [ref=e299] [cursor=pointer]:
    - img [ref=e300]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("has title and main heading", async ({ page }) => {
  4  |   await page.goto("/");
  5  | 
  6  |   // Validar el título del documento (SEO)
  7  |   await expect(page).toHaveTitle(/Piano Claro/);
  8  | 
  9  |   // Validar que el título principal de la página está presente
  10 |   const mainHeading = page.locator("h1", { hasText: "Aprende piano leyendo música" });
  11 |   await expect(mainHeading).toBeVisible();
  12 | 
  13 |   // Validar que hay un botón de "Comenzar gratis"
  14 |   const startButton = page.locator("a", { hasText: "Comenzar gratis" });
> 15 |   await expect(startButton).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  16 | });
  17 | 
```