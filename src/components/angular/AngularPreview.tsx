import { withBasePath } from '../../lib/base-path';
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../lib/theme/useTheme";
export function AngularPreview({ id, name }: { id: string; name: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(420);
  const { theme } = useTheme();
  const [initialTheme] = useState(theme);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.type === "kit-angular-height" &&
        typeof event.data.height === "number"
      )
        setHeight(Math.max(240, event.data.height + 8));
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "kit-theme", theme },
      window.location.origin,
    );
  }, [theme]);
  return (
    <iframe
      ref={frame}
      title={`${name} — native Angular demo`}
      src={withBasePath(`/angular-demo/index.html?component=${encodeURIComponent(id)}&theme=${initialTheme}`)}
      onLoad={() =>
        frame.current?.contentWindow?.postMessage(
          { type: "kit-theme", theme },
          window.location.origin,
        )
      }
      style={{ height, width: "100%", border: 0, borderRadius: id === "morphing-icon" ? 0 : 16 }}
    />
  );
}
