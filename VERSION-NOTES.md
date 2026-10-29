# Portfolio versions

- **version 1/** is a complete snapshot of the portfolio as it existed before this redesign, including the current local changes. Its original files are unchanged.
- **version 2/** is the redesigned, self-contained portfolio. Start with `index.html`.
- The original website in the repository root remains in place.

Version 2 takes its principal direction from https://rasheedl.com/ (a compact, image-led archive), with the quiet project navigation of https://justinkaminuma.com/ and the printed-matter sensibility of https://carlocanun.com/.

## Version 2

The homepage presents 86 images across all 18 projects. Visitors can filter by discipline or switch to a text index. Every project retains its complete descriptions, chapters, images, videos, links and interactive embeds. The Info page retains the biography, interests, awards, professor's introduction, colophon and contact information. Atlas Grotesk remains the sole typeface.

The smaller homepage images in `assets/archive/` are additional derivatives; full-size original media is preserved. The site uses plain HTML, CSS and JavaScript and does not need an installation or build step.

## Local preview

Serve the version folder itself with a local static server. For example, from the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory 'version 2'
```

Then visit http://127.0.0.1:8765/. For the archived design, use `--directory 'version 1'`. Version 1 retains its original root-relative navigation, so serving that folder as the site root gives the faithful original experience.

Nothing has been published or pushed.
