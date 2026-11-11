/* RF School marketing page — everything the school may want to change
 * without touching the page: contact details, social links, store links.
 *
 * Edit here, then run `node build.js` and upload the `dist` folder again.
 * The two Supabase values are filled in by the build from app/env.json
 * (the public, browser-safe key the apps already use).
 */
window.RF_CONFIG = {
  // The school's contact details (given by the school on 2026-11-11).
  email: 'rfschool.edu@gmail.com',
  phone: '+966 55 986 7721',
  // WhatsApp number of the quick-contact button; the phone above when empty.
  whatsapp: '',
  // An empty link hides its button.
  social: {
    instagram: '',
    facebook: '',
    tiktok: 'https://www.tiktok.com/@rf.school1',
  },
  // TODO(school): each app's own store page once it is published.
  stores: {
    ios: 'https://apps.apple.com',
    android: 'https://play.google.com',
    windows: 'https://apps.microsoft.com',
  },
  supabaseUrl: 'https://ohaoocejnnhhxawxpnev.supabase.co',
  supabaseKey: 'sb_publishable_Ic_tw1npQ8BMJ4P3OYZJ4A_Udx5QOOi',
};
