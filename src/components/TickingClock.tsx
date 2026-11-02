"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * A ticking clock, synthesised rather than loaded.
 *
 * There is no audio file: a clock tick is a short broadband click, which is a
 * decaying burst of noise through a narrow band-pass — a few lines of Web Audio
 * and no network request, versus an asset to host, cache-bust and pay for on
 * every visit. Two buffers are built once and reused, with the band-pass
 * centred higher on the tick than the tock so the pair alternates the way a
 * real escapement does.
 */
const TICK_SECONDS = 1;
const BURST_SECONDS = 0.03;
const PEAK_GAIN = 0.2;

/** Scheduler constants. See the note on `start` for why a timer alone is not
 *  enough: `setInterval` drifts, and audio scheduled from a drifting callback
 *  arrives audibly uneven. */
const LOOKAHEAD_MS = 120;
const SCHEDULE_AHEAD_SECONDS = 0.4;

function makeBurst(ctx: AudioContext) {
  const frames = Math.ceil(ctx.sampleRate * BURST_SECONDS);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    // Steep decay: a tick is almost all attack. A gentler curve reads as a
    // hiss rather than a click.
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 6;
  }
  return buffer;
}

/**
 * The sound toggle.
 *
 * Off by default, and that is not a preference — a page cannot start audio on
 * its own. Browsers refuse to let an AudioContext run until the visitor has
 * interacted with the page, so an autoplaying tick would simply be silent and
 * the toggle would be the only thing that ever worked. It is also what WCAG
 * 1.4.2 asks for: anything audible for more than three seconds needs a way to
 * stop it, and a control that starts silent and stops on a second press is that
 * mechanism.
 *
 * The clock also stops when the tab is hidden. A ticking sound from a tab the
 * visitor cannot see is the kind of thing people close browsers over.
 */
export function TickingClock() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<{ tick: AudioBuffer; tock: AudioBuffer } | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextTimeRef = useRef(0);
  const highRef = useRef(false);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    void ctxRef.current?.suspend();
  }, []);

  const start = useCallback(async () => {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return false;

    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    buffersRef.current ??= { tick: makeBurst(ctx), tock: makeBurst(ctx) };

    // Created or resumed inside the click handler, which is the gesture the
    // autoplay policy wants to see.
    if (ctx.state === "suspended") await ctx.resume();
    if (ctx.state !== "running") return false;

    nextTimeRef.current = ctx.currentTime + 0.05;

    // A lookahead scheduler, not one tick per timer callback. Timer callbacks
    // are throttled and jittery, so scheduling a sound at the moment one fires
    // lands it late by however much the timer drifted. Instead the timer runs
    // faster than the beat and only queues ticks that fall inside the next
    // window, each pinned to an exact AudioContext time — so the rhythm comes
    // from the audio clock and the timer merely keeps the queue topped up.
    timerRef.current = window.setInterval(() => {
      const audio = ctxRef.current;
      const buffers = buffersRef.current;
      if (!audio || !buffers) return;

      while (nextTimeRef.current < audio.currentTime + SCHEDULE_AHEAD_SECONDS) {
        const at = nextTimeRef.current;
        const source = audio.createBufferSource();
        source.buffer = highRef.current ? buffers.tick : buffers.tock;

        const band = audio.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.value = highRef.current ? 2600 : 1900;
        band.Q.value = 1.8;

        const gain = audio.createGain();
        gain.gain.setValueAtTime(PEAK_GAIN, at);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + BURST_SECONDS);

        source.connect(band).connect(gain).connect(audio.destination);
        source.start(at);
        source.stop(at + BURST_SECONDS);

        highRef.current = !highRef.current;
        nextTimeRef.current = at + TICK_SECONDS;
      }
    }, LOOKAHEAD_MS);

    return true;
  }, []);

  // Pause while the tab is in the background, resume on return — but only if
  // the visitor had it on in the first place.
  useEffect(() => {
    if (!on) return;
    const onVisibility = () => {
      if (document.hidden) stop();
      else void start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [on, start, stop]);

  // Tear the context down on unmount; a suspended context still holds an
  // audio device handle.
  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  async function toggle() {
    if (on) {
      stop();
      setOn(false);
      return;
    }
    // Only claim it is on if the audio context actually started. If the browser
    // refuses, the button stays in its off state rather than lying about it.
    if (await start()) setOn(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn off the ticking clock" : "Turn on the ticking clock"}
      title={on ? "Sound on" : "Sound off"}
      className="absolute right-5 bottom-5 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-paper/60 transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none sm:right-8 sm:bottom-8"
    >
      {on ? (
        <Volume2 className="size-4" aria-hidden="true" />
      ) : (
        <VolumeX className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
