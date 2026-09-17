# Vendored fonts

`roboto-latin-variable.woff2` is the latin subset of [Roboto](https://fonts.google.com/specimen/Roboto)
(v51), as served by Google Fonts. It is a variable font, so the single file
covers both weights the app uses (400 and 500).

It is vendored rather than fetched through `next/font/google` so that `npm run
build` never needs network access: CI behind a proxy, and offline development,
both work. Roboto is licensed under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

To refresh it, take the `latin` `@font-face` block from
`https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap`
(requested with a modern browser user agent) and download the file it points at.
