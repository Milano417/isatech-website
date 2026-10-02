import { GoogleGenAI } from '@google/genai';
import { db } from './db';

const KNOWLEDGE_BASE_PROMPT = `
Vous êtes "ISATECH AI", l'assistant conversationnel officiel de l'Institut des Sciences Appliquées et de la Technologie (ISATech), établissement d'enseignement supérieur d'excellence basé à Abidjan, Koumassi, Côte d'Ivoire.

RÈGLES FONDAMENTALES & STRICTES :
1. Vous parlez au nom officiel d'ISATech avec courtoisie, clarté, professionnalisme et précision.
2. Signification exacte d'ISATECH : Institut des Sciences Appliquées et de la Technologie.
3. Date de création officielle : 06 septembre 2001 (plus de 20 ans d'existence).
4. Nombre de diplômés formés : plus de 2000+ étudiants et cadres formés avec succès.
5. Devise / Slogan officiel : « L’excellence demeure notre credo ».
6. Couleurs officielles : Bleu marine et Blanc.
7. Localisation : Abidjan, Koumassi, Côte d'Ivoire. Note importante : ISATech est un établissement / une école supérieure d'enseignement professionnel (ne pas utiliser le mot "campus").
8. Les 8 filières officielles d'ISATech sont STRICTEMENT les suivantes :
   - IDA : Informatique — Développement d’Applications (programmation, web, mobile, bases de données, logiciel)
   - FCGE : Finance, Comptabilité et Gestion (comptabilité SYSCOHADA, finance, fiscalité, contrôle de gestion)
   - GEC : Gestion Commerciale (vente, négociation, relation client, marketing digital)
   - CV : Communication Visuelle (design graphique, branding, typographie, illustration, Photoshop/Illustrator)
   - TH : Tourisme et Hôtellerie (accueil de prestige, hébergement, réception, gestion hôtelière)
   - RHCOM : Ressources Humaines et Communication (administration du personnel, recrutement, droit social, communication interne)
   - AD : Assistanat de Direction (gestion administrative de dirigeants, secrétariat bilingue, organisation, agendas)
   - RIT : Réseau Informatique et Télécommunications (routage, commutation, serveurs Linux/Windows, TCP/IP, sécurité réseau, télécoms)
9. ORGANIGRAMME : L'école est structurée de manière rigoureuse depuis le Fondateur, la Direction Générale, la Direction des Études, les Responsables Pédagogiques, le Secrétariat d'Accueil jusqu'au Corps Professoral.
10. CANDIDATURE : Se fait en ligne sur le site via le bouton "Candidater" en 5 étapes. Un numéro officiel de suivi unique au format "ISA-2026-XXXXXX" est attribué à chaque candidat.
11. DONNÉES INCONNUES : Ne JAMAIS inventer de fausses certifications non confirmées.
`;

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    label: string;
    route: string;
  };
  timestamp: string;
}

export async function askIsatechAI(userQuestion: string, history: AIMessage[] = []): Promise<{ text: string; action?: { label: string; route: string } }> {
  const query = userQuestion.toLowerCase().trim();

  // Fast direct knowledge intent matching for instant responsiveness
  if (query.includes('dev') || query.includes('programmation') || query.includes('code') || query.includes('logiciel') || query.includes('site web') || query.includes('ida')) {
    return {
      text: `Pour le développement logiciel, la programmation et la création de sites web ou d'applications mobiles, la filière recommandée est :\n\n💻 **IDA — Informatique : Développement d’Applications**\n\nVous y apprendrez les algorithmes, les langages modernes (Java, Python, PHP, JS), la conception logicielle et les bases de données SQL. Le diplôme délivré est le BTS d'État avec passerelle vers une Licence Pro.`,
      action: {
        label: 'Découvrir la filière IDA',
        route: '/formations/informatique-developpement-applications'
      }
    };
  }

  if (query.includes('réseau') || query.includes('reseau') || query.includes('télécom') || query.includes('telecom') || query.includes('rit') || query.includes('serveur') || query.includes('cyber')) {
    return {
      text: `Pour l'administration des infrastructures réseaux, la sécurité informatique et les télécommunications, la filière idéale est :\n\n🌐 **RIT — Réseau Informatique et Télécommunications**\n\nVous maîtriserez les protocoles TCP/IP, le routage et la commutation Cisco, l'administration de serveurs Linux et Windows Server, ainsi que la sécurisation des architectures réseau.`,
      action: {
        label: 'Découvrir la filière RIT',
        route: '/formations/reseau-informatique-telecommunications'
      }
    };
  }

  if (query.includes('compta') || query.includes('finance') || query.includes('gestion') || query.includes('fcge') || query.includes('bilan') || query.includes('fiscalité')) {
    return {
      text: `Pour les métiers du chiffre, de la comptabilité et du contrôle budgétaire, ISATech propose :\n\n📊 **FCGE — Finance, Comptabilité et Gestion**\n\nVous y étudierez le système comptable SYSCOHADA révisé, l'analyse financière, la fiscalité d'entreprise et les logiciels professionnels comme Sage Saari.`,
      action: {
        label: 'Découvrir la filière FCGE',
        route: '/formations/finance-comptabilite-gestion'
      }
    };
  }

  if (query.includes('vente') || query.includes('commercial') || query.includes('gec') || query.includes('marketing') || query.includes('client')) {
    return {
      text: `Pour développer votre sens de la négociation et devenir un stratège des affaires :\n\n📈 **GEC — Gestion Commerciale**\n\nCe parcours forme des cadres commerciaux experts en prospection multicanale, négociation B2B, marketing opérationnel et fidélisation client.`,
      action: {
        label: 'Découvrir la filière GEC',
        route: '/formations/gestion-commerciale'
      }
    };
  }

  if (query.includes('graphis') || query.includes('design') || query.includes('cv') || query.includes('logo') || query.includes('visuel') || query.includes('photoshop')) {
    return {
      text: `Pour exprimer votre créativité dans la création graphique et publicitaire :\n\n🎨 **CV — Communication Visuelle**\n\nFormation complète aux logiciels de la suite Adobe (Photoshop, Illustrator, InDesign), au branding de marque, à la typographie et à la direction artistique.`,
      action: {
        label: 'Découvrir la filière CV',
        route: '/formations/communication-visuelle'
      }
    };
  }

  if (query.includes('tourisme') || query.includes('hotel') || query.includes('hôtellerie') || query.includes('th') || query.includes('voyage')) {
    return {
      text: `Pour faire carrière dans l'accueil haut de gamme et l'industrie touristique :\n\n🏨 **TH — Tourisme et Hôtellerie**\n\nAcquérez les compétences en réception d'hôtels de standing, logiciels de réservation (PMS), conciergerie et organisation événementielle internationale.`,
      action: {
        label: 'Découvrir la filière TH',
        route: '/formations/tourisme-hotellerie'
      }
    };
  }

  if (query.includes('rh') || query.includes('ressources humaines') || query.includes('rhcom') || query.includes('recrutement')) {
    return {
      text: `Pour accompagner le capital humain et animer la communication d'entreprise :\n\n👥 **RHCOM — Ressources Humaines et Communication**\n\nUn parcours axé sur le droit du travail, l'administration du personnel, la gestion prévisionnelle des compétences et la communication interne.`,
      action: {
        label: 'Découvrir la filière RHCOM',
        route: '/formations/ressources-humaines-communication'
      }
    };
  }

  if (query.includes('direction') || query.includes('secretaire') || query.includes('secrétariat') || query.includes('ad') || query.includes('assistanat')) {
    return {
      text: `Pour devenir le collaborateur stratégique des dirigeants et managers :\n\n💼 **AD — Assistanat de Direction**\n\nApprenez la gestion d'agendas complexes, la rédaction administrative experte, l'organisation logistique de missions et la discrétion professionnelle.`,
      action: {
        label: 'Découvrir la filière AD',
        route: '/formations/assistanat-direction'
      }
    };
  }

  if (query.includes('filière') || query.includes('filiere') || query.includes('formation') || query.includes('catalogue')) {
    return {
      text: `ISATech propose **8 filières officielles** d'excellence menant au BTS d'État et pré-Licence :\n\n1. **IDA** — Informatique : Développement d’Applications\n2. **RIT** — Réseau Informatique & Télécommunications\n3. **FCGE** — Finance, Comptabilité & Gestion\n4. **GEC** — Gestion Commerciale\n5. **CV** — Communication Visuelle\n6. **TH** — Tourisme & Hôtellerie\n7. **RHCOM** — Ressources Humaines & Communication\n8. **AD** — Assistanat de Direction\n\nQuelle filière correspond le mieux à vos aspirations ?`,
      action: {
        label: 'Voir toutes les formations',
        route: '/formations'
      }
    };
  }

  if (query.includes('candidat') || query.includes('inscri') || query.includes('dossier') || query.includes('admission')) {
    return {
      text: `Pour candidater à ISATech pour la session 2026-2027, le processus s'effectue directement en ligne en **5 étapes** :\n\n1. Remplir vos informations d'identité\n2. Indiquer votre parcours scolaire (Baccalauréat)\n3. Sélectionner votre filière parmi les 8 proposées\n4. Téléverser vos justificatifs (CNI, diplôme ou attestation)\n5. Confirmer et recevoir votre numéro de dossier unique format **ISA-2026-XXXXXX**\n\nVous pourrez ensuite suivre l'état d'avancement de votre admission en temps réel.`,
      action: {
        label: 'Déposer ma candidature',
        route: '/candidater'
      }
    };
  }

  if (query.includes('suivi') || query.includes('statut') || query.includes('numero') || query.includes('dossier')) {
    return {
      text: `Vous pouvez consulter l'état de traitement de votre dossier à tout moment sur la page **Suivi de Candidature** à l'aide de votre numéro d'identifiant (ex: ISA-2026-XXXXXX) et de votre email.`,
      action: {
        label: 'Accéder au suivi de dossier',
        route: '/suivi-candidature'
      }
    };
  }

  if (query.includes('ou') || query.includes('où') || query.includes('adresse') || query.includes('localisation') || query.includes('situe') || query.includes('contact')) {
    return {
      text: `📍 **Localisation officielle d'ISATech :**\nAbidjan — Koumassi, Côte d'Ivoire.\n\nFondé le 06 septembre 2001, notre établissement dispose de laboratoires informatiques, de salles de cours équipées et d'un secrétariat académique ouvert du lundi au vendredi.`,
      action: {
        label: 'Nous contacter & plan d\'accès',
        route: '/contact'
      }
    };
  }

  // If Gemini API is available via environment, try querying it
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${KNOWLEDGE_BASE_PROMPT}\n\nQuestion de l'utilisateur : ${userQuestion}` }
            ]
          }
        ]
      });

      if (response && response.text) {
        return { text: response.text };
      }
    } catch {
      // fallback
    }
  }

  // Graceful institutional fallback
  return {
    text: `Bienvenue à **ISATech (Institut des Sciences Appliquées et de la Technologie)**, fondé le 06 septembre 2001 à Abidjan, Koumassi (+2000 étudiants formés).\n\nNotre devise est « *L’excellence demeure notre credo* ».\n\nNous proposons 8 filières professionnalisantes : Informatique (IDA), Réseaux (RIT), Finance & Comptabilité (FCGE), Gestion Commerciale (GEC), Communication Visuelle (CV), Tourisme & Hôtellerie (TH), RH & Communication (RHCOM), et Assistanat de Direction (AD).\n\nSouhaitez-vous explorer une formation spécifique ou déposer une candidature ?`,
    action: {
      label: 'Explorer les formations',
      route: '/formations'
    }
  };
}
