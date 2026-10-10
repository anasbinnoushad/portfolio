#!/usr/bin/env python3
"""
build-hero-assets.py
====================
Turns the raw intro video into a crystal-clear, high-definition (Retina-ready)
seamless looping hero clip for all browsers (especially Safari/Apple Retina).
"""

import sys
import os
import subprocess
import tempfile
import wave
import numpy as np

# ─── Configuration ───────────────────────────
# Raw video is 1024x576. Crop person tightly head-to-toe
CROP_W = 460       # Crop width
CROP_H = 540       # Crop height
CROP_X = 282       # Center horizontally: (1024 - 460) // 2 = 282
CROP_Y = 18        # Top offset

# High-DPI Retina resolution (2x for ultra-sharp rendering on MacBook / iPhone)
SCALE_W = 920      # 2x crisp width
SCALE_H = 1080     # 2x crisp height

XFADE_DUR = 0.5    # Cross-fade duration in seconds
CLIP_DUR = 10.0    # Clip duration (full video)

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
        print(f"  ERROR: {result.stderr[:600]}")
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

    tmp = tempfile.mkdtemp(prefix="hero_hd_")

    print("\n[1/6] High-definition crop, color level balance & sharpening...")
    cropped = os.path.join(tmp, "cropped_lossless.mp4")
    
    # Filter chain: crop -> high-quality lanczos scale -> gentle contrast/white level -> subtle unsharp mask
    vf_filter = (
        f"crop={CROP_W}:{CROP_H}:{CROP_X}:{CROP_Y},"
        f"scale={SCALE_W}:{SCALE_H}:flags=lanczos+accurate_rnd,"
        "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,"
        "unsharp=3:3:0.6:3:3:0.0"
    )
    
    # Use lossless H.264 (CRF 0) for intermediate processing to avoid generation loss
    run([
        ff, "-y", "-i", input_path,
        "-vf", vf_filter,
        "-c:v", "libx264", "-crf", "0", "-preset", "ultrafast",
        "-c:a", "pcm_s16le", "-ar", "48000",
        cropped
    ])

    print("\n[2/6] Extracting seamless loop segments...")
    vid_dur = CLIP_DUR
    main_end = vid_dur - XFADE_DUR

    part_a = os.path.join(tmp, "part_a.mp4")
    part_b = os.path.join(tmp, "part_b.mp4")

    # Part A: full clip (lossless)
    run([ff, "-y", "-i", cropped, "-t", str(vid_dur),
         "-c:v", "copy", "-c:a", "copy", part_a])

    # Part B: first xfade_dur seconds for seamless loop wrap
    run([ff, "-y", "-i", cropped, "-t", str(XFADE_DUR),
         "-c:v", "copy", "-c:a", "copy", part_b])

    print("\n[3/6] Video cross-fade (xfade transition)...")
    xfaded_vid = os.path.join(tmp, "xfaded.mp4")
    run([
        ff, "-y",
        "-i", part_a, "-i", part_b,
        "-filter_complex",
        f"[0:v][1:v]xfade=transition=fade:duration={XFADE_DUR}:offset={main_end}[v]",
        "-map", "[v]",
        "-c:v", "libx264", "-crf", "0", "-preset", "ultrafast",
        "-an",
        xfaded_vid
    ])

    print("\n[4/6] Audio seamless loop (sample-accurate numpy crossfade at 48kHz)...")
    audio_wav = os.path.join(tmp, "audio.wav")
    run([ff, "-y", "-i", cropped, "-t", str(vid_dur),
         "-vn", "-acodec", "pcm_s16le", "-ar", "48000", "-ac", "2", audio_wav])

    with wave.open(audio_wav, 'rb') as wf:
        sr = wf.getframerate()
        n_channels = wf.getnchannels()
        n_frames = wf.getnframes()
        raw = wf.readframes(n_frames)
        audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
        if n_channels > 1:
            audio = audio.reshape(-1, n_channels)

    xfade_samples = int(XFADE_DUR * sr)

    fade_out = np.linspace(1.0, 0.0, xfade_samples, dtype=np.float32)
    fade_in = np.linspace(0.0, 1.0, xfade_samples, dtype=np.float32)
    if n_channels > 1:
        fade_out = fade_out[:, np.newaxis]
        fade_in = fade_in[:, np.newaxis]

    main_audio = audio[:-xfade_samples].copy()
    tail = audio[-xfade_samples:] * fade_out
    head = audio[:xfade_samples] * fade_in
    blended = tail + head

    looped_audio = np.concatenate([main_audio, blended], axis=0)
    looped_audio = np.clip(looped_audio, -32768, 32767).astype(np.int16)

    looped_wav = os.path.join(tmp, "looped_audio.wav")
    with wave.open(looped_wav, 'wb') as wf:
        wf.setnchannels(n_channels)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(looped_audio.tobytes())

    print("\n[5/6] Final Ultra-High-Quality Master Encoding...")
    
    # 1. MP4 Master: High-Profile H.264, visually lossless CRF 16, 192k AAC audio
    hero_mp4 = os.path.join(out_dir, "hero.mp4")
    run([
        ff, "-y",
        "-i", xfaded_vid, "-i", looped_wav,
        "-c:v", "libx264",
        "-profile:v", "high",
        "-level", "4.2",
        "-crf", "16",
        "-preset", "slow",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-movflags", "+faststart",
        "-shortest",
        hero_mp4
    ])

    # 2. WebM Master: VP9 CRF 22 (High Quality)
    hero_webm = os.path.join(out_dir, "hero.webm")
    run([
        ff, "-y",
        "-i", xfaded_vid, "-i", looped_wav,
        "-c:v", "libvpx-vp9", "-crf", "22", "-b:v", "0",
        "-c:a", "libopus", "-b:a", "128k", "-ar", "48000",
        "-shortest",
        hero_webm
    ])

    print("\n[6/6] Extracting Ultra-Sharp Portrait & OG Image...")
    portrait = os.path.join(pub_dir, "portrait-bust.webp")
    run([
        ff, "-y", "-i", cropped,
        "-ss", "2", "-frames:v", "1",
        "-vf", "crop=min(iw\\,480):min(ih\\,600):(iw-min(iw\\,480))/2:0,scale=480:600:flags=lanczos",
        "-q:v", "90",
        portrait
    ])

    og = os.path.join(pub_dir, "og.jpg")
    run([
        ff, "-y", "-i", cropped,
        "-ss", "2.5", "-frames:v", "1",
        "-vf", "scale=1200:630:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:630",
        "-q:v", "2",
        og
    ])

    # Cleanup temp file
    if os.path.exists("test_frame.jpg"):
        os.remove("test_frame.jpg")

    print(f"\n[OK] High Quality Export Complete!")
    print(f"   hero.mp4:          {os.path.getsize(hero_mp4) // 1024} KB (HD 920x1080, CRF 16, 192k AAC)")
    print(f"   hero.webm:         {os.path.getsize(hero_webm) // 1024} KB (HD 920x1080, VP9 CRF 22)")
    print(f"   portrait-bust.webp: {os.path.getsize(portrait) // 1024} KB")
    print(f"   og.jpg:            {os.path.getsize(og) // 1024} KB")

if __name__ == "__main__":
    main()
