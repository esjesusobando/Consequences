import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set substantial JSON limits for base64 image/audio uploads
  app.use(express.json({ limit: "20mb" }));

  // Initialize Gemini Client (shared for OCR, transcription, and focus refine)
  let ai: GoogleGenAI | null = null;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API initialized successfully.");
    } else {
      console.warn("WARNING: GEMINI_API_KEY not set. Gemini features run in simulation mode.");
    }
  } catch (error) {
    console.error("Error initializing Gemini client:", error);
  }

  // ------------- OAUTH & GOOGLE PROXY ENDPOINTS -------------

  // In-memory sandbox state for Google Workspace demo
  let sandboxDriveFiles: any[] = [
    { id: "folder_1", name: "SYS_BACKUP_2044", mimeType: "application/vnd.google-apps.folder", size: "2.4 TB", modifiedTime: "2026-06-01T23:14:00Z" },
    { id: "file_2", name: "MANIFEST_CORE.CFG", mimeType: "text/plain", size: "14 KB", modifiedTime: "2026-06-02T10:05:00Z" },
    { id: "bin_3", name: "EXEC_PROTOCOL.BIN", mimeType: "application/octet-stream", size: "402 MB", modifiedTime: "2026-06-02T12:30:00Z" },
    { id: "node_4", name: "ACTIVE_NODE_04", mimeType: "application/vnd.google-apps.shortcut", size: "--", modifiedTime: "2026-06-02T14:00:00Z" },
    { id: "folder_5", name: "ARCHIVE_OLD", mimeType: "application/vnd.google-apps.folder", size: "8.1 TB", modifiedTime: "2026-05-15T08:00:00Z" },
    { id: "media_6", name: "SCAN_REF_01.JPG", mimeType: "image/jpeg", size: "2.4 MB", modifiedTime: "2026-06-02T14:20:00Z" },
  ];

  let sandboxTasks: any[] = [
    { id: "task_1", title: "Verify hyper-drive cooling conduits", notes: "Check for helium leaks", due: "2026-06-03T18:00:00Z", status: "needsAction" as const },
    { id: "task_2", title: "Recalibrate signal dampeners on sub-level 4", notes: "Acoustics are off by 4dB", due: "2026-06-02T22:00:00Z", status: "needsAction" as const },
    { id: "task_3", title: "Purge stale telemetry logs in SYS_BACKUP_2044", notes: "Keep drive capacity below 15TB", due: "2026-06-02T15:00:00Z", status: "needsAction" as const },
    { id: "task_4", title: "Review protocol access breaches", notes: "Security review is past due", status: "completed" as const },
  ];

  let sandboxEmails = [
    { id: "mail_1", threadId: "t1", from: "OPERATOR_02 // SYSTEM_ADMIN", subject: "[ALERT] Level 4 power overload predicted", snippet: "Thermal limits reaching 94%. Manual purge required immediately...", date: "2026-06-02T14:15:00Z", unread: true },
    { id: "mail_2", threadId: "t2", from: "NEXUS_FEED // TELEMETRY", subject: "Routine diagnostic report // STATUS_OK", snippet: "All primary telemetry feeds are active. Node 04 reporting stable...", date: "2026-06-02T13:45:00Z", unread: false },
    { id: "mail_3", threadId: "t3", from: "ia.strongmagazine@gmail.com", subject: "Welcome to Consequences Interface v1.7", snippet: "Congratulations Operator. This secure feed aggregates your real system activities...", date: "2026-06-02T12:00:00Z", unread: true },
  ];

  let sandboxMeetingsList: any[] = [];
  const getSandboxMeetings = () => {
    if (sandboxMeetingsList.length === 0) {
      const baseTime = Date.now();
      sandboxMeetingsList = [
        {
          id: "meet_1", summary: "CQ // Daily System Core Sync",
          description: "Weekly sync to recalibrate nodes, purge stale cache and files.",
          start: { dateTime: new Date(baseTime + 18 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(baseTime + 48 * 60 * 1000).toISOString() },
          location: "Virtual Terminal Node 4 (Main Deck - Server C)", htmlLink: "#",
          attendees: [
            { displayName: "Operator IA", email: "ia.strongmagazine@gmail.com" },
            { displayName: "System Daemon", email: "daemon.cq@consequences.sh" },
            { displayName: "Audit Core Unit", email: "audit.unit4@consequences.sh" },
          ],
          note: "CRITICAL OPERATION: Keep containment values in mind. Purging requires double confirmation."
        },
        {
          id: "meet_2", summary: "OPERATOR SECURITY AUDIT",
          description: "Mandatory security audit with LEVEL_7_ACCESS supervisor.",
          start: { dateTime: new Date(baseTime + 2 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(baseTime + 3 * 60 * 60 * 1000).toISOString() },
          location: "Secure Feed Room #09 (Secured Sub-level)", htmlLink: "#",
          attendees: [
            { displayName: "Operator IA", email: "ia.strongmagazine@gmail.com" },
            { displayName: "Lead Supervisor Intel", email: "intel.supervisor7@consequences.sh" },
          ],
          note: "PREPARATION REQ: Check logs of previous 72 hours for active deviations."
        },
      ];
    }
    return sandboxMeetingsList;
  };

  const getRedirectUri = () => {
    const appUrl = (process.env.APP_URL || "").replace(/\/$/, "");
    return `${appUrl || "http://localhost:3000"}/auth/callback`;
  };

  const getAuthToken = (req: express.Request): string | null => {
    const authHeader = req.headers.authorization;
    return authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  };

  app.get("/api/auth/url", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.json({ useSandbox: true });

    const redirectUri = getRedirectUri();
    const params = new URLSearchParams({
      client_id: clientId, redirect_uri: redirectUri,
      response_type: "code", scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/tasks.readonly",
      ].join(" "), access_type: "offline", prompt: "select_account consent",
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  });

  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!code) return res.status(400).send("Missing auth code");
    try {
      const redirectUri = getRedirectUri();
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ code: code as string, client_id: clientId || "", client_secret: clientSecret || "", redirect_uri: redirectUri, grant_type: "authorization_code" }),
      });
      const tokens = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokens.error_description || tokens.error || "Token exchange failed");
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
      const profile = await profileRes.json();
      res.send(`<html><body style="background:#04060A;color:#00f0ff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;"><script>if(window.opener){window.opener.postMessage({type:'OAUTH_AUTH_SUCCESS',payload:{accessToken:'${tokens.access_token}',user:{email:'${profile.email||""}',name:'${profile.name||"Operator_01"}',picture:'${profile.picture||""}'}}},'*');setTimeout(()=>window.close(),600)}else{window.location.href='/'}</script></body></html>`);
    } catch (err: any) {
      res.send(`<html><body style="background:#04060A;color:#ffb4ab;font-family:monospace;padding:30px;"><h2>EXCHANGE_ERROR</h2><p>${err.message}</p></body></html>`);
    }
  });

  // Calendar
  app.get("/api/calendar", async (req, res) => {
    const token = getAuthToken(req);
    if (!token) return res.json({ items: getSandboxMeetings() });
    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(new Date().toISOString())}&maxResults=10`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return res.status(response.status).json({ error: "Calendar sync failed" });
      res.json(await response.json());
    } catch (err) { res.status(500).json({ error: "Calendar proxy failure" }); }
  });

  app.post("/api/calendar/update", async (req, res) => {
    const { id, summary, description, location, note, startDateTime, endDateTime } = req.body;
    const token = getAuthToken(req);
    if (!token) {
      const list = getSandboxMeetings();
      const meet = list.find((m: any) => m.id === id);
      if (meet) {
        if (summary !== undefined) meet.summary = summary;
        if (description !== undefined) meet.description = description;
        if (location !== undefined) meet.location = location;
        if (note !== undefined) meet.note = note;
        if (startDateTime !== undefined) meet.start = { dateTime: startDateTime };
        if (endDateTime !== undefined) meet.end = { dateTime: endDateTime };
        return res.json({ success: true, item: meet });
      }
      return res.status(404).json({ error: "Sandbox meeting not found" });
    }
    try {
      const patches: any = {};
      if (summary !== undefined) patches.summary = summary;
      if (description !== undefined) patches.description = description;
      if (location !== undefined) patches.location = location;
      if (startDateTime !== undefined) patches.start = { dateTime: startDateTime };
      if (endDateTime !== undefined) patches.end = { dateTime: endDateTime };
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(patches) });
      if (!response.ok) return res.status(response.status).json({ error: "Calendar update failed" });
      res.json({ success: true, item: await response.json() });
    } catch (err) { res.status(500).json({ error: "Calendar update proxy failure" }); }
  });

  // Drive
  app.get("/api/drive", async (req, res) => {
    const token = getAuthToken(req);
    if (!token) return res.json({ files: sandboxDriveFiles });
    try {
      const response = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=30&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return res.status(response.status).json({ error: "Drive sync failed" });
      res.json(await response.json());
    } catch (err) { res.status(500).json({ error: "Drive proxy failure" }); }
  });

  app.post("/api/drive", async (req, res) => {
    const { name, mimeType, size } = req.body;
    const token = getAuthToken(req);
    const newFile = { id: `file_${Date.now()}`, name: name || "NEW_NODE.CFG", mimeType: mimeType || "text/plain", size: size || "1 KB", modifiedTime: new Date().toISOString(), webViewLink: "#" };
    if (!token) { sandboxDriveFiles = [newFile, ...sandboxDriveFiles]; return res.json(newFile); }
    try {
      const response = await fetch("https://www.googleapis.com/drive/v3/files", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ name: newFile.name, mimeType: newFile.mimeType }) });
      if (!response.ok) return res.status(response.status).json({ error: "Drive upload failed" });
      res.json(await response.json());
    } catch (err) { res.status(500).json({ error: "Drive upload failure" }); }
  });

  // Gmail
  app.get("/api/gmail", async (req, res) => {
    const token = getAuthToken(req);
    if (!token) return res.json({ messages: sandboxEmails });
    try {
      const listRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=label:INBOX", { headers: { Authorization: `Bearer ${token}` } });
      if (!listRes.ok) return res.status(listRes.status).json({ error: "Gmail list failed" });
      const listData = await listRes.json();
      const messages = listData.messages || [];
      const detailed = await Promise.all(messages.map(async (msg: any) => {
        try {
          const dRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, { headers: { Authorization: `Bearer ${token}` } });
          if (!dRes.ok) return null;
          const detail = await dRes.json();
          const headers = detail.payload.headers || [];
          return {
            id: detail.id, threadId: detail.threadId, snippet: detail.snippet || "",
            from: (headers.find((h: any) => h.name.toLowerCase() === "from") || {}).value || "Unknown",
            subject: (headers.find((h: any) => h.name.toLowerCase() === "subject") || {}).value || "(No Subject)",
            date: (headers.find((h: any) => h.name.toLowerCase() === "date") || {}).value || "",
            unread: (detail.labelIds || []).includes("UNREAD"),
          };
        } catch { return null; }
      }));
      res.json({ messages: detailed.filter(Boolean) });
    } catch (err) { res.status(500).json({ error: "Gmail proxy failure" }); }
  });

  app.post("/api/gmail/read", (req, res) => {
    const { id } = req.body;
    const msg = sandboxEmails.find(m => m.id === id);
    if (msg) msg.unread = false;
    res.json({ success: true, id });
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    const token = getAuthToken(req);
    if (!token) return res.json({ items: sandboxTasks });
    try {
      const listRes = await fetch("https://tasks.googleapis.com/tasks/v1/users/@default/lists", { headers: { Authorization: `Bearer ${token}` } });
      if (!listRes.ok) return res.status(listRes.status).json({ error: "Tasks lists failed" });
      const listsData = await listRes.json();
      const lists = listsData.items || [];
      if (lists.length === 0) return res.json({ items: [] });
      const tasksRes = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${lists[0].id}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      if (!tasksRes.ok) return res.status(tasksRes.status).json({ error: "Tasks fetch failed" });
      res.json({ items: (await tasksRes.json()).items || [] });
    } catch (err) { res.status(500).json({ error: "Tasks proxy failure" }); }
  });

  app.post("/api/tasks/update", async (req, res) => {
    const { id, title, status } = req.body;
    const token = getAuthToken(req);
    if (!token) {
      if (id) {
        const task = sandboxTasks.find((t: any) => t.id === id);
        if (task) task.status = status;
        return res.json({ success: true, item: task });
      }
      const newTask = { id: `task_${Date.now()}`, title: title || "New diagnostic task", status: status || "needsAction", due: new Date(Date.now() + 24*60*60*1000).toISOString() };
      sandboxTasks = [newTask, ...sandboxTasks];
      return res.json({ success: true, item: newTask });
    }
    res.json({ success: true, message: "Task update transmitted" });
  });

  // Env
  app.get("/api/env", (req, res) => {
    res.json({
      CLIENT_ID_SET: !!process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRET_SET: !!process.env.GOOGLE_CLIENT_SECRET,
      APP_URL: process.env.APP_URL || "http://localhost:3000",
      REDIRECT_URI: getRedirectUri(),
      GEMINI_KEY_SET: !!process.env.GEMINI_API_KEY,
    });
  });

  // ------------- OCR ENDPOINT -------------

  app.post("/api/ocr", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) return res.status(400).json({ error: "Missing imageBase64" });
      if (ai) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [{ inlineData: { mimeType: mimeType || "image/jpeg", data: cleanBase64 } }, { text: "Extract all the text found in this image, retaining layout as closely as possible. Do not add conversational intro/outro text, just output the extracted text." }],
        });
        return res.json({ success: true, text: response.text || "No text extracted.", simulated: false });
      }
      // Simulation fallback
      setTimeout(() => {
        const mockTexts = [
          "TACTICAL OPERATIONAL GUIDE\n\n- Phase 1: Establish project objectives\n- Phase 2: Design system variables\n- Phase 3: Deliver prototype\n\nAUTHORIZATION KEY: 994-OS-CNCT",
          "PERSONAL OS - COMPRA #9042\nProveedor: Industrial Logix S.A.\nFactura para: ia.strongmagazine@gmail.com\n\nSKU-CHIP-V1  x10  $450.00\nTotal: $575.00",
        ];
        res.json({ success: true, text: `[SIMULATED OCR - GEMINI_API_KEY not set]\n\n${mockTexts[Math.floor(Math.random() * mockTexts.length)]}`, simulated: true });
      }, 1500);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "OCR error" });
    }
  });

  // ------------- AUDIO TRANSCRIPTION ENDPOINT -------------

  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) return res.status(400).json({ error: "Missing audioBase64" });
      const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
      if (ai) {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [{ inlineData: { mimeType: mimeType || "audio/webm", data: cleanBase64 } }, { text: "You are an expert audio transcriber. Transcribe exactly what is being spoken. Output ONLY the transcribed text. Do not summarize or add intro/outro." }],
        });
        return res.json({ success: true, text: response.text || "No speech detected.", simulated: false });
      }
      setTimeout(() => {
        const samples = [
          "Revisar el stock mínimo de los procesadores Aura Core V5 en el Almacén de Sucursal Sur.",
          "Contactar al proveedor Logística Europea Express para coordinar la entrega rápida de variantes.",
        ];
        res.json({ success: true, text: `[SIMULATED DICTATION - GEMINI_API_KEY not set]\n"${samples[Math.floor(Math.random() * samples.length)]}"`, simulated: true });
      }, 1500);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Transcription error" });
    }
  });

  // ------------- FOCUS AI ENDPOINTS -------------

  app.post("/api/focus/gemini-refine", async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript required" });
    if (!ai) return res.json({ text: `[SYSTEM_WARNING: NOT_CONNECTED]\n\n${transcript}`, isFallback: true });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `The following is a voice dictation note that may have errors. Correct it, add clean markdown formatting, organize into readable sections, and make it professional, preserving the original language:\n\n"${transcript}"`,
      });
      res.json({ text: response.text });
    } catch (err: any) {
      res.json({ text: `[ERROR]\n\n${transcript}`, isFallback: true });
    }
  });

  app.post("/api/focus/export/notion", async (req, res) => {
    const { token, databaseId, title, content } = req.body;
    if (!token || !databaseId || !title) return res.status(400).json({ error: "Token, Database ID, and Title required" });
    try {
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
        body: JSON.stringify({ parent: { database_id: databaseId }, properties: { Name: { title: [{ text: { content: title } }] } }, children: [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: content || "" } }] } }] }),
      });
      if (!response.ok) return res.status(response.status).json({ error: "Notion API error" });
      res.json({ success: true, data: await response.json() });
    } catch (err: any) { res.status(500).json({ error: err.message || "Notion proxy failure" }); }
  });

  app.post("/api/focus/export/todoist", async (req, res) => {
    const { token, title, content } = req.body;
    if (!token || !title) return res.status(400).json({ error: "Token and Title required" });
    try {
      const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content: title, description: content || "" }),
      });
      if (!response.ok) return res.status(response.status).json({ error: "Todoist API error" });
      res.json({ success: true, data: await response.json() });
    } catch (err: any) { res.status(500).json({ error: err.message || "Todoist proxy failure" }); }
  });

  // ------------- STATIC SERVING -------------

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CONSEQUENCES] Server initialized on port ${PORT}`);
    console.log(`[CONSEQUENCES] Gemini: ${ai ? "READY" : "SIMULATION MODE (set GEMINI_API_KEY)"}`);
    console.log(`[CONSEQUENCES] OAuth: ${process.env.GOOGLE_CLIENT_ID ? "READY" : "SANDBOX MODE (set GOOGLE_CLIENT_ID)"}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
