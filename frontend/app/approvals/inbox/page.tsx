'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { apiGet, apiPost } from "../../../lib/api";
import { Card, CardHeader, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";

type InboxItem = {
  requestId: string;
  requestNo: string;
  requestType: string;
  requestorName: string;
  siteName: string;
  stageOrder: number;
  stageName: string;
  submittedAt: string;
  vip: boolean;
  status: string;
};

export default function ApprovalsInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | "return">("approve");
  const [selected, setSelected] = useState<InboxItem | null>(null);
  const [comment, setComment] = useState("");

  async function refresh() {
    setErr(null);
    try {
      const data = await apiGet("/api/approvals/inbox");
      setItems(data);
    } catch (e: any) {
      setErr(e.message || "Failed");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openModal(item: InboxItem, a: "approve" | "reject" | "return") {
    setSelected(item);
    setAction(a);
    setComment("");
    setOpen(true);
  }

  async function submitAction() {
    if (!selected) return;

    try {
      if (action === "approve") {
        await apiPost(`/api/approvals/requests/${selected.requestId}/approve`, {
          comment: comment || null,
        });
      } else if (action === "reject") {
        await apiPost(`/api/approvals/requests/${selected.requestId}/reject`, {
          comment,
        });
      } else {
        await apiPost(`/api/approvals/requests/${selected.requestId}/return`, {
          comment,
        });
      }

      setOpen(false);
      await refresh();
      alert("Action completed.");
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  }

  const actionLabel = useMemo(() => {
    if (action === "approve") return "Approve";
    if (action === "reject") return "Reject";
    return "Return for changes";
  }, [action]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Approvals Inbox</h1>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {err && <div className="text-red-300 text-sm">{err}</div>}

      <div className="grid gap-3">
        {items.map((i) => (
          <Card key={i.requestId}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <div className="font-medium">{i.requestNo}</div>
                <div className="text-xs text-zinc-400">
                  {i.requestType} • {i.requestorName} • {i.siteName}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Stage {i.stageOrder}: {i.stageName}
                  {i.vip ? " • VIP" : ""}
                </div>
              </div>
              <Badge>{i.status}</Badge>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
              <Link
                className="text-sm text-zinc-200 underline"
                href={`/requests/${i.requestId}`}
              >
                View request
              </Link>

              <div className="flex gap-2">
                <Button onClick={() => openModal(i, "approve")}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => openModal(i, "reject")}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openModal(i, "return")}
                >
                  Return
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-zinc-400 text-sm">
            No items pending for your role.
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{actionLabel}</DialogTitle>

        {selected && (
          <div className="text-sm text-zinc-300 space-y-1">
            <div>
              <span className="text-zinc-400">Request:</span>{" "}
              {selected.requestNo}
            </div>
            <div>
              <span className="text-zinc-400">Type:</span>{" "}
              {selected.requestType}
            </div>
            <div>
              <span className="text-zinc-400">Stage:</span>{" "}
              {selected.stageName}
            </div>
          </div>
        )}

        <div className="mt-3">
          <div className="text-xs text-zinc-400 mb-1">
            Comment {action === "approve" ? "(optional)" : "(required)"}
          </div>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type comment..."
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={action === "reject" ? "destructive" : "default"}
            onClick={submitAction}
            disabled={action !== "approve" && comment.trim().length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
