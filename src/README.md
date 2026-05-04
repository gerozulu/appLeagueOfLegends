# 📁 ESTRUCTURA DEL PROYECTO - LOL RANDOMIZER

## Descripción
Aplicación web para randomizar equipos de League of Legends y explorar ítems, diseñada para hacer las partidas más dinámicas y divertidas.

---

## 📂 ESTRUCTURA DE CARPETAS

```
src/
├── components/          # Componentes reutilizables de React
│   ├── botonActualizar.jsx
│   ├── infoCard.jsx    # Tarjeta para mostrar campeones/items
│   ├── infoCard.module.css
│   └── todoApp.module.css
│
├── pages/              # Páginas/vistas principales
│   └── Practica/
│       ├── ChampionList.jsx       # Lista y búsqueda de campeones ⭐
│       ├── ChampionList.module.css
│       ├── HomePractica.jsx       # Página principal
│       ├── HomePractica.module.css
│       └── Items.jsx              # Galería de ítems
│
├── data/               # Datos estáticos y configuraciones
│   └── championRoles.js    # Mapeo de 160+ campeones con sus roles
│
├── hooks/              # Hooks reutilizables de React ⭐ NUEVO
│   ├── useChampions.js         # Hook para obtener campeones
│   ├── useTeamGenerator.js     # Hook para generar equipos
│   ├── useSearch.js            # Hook para búsqueda
│   └── index.js                # Exportador centralizado
│
├── services/           # Lógica de negocio y API ⭐ NUEVO
│   ├── lolApi.js               # Servicio para API de LoL
│   └── teamGenerator.js        # Lógica de generación de equipos
│
├── constants/          # Constantes globales ⭐ NUEVO
│   └── index.js                # Variables reutilizables
│
├── utils/              # Funciones utilitarias ⭐ NUEVO
│   └── helpers.js              # Funciones auxiliares
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🎯 GUÍA DE USO

### Usar un Hook
```javascript
import { useChampions, useTeamGenerator } from '../hooks';

function MyComponent() {
  const { champions, loading } = useChampions();
  const { generateTeam } = useTeamGenerator(champions);
  
  return (
    <>
      {loading ? <p>Cargando...</p> : <button onClick={() => generateTeam()}>Generar</button>}
    </>
  );
}
```

### Usar un Servicio
```javascript
import { generateRandomTeam, getTeamDifficulty } from '../services/teamGenerator';
import { fetchChampions } from '../services/lolApi';

async function getChampionsAndTeam() {
  const data = await fetchChampions();
  const champions = Object.values(data.data);
  const team = generateRandomTeam(champions);
  const difficulty = getTeamDifficulty(team);
}
```

### Usar Constantes
```javascript
import { LOL_ROLES, MESSAGES } from '../constants';

console.log(LOL_ROLES); // ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]
console.log(MESSAGES.LOADING); // "Cargando campeones..."
```

### Usar Utilidades
```javascript
import { copyToClipboard, saveToLocalStorage, debounce } from '../utils/helpers';

copyToClipboard("Equipo generado!");
saveToLocalStorage("myTeam", teamData);

const debouncedSearch = debounce((query) => {
  // Buscar con delay
}, 300);
```

---

## 🚀 CARACTERÍSTICAS IMPLEMENTADAS

✅ **Generador de Equipos** - Randomiza 5 campeones por roles reales  
✅ **Búsqueda de Campeones** - Filtro por nombre y tipo  
✅ **Visualización de Ítems** - Galería de objetos de LoL  
✅ **Roles Completos** - 160+ campeones mapeados  
✅ **Hooks Reutilizables** - Lógica encapsulada y compartible  
✅ **Servicios Modularizados** - API y lógica de negocio separadas  
✅ **Utilidades Globales** - Funciones auxiliares centralizadas  

---

## 📝 PRÓXIMOS PASOS

- [ ] Crear generador de builds aleatorios
- [ ] Implementar backend (Node.js + Express)
- [ ] Agregar BD (PostgreSQL)
- [ ] Persistencia de equipos generados
- [ ] Sistema de compartir (links públicos)
- [ ] Integración con Teams Copilot

---

## 📚 ARCHIVOS ELIMINADOS

❌ `db.json` - Base de datos Pokemon  
❌ `dbDos.json` - Base de datos Pokemon  
❌ `src/components/pokemon.jsx` - Componente Pokemon no usado  

---

## 🔧 DESARROLLO

**Stack:**
- React 19.2.4
- Vite (Build tool)
- JavaScript/ES6+
- CSS Modules

**APIs Externas:**
- DDragon (League of Legends official API)

---

## 📞 CONTACTO & SOPORTE

Para reportar bugs o sugerencias, contactar al equipo de desarrollo.

---

**Última actualización:** 2026-04-28  
**Versión:** 1.0.0  
**Estado:** En desarrollo - MVP completo
