import { company } from "@/config/company";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export const metadata = pageMetadata({ title: "Politique de confidentialité", path: "/confidentialite", noindex: company.isDemo });

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Cette page décrit l&apos;usage des informations transmises via le simulateur de devis. Son contenu définitif doit être validé par{" "}
        {company.legal.legalName} (voir la liste des informations à fournir).
      </p>
      <h2>Données collectées</h2>
      <p>Inventaire du déménagement, adresses et conditions d&apos;accès, date souhaitée, options, ainsi que vos nom, prénom, téléphone et e-mail.</p>
      <h2>Finalité</h2>
      <p>Établir votre devis, vous recontacter à ce sujet et organiser votre déménagement. Aucune revente, aucune prospection sans accord.</p>
      <h2>Durée de conservation</h2>
      <p>[À compléter — par exemple : 3 ans à compter du dernier contact pour une demande sans suite.]</p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les rectifier ou demander leur suppression en écrivant à {company.email}. Vous pouvez également introduire une
        réclamation auprès de la CNIL.
      </p>
      <h2>Mesure d&apos;audience</h2>
      <p>[À compléter selon les outils retenus — bandeau de consentement requis avant tout traceur publicitaire.]</p>
    </LegalPage>
  );
}
