"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  _id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:4000/menu");

        if (!res.ok) {
          throw new Error("Failed to fetch menu");
        }

        const data = await res.json();
        setMenu(data);
      } catch (err) {
        setError("Unable to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* HERO */}
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <h1 style={heroTitle}>Our Menu</h1>
          <p style={heroText}>
            Crafted with seasonal ingredients & culinary precision.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={menuSection}>
        {loading && <p style={statusText}>Loading menu…</p>}
        {error && <p style={{ ...statusText, color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div style={menuGrid}>
            {menu.map((item) => (
              <div key={item._id} style={menuCard}>
                <div style={menuHeader}>
                  <h3 style={itemName}>{item.name}</h3>
                  <span style={price}>${item.price}</span>
                </div>

                <p style={description}>{item.description}</p>

                <span style={category}>{item.category}</span>

                {!item.isAvailable && (
                  <span style={unavailable}>Unavailable</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ================= STYLES ================= */

const hero = {
  height: "60vh",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1551218808-94e220e084d2')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const heroContent = {
  position: "relative" as const,
  color: "#fff",
  textAlign: "center" as const,
};

const heroTitle = {
  fontSize: "3rem",
  fontWeight: 800,
};

const heroText = {
  marginTop: "0.5rem",
  opacity: 0.85,
};

const menuSection = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "4rem 1.5rem",
};

const statusText = {
  textAlign: "center" as const,
  fontSize: "1.1rem",
};

const menuGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
};

const menuCard = {
  background: "#fff",
  borderRadius: "14px",
  padding: "1.75rem",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column" as const,
};

const menuHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
};

const itemName = {
  fontSize: "1.2rem",
  fontWeight: 700,
};

const price = {
  fontWeight: 700,
};

const description = {
  color: "#555",
  marginBottom: "0.75rem",
};

const category = {
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  color: "#999",
};

const unavailable = {
  marginTop: "0.5rem",
  color: "red",
  fontSize: "0.85rem",
};
