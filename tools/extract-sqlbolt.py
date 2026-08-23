import re, json, os, glob, html

def find_div(s, start_idx):
    """given index of a '<div' opening, return (inner_html, end_index_after_closing)"""
    i = s.index('>', start_idx) + 1
    depth = 1
    j = i
    tag = re.compile(r'<(/?)div\b', re.I)
    while depth > 0:
        m = tag.search(s, j)
        if not m: raise ValueError('unbalanced')
        if m.group(1) == '/': depth -= 1
        else: depth += 1
        j = m.end()
    close = s.rindex('</div', i, j)
    return s[i:close], j

out = {}
for f in sorted(glob.glob('raw/lesson_*.html') + glob.glob('raw/topic_*.html')):
    key = os.path.basename(f)[:-5]
    s = open(f, encoding='utf-8').read()
    slug = key.replace('lesson_','',1).replace('topic_','',1)
    kind = 'lesson' if key.startswith('lesson_') else 'topic'
    # title
    m = re.search(r'<div class="lesson">\s*<div class="title">\s*(.*?)\s*</div>', s, re.S)
    title = html.unescape(m.group(1)).strip() if m else None
    # body
    bi = s.index('<div class="body">')
    body, _ = find_div(s, bi)
    # exercise json
    ej = None
    m = re.search(r'var exerciseJson = "(.*?)";\n', s, re.S)
    if m:
        raw = m.group(1)
        ej = json.loads(json.loads('"' + raw + '"'))
    out[kind + ':' + slug] = {'slug': slug, 'kind': kind, 'title': title, 'body': body.strip(), 'exercise': ej}

json.dump(out, open('extracted.json','w'), indent=1, ensure_ascii=False)
print(len(out), 'pages')
for k,v in out.items():
    print(f"{v['kind']:6} {k:45} ex={'Y' if v['exercise'] else 'n'} body={len(v['body'])}")
