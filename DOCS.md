# 📚 LoL Randomizer - Documentación Corta

## 🎯 Qué es

App React que randomiza equipos de LoL con roles, builds y runas automáticas. Estilo visual tipo LoL Client (oscuro, dorado, azul arcano).

---

## 🏗️ Estructura

### **Componentes Principales**
- **AppHeader** → Navegación sticky con tabs activos
- **AppLayout** → Wrapper de layout + outlet Router
- **InfoCard** → Card de campeón con imagen, nombre, rol, tipo + children (items/runas)

### **Páginas**
- **HomePractica** → Landing (intro + items preview + campeones)
- **ChampionList** → Búsqueda y listado de campeones
- **Items** → Grid de ítems con precios
- **TeamGenerator** (futuro) → Generador de equipos con builds/runas

---

## 🎨 Sistema de Estilos

### **Variables CSS** (`src/index.css`)
```css
--bg0: #070A12        /* Negro profundo */
--accent: #D4AF37     /* Dorado Riot */
--accent2: #6FE7FF    /* Azul Arcano */
--panel: rgba(...)    /* Panel con blur */
--shadow2: 0 8px...   /* Sombra sutil */
```

### **Módulos CSS**
- `AppHeader.module.css` → Header + botones premium
- `infoCard.module.css` → Cards con glow hover
- `ChampionList.module.css` → Grid responsivo (5/2/1 cols)
- `Items.module.css` → Grid items 6/3/1 cols
- `TeamGenerator.module.css` → Generador (futuro)

---

## 🎮 Características

✅ **Header Sticky** → NavLink activos con borde dorado  
✅ **Cards Premium** → Hover con glow + shadow  
✅ **Búsqueda** → Filtro en tiempo real  
✅ **Grid Responsivo** → Desktop/Tablet/Mobile  
✅ **Botones Mejorados** → Ripple effect + glow dinámico  
✅ **Iconos + Tooltips** → Via atributo title  

---

## 🔌 Servicios

- **apiService.js** → getChampions, getItems, getRunes
- **buildGenerator.js** → generateBuildsForTeam (items optimizados)
- **runeGenerator.js** → generateRunesForTeam (runas por rol)
- **teamGenerator.js** → (futuro separado)

---

## 📦 Dependencias

React Router v7, CSS Modules (sin Tailwind ni UI libs)

---

## 🚀 Rutas Actuales

- `/` → HomePractica
- `/champions` → ChampionList (búsqueda)
- `/items` → Items (grid)

**Próxima:** `/generator` → TeamGenerator
