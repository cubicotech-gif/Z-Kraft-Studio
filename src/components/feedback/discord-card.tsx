import type { DiscordInfo } from "@/lib/feedback";
import { CopyHandle } from "./copy-handle";

/** Studio's Discord contact. Renders nothing until the owner sets a handle or invite in /admin. */
export function DiscordCard({ discord }: { discord: DiscordInfo }) {
  if (!discord.handle && !discord.invite) return null;
  return (
    <aside aria-label="Contact us on Discord" className="chamfer bg-neon-violet p-px">
      <div className="chamfer flex flex-col gap-4 bg-void-900 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-hud text-xs font-bold uppercase tracking-[0.3em] text-neon-violet">Prefer Discord?</p>
          <p className="mt-1 font-display text-xl font-bold">{discord.handle ? <>Message us: <span className="text-neon-cyan">@{discord.handle}</span></> : "Join our Discord"}</p>
          <p className="mt-1 text-sm text-ink-dim">Most of our players find us on Discord. Say hi, ask a question or start a quest there.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {discord.invite && (
            <a href={discord.invite} target="_blank" rel="noopener noreferrer" className="chamfer chamfer-sm inline-flex min-h-11 items-center bg-neon-violet px-5 font-hud text-xs font-bold uppercase tracking-[0.18em] text-white hover:brightness-110">
              Join server
            </a>
          )}
          {discord.handle && <CopyHandle handle={discord.handle} />}
        </div>
      </div>
    </aside>
  );
}
