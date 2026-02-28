import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const db = new Database("formflow.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    surplus_panels INTEGER DEFAULT 0,
    needed_panels INTEGER DEFAULT 0,
    active_projects INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS panels (
    id TEXT PRIMARY KEY,
    site_id INTEGER,
    type TEXT,
    reuse_cycles INTEGER DEFAULT 0,
    status TEXT DEFAULT 'idle',
    last_tracked TEXT,
    FOREIGN KEY(site_id) REFERENCES sites(id)
  );
`);

// Seed data if empty
const siteCount = db.prepare("SELECT COUNT(*) as count FROM sites").get() as { count: number };
if (siteCount.count === 0) {
  const insertSite = db.prepare("INSERT INTO sites (name, location, surplus_panels, needed_panels, active_projects) VALUES (?, ?, ?, ?, ?)");
  insertSite.run("Mumbai Central", "Mumbai", 450, 0, 3);
  insertSite.run("Bangalore Tech Park", "Bangalore", 0, 200, 2);
  insertSite.run("Delhi Metro Phase 4", "Delhi", 120, 0, 5);
  insertSite.run("Hyderabad IT Hub", "Hyderabad", 0, 500, 1);

  const insertPanel = db.prepare("INSERT INTO panels (id, site_id, type, reuse_cycles, status, last_tracked) VALUES (?, ?, ?, ?, ?, ?)");
  for (let i = 1; i <= 50; i++) {
    insertPanel.run(`P-${1000 + i}`, 1, "Standard Wall", Math.floor(Math.random() * 20), "in-use", new Date().toISOString());
  }
}

async function generateDesignNudges(projectContext: string) {
  if (!process.env.GEMINI_API_KEY) {
    return [
      { title: "Standardize Column Sizes", description: "Reducing column variations from 5 to 2 can increase panel reuse by 40%.", estimatedSavings: "₹8.5 Lakhs" },
      { title: "Align Wall Heights", description: "Matching wall heights across blocks allows for continuous panel cycling without modification.", estimatedSavings: "₹12 Lakhs" },
      { title: "Modular Slab In-fills", description: "Using standard 600mm in-fills reduces custom timber cutting waste by 25%.", estimatedSavings: "₹4 Lakhs" }
    ];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an AI Formwork Optimization Expert. Based on this project context: "${projectContext}", suggest 3 specific "Design Nudges" that could save construction costs by optimizing formwork reuse. 
    Format the response as JSON with an array of objects: { title: string, description: string, estimatedSavings: string }.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nudges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedSavings: { type: Type.STRING }
              },
              required: ["title", "description", "estimatedSavings"]
            }
          }
        },
        required: ["nudges"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.nudges;
  } catch (e) {
    return [];
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    res.json({
      totalWasteReduced: "25%",
      avgReuseCycles: 28,
      costSavings: "₹12.4 Cr",
      activeSites: 14
    });
  });

  app.get("/api/sites", (req, res) => {
    const sites = db.prepare("SELECT * FROM sites").all();
    res.json(sites);
  });

  app.get("/api/marketplace", (req, res) => {
    const surplus = db.prepare("SELECT * FROM sites WHERE surplus_panels > 0").all() as any[];
    const demand = db.prepare("SELECT * FROM sites WHERE needed_panels > 0").all() as any[];
    
    const suggestions = [];
    for (const s of surplus) {
      for (const d of demand) {
        const amount = Math.min(s.surplus_panels, d.needed_panels);
        if (amount > 0) {
          suggestions.push({
            from: s.name,
            to: d.name,
            panels: amount,
            savings: `₹${(amount * 1500).toLocaleString()}`,
            distance: `${Math.floor(Math.random() * 500) + 50}km`
          });
        }
      }
    }
    res.json(suggestions);
  });

  app.get("/api/inventory", (req, res) => {
    const panels = db.prepare("SELECT p.*, s.name as site_name FROM panels p JOIN sites s ON p.site_id = s.id LIMIT 50").all();
    res.json(panels);
  });

  app.post("/api/optimize", async (req, res) => {
    const { context } = req.body;
    const nudges = await generateDesignNudges(context || "Standard high-rise residential project with varying column sizes.");
    res.json({ nudges });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
