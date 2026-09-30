import { company } from "@/config/company";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export const metadata = pageMetadata({ title: "Mentions légales", path: "/mentions-legales", noindex: company.isDemo });

export default function MentionsLegales() {
  const l = company.legal;
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {l.legalName} — {l.legalForm}
        <br />
        {company.address.street}, {company.address.postalCode} {company.address.city}
        <br />
        SIRET : {l.siret} · TVA : {l.vat}
        <br />
        {l.transportRegistry}
        <br />
        Téléphone : {company.phone.display} · E-mail : {company.email}
      </p>
      <h2>Directeur de la publication</h2>
      <p>{l.publisher}</p>
      <h2>Hébergement</h2>
      <p>{l.host}</p>
      <h2>Assurance</h2>
      <p>{l.insurance}</p>
      <h2>Propriété intellectuelle</h2>
      <p>L&apos;ensemble des contenus de ce site (textes, visuels, logo) est protégé. Toute reproduction sans autorisation est interdite.</p>
    </LegalPage>
  );
}
