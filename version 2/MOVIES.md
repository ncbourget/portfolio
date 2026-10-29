# Movie list

Keep 100 positions in descending order. Format additions as Title - dir. Director. Verify directors online before adding entries. When moving a movie, restore its old position to Placeholder unless instructed otherwise.

Every named movie should have a local Letterboxd poster. Add its verified film URL, title and local JPG filename to movie-posters.json, then run:

    python3 tools/fetch-movie-posters.py

The helper downloads missing posters from Letterboxd's film metadata, converts them to 300px-tall JPEGs at quality 65, saves source attribution in the manifest, and attaches previews to the matching movie text. Existing downloaded posters are reused. Verify the source title/director to distinguish films with identical names.

Movie previews stay centered on the cursor, clamped inside the viewport and are 3.5 movie rows tall. Only the inline text activates a preview. The preview image has pointer-events: none so it never catches the mouse. Keyboard focus also previews a poster; Escape dismisses it. Touch does not create a hover preview.

Preserve this behavior for future entries. All changes belong in version 2; version 1 must remain untouched.
