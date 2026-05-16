/**
 * News Articles List
 *
 * Each article object shape:
 * {
 *   id:        number        — unique identifier (used for routing: /news/:id)
 *   title:     string        — article headline
 *   category:  string        — used to group articles
 *   date:      string        — display date (e.g. "March 2026")
 *   dateOrder: number        — YYYYMM for sorting (e.g. 202603)
 *   thumbnail: importedImage — hero background for the detail page
 *   excerpt:   string        — short description shown on the card
 *   content:   string        — full article body (detail page)
 *   author:    string        — optional author name
 *   images:    Array<{src, alt}> — gallery shown at the bottom of the detail page
 * }
 */

// Article carribean-openning
const carribean_openning_1 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-1.webp';
const carribean_openning_2 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-2.webp';
const carribean_openning_3 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-3.webp';
const carribean_openning_4 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-4.webp';
const carribean_openning_5 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-5.webp';
const carribean_openning_6 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-6.webp';
const carribean_openning_7 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-7.webp';
const carribean_openning_8 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-8.webp';
const carribean_openning_9 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-9.webp';
const carribean_openning_10 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-10.webp';
const carribean_openning_11 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-11.webp';
const carribean_openning_12 = '/Assets/Media/News/grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean/carribean-openning-12.webp';

// Article our-australian-partners-visit 
const australian_partners_visit_1 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-1.webp';
const australian_partners_visit_2 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-2.webp';
const australian_partners_visit_3 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-3.webp';
const australian_partners_visit_4 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-4.webp';
const australian_partners_visit_5 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-5.webp';
const australian_partners_visit_6 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-6.webp';
const australian_partners_visit_7 = '/Assets/Media/News/our-australian-partners-visit/our-australian-partners-visit-7.webp';

// Article our-romania-client-visit
const our_romania_client_visit_1 = '/Assets/Media/News/our-romania-client-visit/our-romania-client-visit-1.webp';
const our_romania_client_visit_2 = '/Assets/Media/News/our-romania-client-visit/our-romania-client-visit-2.webp';
const our_romania_client_visit_3 = '/Assets/Media/News/our-romania-client-visit/our-romania-client-visit-3.webp';
const our_romania_client_visit_4 = '/Assets/Media/News/our-romania-client-visit/our-romania-client-visit-4.webp';

// Article our-turkish-partner-visit
const our_turkish_partner_visit_1 = '/Assets/Media/News/our-turkish-partner-visit/our-turkish-partner-visit-1.webp';
const our_turkish_partner_visit_2 = '/Assets/Media/News/our-turkish-partner-visit/our-turkish-partner-visit-2.webp';
const our_turkish_partner_visit_3 = '/Assets/Media/News/our-turkish-partner-visit/our-turkish-partner-visit-3.webp';

// Article uk-client-visit
const uk_client_visit_1 = '/Assets/Media/News/uk-client-visit/uk-client-visit-1.webp';
const uk_client_visit_2 = '/Assets/Media/News/uk-client-visit/uk-client-visit-2.webp';

// Article usa-client-visit
const usa_client_visit_1 = '/Assets/Media/News/usa-client-visit/usa-client-visit-1.webp';

// Article on-site-project-inspection-in-the-caribbean
const on_site_project_inspection_in_the_caribbean_1 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-1.webp';
const on_site_project_inspection_in_the_caribbean_2 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-2.webp';
const on_site_project_inspection_in_the_caribbean_3 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-3.webp';
const on_site_project_inspection_in_the_caribbean_4 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-4.webp';
const on_site_project_inspection_in_the_caribbean_5 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-5.webp';
const on_site_project_inspection_in_the_caribbean_6 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-6.webp';
const on_site_project_inspection_in_the_caribbean_7 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-7.webp';
const on_site_project_inspection_in_the_caribbean_8 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-8.webp';
const on_site_project_inspection_in_the_caribbean_9 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-9.webp';
const on_site_project_inspection_in_the_caribbean_10 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-10.webp';
const on_site_project_inspection_in_the_caribbean_11 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-11.webp';
const on_site_project_inspection_in_the_caribbean_12 = '/Assets/Media/News/on-site-project-inspection-in-the-caribbean/on-site-project-inspection-in-the-caribbean-12.webp';


const articles = [
//   {
//     id: 1,
//     slug: "wadi-degla-expands-export-operations-to-latin-america",
//     title: "Wadi Degla Expands Export Operations to Latin America",
//     category: "Company News",
//     date: "March 2026",
//     dateOrder: 202603,
//     thumbnail: thumbnail1,
//     excerpt: "Wadi Degla announces a new distribution partnership in Brazil, marking its first dedicated presence in South America and opening new channels for Egyptian marble exports.",
//     content: "Wadi Degla is proud to announce the launch of its Latin American export operations, with an inaugural partnership in Brazil. This milestone follows the founding of Wadi Degla Global Exporting in 2024 under the leadership of the third generation, Saed Alghanam. The new partnership will facilitate the supply of premium Galala and Creamy White Pearl marble to Brazilian developers, architects, and contractors working on luxury residential and commercial projects. This expansion reinforces Wadi Degla's strategy of becoming the most reliable Egyptian stone supplier across all continents.",
//     author: "Wadi Degla Team",
//     images: [
//       { src: exp3,  alt: "Wadi Degla export containers ready for Latin America" },
//       { src: exp4,  alt: "Marble slabs loaded for international shipment" },
//       { src: exp5,  alt: "Export operations at Wadi Degla" },
//       { src: exp6,  alt: "Egyptian marble export shipment" },
//       { src: exp8,  alt: "Stone blocks prepared for shipping" },
//       { src: exp9,  alt: "Loading marble for Brazil" },
//       { src: exp10, alt: "Wadi Degla international export facility" },
//     ],
//   },
    {
    id: 1,
    slug: "grand-opening-of-viva-miches-resort-by-wyndham-in-the-caribbean",
    title: "Grand Opening of Viva Miches Resort by Wyndham in the Caribbean",
    date: "June 2025",
    dateOrder: 202506,
    thumbnail: carribean_openning_11,
    content: "Our CEO mr saed alghanam At the prestigious grand opening of Viva Miches resort by wyndham in the Caribbean — one of the most important and high-profile hospitality projects in the entire region — Wadi Degla proudly stood as the exclusive supplier of all marble used throughout the resort , including the floors, wall ,stairs , cladding, and countertops. This iconic development showcases the exceptional quality, elegance, and durability of our materials across every space. I had the honor of attending this remarkable event alongside Mr. Ettore Collusi, President of Viva resorts by wyndham , mss Dominique Colussi the general coordinator for all viva resorts and Mr. Claudio Natella  the Operations Manager for all Viva Resorts, whose leadership and coordination were instrumental to the project’s success. Our trusted Caribbean representative, ensured smooth execution and high-level oversight on site. The grand opening was further elevated by the presence of His Excellency Luis Abinader  the President of the Dominican Republic and and Mr Gustavo Viescas  the President of Wyndham Hotels Latin America — and his excellency David Collado  the minister of tourism of dominican republic — a testament to the global impact and significance of this project.",
    author: "Wadi Degla Team",
    images: [
      { src: carribean_openning_1, alt: "The prestigious grand opening of Viva Miches image 1" },
      { src: carribean_openning_2, alt: "The prestigious grand opening of Viva Miches image 2" },
      { src: carribean_openning_3, alt: "The prestigious grand opening of Viva Miches image 3" },
      { src: carribean_openning_4, alt: "The prestigious grand opening of Viva Miches image 4" },
      { src: carribean_openning_5,  alt: "The prestigious grand opening of Viva Miches image 5" },
      { src: carribean_openning_6,  alt: "The prestigious grand opening of Viva Miches image 6" },
      { src: carribean_openning_7,  alt: "The prestigious grand opening of Viva Miches image 7" },
      { src: carribean_openning_8,  alt: "The prestigious grand opening of Viva Miches image 8" },
      { src: carribean_openning_9,  alt: "The prestigious grand opening of Viva Miches image 9" },
      { src: carribean_openning_10,  alt: "The prestigious grand opening of Viva Miches image 10" },
      { src: carribean_openning_12,  alt: "The prestigious grand opening of Viva Miches image 12" },
      { src: carribean_openning_11,  alt: "The prestigious grand opening of Viva Miches image 11" },
    ],
  },
  {
    id: 2, 
    slug: "our-australian-partners-visit",
    title: "Our Australian Partners Visit",
    date: "October 2025",
    dateOrder: 202510,
    thumbnail: australian_partners_visit_2,
    content: "Our Australian partners visited our factories to select premium marble and granite stones for a major project in Sydney. The visit focused on reviewing a wide range of high-quality materials, ensuring the perfect selection to meet the project’s design, durability, and performance requirements while reinforcing our international collaboration.",
    author: "Wadi Degla Team",
    images: [
      { src: australian_partners_visit_1, alt: "Our Australian partners visit image 1" },
      { src: australian_partners_visit_2, alt: "Our Australian partners visit image 2" },
      { src: australian_partners_visit_3, alt: "Our Australian partners visit image 3" },
      { src: australian_partners_visit_4, alt: "Our Australian partners visit image 4" },
      { src: australian_partners_visit_5, alt: "Our Australian partners visit image 5" },
      { src: australian_partners_visit_6, alt: "Our Australian partners visit image 6" },
      { src: australian_partners_visit_7, alt: "Our Australian partners visit image 7" },
    ],
  },
    {
    id: 3,
    slug: "our-romania-client-visit",
    title: "Our Romania Client Visit",
    date: "Jan 2026",
    dateOrder: 202601,
    thumbnail: our_romania_client_visit_2,
    content: "Our clients from Romania visited our factories to plan the upcoming New Year supply strategy and strengthen our ongoing partnership. The visit included an in-depth selection process for new marble and granite materials, ensuring premium quality and tailored choices for their next order and future projects.",
    author: "Wadi Degla Team",
    images: [
      { src: our_romania_client_visit_1, alt: "Our Romania client visit image 1" },
      { src: our_romania_client_visit_2, alt: "Our Romania client visit image 2" },
      { src: our_romania_client_visit_3, alt: "Our Romania client visit image 3" },
      { src: our_romania_client_visit_4, alt: "Our Romania client visit image 4" },
    ],
  },
    {
    id: 4,
    slug: "our-turkish-partner-visit",
    title: "Our Turkish Partner Visit",
    date: "Jan 2025",
    dateOrder: 202501,
    thumbnail: our_turkish_partner_visit_1,
    content: "Our partner from Turkey visited our factories to finalize and sign the 2026 supply contract, marking an important step in strengthening our international collaboration. During the visit, they also reviewed and selected new marble and granite materials for the upcoming orders, ensuring the highest quality standards and a diverse product range for future projects.",
    author: "Wadi Degla Team",
    images: [
      { src: our_turkish_partner_visit_1, alt: "Our Turkish partner visit image 1" },
      { src: our_turkish_partner_visit_2, alt: "Our Turkish partner visit image 2" },
      { src: our_turkish_partner_visit_3, alt: "Our Turkish partner visit image 3" },
    ],
  },
    {
    id: 5,
    slug: "our-uk-client-visit",
    title: "Our UK Client Visit",
    date: "Jan 2026",
    dateOrder: 202601,
    thumbnail: uk_client_visit_1,
    content: "Our client from the UK visited our factories to explore our production processes and discover our latest marble and granite collections. The visit highlighted our commitment to quality craftsmanship, while also opening discussions for upcoming projects and future supply opportunities.",
    author: "Wadi Degla Team",
    images: [
      { src: uk_client_visit_1, alt: "Our UK client visit image 1" },
      { src: uk_client_visit_2, alt: "Our UK client visit image 2" },
    ],
  },
    {
    id: 6,
    slug: "our-usa-client-visit",
    title: "Our USA Client Visit",
    date: "Feb 2026",
    dateOrder: 202602,
    thumbnail: usa_client_visit_1,
    content: "Our client from the USA visited our factories to experience our manufacturing excellence and explore our wide range of premium marble and granite materials. The visit provided an opportunity to discuss upcoming projects, evaluate new selections, and strengthen our long-term international partnership.",
    author: "Wadi Degla Team",
    images: [
      { src: usa_client_visit_1, alt: "Our USA client visit image 1" },
    ],
  },
    {
    id: 7,
    slug: "on-site-project-inspection-in-the-caribbean",
    title: "On-Site Project Inspection in the Caribbean",
    date: "July 2025",
    dateOrder: 202507,
    thumbnail: on_site_project_inspection_in_the_caribbean_1,
    content: "Our team carried out a comprehensive on-site visit in the Caribbean to review and monitor the progress of ongoing projects supplied by Wadi Degla. The projects feature premium marble and granite materials sourced from both our Egypt and Turkey branches, reflecting our global supply capabilities.\n\nDuring the visit, we closely assessed installation quality, adherence to design specifications, and overall project execution to ensure everything aligns with our high standards. This hands-on approach allows us to maintain consistency, support our partners on the ground, and guarantee that every project delivers exceptional results in both performance and aesthetics.",
    author: "Wadi Degla Team",
    images: [
      { src: on_site_project_inspection_in_the_caribbean_1, alt: "On-site project inspection in the Caribbean image 1" },
      { src: on_site_project_inspection_in_the_caribbean_2, alt: "On-site project inspection in the Caribbean image 2" },
      { src: on_site_project_inspection_in_the_caribbean_3, alt: "On-site project inspection in the Caribbean image 3" },
      { src: on_site_project_inspection_in_the_caribbean_4, alt: "On-site project inspection in the Caribbean image 4" },
      { src: on_site_project_inspection_in_the_caribbean_5, alt: "On-site project inspection in the Caribbean image 5" },
      { src: on_site_project_inspection_in_the_caribbean_6, alt: "On-site project inspection in the Caribbean image 6" },
      { src: on_site_project_inspection_in_the_caribbean_7, alt: "On-site project inspection in the Caribbean image 7" },
      { src: on_site_project_inspection_in_the_caribbean_8, alt: "On-site project inspection in the Caribbean image 8" },
      { src: on_site_project_inspection_in_the_caribbean_9, alt: "On-site project inspection in the Caribbean image 9" },
      { src: on_site_project_inspection_in_the_caribbean_10, alt: "On-site project inspection in the Caribbean image 10" },
      { src: on_site_project_inspection_in_the_caribbean_11, alt: "On-site project inspection in the Caribbean image 11" },
      { src: on_site_project_inspection_in_the_caribbean_12, alt: "On-site project inspection in the Caribbean image 12" },
    ],
  },

];

export default articles;
