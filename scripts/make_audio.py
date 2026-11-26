"""Make narration MP3s for every scene (run on YOUR laptop, needs internet).

    pip install edge-tts
    python scripts/make_audio.py

Writes public/audio/<topic>/<lang>/<i>.mp3 and public/audio/manifest.json.
Rashmika = female voice, Guru = male voice. Re-running skips files that exist.
"""
import asyncio, json, pathlib
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
VOICES = {
    ("hi", "r"): "hi-IN-SwaraNeural",
    ("hi", "g"): "hi-IN-MadhurNeural",
    ("en", "r"): "en-IN-NeerjaNeural",
    ("en", "g"): "en-IN-PrabhatNeural",
    ("gu", "r"): "gu-IN-DhwaniNeural",
    ("gu", "g"): "gu-IN-NiranjanNeural",
    ("bn", "r"): "bn-IN-TanishaaNeural",
    ("bn", "g"): "bn-IN-BashkarNeural",
    ("mr", "r"): "mr-IN-AarohiNeural",
    ("mr", "g"): "mr-IN-ManoharNeural",
}
LANGS = ("hi", "en", "gu", "bn", "mr")


async def make(text, voice, path):
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, voice, rate="-8%").save(str(path))
            if path.exists() and path.stat().st_size > 0:
                return True
        except Exception as e:
            print(f"  retry {attempt + 1} for {path.name}: {e}")
            await asyncio.sleep(2)
    if path.exists() and path.stat().st_size == 0:
        path.unlink()
    return False


async def main():
    data = json.loads((ROOT / "lib" / "content.json").read_text(encoding="utf-8"))
    extra = json.loads((ROOT / "lib" / "lang-extra.json").read_text(encoding="utf-8"))
    files, failed = [], []
    for t in data["topics"]:
        for lang in LANGS:
            for i, s in enumerate(t["scenes"]):
                key = f"{t['id']}/{lang}/{i}"
                path = OUT / f"{key}.mp3"
                path.parent.mkdir(parents=True, exist_ok=True)
                if not path.exists() or path.stat().st_size == 0:
                    text = s[lang] if lang in ("hi", "en") else extra[lang]["topics"][t["id"]]["scenes"][i]
                    ok = await make(text, VOICES[(lang, s["who"])], path)
                    if not ok:
                        failed.append(key)
                        print("FAILED", key)
                        continue
                    print("made", key)
                files.append(key)
    (OUT / "manifest.json").write_text(json.dumps({"files": files}, indent=0), encoding="utf-8")
    print(f"done: {len(files)} clips.")
    if failed:
        print(f"{len(failed)} failed (phone voice will be used for these). Run the script again to retry them.")
    print("Now commit public/audio and push.")


asyncio.run(main())