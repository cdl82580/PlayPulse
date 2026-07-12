"use client";

import { useActionState } from "react";
import { connectGoogle, disconnectGoogle } from "@/app/actions/account";

export function GoogleConnection({
  connected,
  canDisconnect,
}: {
  connected: boolean;
  canDisconnect: boolean;
}) {
  const [state, action, pending] = useActionState(disconnectGoogle, undefined);

  return (
    <div className="border-line flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <p className="text-sm font-medium">Google</p>
        <p className="text-muted text-xs">
          {connected ? "Connected" : "Not connected"}
        </p>
        {state?.error && (
          <p className="mt-1 text-xs text-red-400">{state.error}</p>
        )}
      </div>

      {connected ? (
        <form action={action}>
          <button
            type="submit"
            disabled={pending || !canDisconnect}
            title={
              canDisconnect
                ? undefined
                : "Set a password before disconnecting Google"
            }
            className="border-line rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Disconnecting…" : "Disconnect"}
          </button>
        </form>
      ) : (
        <form action={connectGoogle}>
          <button
            type="submit"
            className="border-line rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800"
          >
            Connect
          </button>
        </form>
      )}
    </div>
  );
}
