/*
 * Applications slider: edit this list to change the slides.
 *
 * To add a real app:
 *   1. Put the image in assets/apps/ (WebP, about 2000 px wide, is ideal).
 *   2. Set `image` to its path and write a short `alt` text.
 * A slide with an empty `image` shows the built-in placeholder.
 *
 * Fields:
 *   name        App name (required)
 *   category    Short label shown above the name, e.g. "Booking app"
 *   description One or two sentences about what the app does
 *   platforms   Tags shown under the description, e.g. ['iOS', 'Android']
 *   image       Path to the image, e.g. 'assets/apps/clinic-booking.webp'
 *   alt         What the image shows, for screen readers
 *   link        Optional URL (App Store, Google Play or live web app)
 *   linkLabel   Optional button text, defaults to "View app"
 *   background  Optional colour behind the image, matched to the image's edges
 */
window.IWB_APPS = [
  {
    name: 'Smile City Center Clinic System',
    category: 'Case study \u00b7 Healthcare SaaS',
    description: 'A complete dental clinic platform: appointments, patient files with dental charts, billing, reports, reminders and voice entry in three languages.',
    platforms: ['Next.js 15', 'Cloudflare Workers', 'D1 \u00b7 Prisma', 'Responsive', 'EN \u00b7 FR \u00b7 AR voice'],
    image: 'assets/apps/smile-clinic-cover.webp',
    alt: 'Smile City Center Clinic System shown on a desktop browser and two phones',
    background: '#F6F8FB'
  },
  {
    name: 'Daily dashboard',
    category: 'Smile City Center \u00b7 Clinic System',
    description: "Today's visits, waiting room, collections and no-show rate at a glance.",
    platforms: ['Desktop'],
    image: 'assets/apps/smile-clinic-dashboard.webp',
    alt: 'Clinic dashboard with visits today, monthly collections, unpaid balances, today\'s schedule and waiting room',
    background: '#F6F8FB'
  },
  {
    name: 'Interactive dental chart',
    category: 'Smile City Center \u00b7 Clinic System',
    description: 'FDI chart with nine conditions, colour-coded and editable by doctors.',
    platforms: ['Desktop', 'Tablet'],
    image: 'assets/apps/smile-clinic-dental-chart.webp',
    alt: 'Patient profile with a medical alert and a colour-coded FDI dental chart',
    background: '#F6F8FB'
  },
  {
    name: 'Fill by voice',
    category: 'Smile City Center \u00b7 Clinic System',
    description: 'Speak in English, French or Arabic and the form fills itself for review.',
    platforms: ['English', 'Fran\u00e7ais', 'Arabic'],
    image: 'assets/apps/smile-clinic-voice.webp',
    alt: 'New patient form filled automatically from a spoken sentence, with each detected field highlighted',
    background: '#F6F8FB'
  },
  {
    name: 'Patient care in your pocket',
    category: 'Smile City Center \u00b7 Clinic System',
    description: 'Profile with medical alert, dental chart and calendar.',
    platforms: ['iOS', 'Android', 'Mobile web'],
    image: 'assets/apps/smile-clinic-mobile.webp',
    alt: 'Three phone screens showing a patient profile, a dental chart and the doctors\' day calendar',
    background: '#F6F8FB'
  }
];
