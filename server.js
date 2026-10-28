import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Base website URL
const BASE_URL = "https://trixietales.com";

// SEO Route Metadata Dictionary - Optimized for GMB & Local Lead Generation
const ROUTE_SEO = {
  "/": {
    name: "Home",
    title: "Trixietales | Best Wedding Photographer in Whitefield Bangalore | Studio Near Me",
    description:
      "Top-rated luxury wedding photography & cinematography studio in Whitefield, Bengaluru led by International Award-Winner Markhandeya. Candid wedding shoots, pre-wedding films, and heirloom prints. Book on WhatsApp: +91 86182 23659.",
    keywords:
      "photographer near me studio Whitefield bangalore, wedding photographer in Whitefield Bangalore, photographer near me, best wedding photographer Bangalore, photo studio Whitefield, candid wedding photography Bangalore, pre wedding photoshoot Bangalore, maternity photoshoot near me, cinematic wedding films Bengaluru",
    ogImage: "/banner/1.jpeg",
  },
  "/portfolio": {
    name: "Portfolio",
    title: "Wedding & Pre-Wedding Portfolio | Top Photographer in Whitefield Bangalore",
    description:
      "Explore royal wedding portraits, candid ceremonies, haldi moments, and romantic pre-wedding shoots captured by Markhandeya across Bengaluru and luxury destination venues.",
    keywords:
      "wedding photography portfolio Bangalore, candid wedding photos Whitefield, pre wedding shoots Bangalore, luxury bridal portraits, Trixietales portfolio, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/2.jpeg",
  },
  "/prints": {
    name: "3D Prints & Frames",
    title: "3D Prints & Handcrafted Wooden Frames | Artisan Studio Whitefield Bangalore",
    description:
      "Interactive 3D visualizer for handcrafted wooden frames, lay-flat leather heirloom albums, luxe magazines, and desk calendars. Live preview your wedding photos in 360°.",
    keywords:
      "wooden photo frames Bangalore, photo frame studio near me Whitefield, 3D frame visualizer, wedding album printing Bangalore, canvas prints Whitefield, custom calendar printing Bangalore, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/3.jpeg",
  },
  "/reviews": {
    name: "Reviews",
    title: "500+ Verified 5-Star Reviews | 4.9★ Rated Photographer Near Me | Trixietales",
    description:
      "Read authentic 5-star Google reviews and verified client testimonials from 500+ couples across Bengaluru. Highest rated wedding photography studio in Whitefield.",
    keywords:
      "Trixietales reviews, best wedding photographer reviews Bangalore, top rated photography studio Whitefield, Google reviews photographer near me, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/1.jpeg",
  },
  "/experience": {
    name: "Experience & Events",
    title: "The Markhandeya Experience | Photography Competition 2027 & Workshops | Trixietales",
    description:
      "Join India's premier Photography Competition 2027 with prizes worth ₹2 Lakhs, photography masterclasses, and explore Founder Markhandeya's signature cinematic Sony Cine wedding storytelling workflow in Whitefield, Bangalore.",
    keywords:
      "photography competition 2027, photographer near me studio Whitefield bangalore, photography workshop Bangalore, cinematic wedding films Bangalore, Sony Cine wedding filmmaker, Markhandeya wedding photographer, luxury wedding storytelling Whitefield",
    ogImage: "/images/hero1.jpeg",
  },
  "/education": {
    name: "Masterclasses",
    title: "Photography Masterclasses & Mentorship | Trixietales Academy Bengaluru",
    description:
      "Professional wedding photography masterclasses, hands-on lighting workshops, and private filmmaking mentoring by International Award-Winner Markhandeya.",
    keywords:
      "photography masterclass Bangalore, wedding photography workshop Whitefield, cinematography course Bangalore, photography mentoring, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/4.jpeg",
  },
  "/courses": {
    name: "Courses",
    title: "Photography Masterclasses & Mentorship | Trixietales Academy Bengaluru",
    description:
      "Professional wedding photography masterclasses, hands-on lighting workshops, and private filmmaking mentoring by International Award-Winner Markhandeya.",
    keywords:
      "photography masterclass Bangalore, wedding photography workshop Whitefield, cinematography course Bangalore, photography mentoring, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/4.jpeg",
  },
  "/collaborations": {
    name: "Collaborations",
    title: "Brand & Fashion Collaborations | Trixietales Photography Bengaluru",
    description:
      "High-fashion editorial showcases, luxury bridal brand campaigns, celebrity styling, and creative commercial shoots in Bengaluru.",
    keywords:
      "fashion photographer Bangalore, brand shoot Whitefield, commercial photography Bangalore, editorial photoshoot, photographer near me studio Whitefield bangalore",
    ogImage: "/banner/2.jpeg",
  },
  "/about": {
    name: "About Us",
    title: "About Studio & Awards | Markhandeya | Trixietales Whitefield Bangalore",
    description:
      "Learn about Trixietales Studio in Belathur, Whitefield, our international awards, creative director Markhandeya, and our passion for timeless visual art.",
    keywords:
      "about Trixietales, Markhandeya photographer, award winning photographer Bangalore, photography studio Belathur Whitefield, photographer near me studio Whitefield bangalore",
    ogImage: "/images/founder.png",
  },
  "/contact": {
    name: "Contact",
    title: "Contact & Studio Location | Belathur Whitefield Bangalore | GMB Map",
    description:
      "Visit our flagship studio in Belathur, Whitefield, Bengaluru or WhatsApp +91 86182 23659 for direct shoot inquiries, package details, and studio appointments.",
    keywords:
      "contact photographer Whitefield, photo studio address Belathur Bangalore, Trixietales WhatsApp, photographer near me phone number, photographer near me studio Whitefield bangalore",
    ogImage: "/logo.png",
  },
};

// 1. Serve robots.txt with direct sitemap link
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/dashboard

Sitemap: ${BASE_URL}/sitemap.xml
`);
});

// 2. Serve dynamic rich XML sitemap
app.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");

  const today = new Date().toISOString().split("T")[0];
  const urls = Object.keys(ROUTE_SEO).map((routePath) => {
    const route = ROUTE_SEO[routePath];
    const loc = `${BASE_URL}${routePath === "/" ? "" : routePath}`;
    const priority = routePath === "/" ? "1.0" : routePath === "/portfolio" || routePath === "/prints" || routePath === "/contact" ? "0.9" : "0.8";
    const changefreq = routePath === "/" || routePath === "/portfolio" || routePath === "/reviews" ? "weekly" : "monthly";
    const imageXml = route.ogImage
      ? `\n    <image:image>\n      <image:loc>${BASE_URL}${route.ogImage}</image:loc>\n      <image:title>${route.title.replace(/&/g, "&amp;")}</image:title>\n    </image:image>`
      : "";

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  res.send(xml);
});

const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");

// 3. Helper: inject strong dynamic SEO into HTML
function injectSEO(html, reqPath) {
  const normalizedPath = reqPath.split("?")[0].toLowerCase().replace(/\/$/, "") || "/";
  const seo = ROUTE_SEO[normalizedPath] || ROUTE_SEO["/"];
  const canonicalUrl = `${BASE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;

  let modifiedHtml = html;

  // Replace Title
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${seo.title}</title>`
  );

  // Replace Meta Description
  modifiedHtml = modifiedHtml.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${seo.description}" />`
  );

  // Replace OpenGraph Title & Description
  modifiedHtml = modifiedHtml.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${seo.title}" />`
  );
  modifiedHtml = modifiedHtml.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${seo.description}" />`
  );
  modifiedHtml = modifiedHtml.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter Title & Description
  modifiedHtml = modifiedHtml.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${seo.title}" />`
  );
  modifiedHtml = modifiedHtml.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${seo.description}" />`
  );

  // Replace Canonical Link
  modifiedHtml = modifiedHtml.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Inject / Replace Meta Keywords with 'photographer near me studio Whitefield bangalore'
  const defaultKeywords =
    "photographer near me studio Whitefield bangalore, photographer near me, studio Whitefield bangalore, wedding photographer near me, photography studio Whitefield Bangalore, wedding photographers in Bangalore, candid wedding photography Bangalore, cinematic wedding films Whitefield, pre wedding photoshoot studio near me";
  const routeKeywords = seo.keywords || defaultKeywords;
  if (modifiedHtml.includes('<meta name="keywords"')) {
    modifiedHtml = modifiedHtml.replace(
      /<meta name="keywords" content=".*?" \/>/i,
      `<meta name="keywords" content="${routeKeywords}" />`
    );
  } else {
    modifiedHtml = modifiedHtml.replace(
      /<\/head>/i,
      `  <meta name="keywords" content="${routeKeywords}" />\n</head>`
    );
  }

  // Inject GMB Local Business & Geo Meta Tags for Lead Generation
  const gmbLeadTags = `
  <!-- Google My Business (GMB) & Local SEO Lead Generation Meta -->
  <meta name="geo.region" content="IN-KA" />
  <meta name="geo.placename" content="Whitefield, Bengaluru" />
  <meta name="geo.position" content="13.010646;77.755490" />
  <meta name="ICBM" content="13.010646, 77.755490" />
  <meta name="contact:phone_number" content="+918618223659" />
  <meta name="contact:whatsapp" content="https://wa.me/918618223659" />
  <meta name="gmb:map_url" content="https://share.google/fz4Pz3hsFivsuZIva" />
  <meta name="business:contact_data:locality" content="Whitefield, Bengaluru" />
  <meta name="business:contact_data:region" content="Karnataka" />
  <meta name="business:contact_data:postal_code" content="560067" />
  <meta name="business:contact_data:country_name" content="India" />
`;

  if (!modifiedHtml.includes('name="geo.region"')) {
    modifiedHtml = modifiedHtml.replace(/<\/head>/i, `${gmbLeadTags}\n</head>`);
  }

  // Dynamic BreadcrumbList Schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://trixietales.com/"
    }
  ];
  if (normalizedPath !== "/") {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": seo.name || "Page",
      "item": canonicalUrl
    });
  }

  const breadcrumbsSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  });

  // WebSite Schema with Sitelinks Search
  const websiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://trixietales.com/#website",
    "url": "https://trixietales.com/",
    "name": "Trixietales Photography & Films",
    "description": "Premier wedding photography and cinematic films studio in Whitefield Bangalore.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://trixietales.com/portfolio?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  });

  // FAQ Schema for Rich Snippets
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is Trixietales Photography studio located in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Trixietales Photography & Films studio is located at No 3/4, Near Hanuman Temple, Maruthi Layout, Belathur, Whitefield, Bengaluru, Karnataka 560067. Direct Google Map link: https://share.google/fz4Pz3hsFivsuZIva."
        }
      },
      {
        "@type": "Question",
        "name": "How can I book a wedding photoshoot with Markhandeya at Trixietales?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can directly connect with Founder & Creative Director Markhandeya on WhatsApp at +91 86182 23659 or through our website booking inquiry form to check availability and package options."
        }
      },
      {
        "@type": "Question",
        "name": "What photography services and 3D print formats are offered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Trixietales specializes in luxury candid wedding photography, cinematic 4K wedding films, pre-wedding destination shoots, handcrafted solid teakwood frames, lay-flat archival leather heirloom albums, high-fashion magazines, and custom desk calendars with real-time 3D preview."
        }
      },
      {
        "@type": "Question",
        "name": "When is the Photography Competition 2027 and how can I participate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Trixietales Photography Competition 2027 offers prizes worth ₹2 Lakhs with registration closing on March 31st, 2027. Visit our Experience page or message us on WhatsApp +91 86182 23659 to register."
        }
      }
    ]
  });

  // Event Schema for /experience
  const eventSchema = normalizedPath === "/experience" ? `
  <script type="application/ld+json" id="experience-events-schema">
  [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Trixietales Photography Competition 2027",
      "startDate": "2027-01-01T00:00:00+05:30",
      "endDate": "2027-03-31T23:59:59+05:30",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "VirtualLocation",
        "url": "https://trixietales.com/experience"
      },
      "image": ["https://trixietales.com/images/hero1.jpeg"],
      "description": "India's premier wedding and portrait photography competition 2027 with prizes worth ₹2 Lakhs. Registration closes on March 31st, 2027.",
      "offers": {
        "@type": "Offer",
        "url": "https://wa.me/918618223659?text=Register%20Competition%202027",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Trixietales Photography & Films",
        "url": "https://trixietales.com"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": "Portrait Photography Masterclass 2027",
      "startDate": "2027-03-15T10:00:00+05:30",
      "endDate": "2027-03-15T16:00:00+05:30",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": "Studio Center, Mumbai",
        "address": "Studio Center, Mumbai, India"
      },
      "description": "Masterclass on lighting and editorial wedding portraits by Markhandeya."
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": "Wedding Photography Basics 2027",
      "startDate": "2027-03-22T09:00:00+05:30",
      "endDate": "2027-03-22T17:00:00+05:30",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": "Convention Hall, Bangalore",
        "address": "Bangalore, Karnataka, India"
      },
      "description": "Intensive hands-on wedding photography workshop."
    }
  ]
  </script>
` : "";

  // Inject GMB LocalBusiness Schema with Lead Generation ReserveAction
  const gmbSchema = `
  <script type="application/ld+json" id="gmb-local-business-schema">
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PhotographyBusiness", "ProfessionalService"],
    "@id": "https://trixietales.com/#organization",
    "name": "Trixietales Photography & Films",
    "alternateName": "Trixietales Studio - Best Wedding Photographer Near Me Whitefield Bangalore",
    "url": "https://trixietales.com/",
    "hasMap": "https://share.google/fz4Pz3hsFivsuZIva",
    "telephone": "+918618223659",
    "priceRange": "₹₹₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, UPI, Bank Transfer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No 3/4, Near Hanuman Temple, Maruthi Layout, Belathur",
      "addressLocality": "Whitefield, Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560067",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.0106456,
      "longitude": 77.7554901
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "520",
      "bestRating": "5",
      "worstRating": "1"
    },
    "founder": {
      "@type": "Person",
      "name": "Markhandeya",
      "jobTitle": "Creative Director & International Award-Winning Wedding Photographer",
      "sameAs": "https://trixietales.com/about"
    },
    "sameAs": [
      "https://share.google/fz4Pz3hsFivsuZIva",
      "https://www.instagram.com/weddingsbytrixietales/?hl=en",
      "https://www.facebook.com/trixietales"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://wa.me/918618223659?text=Hello%20Trixietales%2C%20I%20found%20you%20on%20Google%20and%20would%20like%20to%20inquire%20about%20a%20wedding%20session.",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Wedding & Studio Photoshoot Booking"
      }
    }
  }
  </script>
  <script type="application/ld+json" id="website-schema">${websiteSchema}</script>
  <script type="application/ld+json" id="breadcrumbs-schema">${breadcrumbsSchema}</script>
  <script type="application/ld+json" id="faq-schema">${faqSchema}</script>
  ${eventSchema}
`;

  if (!modifiedHtml.includes('id="gmb-local-business-schema"')) {
    modifiedHtml = modifiedHtml.replace(/<\/head>/i, `${gmbSchema}\n</head>`);
  }

  return modifiedHtml;
}

// Helper: send HTML response with strong SEO headers
function sendSEOPage(res, html, reqPath) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.send(injectSEO(html, reqPath));
}

// 4. Explicit Named Routes with Dynamic SSR SEO Injection
Object.keys(ROUTE_SEO).forEach((routePath) => {
  app.get(routePath, (req, res) => {
    const indexPath = fs.existsSync(path.join(distDir, "index.html"))
      ? path.join(distDir, "index.html")
      : path.join(__dirname, "index.html");

    fs.readFile(indexPath, "utf8", (err, html) => {
      if (err) {
        console.error("Error reading index.html:", err);
        return res.status(500).send("Server Error");
      }
      sendSEOPage(res, html, routePath);
    });
  });
});

// 5. Serve Built Static Assets (dist and public)
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    index: false,
    redirect: false,
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    }
  }));
}
app.use(express.static(publicDir, { index: false, redirect: false, maxAge: "1d" }));

// 6. SSR / Dynamic Route Fallback for All Pages (Express 5 compatible)
app.use((req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).end();
  }

  const indexPath = fs.existsSync(path.join(distDir, "index.html"))
    ? path.join(distDir, "index.html")
    : path.join(__dirname, "index.html");

  fs.readFile(indexPath, "utf8", (err, html) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Server Error");
    }

    sendSEOPage(res, html, req.path);
  });
});

app.listen(PORT, () => {
  console.log(`🎬 Trixietales SSR Server running on http://localhost:${PORT}`);
});
