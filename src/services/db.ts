import { 
  Formation, 
  Application, 
  NewsArticle, 
  CampusEvent, 
  ContactMessage, 
  StaffMember, 
  User, 
  StudentCourseGrade, 
  StudentScheduleItem 
} from '../types';

// Curated high quality photos representing African academic environment & modern tech in navy/white
const FORMATION_IMAGES: Record<string, string> = {
  IDA: '/images/IDA.jpg', // Coding / technology
  FCGE: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80', // Finance & analysis
  GEC: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80', // Commercial & presentation
  CV: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80', // Visual communication & design
  TH: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', // Hospitality & hotel
  RHCOM: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', // HR meeting / communication
  AD: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=1200&q=80', // Executive assistant / administration
  RIT: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' // Networks / Telecom servers
};

const INITIAL_FORMATIONS: Formation[] = [
  {
    id: 'f-ida',
    code: 'IDA',
    name: 'Informatique — Développement d’Applications',
    slug: 'informatique-developpement-applications',
    category: 'Informatique & Technologies',
    shortDescription: 'Concevez et développez les solutions logicielles, applications web et mobiles de demain.',
    description: 'La formation IDA prépare les étudiants aux principes de conception, de développement et de maintenance d\'applications informatiques. Elle permet de développer des compétences solides en programmation, algorithmique avancée, bases de données relationnelles, développement web moderne et ingénierie logicielle.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.IDA,
    objectives: [
      'Maîtriser les paradigmes fondamentaux de la programmation orientée objet et fonctionnelle',
      'Concevoir des bases de données relationnelles optimisées (SQL, modélisation Merise)',
      'Développer des applications web et logicielles fiables, sécurisées et évolutives',
      'Appliquer les méthodes agiles et les bonnes pratiques de génie logiciel'
    ],
    skills: [
      'Algorithmique avancée',
      'Programmation (Java, Python, C#)',
      'Développement Web (HTML5, CSS3, JavaScript, PHP)',
      'Bases de données & SQL',
      'Conception logicielle & UML',
      'Développement d\'applications',
      'Maintenance & Debugging',
      'Gestion de projets informatiques'
    ],
    program: [
      {
        semester: 'Semestre 1 — Fondamentaux du Développement',
        modules: [
          'Algorithmique & Structures de données',
          'Langage C / Python pour débutants',
          'Technologies Web : HTML, CSS & ergonomie UI',
          'Architecture matérielle et systèmes d\'exploitation',
          'Mathématiques appliquées à l\'informatique',
          'Anglais technique & Communication professionnelle'
        ]
      },
      {
        semester: 'Semestre 2 — Programmation Orientée Objet & Données',
        modules: [
          'Programmation Orientée Objet (Java)',
          'Modélisation des données (Merise, MCD/MLD)',
          'Bases de données relationnelles & Langage SQL',
          'Développement web dynamique (PHP / MySQL)',
          'Droit informatique & Éthique du numérique',
          'Projet tutoré d\'application web'
        ]
      },
      {
        semester: 'Semestre 3 — Génie Logiciel & Architectures Web',
        modules: [
          'Frameworks Web modernes (Laravel / React basics)',
          'Conception et tests logiciels (UML, JUnit)',
          'Administration de bases de données et sécurité applicative',
          'Développement d\'applications desktop / mobiles',
          'Méthodologies Agiles & Gestion de projet Scrum',
          'Anglais professionnel & Préparation d\'entretiens'
        ]
      },
      {
        semester: 'Semestre 4 — Professionnalisation & Stage en Entreprise',
        modules: [
          'Projet de fin de cycle (Conception et développement complet)',
          'Sécurité applicative et bonnes pratiques OWASP',
          'Déploiement et intégration continue',
          'Stage pratique en entreprise (8 à 12 semaines)',
          'Rédaction et soutenance du rapport de stage devant jury'
        ]
      }
    ],
    opportunities: [
      'Développeur web front-end & back-end',
      'Développeur d\'applications mobiles et desktop',
      'Programmeur analyste junior',
      'Analyste-programmeur',
      'Technicien supérieur informatique',
      'Assistant chef de projet digital'
    ],
    admissionRequirements: [
      'Être titulaire d\'un Baccalauréat scientifique ou technique (Séries C, D, E, F) ou Baccalauréat général équivalent',
      'Étude du dossier scolaire (bulletins de Première et Terminale)',
      'Entretien de motivation et test de logique informatique'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-fcge',
    code: 'FCGE',
    name: 'Finance, Comptabilité et Gestion',
    slug: 'finance-comptabilite-gestion',
    category: 'Finance & Gestion',
    shortDescription: 'Maîtrisez les opérations financières, le contrôle de gestion et la fiscalité d\'entreprise.',
    description: 'La filière FCGE développe les compétences nécessaires à la compréhension et à la gestion globale des opérations comptables, financières, fiscales et administratives d\'une entreprise ou institution publique.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.FCGE,
    objectives: [
      'Tenir la comptabilité générale et analytique selon le système comptable SYSCOHADA révisé',
      'Établir les déclarations fiscales et sociales dans le respect de la législation ivoirienne',
      'Participer à l\'élaboration des budgets et aux travaux de contrôle de gestion',
      'Analyser la santé financière d\'une entreprise par des ratios et tableaux de bord'
    ],
    skills: [
      'Comptabilité générale (SYSCOHADA)',
      'Finance d\'entreprise',
      'Gestion de trésorerie',
      'Fiscalité des entreprises',
      'Analyse financière',
      'Gestion budgétaire',
      'Contrôle de gestion',
      'Tableaux de bord financiers',
      'Logiciels comptables (Sage Saari) & Excel avancé'
    ],
    program: [
      {
        semester: 'Semestre 1 — Fondements Comptables & Cadre Juridique',
        modules: [
          'Comptabilité générale I : Écritures et opérations courantes',
          'Mathématiques financières',
          'Économie générale et organisation des entreprises',
          'Droit civil et commercial ivoirien',
          'Bureautique appliquée (Excel niveau 1)',
          'Communication professionnelle écrite et orale'
        ]
      },
      {
        semester: 'Semestre 2 — Travaux d\'Inventaire & Fiscalité',
        modules: [
          'Comptabilité générale II : Travaux d\'inventaire et clôture',
          'Fiscalité I : TVA, impôts directs et taxes sur salaires',
          'Comptabilité analytique d\'exploitation',
          'Logiciels de gestion comptable (Sage Compta)',
          'Statistiques appliquées à la gestion',
          'Anglais des affaires'
        ]
      },
      {
        semester: 'Semestre 3 — Analyse Financière & Gestion Prévisionnelle',
        modules: [
          'Analyse financière et diagnostic économique',
          'Gestion budgétaire et contrôle de gestion',
          'Fiscalité II : Impôt sur les sociétés et contentieux',
          'Gestion de la trésorerie et relations bancaires',
          'Comptabilité des sociétés et opérations spécifiques',
          'Projet professionnel de gestion'
        ]
      },
      {
        semester: 'Semestre 4 — Clôture et Stage d\'Immersion',
        modules: [
          'Audit comptable et financier élémentaire',
          'Synthèse financière et tableaux de bord décisionnels',
          'Stage obligatoire en cabinet d\'expertise ou entreprise',
          'Rédaction et soutenance du mémoire de BTS'
        ]
      }
    ],
    opportunities: [
      'Assistant comptable en cabinet ou entreprise',
      'Comptable d\'entreprise junior',
      'Assistant financier et trésorerie',
      'Gestionnaire administratif et financier',
      'Contrôleur de gestion junior',
      'Auditeur comptable junior'
    ],
    admissionRequirements: [
      'Baccalauréat séries G2, B, D, C ou équivalent homologué',
      'Examen du dossier scolaire',
      'Entretien d\'orientation professionnelle'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-gec',
    code: 'GEC',
    name: 'Gestion Commerciale',
    slug: 'gestion-commerciale',
    category: 'Commerce & Management',
    shortDescription: 'Développez l’art de la négociation, de la vente stratégique et de la fidélisation client.',
    description: 'La filière GEC forme les futurs cadres commerciaux aux techniques de vente, de prospection, de négociation commerciale complexe, de marketing opérationnel et de pilotage d\'équipes commerciales dans un environnement économique dynamique.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.GEC,
    objectives: [
      'Bâtir et mettre en œuvre une stratégie de prospection et de vente efficace',
      'Négocier des contrats commerciaux avec des clients B2B et B2C',
      'Utiliser les outils du marketing digital et de la relation client (CRM)',
      'Organiser des campagnes de promotion et animer des points de vente'
    ],
    skills: [
      'Techniques de vente',
      'Prospection multicanale',
      'Négociation commerciale',
      'Marketing opérationnel & mix',
      'Gestion de la Relation Client (CRM)',
      'Communication commerciale',
      'Management commercial',
      'Stratégie de distribution',
      'Marketing digital & e-commerce'
    ],
    program: [
      {
        semester: 'Semestre 1 — Techniques de Vente & Économie',
        modules: [
          'Techniques de négociation commerciale',
          'Fondements du marketing',
          'Économie d\'entreprise et droit commercial',
          'Comportement du consommateur',
          'Outils bureautiques et bases de données clients',
          'Techniques d\'expression et aisance orale'
        ]
      },
      {
        semester: 'Semestre 2 — Marketing Opérationnel & Distribution',
        modules: [
          'Prospection et conduite d\'entretiens de vente',
          'Merchandising et gestion de linéaire',
          'Gestion commerciale informatisée (logiciels de vente)',
          'Droit de la consommation et de la concurrence',
          'Statistiques appliquées aux études de marché',
          'Anglais commercial'
        ]
      },
      {
        semester: 'Semestre 3 — Stratégie Commerciale & Digital',
        modules: [
          'Stratégie commerciale et politique tarifaire',
          'Marketing digital et réseaux sociaux professionnels',
          'Management de la force de vente',
          'Commerce international et logistique de distribution',
          'Gestion de portefeuille clients grands comptes',
          'Projet commercial appliqué'
        ]
      },
      {
        semester: 'Semestre 4 — Professionnalisation Commerciale',
        modules: [
          'Audit commercial et performance des ventes',
          'Stage professionnel en entreprise (8 à 10 semaines)',
          'Élaboration du plan d\'action commerciale (PAC)',
          'Soutenance du rapport de stage'
        ]
      }
    ],
    opportunities: [
      'Commercial / Attaché commercial terrain',
      'Assistant commercial et administration des ventes',
      'Chargé de clientèle particuliers / entreprises',
      'Conseiller commercial sédentaire',
      'Assistant chef de produit marketing',
      'Business Developer junior'
    ],
    admissionRequirements: [
      'Baccalauréat toutes séries (A, B, C, D, G1, G2)',
      'Aisance relationnelle et aptitude pour la communication',
      'Dossier scolaire et entretien'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-cv',
    code: 'CV',
    name: 'Communication Visuelle',
    slug: 'communication-visuelle',
    category: 'Communication & Design',
    shortDescription: 'Donnez vie aux identités de marque, interfaces et créations graphiques modernes.',
    description: 'La filière CV développe les compétences artistiques et techniques indispensables à la conception d\'identités de marques percutantes, d\'éditions imprimées, de supports publicitaires et de créations digitales innovantes.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.CV,
    objectives: [
      'Maîtriser les logiciels de référence du design graphique (Photoshop, Illustrator, InDesign)',
      'Concevoir des identités visuelles complètes (logos, chartes graphiques, typographies)',
      'Réaliser des supports imprimés (packaging, affiches, brochures) et numériques (web, social media)',
      'Développer une culture visuelle, sémiologique et esthétique contemporaine'
    ],
    skills: [
      'Design graphique & Ergonomie visuelle',
      'Communication visuelle & Sémiologie',
      'Branding & Stratégie de marque',
      'Identité visuelle & Charte graphique',
      'Typographie & Mise en page éditoriale',
      'Illustration vectorielle',
      'Création publicitaire multisupport',
      'Retouche photo & Traitement numérique',
      'Production numérique et pré-presse'
    ],
    program: [
      {
        semester: 'Semestre 1 — Arts Appliqués & Outils Graphiques',
        modules: [
          'Dessin d\'observation et croquis préparatoire',
          'Théorie des couleurs et sémiologie de l\'image',
          'Initiation PAO : Adobe Illustrator & vectoriel',
          'Histoire de l\'art et du graphisme',
          'Typographie fondamentale',
          'Expression écrite et communication visuelle'
        ]
      },
      {
        semester: 'Semestre 2 — Retouche & Édition',
        modules: [
          'Adobe Photoshop : retouche d\'images & photomontage',
          'Adobe InDesign : mise en page éditoriale et presse',
          'Conception de logotypes et univers de marques',
          'Chaîne graphique et contraintes d\'impression pré-presse',
          'Photographie de studio et éclairage',
          'Anglais appliqué au design'
        ]
      },
      {
        semester: 'Semestre 3 — Design Digital & Campagnes Publicitaires',
        modules: [
          'Design d\'interfaces web et mobiles (UI/UX design basique)',
          'Campagnes de communication 360° et affichage urbain',
          'Design packaging et modélisation de volumes',
          'Motion design d\'initiation (After Effects)',
          'Droit de la propriété intellectuelle et droits d\'auteur',
          'Direction artistique et constitution du portfolio'
        ]
      },
      {
        semester: 'Semestre 4 — Stage & Projet Créatif Majeur',
        modules: [
          'Projet global d\'identité visuelle et soutenance de book',
          'Stage professionnel en agence de communication ou imprimerie',
          'Pitch client et présentation d\'intentions créatives',
          'Soutenance de diplôme devant un jury professionnel'
        ]
      }
    ],
    opportunities: [
      'Graphiste / Designer graphique',
      'Infographiste d\'édition et pré-presse',
      'Créateur de contenu visuel (Content Creator)',
      'Assistant directeur artistique en agence',
      'Designer de communication de marque',
      'Designer packaging et supports imprimés'
    ],
    admissionRequirements: [
      'Baccalauréat toutes séries (A, B, C, D, E, F) ou équivalent',
      'Intérêt prononcé pour les arts graphiques, le dessin et le digital',
      'Présentation facultative d\'un carnet de croquis ou travaux personnels'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-th',
    code: 'TH',
    name: 'Tourisme et Hôtellerie',
    slug: 'tourisme-hotellerie',
    category: 'Tourisme & Hôtellerie',
    shortDescription: 'Excellence de l’accueil, gestion hôtelière haut de gamme et valorisation touristique.',
    description: 'La filière TH prépare les futurs professionnels aux exigences de l\'accueil de prestige, de l\'hébergement, de la gestion opérationnelle d\'établissements hôteliers et de l\'animation d\'activités touristiques nationales et internationales.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.TH,
    objectives: [
      'Gérer avec rigueur les services d\'accueil et de réception hôtelière',
      'Maîtriser les logiciels de réservation (PMS) et de tarification hôtelière',
      'Organiser des événements, séminaires et circuits touristiques',
      'Appliquer les normes internationales de qualité et d\'hygiène'
    ],
    skills: [
      'Accueil et réception de prestige',
      'Gestion hôtelière et hébergement',
      'Économie et géographie touristique',
      'Relation client multiculturelle',
      'Gestion des réservations & logiciels PMS',
      'Techniques de restauration et banqueting',
      'Événementiel hôtelier et séminaires',
      'Communication professionnelle bilingue'
    ],
    program: [
      {
        semester: 'Semestre 1 — Fondamentaux de l\'Hôtellerie',
        modules: [
          'Techniques d\'accueil et posture professionnelle',
          'Géographie touristique de la Côte d\'Ivoire et de l\'Afrique',
          'Gestion des opérations de front office (réception)',
          'Économie générale et sociologie des loisirs',
          'Bureautique appliquée au secteur hôtelier',
          'Anglais hôtelier intensif'
        ]
      },
      {
        semester: 'Semestre 2 — Hébergement & Restauration',
        modules: [
          'Gestion des étages et gouvernance hôtelière',
          'Organisation et gestion de la restauration (Food & Beverage)',
          'Logiciels de réservation hôtelière spécialisés (Opera/Fidelio)',
          'Hygiène, sécurité et normes HACCP',
          'Droit du tourisme et de l\'hôtellerie',
          'Deuxième langue vivante étrangère'
        ]
      },
      {
        semester: 'Semestre 3 — Management & Événementiel',
        modules: [
          'Yield Management et tarification hôtelière',
          'Organisation de conférences, salons et banquets',
          'Conception et commercialisation de produits touristiques',
          'Comptabilité et gestion financière hôtelière',
          'Marketing hôtelier et promotion en ligne',
          'Projet événementiel tutoré'
        ]
      },
      {
        semester: 'Semestre 4 — Stage Professionnel de Fin de Cycle',
        modules: [
          'Management des équipes de service hôtelier',
          'Stage pratique dans un grand complexe hôtelier ou agence de voyage',
          'Rédaction du mémoire de stage professionnel',
          'Soutenance devant les professionnels du secteur'
        ]
      }
    ],
    opportunities: [
      'Réceptionniste en hôtel de standing',
      'Agent de réservation et billetterie',
      'Assistant de direction hôtelière',
      'Agent d\'escale et guide touristique',
      'Chargé d\'accueil et de relations publiques',
      'Assistant coordinateur événementiel'
    ],
    admissionRequirements: [
      'Baccalauréat toutes séries (A, B, C, D, G2 ou équivalent)',
      'Excellente présentation et aisance relationnelle',
      'Maîtrise du français et bonnes notions d\'anglais'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-rhcom',
    code: 'RHCOM',
    name: 'Ressources Humaines et Communication',
    slug: 'ressources-humaines-communication',
    category: 'Ressources Humaines & Communication',
    shortDescription: 'Développez les talents, animez la communication interne et gérez le capital humain.',
    description: 'La filière RHCOM forme les futurs spécialistes de la gestion du capital humain, du recrutement, de l\'administration du personnel, des relations sociales et de la communication interne et externe des organisations.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.RHCOM,
    objectives: [
      'Administrer la gestion quotidienne du personnel et des contrats de travail',
      'Participer aux campagnes de recrutement et à l\'intégration des collaborateurs',
      'Concevoir et animer des plans de communication interne et externe',
      'Appliquer le droit social et la législation du travail en vigueur'
    ],
    skills: [
      'Gestion administrative du personnel',
      'Techniques de recrutement & entretiens',
      'Droit du travail & relations sociales',
      'Communication interne & culture d\'entreprise',
      'Communication institutionnelle & RP',
      'Gestion prévisionnelle des emplois et compétences (GPEC)',
      'Élaboration du plan de formation',
      'Paie et déclarations sociales',
      'Communication digitale d\'entreprise'
    ],
    program: [
      {
        semester: 'Semestre 1 — Cadre Juridique & Bases de la Communication',
        modules: [
          'Droit du travail : contrats, congés et obligations',
          'Psychologie des organisations et relations humaines',
          'Fondements de la communication des entreprises',
          'Gestion administrative et archivage RH',
          'Techniques d\'expression écrite et synthèse',
          'Anglais professionnel appliqué aux RH'
        ]
      },
      {
        semester: 'Semestre 2 — Administration du Personnel & Paie',
        modules: [
          'Gestion de la paie et charges sociales',
          'Techniques d\'entretien et processus de sélection',
          'Communication interne : journal d\'entreprise, intranet, affichage',
          'Logiciels spécialisés RH (Sage Paie & RH)',
          'Statistiques sociales et bilans sociaux',
          'Relations avec les délégués du personnel et syndicats'
        ]
      },
      {
        semester: 'Semestre 3 — Développement RH & Communication de Crise',
        modules: [
          'Gestion Prévisionnelle des Emplois et des Compétences (GPEC)',
          'Plan et ingénierie de la formation continue',
          'Communication externe, relations presse et événements internes',
          'Communication de crise et gestion des conflits',
          'Audit social et amélioration des conditions de travail',
          'Projet d\'étude RH appliqué'
        ]
      },
      {
        semester: 'Semestre 4 — Professionnalisation & Stage Pratique',
        modules: [
          'Stratégie de marque employeur et réseaux sociaux RH',
          'Stage en direction des ressources humaines (8 à 12 semaines)',
          'Élaboration du mémoire de fin de formation',
          'Soutenance officielle devant jury'
        ]
      }
    ],
    opportunities: [
      'Assistant(e) Ressources Humaines',
      'Chargé(e) de recrutement junior',
      'Assistant(e) administratif(ve) du personnel',
      'Chargé(e) de communication interne',
      'Assistant(e) relations presse et communication',
      'Gestionnaire de paie et formation junior'
    ],
    admissionRequirements: [
      'Baccalauréat toutes séries (A, B, C, D, G1, G2 ou équivalent)',
      'Bon niveau d\'expression orale et rédactionnelle',
      'Entretien d\'évaluation des motivations'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-ad',
    code: 'AD',
    name: 'Assistanat de Direction',
    slug: 'assistanat-direction',
    category: 'Administration & Management',
    shortDescription: 'Devenez le collaborateur stratégique et le pilier organisationnel des dirigeants.',
    description: 'La filière AD prépare les étudiants à devenir des collaborateurs de premier plan auprès de cadres dirigeants et directeurs généraux, maîtrisant l\'organisation d\'agendas complexes, la rédaction d\'actes, la gestion documentaire et les réunions de haut niveau.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.AD,
    objectives: [
      'Assurer l\'organisation logistique et le secrétariat de directions générales',
      'Rédiger des correspondances administratives, comptes rendus et procès-verbaux',
      'Gérer les flux d\'informations confidentielles et les agendas de dirigeants',
      'Maîtriser les logiciels bureautiques avancés et les outils collaboratifs'
    ],
    skills: [
      'Gestion administrative de haut niveau',
      'Secrétariat de direction générale',
      'Organisation d\'événements et réunions',
      'Gestion d\'agenda et déplacements',
      'Gestion documentaire et archivage numérique',
      'Communication institutionnelle & discrétion',
      'Accueil protocolaire de délégations',
      'Rédaction administrative experte',
      'Outils bureautiques avancés (Pack Office 365)'
    ],
    program: [
      {
        semester: 'Semestre 1 — Organisation & Outils Bureautiques',
        modules: [
          'Techniques de rédaction administrative et commerciale',
          'Bureautique avancée : Word (mise en page pro) & Excel',
          'Organisation matérielle et gestion du temps',
          'Droit civil, du travail et des affaires',
          'Communication interpersonnelle et protocole d\'accueil',
          'Anglais professionnel pour assistants'
        ]
      },
      {
        semester: 'Semestre 2 — Gestion Documentaire & Réunions',
        modules: [
          'Préparation, tenue et rédaction de PV de réunions',
          'Classement, archivage physique et électronique (GED)',
          'Présentations professionnelles assistées par ordinateur (PowerPoint)',
          'Comptabilité simplifiée et gestion des frais généraux',
          'Sténographie et prise de notes rapide',
          'Deuxième langue étrangère'
        ]
      },
      {
        semester: 'Semestre 3 — Collaboration Stratégique & Relations Publiques',
        modules: [
          'Organisation de missions, voyages et déplacements de délégations',
          'Relations publiques et communication protocolaire',
          'Outils collaboratifs modernes (Teams, Google Workspace, CRM)',
          'Gestion des situations d\'urgence et confidentialité',
          'Dossiers administratifs et gestion de projets transverses',
          'Projet pratique de simulation de direction'
        ]
      },
      {
        semester: 'Semestre 4 — Stage & Examen d\'Assistanat',
        modules: [
          'Déontologie du métier et posture managériale',
          'Stage pratique en entreprise ou institution (8 à 12 semaines)',
          'Rédaction du rapport de stage d\'assistanat',
          'Soutenance orale'
        ]
      }
    ],
    opportunities: [
      'Assistant(e) de direction générale',
      'Secrétaire de direction bilingue',
      'Assistant(e) administratif(ve) et juridique',
      'Office Manager junior',
      'Chargé(e) de secrétariat général',
      'Assistant(e) de gestion de projets'
    ],
    admissionRequirements: [
      'Baccalauréat séries A, B, D, G1 ou équivalent',
      'Excellente maîtrise du français écrit et oral',
      'Sens aigu de l\'organisation et de la rigueur'
    ],
    status: 'PUBLISHED'
  },
  {
    id: 'f-rit',
    code: 'RIT',
    name: 'Réseau Informatique et Télécommunications',
    slug: 'reseau-informatique-telecommunications',
    category: 'Réseaux & Télécommunications',
    shortDescription: 'Déployez, administrez et sécurisez les infrastructures réseaux et télécoms de pointe.',
    description: 'La filière RIT forme les spécialistes de l\'installation, de la configuration, de l\'administration, de la supervision et de la sécurité des infrastructures réseaux d\'entreprises et des systèmes de télécommunication modernes.',
    level: 'BAC+2 (BTS d\'État) / Préparation Licence Pro',
    duration: '2 ans (4 semestres)',
    location: 'Abidjan — Koumassi, Côte d\'Ivoire',
    image: FORMATION_IMAGES.RIT,
    objectives: [
      'Configurer et interconnecter des équipements réseaux (routeurs, commutateurs, pare-feu)',
      'Administrer des systèmes d\'exploitation serveurs (Linux, Windows Server)',
      'Déployer des services réseaux fondamentaux (DNS, DHCP, VPN, Web, Mail)',
      'Sécuriser les architectures réseaux contre les intrusions et vulnérabilités'
    ],
    skills: [
      'Réseaux informatiques & Modèle OSI',
      'Protocoles TCP/IP & Adressage IPv4/IPv6',
      'Routage & Commutation (Cisco / MikroTik)',
      'Administration systèmes Linux & Windows Server',
      'Télécommunications & Fibre optique',
      'Sécurité informatique & Pare-feu',
      'Maintenance des équipements matériels',
      'Virtualisation & Cloud Computing',
      'Supervision réseau (Nagios / Zabbix)'
    ],
    program: [
      {
        semester: 'Semestre 1 — Fondements Réseaux & Systèmes',
        modules: [
          'Architecture des ordinateurs et maintenance préventive',
          'Notions fondamentales de réseaux (Modèles OSI et TCP/IP)',
          'Systèmes d\'exploitation de base : Linux (Ubuntu/Debian) et Windows',
          'Électronique et physique des signaux de télécommunication',
          'Mathématiques pour l\'ingénierie réseau',
          'Anglais technique informatique'
        ]
      },
      {
        semester: 'Semestre 2 — Routage, Commutation & Services',
        modules: [
          'Configuration des commutateurs (VLANs, Trunking, Spanning Tree)',
          'Routage statique et dynamique (RIP, OSPF)',
          'Services réseaux fondamentaux : DHCP, DNS, NAT, SSH',
          'Supports de transmission : câblage RJ45 et fibre optique',
          'Téléphonie sur IP (VoIP) et standards de télécoms mobiles',
          'Ateliers pratiques en laboratoire réseau'
        ]
      },
      {
        semester: 'Semestre 3 — Administration Serveurs & Sécurité',
        modules: [
          'Administration avancée Linux (Apache, Nginx, BIND, iptables)',
          'Windows Server : Active Directory, stratégies de groupe (GPO)',
          'Sécurité périmétrique, VPN et pare-feu (Firewalling)',
          'Virtualisation de serveurs (VMware, VirtualBox, Proxmox)',
          'Supervision réseau et gestion des incidents',
          'Projet d\'architecture réseau d\'entreprise'
        ]
      },
      {
        semester: 'Semestre 4 — Professionnalisation Réseau & Télécoms',
        modules: [
          'Initiation aux technologies sans fil et réseaux 4G/5G',
          'Stage pratique en entreprise de télécoms ou DSI (8 à 12 semaines)',
          'Élaboration du rapport de stage technique',
          'Soutenance devant jury d\'experts'
        ]
      }
    ],
    opportunities: [
      'Administrateur réseau et systèmes junior',
      'Technicien supérieur réseaux & télécoms',
      'Technicien d\'infrastructure et câblage',
      'Technicien support niveau 2 en DSI',
      'Assistant ingénieur cybersécurité',
      'Déployeur de solutions de télécommunication'
    ],
    admissionRequirements: [
      'Baccalauréat séries C, D, E, F2, F3 ou équivalent scientifique/technique',
      'Appétence pour le matériel, les architectures informatiques et la logique',
      'Dossier scolaire et entretien technique'
    ],
    status: 'PUBLISHED'
  }
];

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'n-1',
    title: 'Campagne d\'Admission 2026-2027 : Rejoignez l\'excellence à ISATech Koumassi',
    slug: 'campagne-admission-2026-2027',
    excerpt: 'Les inscriptions et dépôts de dossiers de candidature pour la rentrée académique 2026 sont officiellement ouverts sur notre plateforme.',
    content: `L'Institut des Sciences Appliquées et de la Technologie (ISATech) a le plaisir d'informer les bacheliers, étudiants et professionnels de l'ouverture officielle de la campagne de recrutement pour l'année académique 2026-2027.

Depuis sa création le 06 septembre 2001, ISATech cultive l'excellence pédagogique avec plus de 2000 diplômés formés et une devise immuable : « L’excellence demeure notre credo ».

Les candidats peuvent dès à présent déposer leur candidature en ligne pour les huit filières d'excellence :
- IDA (Informatique — Développement d’Applications)
- FCGE (Finance, Comptabilité et Gestion)
- GEC (Gestion Commerciale)
- CV (Communication Visuelle)
- TH (Tourisme et Hôtellerie)
- RHCOM (Ressources Humaines et Communication)
- AD (Assistanat de Direction)
- RIT (Réseau Informatique et Télécommunications)

Un accompagnement personnalisé est proposé à chaque candidat dès la soumission de son dossier avec l'attribution d'un numéro officiel de suivi.`,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    category: 'Actualités',
    author: 'Direction Pédagogique ISATech',
    authorRole: 'Direction des Admissions',
    publishedAt: '2026-09-15',
    readTime: '4 min',
    status: 'PUBLISHED',
    tags: ['Admission', 'Rentrée 2026', 'Filières', 'BTS']
  },
  {
    id: 'n-2',
    title: 'Immersion professionnelle : Les étudiants d\'IDA et RIT brillent lors des ateliers pratiques',
    slug: 'immersion-professionnelle-ida-rit-ateliers-pratiques',
    excerpt: 'Les travaux pratiques en laboratoire informatique et réseaux permettent aux étudiants d\'acquérir des réflexes opérationnels immédiatement valorisables.',
    content: `À ISATech, la théorie trouve son prolongement naturel dans la mise en pratique immédiate. Nos étudiants des promotions Informatique (IDA) et Réseaux (RIT) ont mené cette semaine des sessions intensives de simulation de projets réels.

Au programme :
- Déploiement d'une architecture réseau sécurisée avec segmentation VLAN et pare-feu
- Conception et prototypage d'une application de gestion pour PME en équipe Scrum
- Tests de vulnérabilités et initiation aux standards de cybersécurité

Cette pédagogie par projet garantit une insertion professionnelle rapide de nos futurs diplômés sur le marché de l'emploi en Côte d'Ivoire et dans la sous-région.`,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    category: 'Technologie',
    author: 'Cellule Informatique & Innovation',
    authorRole: 'Département Tech',
    publishedAt: '2026-09-22',
    readTime: '3 min',
    status: 'PUBLISHED',
    tags: ['Tech', 'Informatique', 'Réseaux', 'Laboratoire']
  },
  {
    id: 'n-3',
    title: 'Journées Portes Ouvertes : Venez découvrir l\'école à Abidjan-Koumassi',
    slug: 'journees-portes-ouvertes-ecole-koumassi',
    excerpt: 'Rencontrez l\'équipe pédagogique, échangez avec les étudiants actuels et visitez les salles spécialisées lors de nos prochaines journées portes ouvertes.',
    content: `Vous hésitez encore sur le choix de votre filière post-bac ? ISATech ouvre les portes de son établissement situé à Abidjan, Koumassi.

Au cours de cet événement :
- Présentation détaillée des 8 parcours de formation
- Visite guidée des salles d'informatique, de communication visuelle et de comptabilité
- Rencontres individuelles avec les enseignants et responsables de filières
- Ateliers d'orientation personnalisée et simulateur de candidature

L'accès est libre et gratuit pour tous les bacheliers et leurs parents.`,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    category: 'Événements',
    author: 'Secrétariat Général ISATech',
    authorRole: 'Relations Extérieures',
    publishedAt: '2026-09-28',
    readTime: '3 min',
    status: 'PUBLISHED',
    tags: ['Portes Ouvertes', 'Orientation', 'Koumassi']
  },
  {
    id: 'n-4',
    title: 'Vie scolaire : Constitution du nouveau Bureau des Étudiants (BDE)',
    slug: 'vie-scolaire-constitution-nouveau-bde',
    excerpt: 'Dynamisme, entraide et cohésion : le nouveau bureau des étudiants prend ses fonctions avec un riche programme culturel, sportif et technologique.',
    content: `La vie à l'école ISATech ne se résume pas aux cours magistraux et aux séances en laboratoire. Le nouveau Bureau des Étudiants vient d'être élu pour porter la voix des étudiants et organiser les activités extrascolaires.

Au calendrier de cette année :
- Tournoi inter-filières de football et basketball
- Hackathon annuel ISATech Code Challenge
- Journée d'intégration et gala de remise des diplômes
- Séances de mentorat entre promotions aînées et nouveaux arrivants`,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    category: 'Vie étudiante',
    author: 'BDE ISATech',
    authorRole: 'Représentation Étudiante',
    publishedAt: '2026-09-30',
    readTime: '2 min',
    status: 'PUBLISHED',
    tags: ['BDE', 'Cohésion', 'Sport']
  }
];

const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'e-1',
    title: 'Grande Journée Portes Ouvertes & Orientation 2026',
    description: 'Venez explorer l\'école ISATech Koumassi, tester nos laboratoires informatiques et rencontrer les responsables de filières.',
    date: '2026-10-15',
    time: '09h00 - 16h30',
    location: 'ISATech — Abidjan, Koumassi',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    category: 'Orientation',
    status: 'A_VENIR',
    capacity: 250,
    registeredCount: 142
  },
  {
    id: 'e-2',
    title: 'Hackathon ISATech Code & Innovation Challenge',
    description: '36 heures d\'immersion pour concevoir des prototypes web et mobiles répondant aux enjeux urbains et économiques ivoiriens.',
    date: '2026-10-24',
    time: '08h30 - 20h00',
    location: 'Lab Informatique ISATech — Salle Multimédia',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    category: 'Technologie',
    status: 'A_VENIR',
    capacity: 60,
    registeredCount: 48
  },
  {
    id: 'e-3',
    title: 'Masterclass : SYSCOHADA Révisé & Clôture Comptable',
    description: 'Séminaire professionnel interactif animé par des experts-comptables agréés pour les étudiants FCGE et les praticiens de la gestion.',
    date: '2026-10-08',
    time: '14h00 - 17h30',
    location: 'Amphithéâtre Central ISATech',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    category: 'Professionnel',
    status: 'A_VENIR',
    capacity: 120,
    registeredCount: 95
  },
  {
    id: 'e-4',
    title: 'Conférence : Sécurité des Réseaux et Enjeux du Cloud en Afrique',
    description: 'Intervention d\'ingénieurs réseaux seniors sur la résilience des infrastructures numériques d\'entreprises.',
    date: '2026-09-18',
    time: '10h00 - 12h30',
    location: 'Salle de Conférence ISATech',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'Conférence',
    status: 'TERMINE',
    capacity: 100,
    registeredCount: 100
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    applicationNumber: 'ISA-2026-004128',
    firstName: 'Kouassi Jean-Eudes',
    lastName: 'Koffi',
    email: 'koffi.jeaneudes@gmail.com',
    phone: '+225 07 08 12 34 56',
    birthDate: '2004-05-14',
    gender: 'M',
    address: 'Koumassi Remblais, Rue 12',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    lastDiploma: 'Baccalauréat Série C',
    graduationYear: '2025',
    previousSchool: 'Lycée Moderne de Koumassi',
    formationCode: 'IDA',
    status: 'EN_COURS',
    statusNotes: 'Dossier académique complet. En attente de passage devant la commission de validation pédagogique.',
    documents: [
      { id: 'd-1', type: 'Pièce d\'identité', name: 'CNI_Koffi_JE.pdf', size: '1.2 Mo', uploadDate: '2026-09-20', status: 'VERIFIE' },
      { id: 'd-2', type: 'Attestation de Bac', name: 'BAC_Attestation_2025.pdf', size: '1.8 Mo', uploadDate: '2026-09-20', status: 'VERIFIE' },
      { id: 'd-3', type: 'Relevé de notes', name: 'Releves_Notes_Terminale.pdf', size: '2.4 Mo', uploadDate: '2026-09-20', status: 'VERIFIE' }
    ],
    submittedAt: '2026-09-20T10:14:00Z',
    updatedAt: '2026-09-22T14:30:00Z'
  },
  {
    id: 'app-2',
    applicationNumber: 'ISA-2026-003892',
    firstName: 'Aminata Marie',
    lastName: 'Bakayoko',
    email: 'aminata.bakayoko@yahoo.fr',
    phone: '+225 05 44 89 10 22',
    birthDate: '2005-02-18',
    gender: 'F',
    address: 'Marcory Résidentiel',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    lastDiploma: 'Baccalauréat Série G2',
    graduationYear: '2025',
    previousSchool: 'Collège Moderne d\'Abidjan',
    formationCode: 'FCGE',
    status: 'ACCEPTEE',
    statusNotes: 'Félicitations ! Votre candidature est acceptée. Veuillez vous présenter au secrétariat d\'ISATech Koumassi pour finaliser votre inscription.',
    documents: [
      { id: 'd-4', type: 'Pièce d\'identité', name: 'CNI_Bakayoko.pdf', size: '1.1 Mo', uploadDate: '2026-09-12', status: 'VERIFIE' },
      { id: 'd-5', type: 'Diplôme de Baccalauréat', name: 'BAC_G2_Certifie.pdf', size: '1.5 Mo', uploadDate: '2026-09-12', status: 'VERIFIE' }
    ],
    submittedAt: '2026-09-12T08:20:00Z',
    updatedAt: '2026-09-16T11:00:00Z'
  },
  {
    id: 'app-3',
    applicationNumber: 'ISA-2026-005201',
    firstName: 'Yao Marc-Aurèle',
    lastName: 'Konan',
    email: 'konan.yao@outlook.com',
    phone: '+225 01 02 88 77 66',
    birthDate: '2003-11-29',
    gender: 'M',
    address: 'Port-Bouët Vridi',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    lastDiploma: 'Baccalauréat Série D',
    graduationYear: '2024',
    previousSchool: 'Lycée Municipal de Port-Bouët',
    formationCode: 'RIT',
    status: 'COMPLEMENT_REQUIS',
    statusNotes: 'Merci de fournir le relevé de notes certifié de l\'examen du Baccalauréat pour finaliser l\'évaluation de votre dossier.',
    documents: [
      { id: 'd-6', type: 'Pièce d\'identité', name: 'Passeport_Konan.pdf', size: '2.1 Mo', uploadDate: '2026-09-25', status: 'VERIFIE' }
    ],
    submittedAt: '2026-09-25T16:45:00Z',
    updatedAt: '2026-09-27T09:15:00Z'
  }
];

// Full Hierarchical Staff for the requested Organigramme (Fondateur -> Secrétaire -> Profs)
const INITIAL_STAFF: StaffMember[] = [
  {
    id: 's-fondateur',
    name: 'M. Le Fondateur d\'ISATech',
    role: 'Fondateur & Président du Conseil',
    department: 'Haute Direction',
    biography: 'Fondateur de l\'Institut des Sciences Appliquées et de la Technologie le 06 septembre 2001. Initiateur de la vision d\'excellence académique et technologique à Abidjan.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'FONDATEUR'
  },
  {
    id: 's-dg',
    name: 'Direction Générale',
    role: 'Directeur Général',
    department: 'Direction Générale',
    biography: 'Supervise le management global de l\'établissement, la politique de développement et la coordination générale des activités académiques.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'DIRECTION',
    reportsTo: 's-fondateur'
  },
  {
    id: 's-de',
    name: 'Direction des Études & Secrétariat Général',
    role: 'Directeur des Études',
    department: 'Direction Académique',
    biography: 'Supervise l\'élaboration des programmes, le respect des normes du Ministère de l\'Enseignement Supérieur, la planification des examens d\'État et le contrôle de l\'assiduité.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'DIRECTION',
    reportsTo: 's-dg'
  },
  {
    id: 's-pedago-tech',
    name: 'Responsable Pédagogique Filières Technologiques',
    role: 'Responsable Pédagogique (IDA & RIT)',
    department: 'Pôle Informatique & Télécoms',
    biography: 'Ingénieur informaticien, coordonne les modules de développement applicatif, de bases de données, d\'administration systèmes et d\'infrastructures réseaux.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'PEDAGOGIE',
    reportsTo: 's-de'
  },
  {
    id: 's-pedago-gest',
    name: 'Responsable Pédagogique Filières Tertiaires',
    role: 'Responsable Pédagogique (FCGE, GEC, RHCOM, TH, AD, CV)',
    department: 'Pôle Tertiaire & Gestion',
    biography: 'Spécialiste en sciences de gestion et finances d\'entreprises, garantit l\'adéquation des cursus avec le système comptable SYSCOHADA et les réalités économiques.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'PEDAGOGIE',
    reportsTo: 's-de'
  },
  {
    id: 's-secretariat',
    name: 'Secrétariat Principal & Accueil',
    role: 'Secrétaire de Direction & Accueil Académique',
    department: 'Secrétariat & Admissions',
    biography: 'Premier point de contact des étudiants et des parents. En charge de la réception des dossiers de candidature, de la délivrance des attestations et de la gestion administrative courante.',
    image: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'SECRETARIAT',
    reportsTo: 's-de'
  },
  {
    id: 's-prof-1',
    name: 'Enseignant Référent Développement & Web',
    role: 'Professeur Titulaire — Programmation & Algorithmique (IDA)',
    department: 'Corps Enseignant',
    biography: 'Formateur certifié, anime les cours de programmation objet, de génie logiciel et de projets web pour les promotions IDA.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'PROFESSEURS',
    reportsTo: 's-pedago-tech'
  },
  {
    id: 's-prof-2',
    name: 'Enseignant Référent Réseaux & Télécoms',
    role: 'Professeur Titulaire — Architectures Réseaux & Systèmes (RIT)',
    department: 'Corps Enseignant',
    biography: 'Expert en routage Cisco et administration Linux, encadre les travaux pratiques en laboratoire réseau et prépare aux certifications professionnelles.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'PROFESSEURS',
    reportsTo: 's-pedago-tech'
  },
  {
    id: 's-prof-3',
    name: 'Enseignant Référent Comptabilité & Finance',
    role: 'Professeur Titulaire — Comptabilité SYSCOHADA (FCGE)',
    department: 'Corps Enseignant',
    biography: 'Praticien de cabinet d\'audit, dispense la comptabilité générale, l\'analyse financière approfondie et la fiscalité d\'entreprise.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    status: 'ACTIF',
    level: 'PROFESSEURS',
    reportsTo: 's-pedago-gest'
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Karamoko Bamba',
    email: 'k.bamba@gmail.com',
    phone: '+225 07 89 45 12 30',
    subject: 'Renseignements sur la filière IDA en cours du soir',
    message: 'Bonjour, je souhaiterais savoir si la filière Informatique et Développement d\'Applications est disponible en horaires décalés ou cours du soir pour les professionnels ? Merci d\'avance.',
    status: 'NOUVEAU',
    createdAt: '2026-09-30T14:15:00Z'
  },
  {
    id: 'msg-2',
    name: 'Awa Toure',
    email: 'toure.awa@yahoo.fr',
    phone: '+225 05 11 22 33 44',
    subject: 'Conditions d\'admission filière Communication Visuelle',
    message: 'Bonjour l\'équipe ISATech, ma fille vient d\'avoir son Bac A et est passionnée de design. Le dossier artistique est-il éliminatoire ? Cordialement.',
    status: 'TRAITE',
    createdAt: '2026-09-28T09:30:00Z',
    replyNote: 'Répondu le 28/09 : le dossier artistique est facultatif et permet d\'orienter le candidat.'
  }
];

// Seed Student Demo for Portal
export const DEMO_STUDENT: User = {
  id: 'usr-stud-1',
  name: 'Kouassi Jean-Eudes Koffi',
  email: 'koffi.jeaneudes@gmail.com',
  role: 'STUDENT',
  matricule: 'ISA-2025-IDA-042',
  formationCode: 'IDA',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
};

export const DEMO_STUDENT_GRADES: StudentCourseGrade[] = [
  { code: 'IDA301', courseName: 'Algorithmique Avancée & Structures de Données', credits: 4, grade: 16.5, coefficient: 3, status: 'VALIDE' },
  { code: 'IDA302', courseName: 'Conception Logicielle & Modélisation UML', credits: 4, grade: 15.0, coefficient: 3, status: 'VALIDE' },
  { code: 'IDA303', courseName: 'Bases de Données Relationnelles & SQL Avancé', credits: 4, grade: 17.0, coefficient: 3, status: 'VALIDE' },
  { code: 'IDA304', courseName: 'Développement Web Fullstack (PHP / JavaScript)', credits: 5, grade: 18.0, coefficient: 4, status: 'VALIDE' },
  { code: 'IDA305', courseName: 'Architecture Système & Réseaux pour Développeurs', credits: 3, grade: 14.0, coefficient: 2, status: 'VALIDE' },
  { code: 'IDA306', courseName: 'Anglais Professionnel & Expression Orale', credits: 2, grade: 15.5, coefficient: 1, status: 'VALIDE' }
];

export const DEMO_STUDENT_SCHEDULE: StudentScheduleItem[] = [
  { id: 'sch-1', day: 'Lundi', time: '08h00 - 11h00', subject: 'Développement Web Fullstack', teacher: 'M. Diallo', room: 'Lab Info 2', type: 'TP' },
  { id: 'sch-2', day: 'Lundi', time: '11h30 - 13h30', subject: 'Architecture Système & Réseaux', teacher: 'M. Traoré', room: 'Amphi B', type: 'CM' },
  { id: 'sch-3', day: 'Mardi', time: '08h30 - 11h30', subject: 'Bases de Données & SQL', teacher: 'Mme Koné', room: 'Salle 104', type: 'TD' },
  { id: 'sch-4', day: 'Mercredi', time: '09h00 - 12h00', subject: 'Conception Logicielle UML', teacher: 'M. Coulibaly', room: 'Amphi A', type: 'CM' },
  { id: 'sch-5', day: 'Jeudi', time: '08h00 - 12h00', subject: 'Atelier de Projet Programmation', teacher: 'M. Diallo', room: 'Lab Info 1', type: 'TP' },
  { id: 'sch-6', day: 'Vendredi', time: '10h00 - 12h00', subject: 'Anglais Technique & Communication', teacher: 'Mme Smith', room: 'Salle 202', type: 'TD' }
];

class DatabaseService {
  private formationsKey = 'isatech_formations_v2';
  private applicationsKey = 'isatech_applications_v2';
  private newsKey = 'isatech_news_v2';
  private eventsKey = 'isatech_events_v2';
  private staffKey = 'isatech_staff_v2';
  private messagesKey = 'isatech_messages_v2';
  private currentUserKey = 'isatech_current_user_v2';

  private listeners: (() => void)[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(this.formationsKey)) {
      localStorage.setItem(this.formationsKey, JSON.stringify(INITIAL_FORMATIONS));
    }
    if (!localStorage.getItem(this.applicationsKey)) {
      localStorage.setItem(this.applicationsKey, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(this.newsKey)) {
      localStorage.setItem(this.newsKey, JSON.stringify(INITIAL_NEWS));
    }
    if (!localStorage.getItem(this.eventsKey)) {
      localStorage.setItem(this.eventsKey, JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(this.staffKey)) {
      localStorage.setItem(this.staffKey, JSON.stringify(INITIAL_STAFF));
    }
    if (!localStorage.getItem(this.messagesKey)) {
      localStorage.setItem(this.messagesKey, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(this.currentUserKey)) {
      const defaultUser: User = {
        id: 'usr-admin',
        name: 'Administrateur Principal',
        email: 'admin@isatech.ci',
        role: 'SUPER_ADMIN'
      };
      localStorage.setItem(this.currentUserKey, JSON.stringify(defaultUser));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Current User / Auth ---
  public getCurrentUser(): User {
    try {
      const data = localStorage.getItem(this.currentUserKey);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      id: 'usr-admin',
      name: 'Administrateur Principal',
      email: 'admin@isatech.ci',
      role: 'SUPER_ADMIN'
    };
  }

  public setCurrentUser(user: User) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.notify();
  }

  // --- Formations ---
  public getFormations(): Formation[] {
    try {
      const raw = localStorage.getItem(this.formationsKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_FORMATIONS;
  }

  public getFormationBySlug(slug: string): Formation | undefined {
    return this.getFormations().find(f => f.slug === slug || f.code.toLowerCase() === slug.toLowerCase());
  }

  public getFormationByCode(code: string): Formation | undefined {
    return this.getFormations().find(f => f.code.toUpperCase() === code.toUpperCase());
  }

  public saveFormation(formation: Formation): void {
    const list = this.getFormations();
    const index = list.findIndex(f => f.id === formation.id);
    if (index >= 0) {
      list[index] = formation;
    } else {
      list.push(formation);
    }
    localStorage.setItem(this.formationsKey, JSON.stringify(list));
    this.notify();
  }

  public deleteFormation(id: string): void {
    const list = this.getFormations().filter(f => f.id !== id);
    localStorage.setItem(this.formationsKey, JSON.stringify(list));
    this.notify();
  }

  // --- Applications ---
  public getApplications(): Application[] {
    try {
      const raw = localStorage.getItem(this.applicationsKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_APPLICATIONS;
  }

  public getApplicationByNumber(appNumber: string): Application | undefined {
    const clean = appNumber.trim().toUpperCase();
    return this.getApplications().find(a => 
      a.applicationNumber.toUpperCase() === clean
    );
  }

  public createApplication(appData: Omit<Application, 'id' | 'applicationNumber' | 'status' | 'submittedAt' | 'updatedAt'>): Application {
    const list = this.getApplications();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const applicationNumber = `ISA-2026-${randomDigits}`;
    const now = new Date().toISOString();

    const newApp: Application = {
      ...appData,
      id: 'app-' + Date.now(),
      applicationNumber,
      status: 'RECUE',
      statusNotes: 'Votre candidature a été reçue avec succès par le secrétariat d\'ISATech.',
      submittedAt: now,
      updatedAt: now
    };

    list.unshift(newApp);
    localStorage.setItem(this.applicationsKey, JSON.stringify(list));
    this.notify();
    return newApp;
  }

  public updateApplicationStatus(id: string, status: Application['status'], notes?: string): void {
    const list = this.getApplications();
    const target = list.find(a => a.id === id);
    if (target) {
      target.status = status;
      if (notes !== undefined) {
        target.statusNotes = notes;
      }
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(this.applicationsKey, JSON.stringify(list));
      this.notify();
    }
  }

  public deleteApplication(id: string): void {
    const list = this.getApplications().filter(a => a.id !== id);
    localStorage.setItem(this.applicationsKey, JSON.stringify(list));
    this.notify();
  }

  // --- News ---
  public getNews(): NewsArticle[] {
    try {
      const raw = localStorage.getItem(this.newsKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_NEWS;
  }

  public getNewsBySlug(slug: string): NewsArticle | undefined {
    return this.getNews().find(n => n.slug === slug);
  }

  public saveNews(article: NewsArticle): void {
    const list = this.getNews();
    const index = list.findIndex(n => n.id === article.id);
    if (index >= 0) {
      list[index] = article;
    } else {
      list.unshift(article);
    }
    localStorage.setItem(this.newsKey, JSON.stringify(list));
    this.notify();
  }

  public deleteNews(id: string): void {
    const list = this.getNews().filter(n => n.id !== id);
    localStorage.setItem(this.newsKey, JSON.stringify(list));
    this.notify();
  }

  // --- Events ---
  public getEvents(): CampusEvent[] {
    try {
      const raw = localStorage.getItem(this.eventsKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  }

  public saveEvent(event: CampusEvent): void {
    const list = this.getEvents();
    const index = list.findIndex(e => e.id === event.id);
    if (index >= 0) {
      list[index] = event;
    } else {
      list.unshift(event);
    }
    localStorage.setItem(this.eventsKey, JSON.stringify(list));
    this.notify();
  }

  public deleteEvent(id: string): void {
    const list = this.getEvents().filter(e => e.id !== id);
    localStorage.setItem(this.eventsKey, JSON.stringify(list));
    this.notify();
  }

  // --- Messages ---
  public getMessages(): ContactMessage[] {
    try {
      const raw = localStorage.getItem(this.messagesKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  }

  public createMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): ContactMessage {
    const list = this.getMessages();
    const newMsg: ContactMessage = {
      ...data,
      id: 'msg-' + Date.now(),
      status: 'NOUVEAU',
      createdAt: new Date().toISOString()
    };
    list.unshift(newMsg);
    localStorage.setItem(this.messagesKey, JSON.stringify(list));
    this.notify();
    return newMsg;
  }

  public updateMessageStatus(id: string, status: ContactMessage['status'], replyNote?: string): void {
    const list = this.getMessages();
    const msg = list.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      if (replyNote) msg.replyNote = replyNote;
      localStorage.setItem(this.messagesKey, JSON.stringify(list));
      this.notify();
    }
  }

  // --- Staff & Organigramme ---
  public getStaff(): StaffMember[] {
    try {
      const raw = localStorage.getItem(this.staffKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return INITIAL_STAFF;
  }

  public saveStaff(member: StaffMember): void {
    const list = this.getStaff();
    const index = list.findIndex(s => s.id === member.id);
    if (index >= 0) {
      list[index] = member;
    } else {
      list.push(member);
    }
    localStorage.setItem(this.staffKey, JSON.stringify(list));
    this.notify();
  }

  // --- Statistics for Admin ---
  public getStats() {
    const apps = this.getApplications();
    const formations = this.getFormations();
    const news = this.getNews();
    const events = this.getEvents();
    const messages = this.getMessages();

    return {
      totalApplications: apps.length,
      receivedApplications: apps.filter(a => a.status === 'RECUE').length,
      inReviewApplications: apps.filter(a => a.status === 'EN_COURS').length,
      acceptedApplications: apps.filter(a => a.status === 'ACCEPTEE').length,
      totalFormations: formations.length,
      totalNews: news.length,
      upcomingEvents: events.filter(e => e.status === 'A_VENIR').length,
      unreadMessages: messages.filter(m => m.status === 'NOUVEAU').length,
      formedStudents: '2000+'
    };
  }
}

export const db = new DatabaseService();
