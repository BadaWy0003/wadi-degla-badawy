import i18n from '../i18n';

// Generate searchable content dynamically from i18n translations
const generateSearchableContent = () => {
  const t = i18n.t.bind(i18n);
  
  return [
    {
      title: t('about.introTitle'),
      path: "/about",
      content: `${t('about.introText1')} ${t('about.introText2')}`,
      sections: [
        {
          title: t('about.visionTitle'),
          content: t('about.visionText')
        },
        {
          title: t('about.missionTitle'),
          content: t('about.missionText')
        },
        {
          title: t('about.expertiseTitle'),
          content: t('about.expertiseText1')
        }
      ]
    },
    {
      title: t('history.pageTitle').replace(' | Wadidegla', ''),
      path: "/history",
      content: t('history.introText1'),
      sections: [
        {
          title: t('history.section1.title'),
          content: t('history.section1.text')
        },
        {
          title: t('history.section2.title'),
          content: t('history.section2.text')
        },
        {
          title: t('history.section3.title'),
          content: t('history.section3.text')
        },
        {
          title: t('history.section4.title'),
          content: t('history.section4.text')
        }
      ]
    },
    {
      title: t('quarries.pageTitle').replace(' | Wadidegla', ''),
      path: "/quarries",
      content: t('quarries.introText') || "Our quarries represent the foundation of our superior product quality.",
      sections: [
        {
          title: "Our Quarries",
          content: t('quarries.introText') || "Located across Egypt's richest stone deposits"
        }
      ]
    },
    {
      title: t('exports.pageTitle').replace(' | Wadidegla', ''),
      path: "/exports",
      content: t('exports.introText') || "As a leading exporter of Egyptian marble and granite",
      sections: [
        {
          title: "Global Reach",
          content: t('exports.introText') || "Serving markets worldwide"
        }
      ]
    },
    {
      title: t('machinery.pageTitle').replace(' | Wadidegla', ''),
      path: "/machinery",
      content: t('machinery.introText') || "Our production facility houses state-of-the-art machinery",
      sections: [
        {
          title: "Modern Equipment",
          content: t('machinery.introText') || "Advanced equipment for stone processing"
        }
      ]
    },
    {
      title: t('certificates.pageTitle').replace(' | Wadidegla', ''),
      path: "/certificates",
      content: t('certificates.introText') || "Our commitment to quality is validated by international certifications",
      sections: [
        {
          title: t('certificates.isoTitle'),
          content: t('certificates.isoText') || "ISO 9001:2015 certified"
        }
      ]
    },
    {
      title: t('gallery.pageTitle').replace(' | Wadidegla', ''),
      path: "/gallery",
      content: t('gallery.introText') || "Explore our collection of marble and granite",
      sections: [
        {
          title: "Gallery",
          content: t('gallery.introText') || "View our magnificent projects and stone varieties"
        }
      ]
    },
    {
      title: t('contact.pageTitle').replace(' | Wadidegla', ''),
      path: "/contact",
      content: t('contact.introText') || "Connect with us for all your natural stone needs",
      sections: [
        {
          title: "Contact Us",
          content: t('contact.introText') || "Our team is ready to assist you"
        }
      ]
    },
    {
      title: t('products.pageTitle').replace(' | Wadidegla', ''),
      path: "/products",
      content: t('products.introText') || "Discover our premium natural stone products",
      sections: [
        {
          title: "Our Products",
          content: t('products.introText') || "High-quality marble and granite for every project"
        }
      ]
    },
    {
      title: t('projects.pageTitle').replace(' | Wadidegla', ''),
      path: "/projects",
      content: t('projects.introText') || "Explore our completed and ongoing projects",
      sections: [
        {
          title: "Projects",
          content: t('projects.introText') || "Showcasing our expertise and craftsmanship"
        }
      ]
    }
  ];
};

export const searchContent = (query) => {
  const searchTerm = query.toLowerCase();
  const searchableContent = generateSearchableContent();
  
  return searchableContent.flatMap(page => {
    const matches = [];
    
    // Search in main content
    if (
      page.title.toLowerCase().includes(searchTerm) ||
      page.content.toLowerCase().includes(searchTerm)
    ) {
      matches.push({
        title: page.title,
        path: page.path,
        content: page.content.substring(0, 150) + '...' // Preview text
      });
    }
    
    // Search in sections
    if (page.sections) {
      page.sections.forEach(section => {
        if (
          section.title.toLowerCase().includes(searchTerm) ||
          section.content.toLowerCase().includes(searchTerm)
        ) {
          matches.push({
            title: `${page.title} - ${section.title}`,
            path: `${page.path}`,
            content: section.content.substring(0, 150) + '...'
          });
        }
      });
    }
    
    return matches;
  });
};