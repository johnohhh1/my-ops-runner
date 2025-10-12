import { Server } from "@modelcontextprotocol/sdk/server/websocket.js";

export const config = { runtime: "edge" };

export default {
  async fetch(req) {
    if (req.headers.get("upgrade") !== "websocket")
      return new Response("Expected WebSocket", { status: 400 });

    const { socket, response } = Deno.upgradeWebSocket(req);
    const mcp = new Server({ name: "ops-mcp", version: "1.0.0" });

    const RUNNER_BASE = "https://my-ops-runner.vercel.app";
    const TOKEN = process.env.AI_SECRET_TOKEN;

    // Tool 1: Fetch ops report
    mcp.tool("fetch_ops_report", "Fetch comprehensive ops report with counts and deadlines", async () => {
      try {
        const r = await fetch(`${RUNNER_BASE}/api/ops/fetch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        
        if (!r.ok) {
          throw new Error(`Failed to fetch ops report: ${r.status} ${r.statusText}`);
        }
        
        const data = await r.json();
        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ error: error.message }, null, 2) 
          }]
        };
      }
    });

    // Tool 2: Mark item as complete
    mcp.tool("mark_item_complete", "Mark a specific item as complete by ID", async (args) => {
      try {
        const { id } = args;
        if (!id) {
          throw new Error("Missing required parameter: id");
        }
        
        const r = await fetch(`${RUNNER_BASE}/api/ops/mark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ id }),
        });
        
        if (!r.ok) {
          throw new Error(`Failed to mark item: ${r.status} ${r.statusText}`);
        }
        
        const data = await r.json();
        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify(data, null, 2) 
          }] 
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ error: error.message }, null, 2) 
          }]
        };
      }
    });

    socket.addEventListener("message", (e) => mcp.receive(e.data, socket));
    socket.addEventListener("close", () => mcp.close());
    socket.addEventListener("error", (e) => {
      console.error("WebSocket error:", e);
    });
    
    return response;
  },
};
