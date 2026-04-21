import { useEffect, useState } from "react";

function Items() {
  const [items, setItems] = useState({});

  useEffect(() => {
    fetch("https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json")
      .then(res => res.json())
      .then(data => setItems(data.data));
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {Object.entries(items).map(([id, item]) => {
        
        // filtro para que no salgan cosas raras
        if (item.gold.total === 0 || item.inStore === false) return null;

        return (
          <div key={id} style={{
            background: "#111",
            color: "white",
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
            width: "120px",
            textAlign: "center"
          }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${id}.png`}
              alt={item.name}
              width="50"
            />
            <p>{item.name}</p>
            <p>💰 {item.gold.total}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Items;