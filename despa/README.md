# Despa project page

Standalone static page within the existing Jekyll homepage. The public path is
`https://yokinglou.github.io/despa/`; the personal homepage links here from the
Despa publication entry. Jekyll copies these files without wrapping them in the
personal homepage layout. Keep the repository root Jekyll configuration intact.

## Resource links

Edit `config.js` when arXiv, SpaBench, and GitHub resources become public.
Empty values keep the existing **Soon** buttons without fake URLs.
The personal homepage paper/arXiv placeholders in `_pages/about.md` can then
be replaced with the released links.

## Figures

The supplied project page and assets come from `26NeurIPS/project-homepage`.
`assets/architecture.webp` is a rendering of the paper's Figure 2
(`latex/figures/pipeline.pdf`), also used by the personal homepage teaser.
The original paper sources and poster files remain outside this website.

## Preview

Use the existing Jekyll preview server and open `/despa/`. No separate build
step or JavaScript dependencies are required. Relative asset URLs also work
when the folder is served directly.

## Button icons

The inline arXiv mark comes from [Simple Icons](https://cdn.simpleicons.org/arxiv)
(CC0). The GitHub mark is extracted from the repository's existing Font Awesome
Free brands font, with its original path and coordinate system preserved
([Font Awesome license](https://fontawesome.com/license/free), CC BY 4.0 for icons).
