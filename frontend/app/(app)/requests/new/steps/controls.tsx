export default function StepControls({ draft, setDraft, back, next }: any) {
  const requiresWork =
    draft.visitType === 'MOP' ||
    draft.visitType === 'MCM' ||
    draft.visitType === 'WP';

  const requiresRisk =
    draft.visitType === 'MHV';

  const requiresException =
    draft.visitType === 'TEP';

  const valid =
    draft.accessType &&
    (!requiresWork || draft.workDescription) &&
    (!requiresRisk || draft.riskNotes) &&
    (!requiresException || draft.exceptionReason) &&
    (!draft.equipmentRequired || draft.equipmentDetails);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Step 4 — Visit Controls</h2>

      <select
        className="border p-2 w-full"
        value={draft.accessType}
        onChange={(e) => setDraft({ ...draft, accessType: e.target.value })}
      >
        <option value="">Access Type *</option>
        <option value="One-time">One-time</option>
        <option value="Temporary">Temporary</option>
      </select>

      {requiresWork && (
        <textarea
          className="border p-2 w-full"
          placeholder="Work Description *"
          value={draft.workDescription}
          onChange={(e) =>
            setDraft({ ...draft, workDescription: e.target.value })
          }
        />
      )}

      {requiresRisk && (
        <textarea
          className="border p-2 w-full"
          placeholder="Risk / Safety Notes *"
          value={draft.riskNotes}
          onChange={(e) =>
            setDraft({ ...draft, riskNotes: e.target.value })
          }
        />
      )}

      {requiresException && (
        <textarea
          className="border p-2 w-full"
          placeholder="Reason for Exception *"
          value={draft.exceptionReason}
          onChange={(e) =>
            setDraft({ ...draft, exceptionReason: e.target.value })
          }
        />
      )}

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={draft.escortRequired}
          onChange={(e) =>
            setDraft({ ...draft, escortRequired: e.target.checked })
          }
        />
        Escort Required
      </label>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={draft.equipmentRequired}
          onChange={(e) =>
            setDraft({ ...draft, equipmentRequired: e.target.checked })
          }
        />
        Equipment Brought In
      </label>

      {draft.equipmentRequired && (
        <textarea
          className="border p-2 w-full"
          placeholder="Equipment Details *"
          value={draft.equipmentDetails}
          onChange={(e) =>
            setDraft({ ...draft, equipmentDetails: e.target.value })
          }
        />
      )}

      <textarea
        className="border p-2 w-full"
        placeholder="Additional Notes (optional)"
        value={draft.notes}
        onChange={(e) =>
          setDraft({ ...draft, notes: e.target.value })
        }
      />

      <div className="flex gap-4">
        <button onClick={back} className="underline">Back</button>
        <button
          onClick={next}
          disabled={!valid}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
