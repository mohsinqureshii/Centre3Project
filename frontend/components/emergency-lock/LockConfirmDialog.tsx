"use client";

import React from "react";

export default function LockConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (reason?: string) => Promise<void> | void;
}) {
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setReason("");
      setBusy(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background border shadow-xl p-5 space-y-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground mt-1">{description}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Reason (optional)</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Incident reference, note…"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </button>
          <button
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm(reason);
                onOpenChange(false);
              } catch (e: any) {
                alert(e?.message || "Failed");
              } finally {
                setBusy(false);
              }
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
