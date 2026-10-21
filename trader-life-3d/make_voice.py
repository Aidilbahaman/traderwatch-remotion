#!/usr/bin/env python3
"""Kokoro VO for trader-life-3d.

Narration is written as continuous sentences with long caption slots, so no
atempo compression is needed. That is what keeps the read smooth instead of
clipped. One voice throughout for consistency.
"""
from __future__ import annotations
import os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AUDIO = ROOT / 'audio'
MODEL = Path.home()/'.hermes/cache/tts-models/kokoro-v1.0.onnx'
VOICES = Path.home()/'.hermes/cache/tts-models/voices-v1.0.bin'

# (start, end, text) — slots are wide (7-8s) so speech is never time-compressed.
LINES = [
 (0.60,  4.60, "Five ways a trade dies. Not one of them is the market's fault."),
 (5.30, 13.40, "One. The entry felt obvious, so you took it bigger than the plan allowed."),
 (15.30,23.40, "Two. The first candle closes red, and instead of checking the setup, you freeze."),
 (25.30,33.40, "Three. You tell yourself it comes back. There is no plan now. Only hope."),
 (35.30,43.40, "Four. So you move the stop. Just a little lower. Just this once."),
 (45.30,53.40, "Five. You close at the worst price of the day, and call it bad luck."),
 (56.10,63.20, "The market didn't do this to you. Five decisions. And every one of them was yours."),
]

def run(cmd):
    print('+',cmd,flush=True)
    subprocess.run(cmd,shell=True,check=True)

def probe(p:Path)->float:
    return float(subprocess.check_output(
        ['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)], text=True).strip())

def make_vo():
    sys.path.insert(0,str(Path.home()/'.local/lib/python3.12/site-packages'))
    from kokoro_onnx import Kokoro
    import soundfile as sf
    k=Kokoro(str(MODEL),str(VOICES))
    AUDIO.mkdir(parents=True,exist_ok=True)
    clips=[]
    for i,(at,end,text) in enumerate(LINES,1):
        # One warm US male voice for the whole film: consistent tone, no jumps.
        samples,sr=k.create(text,voice='am_michael',speed=1.0,lang='en-us')
        wav=AUDIO/f'vo{i:02d}.wav'; mp3=AUDIO/f'vo{i:02d}.mp3'
        sf.write(str(wav),samples,sr)
        # Trim silence only; never change tempo, so prosody stays natural.
        run(f'ffmpeg -y -v error -i "{wav}" -filter:a '
            f'"silenceremove=start_periods=1:start_threshold=-50dB,'
            f'areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse" '
            f'-c:a libmp3lame -b:a 128k "{mp3}"')
        wav.unlink()
        dur=probe(mp3); slot=end-at
        status='OK' if dur<=slot-0.15 else 'TIGHT'
        if dur>slot-0.15:
            print(f'  !! line {i} is {dur:.2f}s vs slot {slot:.2f}s')
        print(f'{i:02d} at={at:5.2f} dur={dur:4.2f} slot={slot:4.2f} {status} {text}')
        clips.append((mp3,at,dur,slot))
    return clips

def mix(clips):
    inputs=[];filters=[];labels=[]
    for i,(p,at,dur,slot) in enumerate(clips):
        inputs += ['-i',str(p)]
        label=f'v{i}'
        filters.append(f'[{i}:a]adelay={int(at*1000)}|{int(at*1000)},volume=1[{label}]')
        labels.append(f'[{label}]')
    filters.append(''.join(labels)+f'amix=inputs={len(labels)}:normalize=0:duration=longest,'+
                   'alimiter=limit=0.92,apad=pad_dur=68.0,atrim=0:68.0,asetpts=N/SR/TB[mix]')
    ins=' '.join('"'+x+'"' if ' ' in x else x for x in inputs)
    fc=';'.join(filters)
    run(f'ffmpeg -y -v error {ins} -filter_complex "{fc}" -map "[mix]" -c:a libmp3lame -b:a 160k "{AUDIO/"dialogue.mp3"}"')

if __name__=='__main__':
    mix(make_vo())
    print('OK',AUDIO/'dialogue.mp3')
