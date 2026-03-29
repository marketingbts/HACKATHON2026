# 🚀 Marki

**Generación de estrategia de contenido para redes, personalizada para tu negocio.**

---
## Ejecución del proyecto

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)
- Cuenta en [Supabase](https://supabase.com/) con un proyecto creado
- API Key de [Groq](https://console.groq.com/) (proveedor de IA por defecto)
- Token de [Hugging Face](https://huggingface.co/settings/tokens) (para generación de imágenes)

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/marketingbts/HACKATHON2026.git
cd HACKATHON2026
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.local.example .env.local
```

Luego editá `.env.local` con tus credenciales:

```env
# Supabase
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# IA (Groq por defecto)
AI_PROVIDER=groq
GROQ_API_KEY=<tu-api-key-de-groq>

# Hugging Face (generación de imágenes)
HF_TOKEN=<tu-token-de-hugging-face>

# Desarrollo — poner true para saltear autenticación
SKIP_AUTH=true
DEV_USER_ID=<cualquier-id>
```

> **Tip:** Con `SKIP_AUTH=true` podés usar la app sin login, útil para desarrollo local.

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción (requiere build previo) |
| `npm run lint` | Ejecuta el linter |


## 📌 Resumen Ejecutivo

**Marki** es una plataforma web 100% en español que permite a emprendedores y dueños de pymes crear estrategias contenido profesional para redes sociales con asistencia de inteligencia artificial, sin necesidad de conocimientos técnicos ni experiencia en marketing.

Está diseñada para resolver un problema concreto: la falta de tiempo, estrategia y claridad a la hora de comunicar un negocio en redes.

---

## 🎯 ¿Para quién es?

**Marki** está pensado para:

- Emprendedores  
- Dueños de pymes  
- Negocios locales (panaderías, tiendas de ropa, servicios, etc.)

### 👤 Usuarios típicos

- No tienen equipo de marketing  
- No saben qué publicar ni cómo  
- Usan herramientas genéricas sin buenos resultados  
- Hablan español y buscan simplicidad  

---

## 😖 Problema

Hoy, muchos emprendedores:

- No saben **qué publicar**  
- No tienen claridad sobre **cuándo ni cómo hacerlo**  
- Pierden tiempo usando herramientas que no entienden su negocio  
- Publican de forma inconsistente o directamente abandonan redes  

👉 El resultado: redes sociales que no generan valor.

---

## 💡 Solución

**Marki permite:**

- Cargar el contexto del negocio **una sola vez**  
- Generar contenido relevante y personalizado automáticamente  
- Crear una estrategia de contenido coherente  
- Organizar publicaciones en un calendario claro  

Todo en un solo lugar, sin complejidad.

---

## ✨ Propuesta de Valor

> **“Generación de estrategia de contenido para redes, personalizada para tu negocio.”**

---

## 🔥 Diferenciadores

- 🗣️ **100% en español** (lenguaje simple y accesible)  
- 🧠 **Contexto del negocio persistente** (no prompts genéricos)  
- 📅 **Estrategia + contenido + calendario integrados**  
- 🧑‍💼 **Enfocado en emprendedores y pymes**, no en grandes empresas  
- ⚡ **Rápido y fácil de usar**, incluso para usuarios sin experiencia digital  
