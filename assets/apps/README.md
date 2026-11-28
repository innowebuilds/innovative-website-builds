# Application images

Images for the **Applications** section on the homepage live in this folder.
Each app is a small card; clicking it opens a gallery of that app's screens.

1. Export each image as WebP (JPG/PNG also work), ideally **2000 px wide**
   (about 1.44:1, e.g. 2000 x 1389). The gallery shows images in full, never cropped.
   The first screen is also the card image, so make it the strongest overview shot.
2. Name files in lowercase with dashes, prefixed by the app, e.g. `booking-app-cover.webp`.
3. Open `script/apps.js`, copy an existing app entry and fill in `name`, `category`,
   `description`, `platforms`, and the `screens` list (`image`, `title`, `caption`, `alt`).

Apps appear in the order they are listed. A "Have an app in mind?" card is always added last.
