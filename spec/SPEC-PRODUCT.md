# ContentAI — Product Specification (MVP)

**Versión:** 1.0
**Fecha:** 2026-03-28
**Equipo:** Hackathon ITBA 2026 — Categoría Marketing & Growth

---

## 1. Resumen Ejecutivo

**Nombre del producto:** Marki

**Qué es:** Una plataforma web 100% en español que permite a emprendedores y dueños de pymes generar estrategia de contenido profesional para redes sociales con asistencia de IA, sin conocimientos técnicos ni equipo de marketing.

**Para quién:** Emprendedores, dueño de una pyme o negocio local (panadería, tienda de ropa, servicio de limpieza, etc.) que hoy resuelve su marketing con ChatGPT sin saber guiarlo, con templates genéricos de Canva, o directamente no postea. No tiene conocimientos técnicos, puede ser una persona mayor. Habla español.

**Qué problema resuelve:** El emprendedor sin equipo de marketing no sabe qué publicar, cuándo, ni cómo comunicar su negocio de forma consistente. Gasta tiempo en herramientas genéricas que no conocen su negocio y terminan abandonando las redes o publicando de forma irregular.

**Propuesta de valor:** "Generación de estrategia de contenido para redes, personalizado para tu negocio."

**Diferenciadores clave:**
- 100% en español, lenguaje simple y accesible
- El contexto real del negocio siempre está presente — no prompts genéricos
- Genera contenido + estrategia + calendario en un solo lugar
- Orientado a emprendedores y pymes, no a grandes empresas

---

## 2. Objetivos del Producto

### Objetivos de negocio
- Demostrar en 36 horas un MVP funcional y demostrables end-to-end
- Validar que un emprendedor sin conocimientos técnicos pueda planificar y generar contenido de calidad personalizado
- Ganar la categoría Marketing & Growth del Hackathon ITBA 2026

### Objetivos del usuario
- Cargar el contexto de su negocio una sola vez y que la plataforma lo recuerde siempre. Se puede editar el contexto posteriormente
- Generar posts profesionales sin saber escribir copy
- Tener un plan de contenido semanal o mensual organizado sin esfuerzo
- No publicar dos cosas contradictorias o solapadas en el mismo día

---

## 3. Usuarios y Casos de Uso

### 3.1 Perfil principal: El Emprendedor Pyme

**Ejemplo:** María, 45 años, dueña de "La Esquina de María", panadería artesanal en Palermo.
- Tiene Instagram y Facebook pero postea de forma irregular
- Usa ChatGPT pero no sabe cómo pedirle lo que necesita
- No tiene presupuesto para contratar un community manager
- Quiere presencia profesional sin invertir horas por semana

### 3.2 Casos de uso principales

| Caso de uso | Descripción |
|---|---|
| CU-01: Onboarding | El usuario carga el contexto de su negocio por primera y única vez |
| CU-02: Generación rápida | El usuario necesita un post o ad puntual sin planificar |
| CU-03: Plan de contenido | El usuario quiere organizar sus redes por una semana o un mes |
| CU-04: Ver mis planes | El usuario revisa los planes anteriores y el calendario unificado |
| CU-05: Configuracion | El usuario revisa la información de su negocio y puede editarla |

### 3.3 Journey del usuario

```
Primera vez:
Onboarding (negocio + audiencias + productos)
       ↓
Dashboard principal
       ↓
Generación rápida o Plan de contenido
       ↓
Elige variante → Ve el calendario unificado

Usos siguientes:
Dashboard → Generación rápida o Plan → Calendario
Dashboard → Configuración → Edición de datos del negocio
```

---

## 4. Funcionalidades

### 4.1 Onboarding

**Descripción:** El usuario carga el contexto de su negocio una sola vez. Esta información es usada como contexto permanente en todas las generaciones de contenido.

**Datos recopilados:**

**Empresa:**
- Nombre del negocio (obligatorio)
- Rubro (obligatorio)
- Descripción breve (obligatorio)
- Colores de marca (opcional, hex o selector de color)
- Logo (opcional, upload de imagen)
- Redes sociales donde tiene presencia (checkboxes: Instagram, Facebook, TikTok, WhatsApp)
- Tipografía (opcional)

**Audiencias** (puede cargar 1 o más):
- Nombre de la audiencia (ej: "Mamás del barrio")´
- Descripción: edad, intereses, comportamiento, redes sociales que utiliza, ubicación

**Productos/Servicios** (puede cargar 1 o más):
- Nombre del producto/servicio
- Descripción
- Diferencial (qué lo hace especial)

**Criterios de aceptación:**
- CA-01: El usuario puede guardar el onboarding parcialmente (salvo lo obligatorio) y completar el resto más tarde
- CA-02: Debe poder cargar al menos 1 producto para continuar
- CA-03: El usuario puede editar la información del onboarding desde el menú de configuración
- CA-04: Si el usuario no completa el onboarding mínimo (nombre + rubro + 1 producto), el sistema no le permite avanzar hasta que lo complete

**Ejemplo:**
> Empresa: "La Esquina de María" | Rubro: Panadería artesanal | Redes: Instagram, Facebook
> Audiencia 1: "Mamás del barrio" — Mujeres 30–45 años, buscan productos frescos y caseros, usan Instagram en la mañana
> Producto: "Medialunas artesanales" — Hechas con manteca real, sin conservantes. $1.500 la docena. Diferencial: receta de la abuela

---

### 4.2 Dashboard Principal

**Descripción:** Pantalla de inicio después del onboarding con las acciones principales.

**Componentes:**
- Saludo personalizado con el nombre del negocio
- 3 botones de acción principal:
  - **Generación rápida** — Para cuando necesito algo puntual ahora
  - **Crear plan de contenido** — Para organizar mis redes por un período
  - **Mis planes** — Ver los planes que ya creé
- Resumen del calendario: próximas 3 publicaciones planificadas (si existen)

**Criterios de aceptación:**
- CA-05: El dashboard es la pantalla que ve el usuario al iniciar sesión (si ya completó el onboarding)
- CA-06: Si no hay planes activos, el resumen del calendario muestra un estado vacío con CTA a "Crear plan de contenido"

---

### 4.3 Generación Rápida

**Descripción:** Permite generar un post o ad puntual sin crear un plan completo.

**Inputs del usuario:**
1. **Formato:** Post, Carrousel (varias imagenes explicando algo), Reel e Historia (selector)
2. **Producto/servicio a destacar:** dropdown con los cargados en onboarding + opción "Agregar nuevo" (mismo componente de onboarding)
3. **Audiencia:** dropdown con las audiencias del onboarding + opción "Agregar nueva" (mismo componente de onboarding)
4. **Detalles adicionales:** campo de texto libre opcional (ej: "liquidación y quiero hacer un posteo rápido")

**Output:**
- 3 variantes de copy (texto) + descripción de imagen sugerida para cada variante
- El usuario elige una variante
- Puede editar el copy elegido antes de usarlo
- Puede guardar el resultado (queda en "Mis planes" > generaciones rápidas)

**Criterios de aceptación:**
- CA-07: El sistema genera exactamente 3 variantes por solicitud
- CA-08: Cada variante incluye: copy listo para publicar + descripción de imagen sugerida
- CA-09: El usuario puede regenerar las 3 variantes si ninguna le gusta o de a una también puede hacerlo
- CA-10: El copy generado incorpora el contexto del negocio (nombre, producto, audiencia)
- CA-11: Si la API de IA falla, se muestra un error claro con botón "Reintentar"

**Ejemplo:**

Input:
> Tipo: Post | Producto: Medialunas | Audiencia: Mamás del barrio | Detalle: "es jueves, mañana hay feriado"

Output variante 1:
> Copy: "¿Ya tenés el desayuno del feriado resuelto? 🥐 Nuestras medialunas artesanales, hechas con manteca real y la receta de siempre, te esperan mañana desde las 7am. ¡Pasá a buscarlas antes de que se agoten!"
> Imagen: Foto cálida de medialunas recién horneadas sobre papel manteca

---

### 4.4 Plan de Contenido

**Descripción:** Genera una estrategia completa de contenido para un período determinado, con posts, acciones recomendadas y un calendario.

**Inputs del usuario:**
1. **Objetivo** (opciones predefinidas, selección única):
   - Lanzar un producto nuevo
   - Ganar seguidores
   - Aumentar comentarios e interacción
   - Promocionar una oferta
   - Fidelizar clientes existentes

2. **Audiencias** (multiselect con buscador): muestra las audiencias del onboarding, permite buscar por nombre y seleccionar una o más. Incluye opción "Crear nueva audiencia" que abre un modal inline y la guarda automáticamente para futuros planes. El modelo soporta múltiples desde el inicio.

3. **Productos/servicios a destacar** (multiselect con buscador): muestra los productos del onboarding, permite buscar por nombre y seleccionar uno o más. Incluye opción "Agregar nuevo producto" que abre un modal inline y lo guarda automáticamente. El modelo soporta múltiples desde el inicio.

4. **Tono de comunicación** (selección única):
   - Formal
   - Informal
   - Cercano
   - Profesional

5. **Período:**
   - Esta semana
   - Este mes
   - Personalizado (selector de fechas: del X al Y)

6. **Detalles adicionales:** campo de texto libre opcional

**Output del plan (4 componentes):**

**A) Resumen de estrategia:**
Explica qué publicar, cuándo, por qué y cómo, basado en el objetivo y la audiencia.

**B) Contenido para publicar:**
- Posts: copy + descripción de imagen, 3 variantes por pieza

**C) Acciones recomendadas:**
Tácticas que no son publicaciones pero generan resultados (siempre presente en el output).

**D) Calendario unificado:**
Muestra todos los planes activos juntos (no solo el nuevo), con columnas: Día, Acción, Tipo, Plan.

**Criterios de aceptación:**
- CA-12: El calendario muestra todos los planes activos unificados, no solo el recién creado
- CA-13: El plan incluye siempre los 4 componentes (estrategia, contenido, acciones, calendario)
- CA-14: La audiencia o producto creado inline queda guardado y disponible en futuros planes
- CA-15: El usuario puede elegir una variante por pieza y guardar el plan completo
- CA-16: El plan debe tener al menos una audiencia y al menos un producto seleccionado para poder generarse

**Ejemplos:**

Input:
> Objetivo: Lanzar un producto nuevo | Audiencia: Mamás del barrio | Tono: Cercano | Período: Esta semana | Detalle: "Estamos lanzando nuestro pan de masa madre, es la primera vez que lo vendemos"

Resumen de estrategia:
> "Para lanzar tu pan de masa madre con las mamás del barrio te recomendamos una estrategia de lanzamiento en 3 etapas: anticipación (generar curiosidad antes del lanzamiento), revelación (el día del lanzamiento) y prueba social (mostrar reacciones de los primeros clientes). El tono debe ser cercano y emotivo, destacando el proceso artesanal."

Post día 1, variante 1:
> "Algo nuevo está llegando a La Esquina de María... y huele muy bien. ¿Adivinan qué es? 👀"

Acciones recomendadas:
> - Publicar una Story el martes mostrando el proceso de preparación (video corto)
> - Responder todos los comentarios del post de anticipación en menos de 2 horas
> - Pedirles a los primeros clientes que etiqueten a La Esquina de María en sus fotos

Calendario unificado:
| Día | Acción | Tipo | Plan |
|---|---|---|---|
| Lunes | Post de anticipación | Publicación | Masa madre |
| Martes | Story del proceso | Acción | Masa madre |
| Miércoles | Ad de preventa facturas | Ad | Facturas |
| Viernes | Post de lanzamiento | Publicación | Masa madre |
| Sábado | Repost de clientes | Acción | Masa madre |

---

### 4.5 Mis Planes

**Descripción:** Historial de todos los planes creados, con acceso al detalle completo de cada uno.

**Componentes:**
- Lista de planes ordenados por fecha de creación (más reciente primero)
- Por cada plan: nombre del objetivo, período, estado (activo/archivado)
- Al hacer click en un plan: estrategia + contenido + calendario de ese plan
- Opción de archivar un plan (ya no aparece en el calendario unificado)

**Criterios de aceptación:**
- CA-16: El usuario puede ver el detalle completo de cualquier plan anterior
- CA-17: Los planes archivados no aparecen en el calendario unificado pero siguen accesibles en el historial
- CA-18: Las generaciones rápidas aparecen en una sección separada dentro de "Mis planes"

---

## 5. Flujos de Usuario

### Flujo 1: Primera vez — Onboarding

```
1. Usuario ingresa a la plataforma
2. Ve la pantalla de bienvenida con CTA "Empezar"
3. Formulario Paso 1: Datos del negocio (nombre, rubro, descripción, redes)
4. Formulario Paso 2: Audiencias (opcional)
5. Formulario Paso 3: Productos/Servicios (carga al menos 1)
6. Confirma y guarda → redirige al Dashboard
```

### Flujo 2: Generación Rápida

```
1. Usuario entra al Dashboard → click en "Generación rápida"
2. Completa: Formato + Producto + Audiencia + (opcional) Detalle
3. Click en "Generar"
4. Ve spinner "Generando tu contenido..."
5. Ve 3 variantes de copy + imagen sugerida
6. Elige una variante (click en "Elegir esta")
7. Puede editar el texto
8. Opciones: "Copiar" o "Guardar en mis planes"
```

### Flujo 3: Plan de Contenido

```
1. Usuario entra al Dashboard → click en "Crear plan de contenido"
2. Completa: Objetivo + Audiencia + Tono + Período + (opcional) Detalle
3. Click en "Generar plan"
4. Ve el plan completo: Estrategia + Contenido + Acciones + Calendario
5. Por cada pieza de contenido: elige 1 de 3 variantes
6. Click en "Guardar plan"
7. El plan queda activo y su contenido aparece en el calendario unificado
```

### Flujo 4: Ver Mis Planes y Calendario

```
1. Usuario entra al Dashboard → click en "Mis planes"
2. Ve la lista de planes con fecha y objetivo
3. Click en un plan → ve detalle (estrategia + contenido + calendario)
4. Desde cualquier plan puede ver el "Calendario unificado" con todos los planes activos
```

---

## 6. Casos Borde

### 6.1 Onboarding incompleto
- **Escenario:** El usuario intenta ir a cualquier sección sin haber completado el onboarding.
- **Comportamiento:** El sistema lo redirige al onboarding.

### 6.2 Error en la IA
- **Escenario:** La API de generación falla (timeout, error de red, error del proveedor).
- **Comportamiento:** Se muestra un mensaje claro: "No pudimos generar el contenido. Verificá tu conexión e intentalo de nuevo." + botón "Reintentar". No se guarda ningún resultado parcial.

### 6.3 Respuesta de IA fuera de formato
- **Escenario:** La IA no genera exactamente 3 variantes diferenciadas.
- **Comportamiento:** El sistema muestra lo que generó como texto editable con la nota: "La IA generó una respuesta que necesita revisión. Podés editarla directamente."

### 6.5 Período personalizado inválido
- **Escenario:** El usuario selecciona un período personalizado con fecha de fin anterior a la de inicio, o fechas en el pasado.
- **Comportamiento:** El selector de fechas no permite seleccionar fechas inválidas. Si las fechas son en el pasado, muestra: "El período seleccionado ya pasó. ¿Querés elegir fechas futuras?"

### 6.6 Muchas audiencias o productos
- **Escenario:** El usuario tiene muchas audiencias o productos cargados.
- **Comportamiento:** El componente es siempre un multiselect con buscador — no hay un umbral para activar la búsqueda, está disponible desde el primer uso.

### 6.7 Plan sin contenido generado (solo acciones)
- **Escenario:** Para ciertos objetivos (ej: fidelizar clientes), el plan puede no requerir posts sino solo acciones recomendadas.
- **Comportamiento:** La sección B (contenido) muestra "Para este objetivo, la estrategia se basa en acciones directas con tus clientes, no en publicaciones." Las acciones recomendadas están siempre presentes.

### 6.8 Usuario que nunca guardó un plan
- **Escenario:** El usuario entra a "Mis planes" sin haber creado ninguno.
- **Comportamiento:** Estado vacío con el mensaje "Todavía no creaste ningún plan. ¿Empezamos?" y botón "Crear mi primer plan".

### 6.9 Regeneración de variantes
- **Escenario:** El usuario no le gusta ninguna de las 3 variantes generadas.
- **Comportamiento:** Botón "Generar otras variantes" que ejecuta una nueva llamada a la IA con el mismo brief. Las variantes anteriores se reemplazan.

---

## 7. Fuera de Scope (MVP)

Las siguientes funcionalidades NO entran en el MVP de 36 horas:

- **Publicación automática en redes sociales:** ContentAI no se integra con APIs de Instagram, Facebook, TikTok, etc. El usuario copia el copy y publica manualmente.
- **Scheduling automático:** No hay publicación programada automática.
- **Análisis de resultados / métricas:** No se muestran métricas de performance (likes, alcance, CTR). Solo el contenido generado.
- **Logo y colores de marca en imágenes generadas:** Las imágenes son sugerencias de concepto, no se generan imágenes reales con la identidad visual de la marca.
- **Historial de posts publicados:** No se registra qué posts el usuario ya publicó en las redes.
- **Notificaciones:** No hay emails, push notifications ni recordatorios.
- **Multi-usuario / roles:** Una sola cuenta por negocio. No hay roles de equipo.
- **Facturación / planes de pago:** Sin billing ni suscripciones en el MVP.
- **App mobile:** Solo web (desktop y mobile responsive si el tiempo lo permite).
- **Multi-idioma:** La plataforma es 100% en español. Sin i18n.

---

*Spec generado para el Hackathon ITBA 2026 — BTS — Categoría Marketing & Growth*
