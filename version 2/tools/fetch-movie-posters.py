from pathlib import Path
import concurrent.futures
import html
import json
import re
import subprocess
import tempfile
import urllib.request

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'movie-posters.json'
films = json.loads(manifest_path.read_text())

def fetch(film):
    destination = root / film['poster']
    if destination.exists() and film.get('poster_source'):
        return film
    request = urllib.request.Request(film['letterboxd_url'], headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        page = response.read().decode('utf-8')
        film['letterboxd_url'] = response.url
    match = re.search(r'"image"\s*:\s*"(https://a\.ltrbxd\.com/[^"\s]+)"', page)
    if not match:
        raise ValueError(f"No poster found for {film['title']}")
    source = html.unescape(match[1].replace('\\/', '/'))
    directors = re.search(r'"director"\s*:\s*(\[.*?\])', page, re.S)
    if directors:
        film['source_directors'] = [person['name'] for person in json.loads(directors[1])]
    film['poster_source'] = source
    name = re.search(r'<title>(.*?)</title>', page, re.S)
    film['source_title'] = html.unescape(name[1].strip()) if name else ''
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as directory:
        original = Path(directory) / 'poster.jpg'
        with urllib.request.urlopen(urllib.request.Request(source, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as response:
            original.write_bytes(response.read())
        subprocess.run(['sips', '-Z', '300', '-s', 'format', 'jpeg', '-s', 'formatOptions', '65', str(original), '--out', str(destination)], check=True, capture_output=True)
    if not destination.exists():
        raise ValueError(f"Poster conversion failed for {film['title']}")
    film['bytes'] = destination.stat().st_size
    return film

results = []
errors = []
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(fetch, film): film for film in films}
    for future in concurrent.futures.as_completed(futures):
        film = futures[future]
        try:
            results.append(future.result())
            print('Saved:', film['title'], flush=True)
        except Exception as error:
            errors.append((film['title'], str(error)))
            results.append(film)
            print('Failed:', film['title'], str(error), flush=True)
manifest_path.write_text(json.dumps(sorted(results, key=lambda film: -film['rank']), indent=2, ensure_ascii=False) + '\n')
if errors:
    raise SystemExit(str(errors))
print('Poster total:', sum(film['bytes'] for film in results), 'bytes')
page_path = root / 'top100movies.html'
page = page_path.read_text()
by_title = {film['title']: film for film in results}

def attach_poster(match):
    content = re.sub(r'<[^>]*>', '', match[1])
    title = html.unescape(content.split(' - dir. ')[0])
    film = by_title.get(title)
    if not film:
        return '<li>' + content + '</li>'
    return '<li><span class="movie-title" tabindex="0" data-poster="' + html.escape(film['poster'], quote=True) + '">' + content + '</span></li>'

page = re.sub(r'<li>(.*?)</li>', attach_poster, page, flags=re.S)
if 'src="movies.js"' not in page:
    page = page.replace('</body>', '<script src="movies.js"></script></body>')
page_path.write_text(page)
