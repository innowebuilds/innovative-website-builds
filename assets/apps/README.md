# Application images

Images for the **Applications** slider on the homepage live in this folder.

1. Export each app image as WebP (JPG/PNG also work), ideally **2000 px wide** (the stage is about 1.44:1, e.g. 2000 x 1389).
   A composed mockup (several phone screens on a plain background) looks best; a single
   screenshot is centred and shown in full, never cropped.
2. Name it in lowercase with dashes, e.g. `clinic-booking.webp`.
3. Open `script/apps.js` and set that slide's `image` to `assets/apps/clinic-booking.webp`,
   plus its `name`, `category`, `description`, `platforms`, `alt` and optional `link`.

Add or remove entries in `script/apps.js` to change the number of slides. The arrows,
dots and counter update automatically.
