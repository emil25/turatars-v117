#!/usr/bin/env python3
# tools/prep_fixtures.py — a tesztek /tmp fixtúráit állítja elő (audit47 a v47final/V5-höz;
# a v51/v52/v54 suitek saját maguk írják a többi fájlt). Futtasd a handover gyökeréből.
import os
from pathlib import Path
import shutil
def gpx(n, l0, ln0, pts, step, gain):
    o = ('<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="handover-fixed" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>'+n+'</name><trkseg>')
    la, lnn = l0, ln0
    half = pts // 2
    for i in range(pts):
        el = (800.0 + i*gain) if i <= half else (800.0 + half*gain - (i-half)*gain)
        o += '<trkpt lat="%.5f" lon="%.5f"><ele>%.1f</ele><time>2026-06-01T%02d:%02d:00Z</time><name>p%d</name></trkpt>' % (la, lnn, el, 1 + i % 9, i % 60, i)
        la += step; lnn += 0.00018
    return o + '</trkseg></trk></gpx>'
def write(p, s):
    open(p, "w").write(s); print("wrote", p, len(s))
# One canonical fixture, also consumed by v47final.js; do not generate a different track.
os.makedirs("/tmp", exist_ok=True)
shutil.copyfile(Path(__file__).resolve().parent.parent / "tests" / "fixtures" / "audit47.gpx", "/tmp/audit47.gpx")
write("/tmp/flow52.gpx", gpx("Flow52 vonal", 46.90200, 25.42000, 40, 0.00131, 9))
write("/tmp/bad52.gpx", '<?xml version="1.0"?><nonsense><x')
write("/tmp/empty52.gpx", '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg></trkseg></trk></gpx>')
