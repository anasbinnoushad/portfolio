#!/usr/bin/env python3
"""
build-hero-assets.py
====================
Turns the raw intro video into a seamless looping hero clip.

Usage:
    python scripts/build-hero-assets.py <input_video>

Requirements:
    pip install numpy imageio-ffmpeg

Steps:
    1. Crop & centre the person (head-to-toe)
    2. Whiten the background
    3. Cross-fade first/last 0.5 s for seamless loop (video + audio)
    4. Export hero.mp4 (H.264, CRF 24) and hero.webm (VP9, CRF 36)
    5. Extract portrait-bust.webp and og.jpg
"""

import sys
import os
import subprocess
import tempfile
import struct
import wave
import numpy as np

# ─── Configuration ───────────────────────────
CROP_W = 460       # Crop width (adjust to your video)
CROP_H = 540       # Crop height
CROP_X = 282       # X offset (center of 1024: (1024-460)//2 ≈ 282)
CROP_Y = 18        # Y offset from top
SCALE_W = 768      # Output width
XFADE_DUR = 0.5    # Cross-fade duration in seconds
CLIP_DUR = 10.0    # Clip duration (use full video)

def get_ffmpeg():
    """Find ffmpeg binary."""
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"

def run(cmd, **kwargs):
    """Run a command and print it."""
    print(f"  -> {' '.join(cmd[:6])}...")
    result = subprocess.run(cmd, capture_output=True, text=True, **kwargs)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[:500]}")
        sys.exit(1)
    return result

def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/build-hero-assets.py <input_video>")
        sys.exit(1)

    input_path = sys.argv[1]
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        sys.exit(1)

    ff = get_ffmpeg()
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "hero")
    pub_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
    os.makedirs(out_dir, exist_ok=True)

    tmp = tempfile.mkdtemp(prefix="hero_")

    print("\n[1/6] Cropping and whitening...")
    cropped = os.path.join(tmp, "cropped.mp4")
    run([
        ff, "-y", "-i", input_path,
        "-vf", (
            f"crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y},"
            f"scale={SCALE_W}:-2,"
            "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"
        ),
        "-c:v", "libx264", "-crf", "18", "-preset", "fast",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        cropped
    ])

    print("\n[2/6] Splitting video and audio for cross-fade...")
    # Extract first part (0 to dur-xfade) and overlap part
    vid_dur = CLIP_DUR
    main_end = vid_dur - XFADE_DUR

    # Video: use xfade filter for seamless loop
    part_a = os.path.join(tmp, "part_a.mp4")
    part_b = os.path.join(tmp, "part_b.mp4")

    # Part A: from 0 to end
    run([ff, "-y", "-i", cropped, "-t", str(vid_dur),
         "-c:v", "libx264", "-crf", "18", "-c:a", "aac", part_a])

    # Part B: just the first xfade_dur seconds (for cross-fading at the end)
    run([ff, "-y", "-i", cropped, "-t", str(XFADE_DUR),
         "-c:v", "libx264", "-crf", "18", "-c:a", "aac", part_b])

    print("\n[3/6] Video cross-fade (xfade)...")
    xfaded_vid = os.path.join(tmp, "xfaded.mp4")
    run([
        ff, "-y",
        "-i", part_a, "-i", part_b,
        "-filter_complex",
        f"[0:v][1:v]xfade=transition=fade:duration={XFADE_DUR}:offset={main_end}[v]",
        "-map", "[v]",
        "-c:v", "libx264", "-crf", "20", "-preset", "slow",
        "-an",
        xfaded_vid
    ])

    print("\n[4/6] Audio cross-fade (numpy)...")
    # Extract audio as WAV
    audio_wav = os.path.join(tmp, "audio.wav")
    run([ff, "-y", "-i", cropped, "-t", str(vid_dur),
         "-vn", "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "1", audio_wav])

    # Read WAV with wave module
    with wave.open(audio_wav, 'rb') as wf:
        sr = wf.getframerate()
        n_channels = wf.getnchannels()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
        audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
        if n_channels > 1:
            audio = audio.reshape(-1, n_channels).mean(axis=1)

    xfade_samples = int(XFADE_DUR * sr)

    # Cross-fade: blend last xfade_samples of audio with first xfade_samples
    fade_out = np.linspace(1.0, 0.0, xfade_samples, dtype=np.float32)
    fade_in = np.linspace(0.0, 1.0, xfade_samples, dtype=np.float32)

    # The main part is audio up to (len - xfade_samples)
    main_audio = audio[:-xfade_samples].copy()
    tail = audio[-xfade_samples:] * fade_out
    head = audio[:xfade_samples] * fade_in
    blended = tail + head

    # Replace the end with the blended section
    looped_audio = np.concatenate([main_audio, blended])
    looped_audio = np.clip(looped_audio, -32768, 32767).astype(np.int16)

    looped_wav = os.path.join(tmp, "looped_audio.wav")
    with wave.open(looped_wav, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(looped_audio.tobytes())

    print("\n[5/6] Muxing and exporting final files...")
    # Combine video + audio → MP4
    hero_mp4 = os.path.join(out_dir, "hero.mp4")
    run([
        ff, "-y",
        "-i", xfaded_vid, "-i", looped_wav,
        "-c:v", "libx264", "-crf", "24", "-preset", "slow",
        "-c:a", "aac", "-b:a", "96k",
        "-movflags", "+faststart",
        "-shortest",
        hero_mp4
    ])

    # Export WebM (VP9 + Opus)
    hero_webm = os.path.join(out_dir, "hero.webm")
    run([
        ff, "-y",
        "-i", xfaded_vid, "-i", looped_wav,
        "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
        "-c:a", "libopus", "-b:a", "80k",
        "-shortest",
        hero_webm
    ])

    print("\n[6/6] Extracting portrait and OG image...")
    # Portrait: clearest frame (middle of clip), head-to-shirt crop
    portrait = os.path.join(pub_dir, "portrait-bust.webp")
    run([
        ff, "-y", "-i", cropped,
        "-ss", "2", "-frames:v", "1",
        "-vf", f"crop={min(CROP_W, 480)}:{min(CROP_H, 600)}:(iw-{min(CROP_W, 480)})/2:0,scale=480:600",
        portrait
    ])

    # OG image: wider frame
    og = os.path.join(pub_dir, "og.jpg")
    run([
        ff, "-y", "-i", cropped,
        "-ss", "2", "-frames:v", "1",
        "-vf", "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630",
        "-q:v", "2",
        og
    ])

    print(f"\n[OK] Done!")
    print(f"   hero.mp4:          {os.path.getsize(hero_mp4) // 1024} KB")
    print(f"   hero.webm:         {os.path.getsize(hero_webm) // 1024} KB")
    print(f"   portrait-bust.webp: {os.path.getsize(portrait) // 1024} KB")
    print(f"   og.jpg:            {os.path.getsize(og) // 1024} KB")
    print(f"\nAdjust CROP_W/H/X/Y at the top of this script if the framing isn't right.")

if __name__ == "__main__":
    main()
