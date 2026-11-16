# Brief — Landing del kiosco de impresión de fotos

> Documento para el agente que va a construir la landing. Todo lo que se afirma aquí está
> verificado contra el repositorio del kiosco (`/Users/mager19/Documents/vibecoding/conceptos/imprimir`,
> rama `seguridad-tunel`, 2026-11-16). Cada funcionalidad lleva su **evidencia** (ruta del
> repo). **No añadas afirmaciones que no estén aquí**: si algo te falta, márcalo como pregunta
> abierta, no lo inventes.
>
> Idioma de la landing: **español neutro y profesional** (público colombiano). Nada de
> «parce», nada de anglicismos innecesarios. Pesos colombianos cuando haga falta (COP).

---

## 1. Objetivo y públicos

**Objetivo:** que un organizador de eventos o un centro comercial entienda en un minuto
qué es el kiosco, cómo lo usa la gente y qué gana él, y **solicite un kiosco** con el
formulario de contacto.

Palabras del dueño (no las cites en la página; son la intención):
«el landing del kiosco como tal, explicando cómo funciona, qué beneficios tiene, un botón de
contacto para que puedan solicitar un kiosco para su evento o para su centro comercial con
todas las funcionalidades y todo lo que tiene el kiosco como tal y el desarrollo que acabamos
de hacer».

**Públicos:**

1. **Organizadores de eventos** — bodas, eventos corporativos, ferias. Buscan una atracción
   que los invitados usen solos y que se lleven un recuerdo físico.
2. **Centros comerciales / operadores de locales** — buscan un punto de servicio que funcione
   sin personal dedicado, que cobre solo y que no genere problemas.

Público secundario (aparece en la página pero no es a quien se le vende): **la persona que
imprime** — alguien de paso con fotos en su teléfono.

---

## 2. Mensaje principal y propuesta de valor

**Idea central (verificada en `PRODUCT.md`, «Positioning»):** el teléfono de la persona es el
control y la billetera; el kiosco solo muestra e imprime. Nadie instala nada, nadie toca
dinero ni teclea datos de pago en una pantalla pública.

Propuestas de titular (elige o adapta; todas son verdaderas):

- «Tus invitados imprimen sus fotos desde su propio teléfono.»
- «Del teléfono al papel: escanea, elige, paga y llévatela.»
- El kiosco ya usa en su pantalla de bienvenida: **«Imprime tus fotos — Escanea, elige y
  llévate tus recuerdos»** (ver captura `capturas/k-bienvenida.png`).

**Beneficios para el organizador / centro comercial** (cada uno con su respaldo):

| Beneficio | Respaldo |
|---|---|
| Funciona sin personal al lado: la persona hace todo el recorrido sola, con pasos guiados. | `PRODUCT.md` («El éxito es que alguien sin ayuda termine con sus fotos impresas»); flujo lineal en `docs/decisiones/editor.md`. |
| Cobra solo, en el teléfono de la persona, con Wompi (pasarela colombiana). | `docs/decisiones/cobros.md`, `docs/wompi.md`. |
| También puede funcionar **sin cobrar** (modo evento pagado por el organizador). | `CLAUDE.md` § Cobro: «Sin las tres credenciales, o con `COBRO_ACTIVO=0`, imprime sin cobrar». ⚠️ Es una configuración de instalación, no un botón del panel: confírmalo con el dueño antes de venderlo como «modo evento» (ver §9). |
| Precios, formatos y herramientas se ajustan desde un panel de operación, sin reiniciar. | `docs/decisiones/ajustes-operador-servicio.md`, `web/src/operador/OperadorPage.tsx` (secciones «Módulos», «Tema de temporada», «Formatos y precios»). |
| Temas de temporada (Navidad, Amor y amistad, Vacaciones) que cambian los colores y los stickers. | `server/src/ajustes.ts` (temas), `odd/tasks/stickers-temporada.md`. |
| Atrae sola: tras un minuto sin uso, la pantalla pasa a un video en loop que enseña el proceso. | `web/src/kiosk/WelcomeScreen.tsx` (`ESPERA_VITRINA_MS = 60_000`). |
| Quien paga siempre recibe lo que pagó: si el papel no sale, el pago y las fotos se conservan y el personal lo resuelve con un **vale de reimpresión** o una devolución. | `PRODUCT.md` (principio «Lo pagado se entrega»), `docs/decisiones/vales.md`. |
| Privacidad por diseño: fotos temporales, sin cuentas ni datos personales guardados. | `docs/decisiones/privacidad.md`. |
| Segura en un lugar público: solo la máquina física inicia sesiones y cada sesión queda atada a un solo teléfono. | `odd/tasks/seguridad-tunel.md`, `server/src/enlace.ts`. |

**Beneficios para quien imprime:** no instala ninguna aplicación, no crea cuenta, usa las
fotos de su propio carrete, ve en la pantalla grande exactamente lo que va a salir
(«lo que se ve es lo que sale», `PRODUCT.md`), y paga con los medios que ya usa.

---

## 3. Cómo funciona (los pasos reales)

El kiosco es un **asistente de 4 pasos** que se ve arriba en la pantalla: **Fotos → Edita →
Tamaño → Paga** (`docs/decisiones/editor.md`, «El kiosco es un asistente lineal»). Para la
landing conviene contarlo en 5–6 momentos:

1. **Toca la pantalla y escanea el QR con tu teléfono.**
   `capturas/k-bienvenida.png` — Pantalla de bienvenida del kiosco (vertical) con polaroids de fotos reales.
   `capturas/k-qr.png` — El QR para conectar el teléfono; abajo, el aviso de privacidad.
2. **Sube tus fotos desde el teléfono.** Se abre una página web (no una app): «Elegir fotos»,
   seleccionas y suben solas.
   `capturas/p-subir.png` — La página del teléfono: «Sube tus fotos» y el botón «Elegir fotos».
   `capturas/p-subidas.png` — El teléfono confirma «3 de 3 fotos subidas».
3. **Aparecen al instante en la pantalla del kiosco.**
   `capturas/k-conectado.png` — El kiosco confirma «Teléfono conectado».
   `capturas/k-galeria-f12.png` — La galería del kiosco con las fotos recién llegadas.
4. **Edítalas en la pantalla grande** (opcional): encuadre, girar, stickers, calendario, filtros.
   `capturas/k-encuadre.png` — Encuadre de la foto sobre la hoja real.
   `capturas/k-calendario.png` — Calendario sobre la foto, con el día marcado con un corazón.
   `capturas/k-stickers-puestos.png` — Stickers de la temporada «Vacaciones» colocados sobre la foto.
5. **Elige tamaño y copias.**
   `capturas/k-tamanos.png` — La pantalla de tamaños: cada formato dibuja la hoja que va a salir.
   `capturas/k-tamano-elegido.png` — Pedido armado con su total.
6. **Paga desde tu teléfono y recoge tu foto.**
   `capturas/k-cobrando.png` — El kiosco espera el pago: «Toca "Pagar" en tu teléfono» (y un QR de respaldo).
   `capturas/p-pagar.png` — El botón de pago aparece en el mismo teléfono («Pago seguro con Wompi»).
   `capturas/hoja-impresa.png` — La hoja real que el servidor compone para la impresora (con stickers y calendario).

⚠️ Los importes que se ven en las capturas (p. ej. $8.000) son **valores de una instalación de
desarrollo**. No los repitas como precio comercial (ver §9).

---

## 4. Funcionalidades (agrupadas, con evidencia)

### Experiencia de la persona
- **Sin app ni cuenta**: escanea un QR y sube desde el navegador del teléfono. —
  `web/src/mobile/UploadPage.tsx`, `CLAUDE.md` («El flujo de usuario es sagrado»).
- **Fotos en vivo en la pantalla** al subirlas. — `server/src/events.ts` (SSE), `CLAUDE.md`.
- **Retomar más tarde**: si la persona se aleja, sus fotos quedan en reposo y vuelve con un
  **código de 5 caracteres** que teclea en su teléfono. — `docs/decisiones/sesiones.md`.
- **Pantalla vertical táctil de 32"**, pensada para usarse de pie con un dedo. —
  `docs/decisiones/hardware.md`, `contexto.md`.

### Editor (en la pantalla del kiosco)
Herramientas en `web/src/kiosk/editor/registry.ts` y `tools/`:
- **Encuadre** (recortar y acercar sobre la hoja real) y **Girar** 90°.
- **Stickers de temporada**: se elige uno, se arrastra con el dedo, se agranda/achica con
  − / + y se gira con botones; varios por foto. Solo aparecen cuando hay un tema de temporada
  activo. 21 de Vacaciones, 10 de Navidad, 8 de Amor y amistad. — `tools/stickersTool.tsx`,
  `odd/tasks/stickers-temporada.md`.
- **Calendario** sobre la foto: el mes que quieras, un día marcado con **círculo o corazón**,
  en cualquiera de las cuatro esquinas, en tamaño pequeño o grande. — `tools/calendarTool.tsx`.
- **Filtros**: Blanco y negro, Sepia, Vívido, Cálido, Frío. — `tools/filterTool.tsx`.
- **Auto-mejora** — existe; nace apagada y se enciende desde el panel. — `tools/enhanceTool.tsx`,
  `CLAUDE.md` («`decor` y `enhance` nacen apagados»).
- **Lo que se ve es lo que sale**: la vista previa reproduce la composición que se imprime. —
  `docs/decisiones/editor.md`.
  `capturas/k-filtros.png` — Panel de filtros en el editor.

### Formatos de impresión (rollo 4×6 / 10×15)
De `server/src/catalogo.ts` (valores de fábrica; cada máquina los ajusta):
- **Clásica 10 × 15 cm** (vertical u horizontal), a sangre.
- **Documento 3 × 4 cm** — 9 fotos por hoja (la medida se puede cambiar y la rejilla se recalcula).
- **Dúo 10 × 7,5 cm** — dos fotos por hoja con línea de corte.
- **Separador de libro 3 × 15 cm** — tres tiras de la misma foto por hoja.
- **Polaroid** — existe pero está **en pausa**. No la anuncies.
- Se pueden **pausar formatos** desde el panel. — `docs/decisiones/catalogo.md`.

### Pago
- **Wompi** (Colombia, Grupo Bancolombia), en el **teléfono de la persona**; el kiosco solo
  muestra el total y espera. — `docs/decisiones/cobros.md`.
- **Medios de pago**: los que muestra el checkout de Wompi dependen de lo que el comercio
  tenga habilitado en su cuenta (`docs/wompi.md` §3). La documentación del proyecto prioriza
  **Nequi, Bancolombia (QR/botón) y tarjeta**; PSE «aceptable». Mientras el dueño no
  confirme qué está habilitado en producción, escribe algo como «Paga con Nequi, tarjeta y
  otros medios de Wompi» o simplemente «Pago seguro con Wompi desde tu teléfono».
- El kiosco **no guarda datos de pago ni de la persona**; los secretos nunca salen del
  servidor. — `CLAUDE.md` § Cobro.
- **Vale de reimpresión**: si alguien pagó y el papel no salió, el personal le da un vale
  (código `V` + 5, vigencia 14 días) que se canjea desde el teléfono. — `docs/decisiones/vales.md`.

### Impresión
- **Impresora fotográfica de sublimación HiTi P525L**, rollo 4×6. — `contexto.md`,
  `pendientes-por-resolver.md` (sublimación), `docs/decisiones/hardware.md`.
- El pedido se da por entregado **solo cuando la impresora confirma que la hoja salió**. —
  `docs/decisiones/impresion.md`.
- No afirmes velocidades de impresión ni capacidad del rollo por evento (ver §9).

### Operación (panel `/operador`)
Desde otro equipo o teléfono (nunca en la pantalla del kiosco), con clave. —
`web/src/operador/OperadorPage.tsx`, `docs/decisiones/ajustes-operador-servicio.md`:
- **Formatos y precios** (precios configurables, se aplican en caliente).
- **Módulos**: imprimir en papel sí/no; herramientas del editor encendidas o apagadas.
- **Tema de temporada**: Normal, Navidad, Amor y amistad, Vacaciones (el kiosco lo aplica en
  un minuto, sin reiniciar).
- **Fuera de servicio**: cerrar la máquina (p. ej. sin papel) corta ventas nuevas pero
  **nunca** la entrega de lo ya pagado.
- **Sesiones, pagos, impresiones, reclamos y vales** a la vista; registro de eventos.
- No hay capturas del panel en este brief (ver §8).

### Acceso remoto
- La máquina se puede alcanzar por un **subdominio** (`kiosko.jamaxgroup.com`, vía túnel de
  Cloudflare); eso permite al dueño abrir el panel de operación a distancia y que el QR
  funcione desde la red móvil del teléfono. — `odd/tasks/seguridad-tunel.md`, `deploy/README.md`.
- ⚠️ Ese subdominio **es la máquina**, no la landing. No lo enlaces desde la landing.

---

## 5. Secciones especiales (lenguaje para clientes, no técnico)

### Temporadas y stickers
- Tres temas además del normal: **Navidad**, **Amor y amistad**, **Vacaciones**. Cambian los
  colores de las pantallas y ofrecen stickers propios (los stickers fueron diseñados para el
  kiosco). Los colores del tema no cambian lo que se imprime; los stickers sí van en la foto.
  `capturas/k-bienvenida-navidad.png` — Bienvenida con el tema Navidad.
  `capturas/k-bienvenida-amor-amistad.png` — Bienvenida con el tema Amor y amistad.
  `capturas/k-bienvenida-vacaciones.png` — Bienvenida con el tema Vacaciones.
  `capturas/k-qr-vacaciones.png`, `capturas/k-conectado-vacaciones.png`,
  `capturas/k-galeria-vacaciones.png`, `capturas/p-subir-vacaciones.png` — El mismo recorrido con el tema Vacaciones.
- Sugerencia de copy: «Un kiosco que se viste para cada temporada.»
- Precio de los stickers: el dueño decidió **$500 por sticker** (`odd/tasks/stickers-temporada.md`
  S3) y la pantalla lo muestra. Aun así, **no lo publiques** sin confirmación (ver §9).

### Video vitrina
- `video/vitrina-kiosco.mp4` — vertical 1080 × 1920, 37 s, sin audio, en loop. Muestra el
  proceso completo. Es el mismo tipo de video que el kiosco reproduce cuando nadie lo usa.
- Úsalo como pieza principal (hero o sección «Míralo en acción»), dentro de un marco que
  sugiera la pantalla vertical. `autoplay muted loop playsinline`, con un póster
  (p. ej. `capturas/k-bienvenida.png`).

### Seguridad (contado para clientes)
- «Solo la pantalla del kiosco puede iniciar una sesión»: desde fuera no se puede manejar la
  máquina ni entorpecer su uso. — `odd/tasks/seguridad-tunel.md` S1–S3.
- «Cada sesión es de un solo teléfono»: el primer teléfono que escanea el QR queda atado a
  ella; si otro lo intenta, ve que ya se abrió en otro teléfono, y la persona frente al kiosco
  puede dejarlo entrar con un código. — S4.
- «El QR está firmado por la máquina y caduca»: un enlace copiado o adivinado no sirve. —
  `server/src/enlace.ts` (commit `93cc29f`).
- «Mientras alguien usa la máquina, el QR desaparece de la pantalla»: en cuanto un teléfono
  toma la sesión, el kiosco muestra «Tu teléfono está conectado» y no queda nada que escanear.
  — `web/src/kiosk/QrPanel.tsx` (commit `93cc29f`). Ojo: las capturas `k-conectado*.png` son
  anteriores a este cambio y todavía muestran el QR; no las uses para ilustrar esta frase.
- Todo lo de esta sección está en la rama `seguridad-tunel`, probado y verificado, pero aún sin
  fusionar a `main`; ver §9.

### Privacidad (contado para clientes)
Frases que el código respalda (de `docs/decisiones/privacidad.md` y del texto real del kiosco):
- «Tus fotos se borran al terminar la sesión y no guardamos ningún dato tuyo.» (texto real
  bajo el QR y en el teléfono).
- Sin cuentas, sin registro, sin datos de pago en el kiosco.
- Las fotos son temporales. Única excepción, que hay que decir si se habla de plazos: si
  alguien **pagó y su foto no salió**, se conservan hasta 7 días para poder entregársela.
- **No afirmes** «no se almacenan» (sí se guardan en disco mientras dura la sesión) ni
  cumplimiento legal certificado: la política es un borrador sin revisión legal.

---

## 6. Llamado a la acción y formulario

- Botón principal, repetido arriba y abajo: **«Solicita tu kiosco»**.
- Formulario: **nombre**, **empresa**, **tipo** (evento / centro comercial — si es evento,
  puede pedir subtipo: boda, corporativo, feria, otro), **fecha** (del evento o de inicio),
  **ciudad**, **mensaje**. Añade **correo o teléfono de contacto** de quien escribe (sin eso no
  se le puede responder).
- Destino del formulario y canales — **DESCONOCIDOS, deja estos marcadores visibles**:
  - `[[NOMBRE DE LA MARCA]]` — el producto **no tiene nombre comercial decidido**
    (`PRODUCT.md`, «Brand Commitments»: «No inventar uno»). La app se titula a sí misma
    «Kiosco de fotos»; úsalo como descriptor, no como marca.
  - `[[CORREO DE CONTACTO]]`
  - `[[WHATSAPP]]` (sugerido: botón flotante de WhatsApp, habitual en Colombia)
  - `[[ENDPOINT DEL FORMULARIO]]` (a dónde se envían las solicitudes)
  - `[[DOMINIO DE LA LANDING]]` — el dueño opera bajo `jamaxgroup.com`; la landing no es
    `kiosko.jamaxgroup.com`.
  - `[[POLÍTICA DE PRIVACIDAD DE LA LANDING]]` — el formulario recoge datos personales (Ley 1581
    de 2012); hace falta un aviso propio del sitio, distinto del del kiosco.
- Mensaje de confirmación tras enviar: corto y verdadero («Recibimos tu solicitud; te
  contactaremos») sin prometer plazos.

---

## 7. Identidad visual y tono

Tomada de la propia app (`web/src/styles.css`, `:root`; `DESIGN.md`). Estilo **«FOTO-POP
Bento»**: neo-brutalista amable, como recortes pegados sobre una mesa.

**Colores (tokens):**

| Token | Hex | Uso |
|---|---|---|
| ink-black | `#000000` | Bordes de 2 px y texto fuerte |
| soft-ink | `#1a1c1b` | Texto principal |
| cream-canvas | `#f9f9f7` | Fondo de página |
| paper-white | `#ffffff` | Tarjetas |
| acid-lime | `#d2e823` | **Solo** la acción principal (el CTA) — «el lima significa avanzar» |
| acid-lime-deep | `#bdd200` | Hover del lima |
| cobalt-ink | `#061492` | Tarjetas de color / bloque de bienvenida |
| lavender-pop | `#e9c0e9` | Tarjetas del bento |
| mustard | `#d6a337` | Tarjetas del bento |
| olive-gray / moss-gray | `#464833` / `#777961` | Texto secundario / terciario |

Temas de temporada (solo cambian colores; ver capturas de bienvenida): Navidad (rojo y verde),
Amor y amistad (fucsia/magenta), Vacaciones (turquesa y amarillo). Valores exactos en
`web/src/styles.css`, bloques `:root[data-tema=…]`. Útil para una sección de temporadas.

**Forma:** borde negro de 2 px en todo lo que es objeto; **sombra dura sin desenfoque**
(`6px 6px 0 #000`, piezas pequeñas `4px 4px 0`) que se «hunde» al pulsar
(`translate(3px,3px)` y sin sombra); botones en píldora (`9999px`); tarjetas de 32 px de radio,
baldosas de 24 px. Fotos presentadas como **polaroids** ligeramente giradas (así es la
bienvenida del kiosco).

**Tipografía:** **Inter** (variable) para todo, trabajada por peso: títulos 800 con
tracking `-0.02em`, cuerpo 500. Monoespaciada solo para códigos (p. ej. un código de sesión
`6VZ4Y`). Inter está en Google Fonts.

**Tono de voz** (`PRODUCT.md`): frases cortas, directas y verdaderas. Segunda persona («tú»).
Sin jerga técnica (nada de SSE, CUPS, HMAC, túnel, Raspberry). Sin superlativos vacíos.

---

## 8. Inventario de assets

Rutas relativas a esta carpeta. Capturas kiosco: 1080 × 1920; teléfono: 1170 × 2532 (390 × 844 @3x).

| Archivo | Qué es |
|---|---|
| `capturas/k-bienvenida.png` | Bienvenida (tema normal) con polaroids |
| `capturas/k-bienvenida-navidad.png` | Bienvenida, tema Navidad |
| `capturas/k-bienvenida-amor-amistad.png` | Bienvenida, tema Amor y amistad |
| `capturas/k-bienvenida-vacaciones.png` | Bienvenida, tema Vacaciones |
| `capturas/k-qr.png` / `k-qr-vacaciones.png` | QR para conectar el teléfono |
| `capturas/k-conectado.png` / `k-conectado-vacaciones.png` | «Teléfono conectado» |
| `capturas/k-galeria-f12.png` / `k-galeria-vacaciones.png` | Galería con fotos recién subidas |
| `capturas/k-elegida.png` | Foto elegida en la galería |
| `capturas/k-encuadre.png` | Editor: encuadre |
| `capturas/k-calendario.png` | Editor: calendario con corazón |
| `capturas/k-stickers-puestos.png` | Editor: tres stickers de Vacaciones sobre la foto |
| `capturas/k-filtros.png` | Editor: panel de filtros |
| `capturas/k-tamanos.png` | Elegir formato (Clásica, Documento, Dúo, Separador) |
| `capturas/k-tamano-elegido.png` | Pedido con copias y total |
| `capturas/k-cobrando.png` | Kiosco esperando el pago |
| `capturas/p-subir.png` / `p-subir-vacaciones.png` | Teléfono: «Sube tus fotos» |
| `capturas/p-subidas.png` | Teléfono: «3 de 3 fotos subidas» |
| `capturas/p-pagar.png` | Teléfono: botón «Pagar» con Wompi |
| `capturas/hoja-impresa.png` | Hoja real compuesta por el servidor (1240 × 1844) |
| `video/vitrina-kiosco.mp4` | Video vitrina vertical, 37 s, sin audio |
| `fotos/foto-*.jpg` | 6 fotos del dueño (420 × 420) usadas en la bienvenida del kiosco; uso autorizado. Para una sección tipo polaroid. |

Notas:
- Las fotos que se ven en las capturas son del dueño (autorizadas). Se excluyeron de `fotos/`
  las que muestran a una menor; algunas capturas de bienvenida sí muestran fotos con niños en
  sus polaroids — si se decide no mostrar menores, usa `k-bienvenida-vacaciones.png` con cuidado
  y pregunta al dueño (§9).
- No hay capturas del panel `/operador` ni de la pantalla «Imprimiendo»; si hacen falta,
  piden una sesión con el dueño.
- Las capturas son de una instalación de desarrollo: muestran códigos de sesión e importes de
  prueba; están bien como ilustración.

---

## 9. Lo que NO se debe afirmar, y preguntas abiertas

**No afirmar:**
- Ningún **nombre de marca** inventado (usa `[[NOMBRE DE LA MARCA]]`).
- **Precios** de formatos o del alquiler/servicio: son configurables por máquina. Di
  «precios configurables». Los $3.500 / $5.000 / $8.000 que aparecen en el código o en las
  capturas son de fábrica o de prueba.
- **Velocidad** de impresión, fotos por hora, capacidad por evento, durabilidad del papel.
- **Clientes, testimonios, cifras de ventas, eventos realizados**: no existen (`PRODUCT.md`,
  «Evidence on Hand»: «ningún testimonio, cliente ni cifra de ventas. No fabricar ninguno»).
- **Cumplimiento legal certificado** de habeas data: la política es un borrador sin revisión.
- Que el kiosco imprime **Polaroid** (en pausa) o que tiene **Auto-mejora** activa por defecto.
- Un medio de pago concreto como garantizado (depende de la cuenta Wompi del comercio).
- Que funciona **sin internet** (el pago y el QR remoto dependen de la red; no está documentado
  un modo sin conexión).
- Que hay **varios kioscos** disponibles o cobertura nacional: hoy hay **un** kiosco
  (`PRODUCT.md`, «Operating Context»).
- Gestos multitáctiles (pellizcar para hacer zoom): el monitor entrega un solo dedo.

**Preguntas abiertas para el dueño:**
1. ¿Nombre comercial, logo y dominio de la landing?
2. ¿Correo, WhatsApp y a dónde llegan las solicitudes del formulario?
3. ¿Modelo comercial que se ofrece: alquiler por evento, el kiosco cobra a los invitados, el
   organizador paga un paquete de impresiones, reparto de ingresos con el centro comercial?
   ¿Se puede ofrecer «modo evento sin cobro» (posible por configuración, `COBRO_ACTIVO=0`)?
4. ¿Cuántos kioscos hay disponibles y en qué ciudades se presta el servicio?
5. ¿Qué medios de pago están habilitados en la cuenta Wompi de producción?
6. ¿Se publica el precio de los stickers ($500) o de los formatos?
7. ¿Se puede personalizar el kiosco para un evento (marca del cliente, stickers propios, marco
   con logo)? El código **no** lo ofrece hoy; no lo anuncies sin confirmación.
8. ¿Se pueden mostrar en la landing fotos con menores (las polaroids de bienvenida incluyen
   algunas)?
9. ¿Ya está publicada la seguridad de la sección «Seguridad»? Está en la rama
   `seguridad-tunel` (commits hasta `a2e9d43`), probada y verificada, pero sin fusionar a `main`
   al 2026-11-16.
10. ¿Qué incluye el servicio: instalación, transporte, papel, persona de apoyo en el evento?
