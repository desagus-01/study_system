import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import type { SystemStatus } from "../shared/types";

function App(): React.JSX.Element {
  const [status, setStatus] = useState<SystemStatus | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void window.piLearn
      .getSystemStatus()
      .then(setStatus)
      .catch(() => setError("Unable to read system status."));
  }, []);

  if (error) {
    return <main><h1>Pi Learn</h1><p>{error}</p></main>;
  }

  if (!status) {
    return <main><h1>Pi Learn</h1><p>Checking system status…</p></main>;
  }

  return (
    <main>
      <h1>Pi Learn</h1>
      <h2>System status</h2>
      <ul>
        <li>Electron: {status.electron}</li>
        <li>Preload: {status.preload}</li>
        <li>SQLite: {status.sqlite}</li>
        <li>Pi: {status.pi}</li>
      </ul>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
