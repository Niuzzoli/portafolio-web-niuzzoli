import TextLoop from "@/components/TextLoop";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import SiteFooter from "@/components/SiteFooter";
import { CONTACT_EMAIL, LOCATION, SOCIALS } from "@/lib/contact";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Datos estructurados: le dicen a Google quién sos, dónde trabajás y qué ofrecés.
// Se pueden validar en https://search.google.com/test/rich-results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#negocio`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/opengraph-image`,
      email: CONTACT_EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: LOCATION.city,
        addressRegion: LOCATION.region,
        addressCountry: LOCATION.country,
      },
      areaServed: { "@type": "Country", name: "Argentina" },
      founder: { "@id": `${SITE_URL}/#persona` },
      sameAs: SOCIALS.map((social) => social.href),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios",
        itemListElement: [
          "Diseño web",
          "Desarrollo web",
          "Automatizaciones",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#persona`,
      name: AUTHOR,
      jobTitle: "Diseñador y desarrollador web",
      url: SITE_URL,
      sameAs: SOCIALS.map((social) => social.href),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#sitio`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "es-AR",
      publisher: { "@id": `${SITE_URL}/#negocio` },
    },
  ],
};

export default function Home() {
  return (
    <main className="bg-black text-white">
      <script
        type="application/ld+json"
        // El reemplazo de "<" evita que un texto cierre el <script> (recomendación de la guía de Next)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Nav + intro del logo */}
      <SiteHeader />

      {/* Todo el contenido va en una capa opaca por encima del footer (que está debajo, pegado al fondo) */}
      <div id="contenido" className="relative z-10 bg-black">
        <Hero />

        {/* Sube sobre el final del hero: sin fondo propio, para que se vea el degradado detrás.
          El margen va en vw porque el separador escala con el ancho de la pantalla.
          Sin eventos de mouse: tapa el final del hero y si no bloquearía el botón. */}
        <section className="pointer-events-none relative z-10 -mt-[26vw] overflow-hidden md:-mt-[12vw]">
          {/* En pantallas chicas el separador es el doble de ancho y se recortan los costados,
            así el texto y la cinta se ven al doble de tamaño */}
          <div className="-ml-[50%] w-[200%] md:ml-0 md:w-full">
            <TextLoop
              text={"Diseños ✦ Desarrollos ✦ Automatizaciones"}
              shape={"wave"}
              speed={70}
              scrollBoost={2}
              curviness={60}
              edgeFade={0.8}
              fontSize={30}
              fontWeight={700}
              letterSpacing={1.5}
              uppercase={false}
              outline={false}
              outlineWidth={1.5}
              cross
              tilt={6}
              pauseOnHover={false}
              crossAngle={15}
              ribbon={true}
              ribbonColor="#721717"
              ribbonWidth={40}
            />
          </div>
        </section>

        <Services />
        <Projects />
        <Process />
        <Contact />
      </div>

      <SiteFooter />
    </main>
  );
}
