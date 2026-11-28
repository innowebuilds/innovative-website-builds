/*
 * Applications section: each entry is one app card. Clicking a card opens a
 * gallery of that app's screens.
 *
 * To add an app:
 *   1. Put its images in assets/apps/ (WebP, about 2000 px wide, is ideal).
 *   2. Copy an entry below and fill it in. The first screen is used as the card image.
 * An app with no screens yet shows a "Preview coming soon" card.
 *
 * App fields:
 *   name        App name (required)
 *   category    Short label shown above the name, e.g. "Healthcare SaaS"
 *   description One or two sentences about what the app does
 *   platforms   Tags shown on the card, e.g. ['iOS', 'Android']
 *   background  Optional colour behind the images, matched to their edges
 *   screens     List of { image, title, caption, alt } shown in the gallery
 */
window.IWB_APPS = [
  {
    name: 'Smile City Center Clinic System',
    category: 'Healthcare SaaS',
    description: 'A complete dental clinic platform: appointments, patient files with dental charts, billing, reports, reminders and voice entry in three languages.',
    platforms: ['Next.js 15', 'Cloudflare Workers', 'D1 · Prisma', 'EN · FR · AR voice'],
    background: '#F6F8FB',
    screens: [
      {
        image: 'assets/apps/smile-clinic-cover.webp',
        title: 'Smile City Center Clinic System',
        caption: 'Desktop and mobile, with appointments, patient files, billing and reminders.',
        alt: 'Smile City Center Clinic System shown on a desktop browser and two phones'
      },
      {
        image: 'assets/apps/smile-clinic-dashboard.webp',
        title: 'Daily dashboard',
        caption: "Today's visits, waiting room, collections and no-show rate at a glance.",
        alt: "Clinic dashboard with visits today, monthly collections, unpaid balances, today's schedule and waiting room"
      },
      {
        image: 'assets/apps/smile-clinic-dental-chart.webp',
        title: 'Interactive dental chart',
        caption: 'FDI chart with nine conditions, colour-coded and editable by doctors.',
        alt: 'Patient profile with a medical alert and a colour-coded FDI dental chart'
      },
      {
        image: 'assets/apps/smile-clinic-voice.webp',
        title: 'Fill by voice',
        caption: 'Speak in English, French or Arabic and the form fills itself for review.',
        alt: 'New patient form filled automatically from a spoken sentence, with each detected field highlighted'
      },
      {
        image: 'assets/apps/smile-clinic-mobile.webp',
        title: 'Patient care in your pocket',
        caption: 'Profile with medical alert, dental chart and calendar.',
        alt: "Three phone screens showing a patient profile, a dental chart and the doctors' day calendar"
      }
    ]
  }
];
