# 📉 Trading Algorithm Dashboard (PWA)

Una plataforma completa de análisis y trading de criptomonedas que combina algoritmos técnicos propios con inteligencia artificial (LLMs) para ofrecer recomendaciones de inversión.

Ahora incluye una moderna **Progressive Web App (PWA)** que actúa como panel de control, permitiendo ejecutar análisis, gestionar claves API y visualizar resultados desde cualquier dispositivo.

---

## 🚀 Características Principales

### 🧠 Inteligencia Híbrida
*   **Análisis Técnico**: Algoritmo en Python que evalúa tendencias, volúmenes, RSI, y medias móviles (10, 50, 200 sesiones).
*   **Ranking Automático**: Clasifica activos en base a una puntuación propia (0-10) que considera oportunidades de compra, venta y márgenes.
*   **Smart Summary (IA)**: Integración con **Groq, Google Gemini y OpenAI** para generar un resumen narrativo y recomendaciones estratégicas sobre tu portafolio actual.

### 💻 Dashboard PWA (Nuevo)
*   **Interfaz Moderna**: Diseño oscuro premium con glassmorphism, construido en **React + Vite**.
*   **Gestión de Claves**: Configura tus API Keys de Kraken y proveedores de IA directamente desde la interfaz web de forma segura.
*   **Visualización de Datos**: Tablas interactivas de rankings, estado de activos (Vivos/Muertos) y métricas financieras en tiempo real.
*   **Multi-Plataforma**: Instálala como aplicación nativa en tu escritorio o móvil.

### ⚙️ Backend Robusto
*   **Motor de Trading**: Lógica central en Python refactorizada para ser modular.
*   **API FastAPI**: Servidor ligero que expone la lógica de trading y sirve la aplicación web.
*   **Integración Kraken**: Conexión directa con el Exchange Kraken para obtener balances y precios en tiempo real.

---

## 🛠️ Requisitos del Sistema

*   **Python 3.9+**
*   **Node.js 18+** (solo para desarrollo/reconstrucción del frontend)
*   **Cuenta en Kraken** (API Key y Secret)
*   **(Opcional)** API Keys de Groq, Google Gemini u OpenAI para las funciones de IA.

---

## 📦 Instalación y Puesta en Marcha

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd trading-alg-rama01
```

### 2. Ejecución Rápida (Recomendado)
Hemos incluido un script que instala las dependencias necesarias (Python), construye el frontend y lanza el servidor automáticamente.

```bash
./start_pwa.sh
```

Una vez iniciado, abre tu navegador en: **`http://localhost:8000`**

### 3. Configuración Inicial
1.  Abre la aplicación en el navegador.
2.  Ve a la pestaña **Settings**.
3.  Copia y pega el contenido de tu archivo de claves de Kraken (`kraken.key`).
    *   *Formato esperado del archivo: API_KEY en la primera línea, SECRET en la segunda.*
4.  Introduce tus claves de **Groq** o **Gemini** si deseas usar el "Smart Summary".
5.  Guarda los cambios.

---

## 📖 Guía de Uso del Dashboard

### Dashboard Tab
El panel principal donde ocurre la magia.

*   **Select AI Agent**: Elige qué modelo de IA quieres usar para el resumen (Groq suele ser el más rápido).
*   **Botón "Run Analysis"**: Ejecuta el algoritmo completo. Esto puede tardar unos segundos ya que:
    1.  Descarga precios y balances de Kraken.
    2.  Calcula indicadores técnicos y rankings.
    3.  Envía los datos procesados a la IA para el resumen final.
*   **Resultados**:
    *   **Total Value / Cash**: Valor aproximado de tu portafolio y liquidez en EUR.
    *   **Smart Summary**: Un análisis textual generado por la IA sobre tu estado actual.
    *   **Ranking Table**: Lista de activos ordenados por oportunidad.
        *   **Buy Set**: Activos recomendados para comprar.
        *   **Sell**: Activos recomendados para vender o reducir posición.

### Settings Tab
Gestión segura de tus credenciales. Las claves se guardan localmente en el servidor (`data/keys/`), nunca se comparten externamente excepto con los proveedores oficiales (Kraken/Google/Groq) durante las llamadas API.

---

## 📂 Estructura del Proyecto

```text
trading-alg-rama01/
├── src/                  # 🧠 Lógica Core (Python)
│   ├── orders.py         # Algoritmo principal y cálculo de rankings
│   ├── ia_agent.py       # Cliente para conectar con LLMs (Groq, Gemini)
│   ├── balances.py       # Gestión de balances
│   └── utils/            # Funciones auxiliares y clases (Asset, Order, Trade)
│
├── server/               # 🔌 Backend API
│   └── main.py           # Servidor FastAPI (endpoints /api/run, /api/keys)
│
├── web/                  # 🎨 Frontend PWA
│   ├── src/              # Código fuente React
│   └── dist/             # Versión compilada para producción
│
├── data/                 # 💾 Almacenamiento local
│   └── keys/             # Archivos de claves API (ignorados por git)
│
└── start_pwa.sh          # Script de arranque automático
```

## 🔄 Flujo de Trabajo del Algoritmo

1.  **Recopilación**: Obtiene órdenes abiertas, operaciones pasadas y precios actuales de Kraken.
2.  **Procesamiento**:
    *   Reconstruye el historial de cada activo (compras/ventas).
    *   Calcula precios medios de compra/venta.
    *   Analiza tendencias (Medias 10/50/200 sesiones).
3.  **Evaluación (Ranking)**:
    *   Asigna puntos basado en si el precio está por debajo de la media (oportunidad de compra) o por encima (venta).
    *   Considera el volumen y la "distancia" a las medias móviles.
4.  **Consulta IA**:
    *   Envía un JSON con el "estado del arte" de tu portafolio al LLM seleccionado.
    *   El LLM devuelve una estrategia narrada y consejos específicos.

---

## ⚠️ Nota de Seguridad
Las claves API se almacenan en tu máquina local dentro de la carpeta `data/keys/`. Asegúrate de no subir esta carpeta a repositorios públicos (ya está incluida en `.gitignore`).

---

Hecho con ❤️ para un Trading eficiente.