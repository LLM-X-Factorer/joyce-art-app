const imageUrl = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=900`;

const greekWorks = [
  {
    title: "Parthenon",
    date: "447-432 BCE",
    image: imageUrl("The Parthenon in Athens.jpg"),
    theme: "Temple, city, proportion",
    lookFor: [
      "Doric columns supporting a massive entablature without decorative scrolls.",
      "A measured balance between heavy stone and optical refinement.",
      "The temple as a public image of Athens, not just a religious container."
    ],
    whyItMatters:
      "It teaches you that Greek architecture is political and visual at the same time: proportion becomes a language of civic authority.",
    note:
      "Athenian power becomes architecture. The Parthenon is not only a temple to Athena; it is a civic argument in marble, using proportion, procession, sculpture, and optical refinement to turn the city into an image of order."
  },
  {
    title: "Kouros Figure",
    date: "c. 590-580 BCE",
    image: imageUrl("Kouros NAMA 3851 Athens Greece.jpg"),
    imagePosition: "center 18%",
    theme: "Ideal body, frontality",
    lookFor: [
      "A rigid frontal pose with one foot stepping forward.",
      "A body organized by symmetry, youth, and ideal proportion.",
      "The archaic smile and stylized anatomy rather than full naturalism."
    ],
    whyItMatters:
      "It shows the early Greek attempt to turn the human body into an ideal public form before classical naturalism fully develops.",
    note:
      "The archaic kouros gives the human body a public grammar: upright, frontal, balanced, and idealized. It is not yet naturalistic in the later classical sense, but it makes the body a carrier of youth, status, memory, and sacred presence."
  },
  {
    title: "Aphrodite of Knidos",
    date: "Roman copy after Praxiteles, c. 350 BCE",
    image: imageUrl("1981.11 - Statue of the Aphrodite of Knidos.jpg"),
    imagePosition: "center 16%",
    theme: "Female nude, divinity, desire",
    lookFor: [
      "A nude goddess shown with human vulnerability rather than remote sacred distance.",
      "The hand gesture that both conceals and draws attention to the body.",
      "The shift from male athletic nudity toward the female nude as a major subject of classical sculpture."
    ],
    whyItMatters:
      "This is one of the decisive moments in the history of the nude. The goddess Aphrodite becomes a body to be viewed, desired, protected, and interpreted, which shapes later Western images of Venus for centuries.",
    note:
      "The Aphrodite of Knidos, associated with Praxiteles, is famous as a breakthrough in the monumental female nude. Unlike the kouros or athlete, this body is not about civic youth or athletic control; it joins divinity, beauty, modesty, and erotic looking. It is a crucial bridge between Greek ideals of the body and the long later tradition of Venus images."
  },
  {
    title: "Black-Figure Amphora",
    date: "6th century BCE",
    image: imageUrl("Greek Amphora Storage Jar with Herakles Carrying the Erymanthian Boar, Athens, c. 510 BC (10455496763).jpg"),
    theme: "Myth as portable image",
    lookFor: [
      "Black figures organized clearly against the clay ground.",
      "Mythic action compressed onto a curved everyday object.",
      "The vase as both usable object and storytelling surface."
    ],
    whyItMatters:
      "It reminds you that Greek art was not only temples and statues. Images also moved through lived objects, trade, ritual, and domestic life.",
    note:
      "Painted pottery carried stories through daily life, ritual, trade, and burial. Before museums made art feel separate from use, Greek images lived on objects that could be handled, filled, exchanged, and remembered."
  }
];

const collectionWorks = [
  {
    id: "parthenon-collection",
    category: "Architecture",
    title: "Parthenon",
    date: "447-432 BCE",
    culture: "Classical Athens",
    image: imageUrl("The Parthenon in Athens.jpg"),
    context:
      "Built on the Acropolis after the Persian sack of Athens, the Parthenon is both a temple to Athena and a public statement about Athenian power. It turns civic wealth, religious devotion, military memory, and democratic self-image into architecture.",
    visual: [
      "The Doric colonnade gives the building a severe rhythm: repeated columns, heavy entablature, and a calm rectangular body.",
      "Its optical refinements slightly curve and adjust the architecture so the temple appears more perfect to the human eye.",
      "Sculpture and procession mattered as much as structure; the building taught viewers how Athens wanted to be seen.",
      "The temple is not just a shell for worship. It is a total visual system: proportion, myth, ritual, and civic pride."
    ],
    implications:
      "The Parthenon shows that architecture can create political memory. Marble becomes a language for authority, order, victory, and cultural inheritance.",
    questions: [
      "When does a sacred building become a political monument?",
      "How does proportion make power feel natural?",
      "What changes when we view the Parthenon as a damaged historical survivor rather than a timeless ideal?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/the-parthenon-athens/"
  },
  {
    id: "pantheon",
    category: "Architecture",
    title: "Pantheon",
    date: "c. 125 CE",
    culture: "Imperial Rome",
    image: imageUrl("Pantheon (Rome) - Dome interior.jpg"),
    context:
      "The Pantheon joins temple, imperial space, engineering experiment, and later Christian church. Its survival depends partly on reuse: the building kept living because its meaning could change.",
    visual: [
      "The exterior portico looks like a traditional temple front, but the interior opens into a vast circular rotunda.",
      "The coffered concrete dome lightens mass while turning structure into ornament.",
      "The oculus is the only major direct light source, so sunlight moves through the building like a visible cosmic instrument.",
      "The geometry of circle, square, dome, and floor makes the visitor feel placed inside an ordered universe."
    ],
    implications:
      "Roman architecture does not only imitate Greek forms; it transforms space through concrete, scale, and interior experience. The Pantheon makes power feel cosmic.",
    questions: [
      "Why does the interior matter more than the facade here?",
      "How does moving light change the meaning of architecture?",
      "What does reuse do to a monument's identity?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/the-pantheon/"
  },
  {
    id: "hagia-sophia",
    category: "Architecture",
    title: "Hagia Sophia",
    date: "532-537 CE",
    culture: "Byzantine Constantinople",
    image: imageUrl("Interior of Hagia sophia.JPG"),
    context:
      "Built under Emperor Justinian in Constantinople, Hagia Sophia was designed as a Christian imperial church at the center of Byzantine power. Its later lives as mosque, museum, and mosque again show how architecture can carry layered religious and political histories.",
    visual: [
      "The huge central dome appears to float because windows around its base dissolve the weight of the structure.",
      "Pendentives solve the technical problem of placing a round dome over a square bay.",
      "Marble revetment, mosaics, and light make the interior feel less like stone mass and more like atmosphere.",
      "The building uses scale and radiance to make empire feel divinely ordered."
    ],
    implications:
      "Hagia Sophia changes architecture from a stable classical body into an immersive spiritual environment. It is engineering used for wonder.",
    questions: [
      "How can architecture make weight seem weightless?",
      "What happens when one building serves different religions across time?",
      "Is light here decoration, theology, or political theater?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/hagia-sophia-istanbul/"
  },
  {
    id: "chartres",
    category: "Architecture",
    title: "Chartres Cathedral",
    date: "main campaign after 1194",
    culture: "French Gothic",
    image: imageUrl("Westfassade Chartres.jpg"),
    context:
      "Chartres was rebuilt after a major fire and became one of the clearest statements of Gothic ambition. Pilgrimage, Marian devotion, urban pride, stained glass, and guild labor all meet in the cathedral.",
    visual: [
      "Pointed arches, rib vaults, and flying buttresses move weight outward so walls can open for glass.",
      "The west facade combines portal sculpture with towers, making theology legible before one enters.",
      "Stained glass transforms daylight into colored narrative and sacred atmosphere.",
      "The building is a system: structure, sculpture, glass, procession, and sound all work together."
    ],
    implications:
      "Chartres shows Gothic architecture as a technology of height, light, and collective belief. It makes the city itself participate in sacred spectacle.",
    questions: [
      "Why did medieval builders want walls to disappear into glass?",
      "How does a cathedral teach people who cannot read texts?",
      "What is the relationship between engineering and devotion?"
    ],
    source: "Chartres Cathedral",
    sourceUrl: "https://www.cathedrale-chartres.org/en/cathedrale/monument/larchitecture/"
  },
  {
    id: "kouros-collection",
    category: "Sculpture",
    title: "Kouros Figure",
    date: "c. 590-580 BCE",
    culture: "Archaic Greece",
    image: imageUrl("Kouros NAMA 3851 Athens Greece.jpg"),
    imagePosition: "center 18%",
    context:
      "The kouros belongs to an early Greek sculptural culture that used the standing male body for grave markers, dedications, and ideals of youth. It is not portraiture in the modern sense; it is a public grammar of the body.",
    visual: [
      "The figure is frontal, symmetrical, and rigid, with one foot forward but little sense of natural walking.",
      "Anatomy is patterned and stylized: hair, knees, torso, and smile behave like signs of life rather than observed flesh.",
      "The body is nude, youthful, and idealized, connecting beauty with status and sacred/public memory.",
      "The sculpture still carries traces of Egyptian frontality while pushing toward a distinct Greek interest in the free-standing body."
    ],
    implications:
      "The kouros helps explain why the human body becomes central in Greek art: not only as anatomy, but as social ideal, offering, memory, and measure.",
    questions: [
      "What does an ideal body communicate before it becomes realistic?",
      "Why might a culture choose nudity for public honor?",
      "How is stillness different from lifelessness?"
    ],
    source: "Met Museum Heilbrunn",
    sourceUrl: "https://www.metmuseum.org/essays/greek-art-in-the-archaic-period"
  },
  {
    id: "aphrodite-knidos-collection",
    category: "Sculpture",
    title: "Aphrodite of Knidos",
    date: "Roman copy after Praxiteles, c. 350 BCE",
    culture: "Late Classical Greece",
    image: imageUrl("1981.11 - Statue of the Aphrodite of Knidos.jpg"),
    imagePosition: "center 16%",
    context:
      "Praxiteles' Aphrodite became famous as a decisive image of the monumental female nude. Unlike male athletic nudity, this goddess stages beauty, vulnerability, modesty, and desire inside a single viewing encounter.",
    visual: [
      "The body turns gently, creating softness rather than kouros-like frontality.",
      "The covering gesture both hides and focuses attention, making the viewer conscious of looking.",
      "The goddess is divine, but the pose makes her seem caught in a human moment.",
      "The sculpture helped set the long Western tradition of Venus images: ideal beauty mixed with erotic spectatorship."
    ],
    implications:
      "The work matters because it changes what can be shown. It makes the female nude a prestigious subject while also raising the problem of desire, power, and the viewer's gaze.",
    questions: [
      "Is the modest gesture protective, theatrical, or erotic?",
      "What changes when divinity is shown as vulnerable?",
      "How does this sculpture shape later images of Venus?"
    ],
    source: "Met Museum Heilbrunn",
    sourceUrl: "https://www.metmuseum.org/essays/art-of-the-hellenistic-age-and-the-hellenistic-tradition"
  },
  {
    id: "laocoon",
    category: "Sculpture",
    title: "Laocoon and His Sons",
    date: "c. 40-20 BCE",
    culture: "Hellenistic / Roman collection",
    image: imageUrl("Laocoön and his sons group.jpg"),
    context:
      "Laocoon, the Trojan priest who warned against the wooden horse, is destroyed with his sons by sea serpents. Rediscovered in Rome in 1506, the group became a touchstone for Renaissance artists fascinated by anatomy, agony, and expressive motion.",
    visual: [
      "The bodies twist in a knot of muscle, serpents, panic, and resistance.",
      "Laocoon's central torso is heroic in scale, but heroism is trapped inside suffering.",
      "The composition stretches one instant of pain into a theatrical arrangement of diagonals.",
      "Unlike calm Classical idealism, this sculpture makes emotion, bodily strain, and pathos the main event."
    ],
    implications:
      "Laocoon shows the Hellenistic taste for drama and psychological extremity. It also shows how rediscovery can remake art history: ancient sculpture became fuel for Renaissance ambition.",
    questions: [
      "Why is suffering so visually compelling here?",
      "Does the group ask for pity, admiration, or horror?",
      "How did ancient art become modern again through Renaissance rediscovery?"
    ],
    source: "Vatican Museums",
    sourceUrl: "https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/museo-pio-clementino/Cortile-Ottagono/laocoonte.html"
  },
  {
    id: "michelangelo-david",
    category: "Sculpture",
    title: "Michelangelo, David",
    date: "1501-1504",
    culture: "Florentine Renaissance",
    image: imageUrl("Michelangelo's David 1.jpg"),
    imagePosition: "center 12%",
    context:
      "David was carved for Florence and quickly became a political symbol of the republic. The biblical underdog becomes a civic body: beautiful, alert, threatened, and ready.",
    visual: [
      "Michelangelo shows the moment before action, not the victory after Goliath's defeat.",
      "Contrapposto makes the figure relaxed and tense at once: weight rests, but the gaze is alert.",
      "The enlarged head and hands help the statue read from below and intensify thought and action.",
      "The nude body competes with ancient sculpture while giving the biblical hero a Renaissance humanist dignity."
    ],
    implications:
      "David turns sculpture into political psychology. The body is not only ideal form; it is the image of a city imagining its courage.",
    questions: [
      "Why show David before the fight instead of after?",
      "How can a nude biblical hero become a political symbol?",
      "What does the statue say about Renaissance competition with antiquity?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/michelangelo-david/"
  },
  {
    id: "birth-of-venus-collection",
    category: "Painting",
    title: "Botticelli, The Birth of Venus",
    date: "c. 1485",
    culture: "Florentine Renaissance",
    image: imageUrl("Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg"),
    context:
      "The painting belongs to elite Florentine humanist culture, where classical myth could become a learned, poetic, and socially refined subject. It makes pagan beauty newly available inside Renaissance visual culture.",
    visual: [
      "Venus stands on a shell in the Venus pudica pose, covering herself while becoming the center of looking.",
      "Botticelli privileges contour, rhythm, hair, flowers, and drapery more than convincing spatial depth.",
      "The shallow stage and linear bodies make the scene feel poetic rather than naturalistic.",
      "The painting turns the nude into an idea of beauty: vulnerable, ideal, decorative, and intellectually framed."
    ],
    implications:
      "This work is crucial for understanding Renaissance humanism: antiquity is not copied passively, but transformed into courtly poetry, desire, and philosophical beauty.",
    questions: [
      "How does mythology make the nude socially acceptable?",
      "Is Venus a body, an idea, or both?",
      "Why does Botticelli choose line over realism?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/sandro-botticelli-the-birth-of-venus/"
  },
  {
    id: "las-meninas-collection",
    category: "Painting",
    title: "Velazquez, Las Meninas",
    date: "1656",
    culture: "Spanish Baroque",
    image: imageUrl("Las Meninas 01.jpg"),
    context:
      "Las Meninas is a court painting that refuses to behave like a simple royal portrait. It places the painter, princess, attendants, royal reflection, and viewer inside one unstable system of looking.",
    visual: [
      "The Infanta is brightly lit at the center, but the true subject may be the act of painting itself.",
      "The mirror reflects the king and queen, implying that they stand where the viewer stands.",
      "Velazquez includes himself before a large canvas, elevating the painter's role within court power.",
      "Open doors, mirrors, gazes, and brushwork make space feel intellectual as well as physical."
    ],
    implications:
      "The painting asks who controls representation. It is about monarchy, artistic status, spectatorship, and the strange power of images to include the viewer.",
    questions: [
      "Who is the painting really for?",
      "Where exactly are we standing as viewers?",
      "How does Velazquez make painting seem like thought?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/diego-velazquez-las-meninas/"
  },
  {
    id: "olympia-collection",
    category: "Painting",
    title: "Manet, Olympia",
    date: "1863",
    culture: "Modern Paris",
    image: imageUrl("Manet, Édouard - Olympia.jpg"),
    context:
      "Olympia replaces the mythological nude with a modern woman associated with Parisian prostitution. Manet forces academic tradition, modern sex work, race, money, and spectatorship into the same room.",
    visual: [
      "The nude body is flat, pale, sharply lit, and deliberately resistant to academic idealization.",
      "Olympia's gaze is direct; she does not disappear into fantasy for the viewer's comfort.",
      "The Black servant, flowers, slippers, bracelet, and cat make the scene socially specific rather than timeless.",
      "The painting declares its surface through blunt contours and shallow space."
    ],
    implications:
      "Olympia matters because it makes modernity visible as discomfort. It exposes the social contract behind the nude: who looks, who pays, who is named, and who is made invisible.",
    questions: [
      "Why was this nude more scandalous than mythological nudes?",
      "What work does Olympia's gaze do?",
      "How does Manet connect flatness with social honesty?"
    ],
    source: "Musee d'Orsay",
    sourceUrl: "https://www.musee-orsay.fr/en/artworks/olympia-712"
  },
  {
    id: "starry-night-collection",
    category: "Painting",
    title: "Van Gogh, The Starry Night",
    date: "1889",
    culture: "Post-Impressionism",
    image: imageUrl("Van Gogh - Starry Night - Google Art Project.jpg"),
    context:
      "Painted while Van Gogh was at Saint-Remy, The Starry Night transforms landscape into emotional and spiritual pressure. It moves beyond Impressionist perception toward expressive vision.",
    visual: [
      "The sky churns with thick, directional brushstrokes that make night feel alive and unstable.",
      "The cypress rises like a dark flame, connecting earth, village, and sky.",
      "The village is calmer and more geometric, a human counterpoint to cosmic movement.",
      "Color and line do not merely describe the view; they generate feeling."
    ],
    implications:
      "The painting teaches a modern lesson: accuracy is not the same as truth. Van Gogh makes inner intensity visible through external landscape.",
    questions: [
      "What does the painting gain by exaggerating nature?",
      "Is the night comforting, terrifying, or sacred?",
      "How does brushwork become emotion?"
    ],
    source: "MoMA",
    sourceUrl: "https://www.moma.org/collection/works/79802"
  }
];

collectionWorks.push(
  {
    id: "black-figure-amphora-collection",
    category: "Painting",
    title: "Athenian Black-Figure Amphora",
    date: "6th century BCE",
    culture: "Archaic Greece",
    image: imageUrl("Greek Amphora Storage Jar with Herakles Carrying the Erymanthian Boar, Athens, c. 510 BC (10455496763).jpg"),
    context:
      "Greek painting did not only live on walls and panels. Much of what survives is vase painting: portable, usable, traded objects that carried myth into dining, ritual, storage, burial, and domestic life.",
    visual: [
      "Dark silhouettes sit against the warm clay ground, making bodies legible through contour.",
      "Incised details cut into the black slip add anatomy, pattern, textile, and weapon detail.",
      "The curved vessel forces the image to become rhythmic; narrative wraps around an object held in the hand.",
      "Myth is compressed into a few essential poses so the story can be recognized quickly."
    ],
    implications:
      "The amphora breaks the museum habit of separating art from use. Greek image-making was social, portable, and lived with.",
    questions: [
      "How does a usable object change the meaning of an image?",
      "What gets simplified when myth has to fit a curved surface?",
      "Why does vase painting survive when so much ancient panel painting does not?"
    ],
    source: "Met Museum Heilbrunn",
    sourceUrl: "https://www.metmuseum.org/essays/greek-art-in-the-archaic-period"
  },
  {
    id: "fayum-portrait",
    category: "Painting",
    title: "Fayum Mummy Portrait",
    date: "c. 100-150 CE",
    culture: "Roman Egypt",
    image: imageUrl("Portrait of the Boy Eutyches - Metmuseum 18.9.2.jpg"),
    context:
      "Fayum mummy portraits come from Roman Egypt, where Greek, Roman, and Egyptian traditions overlapped. Naturalistic painted faces were attached to mummified bodies, joining Roman-style portraiture to Egyptian funerary practice.",
    visual: [
      "The frontal gaze makes the dead feel vividly present rather than remote.",
      "Soft modeling, large eyes, and encaustic surface create a charged intimacy.",
      "The head is individualized, but the object still belongs to ritual and burial.",
      "The portrait sits between life likeness and afterlife image."
    ],
    implications:
      "This work complicates neat period labels. Roman, Egyptian, Greek, painting, portrait, and funerary object all occupy the same surface.",
    questions: [
      "Is this a portrait, a memorial, or a ritual object?",
      "How does the direct gaze change our relation to the dead?",
      "What does cultural mixture look like in visual form?"
    ],
    source: "Met Museum",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/547951"
  },
  {
    id: "junius-bassus",
    category: "Sculpture",
    title: "Sarcophagus of Junius Bassus",
    date: "359 CE",
    culture: "Early Christian Rome",
    image: imageUrl("Tesoro di san pietro, sarcofago di giunio basso.JPG"),
    context:
      "Made for an elite Roman convert shortly after Christianity became legally accepted, this sarcophagus shows Christian stories using inherited classical forms. It is a monument to religious change without a clean break from Rome.",
    visual: [
      "Biblical scenes are organized into architectural compartments, like a carved theological archive.",
      "Christ appears with imperial authority, borrowing Roman visual language for Christian meaning.",
      "Drapery, bodies, and calm ordering preserve classical dignity inside a new religious program.",
      "The surface reads as both narrative and status: faith and elite identity are carved together."
    ],
    implications:
      "The sarcophagus shows Christianity absorbing and redirecting classical culture rather than simply replacing it.",
    questions: [
      "What happens when a new religion uses the visual grammar of an older empire?",
      "Why would an elite convert want classical style on a Christian tomb?",
      "How does relief sculpture organize belief?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/sarcophagus-of-junius-bassus/"
  },
  {
    id: "wilton-diptych",
    category: "Painting",
    title: "The Wilton Diptych",
    date: "c. 1395-1399",
    culture: "International Gothic England",
    image: imageUrl("Wilton diptych.jpg"),
    context:
      "This small hinged devotional painting was made for Richard II. It turns royal identity, private prayer, precious materials, and courtly Gothic refinement into an intimate object.",
    visual: [
      "Gold ground and ultramarine blue make the object feel jewel-like rather than earthly.",
      "The hinged diptych format makes the painting portable and protective, like a private shrine.",
      "Richard II is shown kneeling before sacred figures, making kingship dependent on divine favor.",
      "Pattern, delicacy, and preciousness matter more than naturalistic depth."
    ],
    implications:
      "The Wilton Diptych shows medieval painting as political devotion: power appears humble, but that humility is itself carefully staged.",
    questions: [
      "How can a private prayer object also be royal propaganda?",
      "Why does material preciousness matter spiritually?",
      "What does Gothic painting gain by not pursuing Renaissance naturalism?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/the-wilton-diptych/"
  },
  {
    id: "chartres-portal",
    category: "Sculpture",
    title: "Chartres Portal Sculpture",
    date: "12th-13th century",
    culture: "French Gothic",
    image: imageUrl("Chartres - south portal - central bay -.jpg"),
    context:
      "The portals of Chartres turn the cathedral threshold into carved theology. Before entering, viewers encounter saints, prophets, biblical history, labor, time, judgment, and salvation in stone.",
    visual: [
      "Figures stretch with the architecture, attached to columns and portals like a sacred procession.",
      "Drapery, gesture, and facial expression vary across workshops, giving theology a human register.",
      "The sculpture works with the building rather than standing apart from it.",
      "Narrative is arranged around the act of entry: the viewer physically passes through doctrine."
    ],
    implications:
      "Gothic sculpture makes architecture readable. It teaches with bodies, thresholds, and repeated viewing rather than with text alone.",
    questions: [
      "How does sculpture change when it is built into architecture?",
      "What does it mean to walk through an image program?",
      "How did medieval art teach through repetition and location?"
    ],
    source: "Chartres CSM",
    sourceUrl: "https://www.chartres-csm.org/en/the-cathedral/the-sculptures-on-the-transept-portals/the-north-portal/"
  },
  {
    id: "bramante-tempietto",
    category: "Architecture",
    title: "Bramante, Tempietto",
    date: "c. 1502",
    culture: "High Renaissance Rome",
    image: imageUrl("01 Bramante Tempietto Exterior.jpg"),
    context:
      "The Tempietto marks the supposed site of Saint Peter's crucifixion while reviving the language of antique centralized architecture. It is small, but it became a manifesto for Renaissance order.",
    visual: [
      "The circular plan, dome, steps, and Doric colonnade create a self-contained classical ideal.",
      "Its scale is intimate, but its proportions make it feel complete and authoritative.",
      "The building looks backward to antiquity and forward to High Renaissance central-plan ambitions.",
      "Architecture becomes argument: perfect form can frame sacred memory."
    ],
    implications:
      "The Tempietto shows Renaissance classicism as disciplined invention, not mere copying. Antiquity becomes a tool for Christian monumentality.",
    questions: [
      "Why does a martyrdom site get a classical circular temple form?",
      "How can a tiny building become historically enormous?",
      "What does symmetry promise to the viewer?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/donato-bramante-tempietto-rome/"
  },
  {
    id: "ecstasy-teresa",
    category: "Sculpture",
    title: "Bernini, Ecstasy of Saint Teresa",
    date: "1647-1652",
    culture: "Roman Baroque",
    image: imageUrl("Ecstasy of St. Theresa.jpg"),
    context:
      "Bernini's chapel sculpture stages Teresa of Avila's mystical vision as a theatrical event. Sculpture, architecture, light, patron portraits, and bodily sensation are fused into one Baroque machine.",
    visual: [
      "Teresa collapses backward while the angel calmly prepares the arrow, making spiritual experience bodily.",
      "Marble turns into flesh, cloth, cloud, and theatrical motion.",
      "Hidden light and gilded rays make divine presence feel staged and real at once.",
      "The Cornaro family appears in side boxes, as if watching sacred theater."
    ],
    implications:
      "The work shows Baroque art as persuasion through total environment. It wants belief to be felt in the nerves.",
    questions: [
      "Where is the line between devotion and theater?",
      "Why does Baroque spirituality often use the body so intensely?",
      "How do sculpture, architecture, and light become one artwork?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/bernini-ecstasy-of-st-teresa/"
  },
  {
    id: "san-carlo",
    category: "Architecture",
    title: "Borromini, San Carlo alle Quattro Fontane",
    date: "1638-1677",
    culture: "Roman Baroque",
    image: imageUrl("San Carlo alle Quattro Fontane - Front.jpg"),
    context:
      "Borromini's small Roman church turns limited urban space into restless architectural invention. Its facade and interior reject static Renaissance balance for movement, compression, and release.",
    visual: [
      "The facade curves in and out, making stone behave almost like a living surface.",
      "Columns, niches, and entablatures create vertical rhythm while the wall undulates horizontally.",
      "The oval interior and coffered dome make space feel elastic rather than fixed.",
      "The building is compact, but its geometry creates drama from constraint."
    ],
    implications:
      "San Carlo shows Baroque architecture thinking through motion. Space becomes active, psychological, and theatrical.",
    questions: [
      "How can a facade seem to move?",
      "What happens when architecture is designed from pressure and constraint?",
      "Why did Baroque Rome value spatial drama?"
    ],
    source: "Wikimedia Commons / Borromini object record",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:San_Carlo_alle_Quattro_Fontane_-_Front.jpg"
  },
  {
    id: "rodin-thinker",
    category: "Sculpture",
    title: "Rodin, The Thinker",
    date: "1881-1883",
    culture: "Modern sculpture",
    image: imageUrl("The Thinker MET 11405.jpg"),
    context:
      "Rodin's figure began in relation to The Gates of Hell and became a freestanding icon of modern thought. It is heroic, but not serenely classical: thinking is shown as bodily compression.",
    visual: [
      "The body folds inward with chin on hand, making thought look muscular and heavy.",
      "The rough surface keeps the sculpture alive, resisting polished academic finish.",
      "The figure is monumental but psychologically unsettled.",
      "Rodin makes interior life visible through tension, mass, and touch."
    ],
    implications:
      "The Thinker modernizes sculpture by making mind and body inseparable. It is not an ideal athlete; it is a body under mental pressure.",
    questions: [
      "Why does thought need a body in this sculpture?",
      "How does rough surface change our sense of finish?",
      "Is the figure heroic, trapped, or both?"
    ],
    source: "Met Museum",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/191805"
  },
  {
    id: "eiffel-tower",
    category: "Architecture",
    title: "Eiffel Tower",
    date: "1887-1889",
    culture: "Third Republic France",
    image: imageUrl("Eiffel tower at Exposition Universelle, Paris, 1889.jpg"),
    context:
      "Built for the 1889 Universal Exposition, the Eiffel Tower made engineering, iron, industry, spectacle, and national ambition visible on an unprecedented scale.",
    visual: [
      "The exposed iron lattice refuses the disguise of traditional masonry architecture.",
      "Its tapering structure turns engineering necessity into a new kind of beauty.",
      "The tower is both machine-like and ornamental, unsettling older ideas of monumentality.",
      "Its height turns modern technology into public spectacle."
    ],
    implications:
      "The Eiffel Tower shows modern architecture breaking from stone, wall, and historical style. Structure itself becomes image.",
    questions: [
      "When does engineering become architecture?",
      "Why did exposed metal feel shocking in the nineteenth century?",
      "How does scale create national myth?"
    ],
    source: "Smarthistory",
    sourceUrl: "https://smarthistory.org/gustave-eiffel-tower/"
  }
);

const collectionEras = [
  {
    id: "ancient",
    number: "01",
    label: "Ancient Greek & Hellenistic",
    range: "c. 600-20 BCE",
    summary: "Myth, civic identity, the ideal body, temple form, vase painting, and Hellenistic drama.",
    workIds: [
      "black-figure-amphora-collection",
      "kouros-collection",
      "parthenon-collection",
      "aphrodite-knidos-collection",
      "laocoon"
    ]
  },
  {
    id: "roman-byzantine",
    number: "02",
    label: "Roman, Early Christian & Byzantine",
    range: "c. 100-537 CE",
    summary: "Concrete space, imperial authority, funerary portraiture, Christian relief, and luminous sacred interiors.",
    workIds: ["fayum-portrait", "pantheon", "junius-bassus", "hagia-sophia"]
  },
  {
    id: "gothic",
    number: "03",
    label: "Medieval Gothic",
    range: "1194-c. 1399",
    summary: "Cathedral structure, portal sculpture, stained light, devotional preciousness, and public theology.",
    workIds: ["chartres", "chartres-portal", "wilton-diptych"]
  },
  {
    id: "renaissance",
    number: "04",
    label: "Renaissance",
    range: "c. 1485-1504",
    summary: "Classical revival, humanist beauty, ideal proportion, civic bodies, and central-plan architecture.",
    workIds: ["birth-of-venus-collection", "bramante-tempietto", "michelangelo-david"]
  },
  {
    id: "baroque",
    number: "05",
    label: "Baroque",
    range: "1638-1677",
    summary: "Theatrical space, religious persuasion, court spectatorship, motion, and psychological drama.",
    workIds: ["san-carlo", "ecstasy-teresa", "las-meninas-collection"]
  },
  {
    id: "modern",
    number: "06",
    label: "Modernity",
    range: "1863-1889",
    summary: "Modern spectatorship, exposed structure, expressive surface, urban spectacle, and subjective vision.",
    workIds: ["olympia-collection", "rodin-thinker", "eiffel-tower", "starry-night-collection"]
  }
];

const collectionEraByWorkId = new Map(
  collectionEras.flatMap((era) =>
    era.workIds.map((workId) => [
      workId,
      {
        period: era.label,
        periodRange: era.range,
        periodNumber: era.number,
        periodId: era.id
      }
    ])
  )
);

collectionWorks.forEach((work) => Object.assign(work, collectionEraByWorkId.get(work.id)));

const zhContent = {
  categories: {
    Painting: "绘画",
    Sculpture: "雕塑",
    Architecture: "建筑"
  },
  eras: {
    ancient: {
      label: "古希腊与希腊化",
      summary: "神话、公民身份、理想身体、神庙形式、瓶画与希腊化戏剧性。"
    },
    "roman-byzantine": {
      label: "罗马、早期基督教与拜占庭",
      summary: "混凝土空间、帝国权威、丧葬肖像、基督教浮雕与发光的神圣室内。"
    },
    gothic: {
      label: "中世纪哥特",
      summary: "大教堂结构、门廊雕塑、彩色光线、虔敬的珍贵材料与公共神学。"
    },
    renaissance: {
      label: "文艺复兴",
      summary: "古典复兴、人文主义美、理想比例、公民身体与集中式建筑。"
    },
    baroque: {
      label: "巴洛克",
      summary: "戏剧化空间、宗教说服、宫廷观看、运动感与心理戏剧。"
    },
    modern: {
      label: "现代性",
      summary: "现代观看、暴露的结构、表现性的画面表面、城市景观与主观视觉。"
    }
  },
  greekWorks: {
    Parthenon: {
      theme: "神庙、城市、比例",
      lookFor: [
        "多立克柱式支撑着厚重的檐部，没有装饰性的涡卷。",
        "沉重石材与视觉修正之间形成有节制的平衡。",
        "神庙不仅是宗教容器，也是雅典公共形象。"
      ],
      whyItMatters:
        "它说明希腊建筑同时是政治的、也是视觉的：比例变成了公民权威的语言。",
      note:
        "雅典的权力变成了建筑。帕特农神庙不仅是献给雅典娜的神庙，也是一篇用大理石写成的城市论证：比例、游行、雕塑和视觉修正共同把城邦塑造成秩序的图像。"
    },
    "Kouros Figure": {
      theme: "理想身体、正面性",
      lookFor: [
        "正面而僵直的站姿，一只脚向前迈出。",
        "身体被对称、青春和理想比例组织起来。",
        "古风微笑与程式化解剖，而不是完全自然主义。"
      ],
      whyItMatters:
        "它展示了早期希腊如何在古典自然主义成熟之前，把人体转化为一种理想的公共形式。",
      note:
        "古风时期的青年立像为人体建立了一套公共语法：直立、正面、平衡、理想化。它还不是后来的古典自然主义，但已经让身体承载青春、身份、记忆和神圣在场。"
    },
    "Aphrodite of Knidos": {
      theme: "女性裸体、神性、欲望",
      lookFor: [
        "裸体女神带有人的脆弱感，而不是遥远的神圣距离。",
        "遮掩的手势既隐藏身体，也把观看引向身体。",
        "从男性运动员裸体转向女性裸体成为古典雕塑的重要主题。"
      ],
      whyItMatters:
        "这是裸体艺术史中的决定性时刻之一。阿佛洛狄忒成为被观看、被欲望、被保护和被解释的身体，影响了后来数百年的维纳斯图像。",
      note:
        "与普拉克西特列斯相关的《克尼多斯的阿佛洛狄忒》以纪念性女性裸体的突破而著名。不同于青年立像或运动员，这个身体不再只是公民青春或运动控制，而是把神性、美、羞怯与欲望观看结合起来。"
    },
    "Black-Figure Amphora": {
      theme: "作为可携带图像的神话",
      lookFor: [
        "黑色人物清晰地组织在陶土底色上。",
        "神话行动被压缩到弯曲的日用物体表面。",
        "陶瓶既是可用之物，也是讲故事的表面。"
      ],
      whyItMatters:
        "它提醒我们希腊艺术不只有神庙和雕像。图像也通过生活器物、贸易、仪式和家庭空间流动。",
      note:
        "彩绘陶器把故事带入日常生活、仪式、贸易与墓葬。在博物馆把艺术从使用中分离出来之前，希腊图像就生活在可以被拿起、盛装、交换和记忆的物体上。"
    }
  },
  collectionWorks: {
    "parthenon-collection": {
      culture: "古典雅典",
      context:
        "帕特农神庙建于波斯人洗劫雅典之后的卫城上，既是献给雅典娜的神庙，也是雅典权力的公共宣言。它把城邦财富、宗教虔敬、战争记忆和民主自我形象转化为建筑。",
      visual: [
        "多立克柱廊给建筑带来严肃的节奏：重复的柱子、厚重的檐部和冷静的矩形主体。",
        "建筑中的视觉修正略微弯曲并调整形体，让神庙在人眼中显得更完美。",
        "雕塑和游行与结构同样重要；建筑教导观看者雅典希望自己如何被看见。",
        "神庙不是单纯的礼拜外壳，而是一套完整的视觉系统：比例、神话、仪式和公民骄傲。"
      ],
      implications:
        "帕特农神庙说明建筑可以创造政治记忆。大理石成为权威、秩序、胜利和文化继承的语言。",
      questions: [
        "神圣建筑在什么时候变成政治纪念碑？",
        "比例如何让权力显得自然？",
        "当我们把帕特农看作受损的历史幸存物，而不是永恒理想时，会发生什么变化？"
      ]
    },
    pantheon: {
      culture: "罗马帝国",
      context:
        "万神殿结合了神庙、帝国空间、工程实验，以及后来的基督教教堂。它能保存至今，部分原因在于再利用：建筑因意义可以改变而继续存活。",
      visual: [
        "外部柱廊像传统神庙正面，内部却打开为巨大的圆形大厅。",
        "带藻井的混凝土穹顶减轻重量，同时把结构变成装饰。",
        "穹顶圆孔是主要自然光源，阳光在室内移动，像可见的宇宙仪器。",
        "圆、方、穹顶和地面的几何关系，让参观者感到自己置身有序宇宙之中。"
      ],
      implications:
        "罗马建筑不只是模仿希腊形式；它通过混凝土、尺度和室内经验改造空间。万神殿让权力显得具有宇宙秩序。",
      questions: [
        "为什么这里的内部比立面更重要？",
        "移动的光如何改变建筑的意义？",
        "再利用会怎样改变一座纪念物的身份？"
      ]
    },
    "hagia-sophia": {
      culture: "拜占庭君士坦丁堡",
      context:
        "圣索菲亚大教堂由查士丁尼皇帝在君士坦丁堡建造，是拜占庭权力中心的基督教帝国教堂。它后来作为清真寺、博物馆、再度成为清真寺的生命，显示建筑能承载多层宗教与政治历史。",
      visual: [
        "巨大的中央穹顶似乎在漂浮，因为底部一圈窗户消解了结构重量。",
        "帆拱解决了把圆形穹顶放在方形空间上的技术问题。",
        "大理石贴面、镶嵌画和光线让室内不再像沉重石块，而像一种气氛。",
        "建筑用尺度与光辉让帝国显得由神圣秩序支撑。"
      ],
      implications:
        "圣索菲亚把建筑从稳定的古典身体转向沉浸式的精神环境。它是为惊奇服务的工程。",
      questions: [
        "建筑如何让重量看起来失重？",
        "一座建筑在不同时期服务不同宗教时会发生什么？",
        "这里的光是装饰、神学，还是政治剧场？"
      ]
    },
    chartres: {
      culture: "法国哥特",
      context:
        "沙特尔大教堂在大火后重建，成为哥特雄心最清晰的宣言之一。朝圣、圣母崇拜、城市骄傲、彩色玻璃和行会劳动都在这座教堂中相遇。",
      visual: [
        "尖拱、肋拱和飞扶壁把重量向外转移，使墙面可以打开给玻璃。",
        "西立面把门廊雕塑与塔楼结合，让神学在进入之前就可被阅读。",
        "彩色玻璃把日光转化为有颜色的叙事和神圣气氛。",
        "建筑是一个系统：结构、雕塑、玻璃、游行和声音共同工作。"
      ],
      implications:
        "沙特尔展示哥特建筑作为高度、光线和集体信仰的技术。它让城市本身参与神圣景观。",
      questions: [
        "为什么中世纪建筑师希望墙面消失为玻璃？",
        "一座大教堂如何教导不能阅读文字的人？",
        "工程与虔敬之间是什么关系？"
      ]
    },
    "kouros-collection": {
      culture: "古风希腊",
      context:
        "青年立像属于早期希腊雕塑文化，站立的男性身体被用作墓碑、奉献物和青春理想。它不是现代意义上的肖像，而是身体的公共语法。",
      visual: [
        "人物正面、对称、僵直，一脚向前却几乎没有自然行走的感觉。",
        "解剖被图案化和程式化：头发、膝盖、躯干和微笑像生命的符号，而不是观察到的肉身。",
        "身体裸体、年轻且理想化，把美与身份、神圣/公共记忆连接起来。",
        "雕塑仍带有埃及正面性的痕迹，同时走向希腊对独立站立身体的兴趣。"
      ],
      implications:
        "青年立像帮助解释为什么人体成为希腊艺术的核心：不仅是解剖，也是社会理想、奉献、记忆和尺度。",
      questions: [
        "一个理想身体在变得写实之前能传达什么？",
        "为什么一种文化会选择裸体作为公共荣誉的形式？",
        "静止与无生命有什么不同？"
      ]
    },
    "aphrodite-knidos-collection": {
      culture: "晚期古典希腊",
      context:
        "普拉克西特列斯的阿佛洛狄忒作为纪念性女性裸体的关键图像而著名。不同于男性运动裸体，这位女神把美、脆弱、羞怯和欲望放进同一次观看相遇中。",
      visual: [
        "身体轻柔转动，产生柔软感，而不是青年立像式的正面性。",
        "遮掩手势既隐藏又集中注意力，让观看者意识到自己在观看。",
        "她是女神，但姿态让她像是被捕捉在一个人的瞬间。",
        "雕塑帮助确立了西方维纳斯图像的长传统：理想美与情色观看混合在一起。"
      ],
      implications:
        "这件作品重要，因为它改变了什么可以被展示。它使女性裸体成为高贵主题，同时也提出欲望、权力与观看者凝视的问题。",
      questions: [
        "遮掩手势是保护性的、戏剧性的，还是情色的？",
        "当神性被表现为脆弱时会改变什么？",
        "这件雕塑如何塑造后来维纳斯图像？"
      ]
    },
    laocoon: {
      culture: "希腊化 / 罗马收藏",
      context:
        "拉奥孔是警告特洛伊人不要接受木马的祭司，他和儿子被海蛇毁灭。1506年在罗马被重新发现后，这组雕塑成为文艺复兴艺术家研究解剖、痛苦和运动表现的关键对象。",
      visual: [
        "身体、蛇、恐慌和抵抗扭结在一团肌肉之中。",
        "拉奥孔中央躯干具有英雄尺度，但英雄性被困在痛苦中。",
        "构图把痛苦的一瞬间拉长为充满对角线的戏剧安排。",
        "不同于冷静的古典理想，这件雕塑让情感、身体紧张和悲怆成为主体。"
      ],
      implications:
        "拉奥孔显示希腊化艺术对戏剧性和心理极端的兴趣，也说明重新发现如何重塑艺术史：古代雕塑成为文艺复兴雄心的燃料。",
      questions: [
        "为什么痛苦在这里如此具有视觉吸引力？",
        "这组雕塑要求我们怜悯、敬佩，还是恐惧？",
        "古代艺术如何通过文艺复兴的重新发现再次变得现代？"
      ]
    },
    "michelangelo-david": {
      culture: "佛罗伦萨文艺复兴",
      context:
        "《大卫》为佛罗伦萨而雕，很快成为共和国的政治象征。圣经中的弱者变成一种城市身体：美丽、警觉、受威胁，并准备行动。",
      visual: [
        "米开朗基罗表现的是行动前的瞬间，而不是战胜歌利亚之后。",
        "对立式姿态让人物同时放松又紧张：重量休息，目光却警觉。",
        "放大的头和手帮助雕像从下方观看时更清楚，也强化思想与行动。",
        "裸体身体与古代雕塑竞争，同时赋予圣经英雄文艺复兴人文主义的尊严。"
      ],
      implications:
        "《大卫》把雕塑变成政治心理学。身体不仅是理想形式，也是一个城市想象自身勇气的图像。",
      questions: [
        "为什么表现战斗前的大卫，而不是胜利后的大卫？",
        "裸体的圣经英雄如何成为政治象征？",
        "这座雕像如何回应文艺复兴与古代的竞争？"
      ]
    },
    "birth-of-venus-collection": {
      culture: "佛罗伦萨文艺复兴",
      context:
        "这幅画属于佛罗伦萨精英人文主义文化，在那里古典神话可以成为有学问、诗意且社会上精致的题材。它使异教之美重新进入文艺复兴视觉文化。",
      visual: [
        "维纳斯站在贝壳上，采用维纳斯羞怯式姿态，一边遮掩自己，一边成为观看中心。",
        "波提切利更重视轮廓、节奏、头发、花朵和衣褶，而不是令人信服的空间深度。",
        "浅舞台和线性身体让场景显得诗意，而不是自然主义。",
        "绘画把裸体转化为美的观念：脆弱、理想、装饰性，并被知识框架包围。"
      ],
      implications:
        "这件作品对理解文艺复兴人文主义很关键：古代不是被被动复制，而是被转化为宫廷诗意、欲望和哲学之美。",
      questions: [
        "神话如何让裸体在社会上变得可接受？",
        "维纳斯是身体、观念，还是两者兼有？",
        "为什么波提切利选择线条而不是写实？"
      ]
    },
    "las-meninas-collection": {
      culture: "西班牙巴洛克",
      context:
        "《宫娥》是一幅拒绝成为简单王室肖像的宫廷绘画。它把画家、公主、侍从、王室倒影和观看者放进一个不稳定的观看系统。",
      visual: [
        "公主在中心被明亮照亮，但真正主题可能是绘画行为本身。",
        "镜子反射国王和王后，暗示他们站在观看者的位置。",
        "委拉斯开兹把自己画在巨大画布前，提升了画家在宫廷权力中的地位。",
        "打开的门、镜子、目光和笔触让空间既是物理的，也是智性的。"
      ],
      implications:
        "这幅画追问谁控制再现。它关于君主制、艺术家地位、观看关系，以及图像把观看者纳入其中的奇异力量。",
      questions: [
        "这幅画真正是为谁而画？",
        "作为观看者，我们到底站在哪里？",
        "委拉斯开兹如何让绘画看起来像思考？"
      ]
    },
    "olympia-collection": {
      culture: "现代巴黎",
      context:
        "《奥林匹亚》用一个与巴黎性交易相关的现代女性取代了神话裸体。马奈把学院传统、现代卖淫、种族、金钱和观看关系强行放进同一房间。",
      visual: [
        "裸体身体扁平、苍白、光线锐利，并有意抵抗学院派理想化。",
        "奥林匹亚直视观众；她不会为了观看者的舒适而消失进幻想。",
        "黑人女仆、花束、拖鞋、手镯和猫让场景具有明确社会身份，而不是永恒神话。",
        "这幅画通过生硬轮廓和浅空间宣告自身的画面表面。"
      ],
      implications:
        "《奥林匹亚》重要，因为它把现代性表现为不适。它暴露了裸体背后的社会契约：谁在观看、谁在付钱、谁被命名、谁被隐形。",
      questions: [
        "为什么这个裸体比神话裸体更具丑闻性？",
        "奥林匹亚的目光在做什么？",
        "马奈如何把扁平性与社会诚实连接起来？"
      ]
    },
    "starry-night-collection": {
      culture: "后印象主义",
      context:
        "《星月夜》画于梵高在圣雷米期间，它把风景转化为情感和精神压力。它超越印象派的知觉，走向表现性的视觉。",
      visual: [
        "天空以厚重而有方向的笔触旋转，让夜晚显得有生命且不稳定。",
        "柏树像黑色火焰升起，连接土地、村庄和天空。",
        "村庄更安静、更几何，是宇宙运动的人类对照。",
        "色彩和线条不只是描述景色，而是在生成情感。"
      ],
      implications:
        "这幅画教给我们一个现代经验：准确不等于真实。梵高通过外部风景让内在强度可见。",
      questions: [
        "夸张自然让这幅画获得了什么？",
        "这个夜晚是安慰的、恐怖的，还是神圣的？",
        "笔触如何变成情感？"
      ]
    },
    "black-figure-amphora-collection": {
      culture: "古风希腊",
      context:
        "希腊绘画并不只存在于墙面和画板上。幸存下来的很多是陶瓶画：可携带、可使用、可交易的物体，把神话带入宴饮、仪式、储藏、墓葬和家庭生活。",
      visual: [
        "深色剪影立在温暖陶土底色上，通过轮廓让身体变得清晰。",
        "刻线切入黑色陶衣，补充解剖、图案、织物和武器细节。",
        "弯曲的器形迫使图像形成节奏；叙事围绕着手中可握的物体展开。",
        "神话被压缩成几个关键姿态，使故事能被迅速识别。"
      ],
      implications:
        "陶瓶打破了博物馆把艺术与使用分离的习惯。希腊图像制造是社会性的、可携带的，并且与生活同在。",
      questions: [
        "可使用的物体如何改变图像意义？",
        "当神话必须适应弯曲表面时，什么会被简化？",
        "为什么陶瓶画幸存下来，而许多古代板画没有？"
      ]
    },
    "fayum-portrait": {
      culture: "罗马埃及",
      context:
        "法尤姆木乃伊肖像来自罗马埃及，希腊、罗马和埃及传统在此重叠。自然主义的绘制面孔被附在木乃伊身体上，把罗马式肖像与埃及丧葬实践连接起来。",
      visual: [
        "正面凝视让死者显得鲜活在场，而不是遥远。",
        "柔和塑造、大眼睛和蜡画表面创造出强烈亲密感。",
        "头部具有个体性，但对象仍属于仪式和墓葬。",
        "肖像处在生前相貌与来世图像之间。"
      ],
      implications:
        "这件作品复杂化了整齐的时代标签。罗马、埃及、希腊、绘画、肖像和丧葬物体都占据同一表面。",
      questions: [
        "这是肖像、纪念物，还是仪式物？",
        "直接凝视如何改变我们与死者的关系？",
        "文化混合在视觉形式中是什么样子？"
      ]
    },
    "junius-bassus": {
      culture: "早期基督教罗马",
      context:
        "这具石棺为一位罗马精英皈依者制作，时间在基督教合法化不久后。它用继承自古典世界的形式表现基督教故事，是宗教转变的纪念物，却没有与罗马彻底断裂。",
      visual: [
        "圣经场景被组织在建筑隔间中，像一座雕刻的神学档案。",
        "基督以帝国权威出现，借用罗马视觉语言来表达基督教意义。",
        "衣褶、身体和冷静秩序在新宗教内容中保留古典尊严。",
        "表面既是叙事，也是身份：信仰与精英身份被一起雕刻。"
      ],
      implications:
        "石棺显示基督教并非简单取代古典文化，而是吸收并重新导向它。",
      questions: [
        "新宗教使用旧帝国的视觉语法时会发生什么？",
        "为什么精英皈依者会想要基督教墓葬上的古典风格？",
        "浮雕如何组织信仰？"
      ]
    },
    "wilton-diptych": {
      culture: "英国国际哥特",
      context:
        "这件小型可折叠虔敬画为理查二世制作，把王权身份、私人祈祷、珍贵材料和宫廷哥特的精致感转化为亲密物件。",
      visual: [
        "金地和群青蓝让作品像宝石一样，而不是尘世空间。",
        "双联画形式使它可携带、可保护，像私人圣龛。",
        "理查二世跪在圣人面前，使王权显得依赖神恩。",
        "图案、精细和珍贵性比自然主义深度更重要。"
      ],
      implications:
        "《威尔顿双联画》显示中世纪绘画是一种政治化的虔敬：权力表现为谦卑，但这种谦卑本身也被精心安排。",
      questions: [
        "私人祈祷物如何同时成为王室宣传？",
        "材料的珍贵性为什么具有精神意义？",
        "哥特绘画不追求文艺复兴自然主义时获得了什么？"
      ]
    },
    "chartres-portal": {
      culture: "法国哥特",
      context:
        "沙特尔的门廊把大教堂门槛变成雕刻神学。进入之前，观看者就会在石头中遇见圣徒、先知、圣经历史、劳动、时间、审判和救赎。",
      visual: [
        "人物随建筑被拉长，依附于柱子和门廊，像神圣游行。",
        "衣褶、手势和面部表情在不同工坊间变化，让神学有了人的维度。",
        "雕塑与建筑共同工作，而不是独立存在。",
        "叙事围绕进入这一行为安排：观看者身体穿过教义。"
      ],
      implications:
        "哥特雕塑让建筑可被阅读。它用身体、门槛和反复观看来教学，而不只依靠文字。",
      questions: [
        "当雕塑建入建筑中时，它会如何改变？",
        "穿过一个图像系统意味着什么？",
        "中世纪艺术如何通过重复和位置来教学？"
      ]
    },
    "bramante-tempietto": {
      culture: "罗马盛期文艺复兴",
      context:
        "小圣堂标记圣彼得殉难的假定地点，同时复兴古代集中式建筑语言。它体量很小，却成为文艺复兴秩序的宣言。",
      visual: [
        "圆形平面、穹顶、台阶和多立克柱廊创造出自足的古典理想。",
        "尺度亲密，但比例让它显得完整且有权威。",
        "建筑回望古代，同时预示盛期文艺复兴对集中式平面的雄心。",
        "建筑成为论证：完美形式可以框定神圣记忆。"
      ],
      implications:
        "小圣堂显示文艺复兴古典主义是一种有纪律的发明，而不是简单复制。古代成为基督教纪念性的工具。",
      questions: [
        "为什么殉难地点会使用古典圆形神庙形式？",
        "一座很小的建筑如何在历史上变得巨大？",
        "对称向观看者承诺了什么？"
      ]
    },
    "ecstasy-teresa": {
      culture: "罗马巴洛克",
      context:
        "贝尼尼的礼拜堂雕塑把阿维拉的德兰的神秘幻象组织成戏剧事件。雕塑、建筑、光线、赞助人肖像和身体感受融合成一台巴洛克机器。",
      visual: [
        "德兰向后瘫倒，天使平静地准备箭矢，使精神经验变得身体化。",
        "大理石变成肉体、布料、云朵和戏剧性运动。",
        "隐藏光源与镀金光线让神圣在场既像舞台效果又像真实经验。",
        "科尔纳罗家族出现在侧面包厢中，仿佛观看神圣剧场。"
      ],
      implications:
        "这件作品显示巴洛克艺术通过总体环境进行说服。它希望信仰被神经感受到。",
      questions: [
        "虔敬与剧场之间的界线在哪里？",
        "为什么巴洛克精神性常常如此强烈地使用身体？",
        "雕塑、建筑和光如何成为一件作品？"
      ]
    },
    "san-carlo": {
      culture: "罗马巴洛克",
      context:
        "博罗米尼的小型罗马教堂把有限城市空间转化为充满动势的建筑发明。立面和内部拒绝静态的文艺复兴平衡，转向运动、压缩和释放。",
      visual: [
        "立面向内外弯曲，使石头几乎像有生命的表面。",
        "柱子、壁龛和檐部创造垂直节奏，而墙面在水平方向起伏。",
        "椭圆形内部和藻井穹顶让空间显得富有弹性，而不是固定。",
        "建筑很小，但几何从限制中制造戏剧性。"
      ],
      implications:
        "圣卡洛显示巴洛克建筑通过运动思考。空间变得主动、心理化、戏剧化。",
      questions: [
        "立面如何看起来像在运动？",
        "当建筑从压力和限制中设计出来时会发生什么？",
        "为什么巴洛克罗马重视空间戏剧性？"
      ]
    },
    "rodin-thinker": {
      culture: "现代雕塑",
      context:
        "罗丹的这个人物最初与《地狱之门》相关，后来成为现代思想的独立象征。它是英雄性的，但并不宁静古典：思考被表现为身体的压缩。",
      visual: [
        "身体向内折叠，下巴抵在手上，使思想看起来肌肉化、沉重。",
        "粗糙表面让雕塑保持活性，抵抗学院派光滑完成度。",
        "人物具有纪念性，却在心理上不安定。",
        "罗丹通过紧张、体量和触感让内在生活可见。"
      ],
      implications:
        "《思想者》通过让心智和身体不可分来现代化雕塑。它不是理想运动员，而是处在精神压力下的身体。",
      questions: [
        "为什么这件雕塑中的思想需要身体？",
        "粗糙表面如何改变我们对完成度的理解？",
        "这个人物是英雄、被困者，还是两者兼有？"
      ]
    },
    "eiffel-tower": {
      culture: "法兰西第三共和国",
      context:
        "埃菲尔铁塔为1889年世界博览会建造，以前所未有的尺度让工程、铁、工业、景观和国家雄心变得可见。",
      visual: [
        "暴露的铁格构拒绝传统砌体建筑的伪装。",
        "逐渐收束的结构把工程必要性转化为新的美。",
        "铁塔既像机器又有装饰性，动摇了旧的纪念性观念。",
        "它的高度把现代技术转化为公共景观。"
      ],
      implications:
        "埃菲尔铁塔显示现代建筑脱离石材、墙体和历史风格。结构本身成为图像。",
      questions: [
        "工程在什么时候变成建筑？",
        "为什么暴露金属在十九世纪会令人震惊？",
        "尺度如何创造国家神话？"
      ]
    }
  }
};

const painters = [
  {
    id: "botticelli",
    name: "Sandro Botticelli",
    years: "c. 1445-1510",
    country: "Italy",
    period: "Early Renaissance",
    movement: "Florentine Renaissance",
    hook: "Mythology, line, courtly beauty, and humanist poetry become painting.",
    position:
      "Botticelli is central for understanding how Renaissance Florence turned classical mythology into elite visual culture. His paintings do not pursue Leonardo's atmospheric naturalism; they privilege contour, rhythm, poetic beauty, and the intellectual world of Medici humanism.",
    sources: [
      "Smarthistory: Botticelli, The Birth of Venus",
      "Uffizi: The Birth of Venus",
      "Uffizi: Primavera"
    ],
    works: [
      {
        title: "The Birth of Venus",
        date: "c. 1485",
        image: imageUrl("Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg"),
        visual: [
          "Venus stands on a giant shell, slightly off balance, using the Venus pudica gesture to cover herself while still becoming the focus of desire.",
          "The figures are defined by clear, elegant contour rather than heavy anatomical volume; Botticelli's line makes bodies feel lyrical and ornamental.",
          "The sea, wind, flowers, hair, and drapery create a decorative rhythm that matters as much as spatial realism.",
          "The shallow space makes the image feel like a poetic stage rather than a convincing natural environment."
        ],
        context: [
          "The scene shows Venus arriving on shore after birth from the sea, blown by wind figures and received by a figure offering a flowered cloak.",
          "The painting belongs to a learned Florentine culture that revived classical mythology through Renaissance humanism.",
          "Unlike a Christian altarpiece, this mythological nude makes pagan beauty intellectually and socially acceptable within an elite courtly setting.",
          "The work is useful for studying how Renaissance art could join sensual beauty, poetry, classical learning, and patronage."
        ],
        exam:
          "Use The Birth of Venus to discuss Renaissance humanism, mythological subject matter, ideal beauty, and Botticelli's linear style."
      },
      {
        title: "Primavera",
        date: "c. 1480-1482",
        image: imageUrl("Botticelli-primavera.jpg"),
        visual: [
          "Nine mythological figures stand in an orange grove, arranged almost like a frieze across a shallow foreground.",
          "The right side shows Zephyrus pursuing Chloris, whose transformation into Flora is visualized through flowers and spring abundance.",
          "Venus stands near the center under a natural arch of trees, organizing the scene as a presiding force of love and harmony.",
          "The painting's beauty depends on line, pattern, textile-like detail, and botanical richness rather than perspectival depth."
        ],
        context: [
          "The subject is famously difficult to interpret, which makes it a strong example of Renaissance allegory and elite learned viewing.",
          "Its mythological program likely relates to love, spring, fertility, transformation, and Medici courtly culture.",
          "The painting turns classical myth into a sophisticated social object: it rewards viewers who can read poetry, symbols, and philosophical references.",
          "It shows how Renaissance painting could function as intellectual display as much as decoration."
        ],
        exam:
          "Use Primavera to discuss allegory, Medici humanism, mythological complexity, and Botticelli's decorative linear intelligence."
      }
    ]
  },
  {
    id: "artemisia",
    name: "Artemisia Gentileschi",
    years: "1593-c. 1656",
    country: "Italy",
    period: "Baroque",
    movement: "Caravaggesque Baroque",
    hook: "Biblical heroines become forceful, physical, and psychologically credible.",
    position:
      "Artemisia Gentileschi is essential because she transforms Baroque drama through female agency. Her paintings use Caravaggio's darkness and realism, but her heroines are not decorative victims; they act, resist, calculate, and survive.",
    sources: [
      "Smarthistory: Artemisia Gentileschi, Judith Slaying Holofernes",
      "Uffizi: Judith Beheading Holofernes",
      "Royal Collection Trust: Self-Portrait as the Allegory of Painting"
    ],
    works: [
      {
        title: "Judith Slaying Holofernes",
        date: "c. 1620-1621",
        image: imageUrl("Artemisia Gentileschi - Judith Beheading Holofernes - WGA8563.jpg"),
        visual: [
          "The scene is compressed around the physical act of beheading, with Judith and her maidservant leaning into the violence rather than recoiling from it.",
          "Strong chiaroscuro focuses the viewer on arms, sheets, blood, and the locked struggle between bodies.",
          "Unlike many earlier Judith images, Artemisia's heroine feels physically capable; the act requires effort, pressure, and collaboration.",
          "The realism of blood and force makes the biblical story immediate rather than distant or decorative."
        ],
        context: [
          "The subject comes from the story of Judith, who saves her people by killing the Assyrian general Holofernes.",
          "Artemisia's version is often read through the realities of gender, violence, and power in seventeenth-century Italy, though it should not be reduced only to biography.",
          "The painting belongs to Baroque visual culture because it stages emotion and bodily action at maximum intensity.",
          "Its modern importance lies in how it changes the image of the female hero: Judith becomes an agent, not an accessory to male drama."
        ],
        exam:
          "Use Judith Slaying Holofernes to discuss Baroque violence, Caravaggesque light, female agency, and the physical credibility of Artemisia's heroines."
      },
      {
        title: "Self-Portrait as the Allegory of Painting",
        date: "c. 1638-1639",
        image: imageUrl("Self-portrait as the Allegory of Painting (La Pittura) - Artemisia Gentileschi.jpg"),
        visual: [
          "Artemisia shows herself in the act of painting, twisting across the canvas with energetic concentration.",
          "The body is active and diagonal, refusing the passive stillness expected of many female portraits.",
          "By identifying herself with the allegorical figure of Painting, she collapses artist, subject, and concept into one image.",
          "The work gives artistic labor a physical presence: hand, brush, torso, and attention are all part of making."
        ],
        context: [
          "Traditional allegories of Painting were often female personifications made by male artists; Artemisia could uniquely represent herself as both woman and painter.",
          "The painting asserts professional identity inside a culture where women's artistic authority was exceptional and contested.",
          "It is a self-portrait, an allegory, and an argument for authorship at the same time.",
          "The work is useful for studying gender, artistic status, and self-fashioning in the Baroque period."
        ],
        exam:
          "Use Self-Portrait as the Allegory of Painting to discuss authorship, gender, allegory, and Artemisia's claim to professional artistic authority."
      }
    ]
  },
  {
    id: "vermeer",
    name: "Johannes Vermeer",
    years: "1632-1675",
    country: "Netherlands",
    period: "Baroque",
    movement: "Dutch Golden Age",
    hook: "Quiet interiors turn light, looking, and ordinary activity into mystery.",
    position:
      "Vermeer is crucial for understanding the Dutch Golden Age as a culture of domestic interiors, optical subtlety, and concentrated looking. His paintings are small in action but vast in attention: light, silence, labor, and gaze become subjects in themselves.",
    sources: [
      "Mauritshuis: Girl with a Pearl Earring",
      "Rijksmuseum: The Milkmaid",
      "Smarthistory: Vermeer"
    ],
    works: [
      {
        title: "Girl with a Pearl Earring",
        date: "c. 1665",
        image: imageUrl("1665 Girl with a Pearl Earring.jpg"),
        visual: [
          "The figure turns over her shoulder, lips parted, as if caught in a moment between silence and speech.",
          "The dark background removes narrative setting, making the face, turban, and earring appear luminous.",
          "The painting is not a conventional portrait but a tronie: a study of type, expression, costume, and visual effect.",
          "The pearl is oversized and almost abstract, made from highlights more than detailed description."
        ],
        context: [
          "The Mauritshuis identifies the work as a tronie rather than a portrait of a known individual.",
          "The image depends on fantasy and theatrical costume, not everyday Dutch dress.",
          "Its power comes from intimacy without biography: the viewer feels addressed but cannot fully know the sitter.",
          "The work is useful for studying how Dutch painting could turn optical effect and ambiguity into emotional presence."
        ],
        exam:
          "Use Girl with a Pearl Earring to discuss the tronie, intimacy, optical luminosity, and Vermeer's transformation of looking into mystery."
      },
      {
        title: "The Milkmaid",
        date: "c. 1660",
        image: imageUrl("Johannes Vermeer - Het melkmeisje - Google Art Project.jpg"),
        visual: [
          "A maidservant pours milk in a quiet interior where almost everything is still except the thin stream of liquid.",
          "Vermeer monumentalizes a humble domestic task by giving the figure sculptural weight and concentrated attention.",
          "Light from the left touches bread, cloth, ceramic, wall, and skin, turning surfaces into subtle optical events.",
          "The composition is simple but exact: table, wall, window, figure, and objects form a world of disciplined stillness."
        ],
        context: [
          "The Rijksmuseum emphasizes how Vermeer makes a simple everyday activity impressive through stillness and light.",
          "The painting belongs to Dutch genre painting, but it resists moral caricature by granting dignity to labor.",
          "The maid is absorbed in her work, which shifts attention from narrative drama to attention itself.",
          "The work is useful for discussing class, domesticity, gendered labor, and the moral seriousness of ordinary life."
        ],
        exam:
          "Use The Milkmaid to discuss Dutch genre painting, domestic labor, stillness, and Vermeer's mastery of light."
      }
    ]
  },
  {
    id: "delacroix",
    name: "Eugene Delacroix",
    years: "1798-1863",
    country: "France",
    period: "Romanticism",
    movement: "French Romanticism",
    hook: "Color, violence, politics, and emotion become engines of modern history painting.",
    position:
      "Delacroix is one of the defining painters of French Romanticism. Against academic restraint and Neoclassical clarity, he makes color, movement, emotion, and political intensity central to painting.",
    sources: [
      "Smarthistory: Delacroix, Liberty Leading the People",
      "Louvre: Delacroix exhibition",
      "Wikimedia/Louvre records for public-domain images"
    ],
    works: [
      {
        title: "Liberty Leading the People",
        date: "1830",
        image: imageUrl("La Liberté guidant le peuple - Eugène Delacroix - Musée du Louvre Peintures RF 129 - après restauration 2024.jpg"),
        visual: [
          "Liberty strides over bodies and barricade debris, holding the tricolor flag in one hand and a musket in the other.",
          "She is both allegorical goddess and woman of the people, which gives the painting its unstable modern charge.",
          "The fighters around her represent different social classes, turning revolution into a collective urban body.",
          "Smoke, diagonal movement, exposed bodies, and vivid color make history feel immediate and dangerous."
        ],
        context: [
          "The painting commemorates the July Revolution of 1830, not the French Revolution of 1789.",
          "Delacroix turns a recent political event into a modern history painting, joining allegory to journalism-like immediacy.",
          "The image became politically charged because Liberty is inspiring but also insurgent; she cannot be fully domesticated by the state.",
          "The work is useful for studying Romanticism as emotion, politics, violence, and national myth."
        ],
        exam:
          "Use Liberty Leading the People to discuss Romantic political painting, allegory, class, revolution, and the modern public image."
      },
      {
        title: "The Death of Sardanapalus",
        date: "1827",
        image: imageUrl("Eugène Delacroix - The Death of Sardanapalus - WGA6173.jpg"),
        visual: [
          "The composition is a chaotic diagonal avalanche of red, gold, flesh, fabric, violence, and luxury.",
          "Sardanapalus reclines above the destruction he has ordered, emotionally detached from the suffering below.",
          "The painting rejects calm Neoclassical order in favor of excess, color, sensuality, and horror.",
          "The eye cannot settle easily; the image produces instability as a visual experience."
        ],
        context: [
          "The subject comes from the legendary Assyrian king who destroys his possessions before his own death.",
          "The painting was controversial because of its violence, eroticism, and refusal of academic restraint.",
          "It is Romantic not because it is sentimental, but because it pushes emotion, imagination, and extremity past classical order.",
          "The work is useful for discussing Orientalism, spectacle, fantasy, and the politics of representing violence."
        ],
        exam:
          "Use The Death of Sardanapalus to discuss Romantic excess, color, violence, Orientalism, and the rejection of Neoclassical restraint."
      }
    ]
  },
  {
    id: "cassatt",
    name: "Mary Cassatt",
    years: "1844-1926",
    country: "United States / France",
    period: "Impressionism",
    movement: "Impressionism",
    hook: "Modern women look, care, move, and occupy public/private space with agency.",
    position:
      "Mary Cassatt gives Impressionism a different social geography. Instead of only cafes, boulevards, and male flaneurs, she studies women in theaters, domestic interiors, gardens, boats, and intimate acts of care, often making looking itself a gendered subject.",
    sources: [
      "Smarthistory: Mary Cassatt, In the Loge",
      "Smarthistory: Mary Cassatt, The Child's Bath",
      "Art Institute of Chicago: The Child's Bath",
      "National Gallery of Art: The Boating Party"
    ],
    works: [
      {
        title: "In the Loge",
        date: "1878",
        image: imageUrl("Mary Stevenson Cassatt - In the Loge - Google Art Project.jpg"),
        visual: [
          "A woman in black sits in a theater box and looks through opera glasses, taking up the foreground with alert self-possession.",
          "A man in the background looks at her, creating a chain of looking: she watches, he watches her, and we watch both.",
          "The sharp cropping, elevated viewpoint, and public leisure setting connect the work to Impressionist modern life.",
          "Cassatt makes the female spectator active rather than merely decorative."
        ],
        context: [
          "The opera was a modern social space where spectators watched performances and each other.",
          "Cassatt differs from many male Impressionists by focusing on women's agency within public spaces.",
          "The painting analyzes the gender politics of looking: a woman can be both viewer and viewed.",
          "The work is useful for studying modernity, spectatorship, gender, and Impressionist social space."
        ],
        exam:
          "Use In the Loge to discuss female spectatorship, modern public leisure, Impressionism, and the gendered power of looking."
      },
      {
        title: "The Child's Bath",
        date: "1893",
        image: imageUrl("Mary Cassatt - The Child's Bath - Google Art Project.jpg"),
        visual: [
          "The composition is cropped and tilted downward, compressing mother, child, basin, and patterned surfaces into an intimate structure.",
          "Flattened pattern and unusual viewpoint show the influence of Japanese prints on Cassatt's mature style.",
          "The gestures are gentle but firm: one hand supports, another washes, making care visible as action.",
          "The painting avoids sentimentality by focusing on concentration, touch, and bodily closeness."
        ],
        context: [
          "Cassatt repeatedly explored mother-child subjects, but she treated them as psychologically and formally serious rather than merely sweet.",
          "The Art Institute describes the work as a tender portrayal of familial closeness, a theme Cassatt returned to throughout her career.",
          "The domestic subject becomes modern because composition, cropping, and pattern make it visually experimental.",
          "The work is useful for studying care, gender, Japonisme, and the dignity of everyday intimacy."
        ],
        exam:
          "Use The Child's Bath to discuss maternal intimacy, Japonisme, modern cropping, and Cassatt's transformation of domestic care into serious modern painting."
      }
    ]
  },
  {
    id: "leonardo",
    name: "Leonardo da Vinci",
    years: "1452-1519",
    country: "Italy",
    period: "High Renaissance",
    movement: "Renaissance humanism",
    hook: "Painting becomes inquiry: anatomy, optics, psychology, atmosphere.",
    position:
      "Leonardo represents the High Renaissance ideal of art joined to scientific observation. His paintings do not only describe bodies; they test how bodies, air, light, psychology, and sacred narrative can be made believable through visual intelligence.",
    works: [
      {
        title: "Mona Lisa",
        date: "c. 1503-1506",
        image: imageUrl("Mona Lisa.jpg"),
        visual: [
          "The sitter is turned in a three-quarter pose, which makes the body feel both stable and psychologically present.",
          "Leonardo uses sfumato, soft transitions without hard outlines, to make the face and hands seem alive rather than sharply drawn.",
          "The background landscape recedes into atmospheric haze, linking the human body to nature, distance, and mystery."
        ],
        context: [
          "The portrait becomes more than likeness; it turns portraiture into a study of inner life.",
          "Her ambiguous smile creates a modern problem of interpretation: the viewer cannot fully possess or resolve her expression.",
          "The painting shows Renaissance humanism because individual presence becomes worthy of sustained attention."
        ],
        exam:
          "Use Mona Lisa to discuss sfumato, psychological ambiguity, and the Renaissance elevation of portraiture into a study of human interiority."
      },
      {
        title: "The Last Supper",
        date: "1495-1498",
        image: imageUrl("Leonardo da Vinci - The Last Supper high res.jpg"),
        visual: [
          "The composition is organized by strict linear perspective, with Christ at the vanishing point.",
          "The apostles react in varied emotional groups, turning a biblical moment into a study of human psychology.",
          "The calm central figure of Christ contrasts with the agitation around him, creating spiritual and compositional order."
        ],
        context: [
          "Painted for a monastery refectory, the scene mirrored the dining space of the monks.",
          "Leonardo shifts the emphasis from symbolic hierarchy to dramatic human response.",
          "The work became fragile because of Leonardo's experimental technique, making conservation part of its history."
        ],
        exam:
          "Use The Last Supper to connect perspective, narrative drama, and Renaissance belief in rational visual order."
      }
    ]
  },
  {
    id: "caravaggio",
    name: "Caravaggio",
    years: "1571-1610",
    country: "Italy",
    period: "Baroque",
    movement: "Tenebrism",
    hook: "Saints, sinners, and spectators are pulled into theatrical light.",
    position:
      "Caravaggio makes sacred scenes immediate, bodily, and morally urgent. He rejects idealized beauty in favor of ordinary models, dirty feet, violent light, and the sense that divine events interrupt the real world.",
    works: [
      {
        title: "The Calling of Saint Matthew",
        date: "1599-1600",
        image: imageUrl("The Calling of Saint Matthew-Caravaggo (1599-1600).jpg"),
        visual: [
          "A beam of light cuts across a dark tavern-like space and transforms an ordinary room into a scene of revelation.",
          "Christ's gesture echoes Michelangelo's Creation of Adam, but the setting is modern and humble.",
          "The figures look like everyday men rather than ideal saints, making conversion feel psychologically immediate."
        ],
        context: [
          "The painting belongs to Counter-Reformation visual culture, where clarity, emotional force, and religious persuasion mattered.",
          "Caravaggio brings sacred history into contemporary life, collapsing the distance between biblical past and viewer's present.",
          "The work challenges decorum by making holiness appear in a low, worldly environment."
        ],
        exam:
          "Use this work for tenebrism, Counter-Reformation immediacy, and Baroque theatrical realism."
      },
      {
        title: "Judith Beheading Holofernes",
        date: "c. 1598-1599",
        image: imageUrl("Caravaggio - Judith Beheading Holofernes.jpg"),
        visual: [
          "The scene freezes the moment of violence with stark light, compressed space, and intense physical tension.",
          "Judith's expression mixes determination and recoil, complicating the heroic act.",
          "Blood, fabric, and gesture are staged with a directness that refuses polite distance."
        ],
        context: [
          "The biblical subject becomes a scene of psychological and bodily confrontation.",
          "Caravaggio's realism turns moral drama into something the viewer almost witnesses at close range.",
          "The painting is useful for discussing Baroque affect: art that moves, shocks, and persuades."
        ],
        exam:
          "Use Judith to discuss violence, theatrical light, gendered power, and Baroque emotional intensity."
      }
    ]
  },
  {
    id: "rembrandt",
    name: "Rembrandt van Rijn",
    years: "1606-1669",
    country: "Netherlands",
    period: "Baroque",
    movement: "Dutch Golden Age",
    hook: "Paint turns inward: light becomes a tool for conscience and aging.",
    position:
      "Rembrandt's importance lies in making painting psychologically dense. Instead of polished ideal beauty, he gives viewers age, doubt, tenderness, conscience, and the material richness of paint itself.",
    works: [
      {
        title: "The Night Watch",
        date: "1642",
        image: imageUrl("The Night Watch - HD.jpg"),
        visual: [
          "A civic guard portrait is transformed into a dynamic public drama with movement, light, and overlapping figures.",
          "The composition breaks the static conventions of group portraiture by staging the militia as if they are moving into action.",
          "Light organizes attention, especially around the captain, lieutenant, and mysterious young girl."
        ],
        context: [
          "Dutch group portraits often recorded civic identity, wealth, and public status.",
          "Rembrandt turns collective identity into theater, making the image feel historical and unstable.",
          "The painting reveals the Dutch Republic's culture of urban militia, commerce, and civic pride."
        ],
        exam:
          "Use The Night Watch to explain how Rembrandt transforms group portraiture into Baroque movement and civic drama."
      },
      {
        title: "Self-Portraits",
        date: "1620s-1660s",
        image: imageUrl("Rembrandt Harmensz. van Rijn - Self-Portrait - Google Art Project.jpg"),
        visual: [
          "Rembrandt repeatedly studies his own face across youth, prosperity, loss, and old age.",
          "The late portraits use thick paint, warm darkness, and direct gaze to make aging visible as experience.",
          "The surface of paint becomes part of the meaning: roughness suggests lived time."
        ],
        context: [
          "The self-portraits are not simple vanity; they form a lifelong inquiry into identity and artistic self-fashioning.",
          "They also function as market demonstrations of expression, costume, lighting, and painterly skill.",
          "The late works resist idealization and give dignity to vulnerability."
        ],
        exam:
          "Use Rembrandt's self-portraits for identity, aging, Protestant introspection, and painterly surface."
      }
    ]
  },
  {
    id: "velazquez",
    name: "Diego Velazquez",
    years: "1599-1660",
    country: "Spain",
    period: "Baroque",
    movement: "Spanish court painting",
    hook: "Painting asks who is looking, who is seen, and who controls representation.",
    position:
      "Velazquez turns court painting into a philosophical problem. His art often asks what painting can represent, where the viewer stands, and how power circulates through looking.",
    works: [
      {
        title: "Las Meninas",
        date: "1656",
        image: imageUrl("Las Meninas 01.jpg"),
        visual: [
          "The painting shows the Infanta, attendants, dwarfs, a dog, the painter, a mirror, and a doorway in a complex court space.",
          "The mirror reflects the king and queen, implying that they occupy the viewer's space.",
          "Velazquez includes himself at the canvas, making painting, power, and spectatorship the subject."
        ],
        context: [
          "This is a court image, but it refuses to behave as a simple royal portrait.",
          "It elevates the painter's intellectual status by showing Velazquez as participant in royal representation.",
          "The work is central for discussions of meta-painting: painting about the act and politics of painting."
        ],
        exam:
          "Use Las Meninas to discuss spectatorship, royal power, illusion, and painting's self-awareness."
      },
      {
        title: "The Surrender of Breda",
        date: "1634-1635",
        image: imageUrl("Velazquez - The Surrender of Breda.jpg"),
        visual: [
          "The composition centers on the exchange of keys between defeated and victorious leaders.",
          "Velazquez avoids humiliating the defeated commander; the gesture is restrained and dignified.",
          "The forest of lances creates military order while the human exchange softens the image of conquest."
        ],
        context: [
          "The painting served Spanish imperial memory and court propaganda.",
          "Its emotional tone is unusual because victory is represented through magnanimity rather than cruelty.",
          "It reveals how history painting can convert political violence into noble ceremony."
        ],
        exam:
          "Use this painting to discuss Spanish power, history painting, and the visual rhetoric of honorable conquest."
      }
    ]
  },
  {
    id: "hokusai",
    name: "Katsushika Hokusai",
    years: "1760-1849",
    country: "Japan",
    period: "Edo",
    movement: "Ukiyo-e",
    hook: "Popular print culture makes nature, labor, and design radically portable.",
    position:
      "Hokusai shows that art history cannot be told only through European oil painting. His woodblock prints combine popular culture, refined design, serial production, and a view of nature that deeply affected European modernism.",
    works: [
      {
        title: "The Great Wave off Kanagawa",
        date: "c. 1831",
        image: imageUrl("Great Wave off Kanagawa2.jpg"),
        visual: [
          "The wave curls like a claw over small boats, making nature monumental and human labor fragile.",
          "Mount Fuji appears tiny but stable in the distance, contrasting permanence with violent motion.",
          "Flat color, contour, rhythm, and cropped composition create an image that feels graphic and modern."
        ],
        context: [
          "The work belongs to Thirty-six Views of Mount Fuji, a commercial print series.",
          "Its reproducibility matters: this was art made for circulation, collection, and popular viewing.",
          "The print later shaped Japonisme and European modernist interest in flatness, asymmetry, and cropping."
        ],
        exam:
          "Use The Great Wave for ukiyo-e, print culture, nature, labor, and cross-cultural influence on modernism."
      },
      {
        title: "Fine Wind, Clear Morning",
        date: "c. 1830-1832",
        image: imageUrl("Red Fuji south wind clear morning.jpg"),
        visual: [
          "Mount Fuji is simplified into a bold triangular mass with red body, white snow, and patterned clouds.",
          "The image is less narrative than iconic: a mountain becomes design, weather, season, and national symbol.",
          "The flat planes of color show Hokusai's power to reduce nature into memorable structure."
        ],
        context: [
          "Like The Great Wave, this print is part of a serial study of Fuji under changing conditions.",
          "It shows that repetition can generate difference: same subject, altered atmosphere.",
          "The work is useful for comparing serial vision in Hokusai and later Monet."
        ],
        exam:
          "Use Red Fuji to discuss seriality, landscape as symbol, and the design intelligence of ukiyo-e."
      }
    ]
  },
  {
    id: "goya",
    name: "Francisco Goya",
    years: "1746-1828",
    country: "Spain",
    period: "Romanticism",
    movement: "Spanish Romanticism",
    hook: "Modern violence, nightmare, politics, and private terror enter painting.",
    position:
      "Goya is a hinge between Enlightenment, Romanticism, and modern political art. He exposes irrationality, state violence, superstition, and the collapse of heroic history painting.",
    works: [
      {
        title: "The Third of May 1808",
        date: "1814",
        image: imageUrl("El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg"),
        visual: [
          "The central victim raises his arms in a pose that recalls crucifixion, but the scene is modern execution rather than sacred redemption.",
          "The French soldiers form a faceless machine of violence, while the victims are individualized by gesture and fear.",
          "The lantern creates harsh illumination, making violence public, theatrical, and unbearable."
        ],
        context: [
          "The painting responds to Napoleon's occupation of Spain and the execution of Spanish civilians.",
          "Goya rejects heroic battle imagery; war is shown as terror inflicted on bodies.",
          "The work becomes a foundation for modern anti-war painting."
        ],
        exam:
          "Use Third of May for Romantic political emotion, anti-heroic history painting, and modern images of state violence."
      },
      {
        title: "Saturn Devouring His Son",
        date: "c. 1819-1823",
        image: imageUrl("Francisco de Goya, Saturno devorando a su hijo (1819-1823).jpg"),
        visual: [
          "The figure of Saturn emerges from darkness, wide-eyed and monstrous, gripping a mutilated body.",
          "The brushwork is rough and the space is nearly void, intensifying the psychological horror.",
          "Myth is stripped of classical beauty and becomes an image of madness, appetite, and destruction."
        ],
        context: [
          "Part of Goya's Black Paintings, originally painted on the walls of his own house.",
          "The image can be read politically, psychologically, or existentially; its force lies in refusing one stable explanation.",
          "It pushes Romantic darkness toward modern anxieties about violence and the unconscious."
        ],
        exam:
          "Use Saturn for the Black Paintings, nightmare imagery, and the breakdown of classical myth into modern terror."
      }
    ]
  },
  {
    id: "turner",
    name: "J. M. W. Turner",
    years: "1775-1851",
    country: "Britain",
    period: "Romanticism",
    movement: "Romantic landscape",
    hook: "Landscape dissolves into light, weather, industry, and sensation.",
    position:
      "Turner makes landscape unstable. Rather than showing nature as a calm stage, he paints atmosphere, storm, steam, fire, and light as forces that overwhelm fixed form.",
    works: [
      {
        title: "Rain, Steam and Speed",
        date: "1844",
        image: imageUrl("Rain Steam and Speed the Great Western Railway.jpg"),
        visual: [
          "The train emerges through rain and vapor, with forms dissolving into atmosphere.",
          "Turner uses blur and speed to make industrial modernity a visual experience rather than a precise description.",
          "The bridge and train cut through landscape, joining nature and machine."
        ],
        context: [
          "The painting registers the railway as a symbol of modern time, speed, and technological transformation.",
          "Romantic landscape here is not anti-modern; it absorbs modern industry into the sublime.",
          "The work anticipates later abstraction because sensation becomes more important than contour."
        ],
        exam:
          "Use this work for industrial modernity, the Romantic sublime, and the dissolution of form into sensation."
      },
      {
        title: "The Slave Ship",
        date: "1840",
        image: imageUrl("Slave-ship.jpg"),
        visual: [
          "A violent sunset, stormy sea, and scattered bodies create an image of beauty contaminated by atrocity.",
          "Human forms are small and fragmented, nearly swallowed by water and color.",
          "The painting's atmospheric force makes moral horror inseparable from visual intensity."
        ],
        context: [
          "The subject refers to enslaved people thrown overboard for insurance claims.",
          "Turner uses sublime landscape as social protest, linking aesthetic experience to abolitionist outrage.",
          "The painting complicates beauty: gorgeous color becomes ethically disturbing."
        ],
        exam:
          "Use The Slave Ship for Romantic sublime, abolitionist politics, and the moral instability of beauty."
      }
    ]
  },
  {
    id: "manet",
    name: "Edouard Manet",
    years: "1832-1883",
    country: "France",
    period: "Modernism begins",
    movement: "Realism / Impressionism precursor",
    hook: "Often called the father of Impressionism; makes modern life and painting's flatness impossible to ignore.",
    featured: true,
    position:
      "Manet is often referred to as the father of Impressionism, but he never simply dissolves into Impressionism. The Impressionists, who formed as a group around 1871, inherited his rebel status. Clement Greenberg later described Manet's paintings as early modernist because they frankly declared the flat surface on which they were painted. His modernity is both formal and social: he paints modern Paris while making painting admit that it is painted.",
    works: [
      {
        title: "Olympia",
        date: "1863",
        image: imageUrl("Manet, Édouard - Olympia.jpg"),
        visual: [
          "A nude woman reclines on a lounge with a small black cat at her feet and a Black female servant behind her holding a bouquet, presumably sent by a customer.",
          "Olympia is flatly painted, poorly contoured by academic standards, and deliberately shallow. The lack of classical depth dissolves illusionism and makes painting speak about its own condition as representation.",
          "She is not clothed by mythology. The reality of a nude woman is present, and the name Olympia was commonly associated with prostitutes in Paris.",
          "Her direct gaze refuses the passive role expected of the academic nude; she looks back at the viewer as a social actor."
        ],
        context: [
          "The subject is modern: she inhabits the contemporary world of Parisian prostitution.",
          "Manet's modernity is not only how he painted, but what he painted: modern marginal figures outside bourgeois normalcy.",
          "The painting is candid about materials, subject, motives, and desire. It transforms the ideal Venus into a courtesan and exposes the viewer's implication in looking.",
          "The scandal came from the collision of an old art-historical format with an unmistakably modern, unidealized woman."
        ],
        exam:
          "Use Olympia to argue that Manet modernizes the nude by stripping away mythology, emphasizing flatness, and forcing viewers to confront modern sexuality, class, race, and spectatorship."
      },
      {
        title: "Le Dejeuner sur l'herbe",
        date: "1863",
        image: imageUrl("Edouard Manet - Luncheon on the Grass - Google Art Project.jpg"),
        visual: [
          "The painting was exhibited at the Salon des Refuses after exclusion from the official Salon and caused controversy through both subject and technique.",
          "The figures are modern Parisian figures. The nude woman is not distanced by mythology or idealization; she looks like a real person, creating discomfort for viewers.",
          "The nude woman looks directly outward with a gaze that is nonchalant yet engaging.",
          "The figures are rendered flatly; the female body can feel like a cutout. The foreground grass and distant meadow use loose brushwork with little academic finish."
        ],
        context: [
          "The work challenges the authorities controlling art in France by quoting tradition while refusing academic decorum.",
          "It is inspired by Titian and by a Raphael-related composition known to Manet through an engraving of The Judgment of Paris.",
          "Its importance lies in Manet making his own decisions for art, helping open the path toward late nineteenth-century and twentieth-century modernism.",
          "The scandal is not nudity alone, but the collapse of acceptable distance: the nude is contemporary, socially legible, and looking back."
        ],
        exam:
          "Use Le Dejeuner sur l'herbe to discuss Manet's challenge to the Salon, his flattening of form, and his replacement of mythological nude tradition with modern Parisian discomfort."
      }
    ]
  },
  {
    id: "monet",
    name: "Claude Monet",
    years: "1840-1926",
    country: "France",
    period: "Impressionism",
    movement: "Impressionism",
    hook: "Painting becomes perception: light, atmosphere, and serial looking.",
    position:
      "Monet makes painting into the record of changing perception. He does not define objects by stable contour; he shows them as they appear under changing light, weather, and time.",
    works: [
      {
        title: "Impression, Sunrise",
        date: "1872",
        image: imageUrl("Claude Monet, Impression, soleil levant.jpg"),
        visual: [
          "Loose brushstrokes describe harbor, water, smoke, and sky with minimal detail.",
          "The orange sun and its reflection become optical anchors inside a misty blue-gray field.",
          "The image looks unfinished by academic standards, which was central to its modern shock."
        ],
        context: [
          "The title helped give Impressionism its name after a critic used it mockingly.",
          "The subject is modern industrial harbor life, but filtered through atmospheric sensation.",
          "Monet values the impression of a moment over polished historical narrative."
        ],
        exam:
          "Use Impression, Sunrise for plein-air vision, loose brushwork, modern atmosphere, and the naming of Impressionism."
      },
      {
        title: "Water Lilies",
        date: "1890s-1920s",
        image: imageUrl("Claude Monet - Water Lilies - 1906, Ryerson.jpg"),
        visual: [
          "The pond surface fills the picture, reducing horizon and stable spatial orientation.",
          "Reflections, flowers, water, and sky merge into a field of color and brushwork.",
          "The late works move toward abstraction because perception becomes immersive."
        ],
        context: [
          "Monet's garden at Giverny became a controlled site for serial observation.",
          "The series shows modern temporality: same motif, endless difference.",
          "The large late panels helped shape later abstract and immersive painting."
        ],
        exam:
          "Use Water Lilies to discuss seriality, perception, late Impressionism, and the path toward abstraction."
      }
    ]
  },
  {
    id: "vangogh",
    name: "Vincent van Gogh",
    years: "1853-1890",
    country: "Netherlands / France",
    period: "Post-Impressionism",
    movement: "Expressive color",
    hook: "Brushstroke and color turn perception into emotional intensity.",
    position:
      "Van Gogh transforms visible nature into emotional and spiritual force. His paintings make brushstroke, color, and line carry feeling rather than merely describe appearances.",
    works: [
      {
        title: "The Starry Night",
        date: "1889",
        image: imageUrl("Van Gogh - Starry Night - Google Art Project.jpg"),
        visual: [
          "The sky is animated by swirling rhythms, thick brushwork, and exaggerated stars.",
          "The dark cypress rises like a flame, connecting earth and sky.",
          "The village is quieter and more geometric, contrasting human settlement with cosmic motion."
        ],
        context: [
          "Painted while Van Gogh was at Saint-Remy, the work turns observed landscape into visionary experience.",
          "It is not simply a night view; it is nature charged with psychological and spiritual intensity.",
          "The painting is central to Post-Impressionism because expression overtakes optical naturalism."
        ],
        exam:
          "Use The Starry Night for expressive brushwork, emotional color, and the Post-Impressionist move beyond Impressionist perception."
      },
      {
        title: "Sunflowers",
        date: "1888",
        image: imageUrl("Vincent van Gogh - Sunflowers - VGM F458.jpg"),
        visual: [
          "Yellow dominates the image, creating harmony through repetition rather than strong contrast.",
          "The flowers appear at different stages of life, from bloom to decay.",
          "Thick impasto gives petals, seeds, and vase a tactile presence."
        ],
        context: [
          "The Sunflowers were connected to Van Gogh's hope for an artists' community in Arles.",
          "A simple still life becomes an experiment in color, friendship, and intensity.",
          "The painting is useful for discussing how ordinary subjects can become expressive icons."
        ],
        exam:
          "Use Sunflowers for color symbolism, impasto, still life, and Van Gogh's expressive transformation of ordinary objects."
      }
    ]
  },
  {
    id: "cezanne",
    name: "Paul Cezanne",
    years: "1839-1906",
    country: "France",
    period: "Post-Impressionism",
    movement: "Structural painting",
    hook: "Rebuilds vision through planes, color patches, and constructive form.",
    position:
      "Cezanne is crucial because he makes seeing feel constructed. Instead of capturing a quick impression, he builds form through repeated planes of color, making painting analytical and unstable at once.",
    works: [
      {
        title: "Mont Sainte-Victoire",
        date: "1880s-1900s",
        image: imageUrl("Paul Cézanne - Mont Sainte-Victoire and the Viaduct of the Arc River Valley.jpg"),
        visual: [
          "The mountain is built from patches of color rather than smooth atmospheric illusion.",
          "Foreground, trees, viaduct, and mountain interlock as planes, making depth feel constructed.",
          "The image balances landscape observation with abstract structure."
        ],
        context: [
          "Cezanne returned to the motif repeatedly, treating landscape as a problem of perception and form.",
          "His method influenced Cubism because objects could be broken into planes and rebuilt.",
          "The work is modern because it makes painting's construction visible."
        ],
        exam:
          "Use Mont Sainte-Victoire to discuss constructed vision, color planes, serial landscape, and the road to Cubism."
      },
      {
        title: "The Large Bathers",
        date: "1898-1905",
        image: imageUrl("Paul Cézanne - Les Grandes Baigneuses.jpg"),
        visual: [
          "Bodies and trees form an architectural triangle rather than naturalistic anatomy.",
          "The figures feel monumental but simplified, almost fused with landscape.",
          "Cezanne uses color and structure to stabilize a scene that remains visually unsettled."
        ],
        context: [
          "The classical bathing theme is reworked into modern structure rather than sensual finish.",
          "The painting influenced later modernists interested in geometry, monumentality, and abstraction.",
          "It is useful for comparing Cezanne with both Renaissance composition and Cubist fragmentation."
        ],
        exam:
          "Use The Large Bathers for modern classicism, structural composition, and the transformation of figure painting."
      }
    ]
  },
  {
    id: "klimt",
    name: "Gustav Klimt",
    years: "1862-1918",
    country: "Austria",
    period: "Symbolism",
    movement: "Vienna Secession",
    hook: "Decoration, eroticism, gold, and modern anxiety merge.",
    position:
      "Klimt collapses the boundary between fine art and decoration. His paintings combine erotic intimacy, symbolic pattern, Byzantine gold, and the tensions of fin-de-siecle Vienna.",
    works: [
      {
        title: "The Kiss",
        date: "1907-1908",
        image: imageUrl("The Kiss - Gustav Klimt - Google Cultural Institute.jpg"),
        visual: [
          "The figures are wrapped in a gold patterned field that nearly dissolves their bodies into ornament.",
          "Male rectangular motifs and female circular motifs create a symbolic contrast of forms.",
          "The couple stands at the edge of a flowered ground, combining intimacy with instability."
        ],
        context: [
          "The work belongs to Klimt's Golden Phase and reflects interest in Byzantine mosaics and decorative surface.",
          "It can be read as erotic union, aesthetic fantasy, or an image of gendered tension.",
          "Klimt's decorative surface challenged hierarchies that separated painting from applied arts."
        ],
        exam:
          "Use The Kiss for Symbolism, Vienna Secession decoration, eroticism, and the modern collapse of figure into ornament."
      },
      {
        title: "Portrait of Adele Bloch-Bauer I",
        date: "1907",
        image: imageUrl("Gustav Klimt 046.jpg"),
        visual: [
          "The sitter's face and hands emerge from an overwhelming gold ornamental field.",
          "The body becomes pattern, luxury, and social identity rather than anatomical form.",
          "The portrait mixes intimacy with display, making status and surface inseparable."
        ],
        context: [
          "The portrait reflects elite Jewish patronage in Vienna and the culture of the Secession.",
          "Its later Nazi looting and restitution history make provenance central to its modern meaning.",
          "The work is useful for discussing patronage, ornament, identity, and museum ethics."
        ],
        exam:
          "Use Adele Bloch-Bauer for portraiture, ornament, patronage, restitution, and the politics of ownership."
      }
    ]
  }
];

const timeline = document.querySelector("#timeline");
const dossier = document.querySelector("#dossier-content");
const periodFilters = document.querySelector("#period-filters");
const countryFilters = document.querySelector("#country-filters");
const searchInput = document.querySelector("#search");
const resetButton = document.querySelector("#reset");
const painterCount = document.querySelector("#painter-count");
const greekWorksContainer = document.querySelector("#greek-works");
const greekDetail = document.querySelector("#greek-detail");
const collectionFilters = document.querySelector("#collection-filters");
const collectionGrid = document.querySelector("#collection-grid");
const collectionDetail = document.querySelector("#collection-detail");
const chronology = document.querySelector("#chronology");
const densityToggle = document.querySelector("#density-toggle");
const studyCard = document.querySelector("#study-card");
const savedCount = document.querySelector("#saved-count");
const saveStudyWork = document.querySelector("#save-study-work");
const nextStudyCard = document.querySelector("#next-study-card");
const revealStudyAnswer = document.querySelector("#reveal-study-answer");
const savedWorkList = document.querySelector("#saved-work-list");
const studyModeButtons = document.querySelectorAll("[data-study-mode]");
const exploreTunnel = document.querySelector("#explore-tunnel");
const tunnelWorkTitle = document.querySelector("#tunnel-work-title");
const languageSelect = document.querySelector("#language-select");

const translations = {
  en: {
    "top.coffee": "Café",
    "top.map": "Map",
    "top.greek": "Greek",
    "top.timeline": "Timeline",
    "top.study": "Study Room",
    "top.painters": "Painters",
    "top.top": "Go back to Top",
    "top.language": "Language",
    "nav.subtitle": "Greek art · period timeline · artists · object notes",
    "hero.coffee": "Have a coffee",
    "hero.map": "Museum map",
    "hero.essay": "Essai / essayer",
    "hero.explore": "Explore",
    "cafe.eyebrow": "Common room cafe",
    "cafe.title": "Have a coffee with an art historian",
    "cafe.intro": "Choose a drink, settle into the common room, and ask the resident art historian about any artwork, period, or strange visual detail you noticed.",
    "cafe.order": "Today's order",
    "cafe.buy": "Buy coffee",
    "cafe.ai": "AI art historian",
    "cafe.askTitle": "Ask across the table",
    "cafe.open": "Open",
    "cafe.greeting": "Ask me why Manet felt modern, how Gothic cathedrals teach, or what makes Greek sculpture feel ideal.",
    "cafe.question": "Question",
    "cafe.placeholder": "Ask about a work, period, or visual detail...",
    "cafe.ask": "Ask",
    "map.eyebrow": "Museum map",
    "map.title": "Choose a room by period",
    "map.intro": "A small floor plan of the common room museum. Each room opens the matching period in the timeline below.",
    "essay.eyebrow": "Essai / essayer",
    "essay.title": "Art history essay room",
    "essay.intro": "Practice two exam habits: first, close visual analysis from an artwork; second, a short essay question drawn from the works you saved to study.",
    "essay.thesis": "Working thesis",
    "essay.thesisPlaceholder": "This artwork matters because...",
    "essay.draft": "Response",
    "essay.draftPlaceholder": "Start with what you see. Then move from visual evidence to historical meaning.",
    "essay.words": "words",
    "essay.moves": "Four moves",
    "greek.eyebrow": "Room 1",
    "greek.title": "Greek Art: the first gallery",
    "greek.intro": "Start here as the guided opening room. The full period timeline below keeps the complete index; this room slows down the first encounter with body, temple, myth, civic ritual, and the long conversation between realism and ideal form.",
    "collection.eyebrow": "Period timeline",
    "collection.title": "Art history by era, not by medium",
    "collection.intro": "The timeline mixes painting, sculpture, and architecture in each period. The painter notebook below is a focused painting archive; linked works move between the two.",
    "collection.compact": "Compact cards",
    "collection.expanded": "Expanded cards",
    "chronology.eyebrow": "Horizontal chronology",
    "chronology.title": "Who overlaps with what?",
    "chronology.intro": "Works are points; painters are lifespan bars. Tap any marker to jump into the matching note or dossier.",
    "study.eyebrow": "Memory room",
    "study.title": "Turn looking into recall",
    "study.intro": "Use the existing memory hooks, images, and visual notes as a small learning loop: save objects, flip a card, then ask the art historian why the answer matters.",
    "study.modeImage": "Image to work",
    "study.modeHook": "Hook to work",
    "study.list": "Learning list",
    "study.savedTitle": "Saved for review",
    "study.savedLine": "works saved on this device.",
    "study.saveCurrent": "Save current",
    "study.removeCurrent": "Remove current",
    "study.next": "Next card",
    "study.reveal": "Reveal answer",
    "study.empty": "No saved works yet. Use Save for review on an artwork you want to study again.",
    "study.promptImage": "Name this work from the image.",
    "study.promptHook": "Name this work from the memory hook.",
    "study.hidden": "Answer hidden. Try to recall before revealing.",
    "study.openNote": "Open full note",
    "study.openDossier": "Open {name} dossier",
    "notebook.find": "Find painter",
    "notebook.controls": "Timeline controls",
    "notebook.searchLabel": "Search painter, work, country, movement",
    "notebook.searchPlaceholder": "Try Manet, Japan, Baroque...",
    "notebook.periods": "Periods",
    "notebook.countries": "Countries",
    "notebook.reset": "Reset filters",
    "notebook.archive": "Painting archive",
    "notebook.title": "Painter dossiers linked to the period timeline",
    "notebook.intro": "This archive is painting-focused. When a work also appears in the main period timeline, its note links back to the full mixed-medium context.",
    "filters.all": "All",
    "filters.allPeriods": "All periods",
    "filters.fullTimeline": "full timeline",
    "actions.openTimeline": "See this in the period timeline",
    "actions.openComplete": "Open complete timeline note",
    "actions.askHistorian": "Ask the art historian",
    "actions.save": "Save",
    "actions.saved": "Saved",
    "actions.saveReview": "Save for review",
    "actions.savedReview": "Saved for review",
    "actions.remove": "Remove",
    "detail.background": "Historical / social background",
    "detail.visual": "Visual analysis",
    "detail.implications": "Implications",
    "detail.questions": "Questions for further exploration",
    "detail.source": "Source",
    "greek.note": "Greek object note",
    "greek.look": "Look for",
    "greek.why": "Why it matters",
    "dossier.eyebrow": "Painter dossier",
    "dossier.movement": "Movement",
    "dossier.hook": "Memory hook",
    "dossier.major": "Major works",
    "dossier.core": "Core painter note",
    "dossier.workNotes": "Major work notes",
    "dossier.context": "Context / social commentary",
    "dossier.openLinked": "Open linked timeline note",
    "timeline.empty": "No painters match this filter yet. Reset or try a broader search.",
    "tunnel.caption": "The frame is opening"
  },
  zh: {
    "top.coffee": "咖啡馆",
    "top.map": "地图",
    "top.greek": "希腊馆",
    "top.timeline": "时间线",
    "top.study": "学习室",
    "top.painters": "画家",
    "top.top": "回到顶部",
    "top.language": "语言",
    "nav.subtitle": "希腊艺术 · 时代时间线 · 艺术家 · 作品笔记",
    "hero.coffee": "喝杯咖啡",
    "hero.map": "博物馆地图",
    "hero.essay": "Essai / essayer",
    "hero.explore": "随机探索",
    "cafe.eyebrow": "公共房间咖啡馆",
    "cafe.title": "和艺术史学者喝杯咖啡",
    "cafe.intro": "选一杯饮品，坐进公共房间，向常驻艺术史学者询问任何作品、时代或你注意到的视觉细节。",
    "cafe.order": "今日点单",
    "cafe.buy": "购买咖啡",
    "cafe.ai": "AI 艺术史学者",
    "cafe.askTitle": "隔桌提问",
    "cafe.open": "开放",
    "cafe.greeting": "问我为什么马奈显得现代，哥特大教堂如何教学，或希腊雕塑为什么显得理想化。",
    "cafe.question": "问题",
    "cafe.placeholder": "询问一件作品、一个时代或一个视觉细节...",
    "cafe.ask": "提问",
    "map.eyebrow": "博物馆地图",
    "map.title": "按时代选择房间",
    "map.intro": "这是公共房间博物馆的小平面图。每个房间都会打开下方时间线中对应的时代。",
    "essay.eyebrow": "Essai / essayer",
    "essay.title": "艺术史论文室",
    "essay.intro": "练习两种考试能力：第一，看图做视觉分析；第二，根据你保存的作品回答一条短论文题。",
    "essay.thesis": "临时论点",
    "essay.thesisPlaceholder": "这件作品之所以重要，是因为……",
    "essay.draft": "回答",
    "essay.draftPlaceholder": "先写你看见了什么，再从视觉证据走向历史意义。",
    "essay.words": "词",
    "essay.moves": "四个动作",
    "greek.eyebrow": "第一展厅",
    "greek.title": "希腊艺术：第一间展厅",
    "greek.intro": "从这里开始导览。完整的时代时间线保留完整索引；这一间展厅放慢第一次观看身体、神庙、神话、公民仪式，以及写实与理想形式之间漫长对话的速度。",
    "collection.eyebrow": "时代时间线",
    "collection.title": "按时代理解艺术史，而不是按媒介",
    "collection.intro": "时间线把绘画、雕塑和建筑放在同一时代中。下方画家档案是以绘画为中心的资料库；已链接的作品可以在两者之间跳转。",
    "collection.compact": "紧凑卡片",
    "collection.expanded": "展开卡片",
    "chronology.eyebrow": "横向年代线",
    "chronology.title": "谁和谁处在同一时代？",
    "chronology.intro": "作品是时间点；画家是生命跨度条。点击任何标记都能进入对应笔记或档案。",
    "study.eyebrow": "记忆房间",
    "study.title": "把观看变成记忆",
    "study.intro": "用现有的记忆点、图像和视觉笔记形成学习闭环：保存作品、翻卡回忆，再问艺术史学者为什么它重要。",
    "study.modeImage": "看图猜作品",
    "study.modeHook": "看记忆点猜作品",
    "study.list": "学习清单",
    "study.savedTitle": "保存复习",
    "study.savedLine": "件作品保存在此设备上。",
    "study.saveCurrent": "保存当前",
    "study.removeCurrent": "移除当前",
    "study.next": "下一张卡",
    "study.reveal": "显示答案",
    "study.empty": "还没有保存作品。点击作品上的“保存复习”，把想继续学习的作品加入清单。",
    "study.promptImage": "根据图像说出这件作品。",
    "study.promptHook": "根据记忆点说出这件作品。",
    "study.hidden": "答案已隐藏。先试着回忆，再显示答案。",
    "study.openNote": "打开完整笔记",
    "study.openDossier": "打开{name}档案",
    "notebook.find": "查找画家",
    "notebook.controls": "时间线筛选",
    "notebook.searchLabel": "搜索画家、作品、国家、流派",
    "notebook.searchPlaceholder": "试试 Manet、Japan、Baroque...",
    "notebook.periods": "时代",
    "notebook.countries": "国家",
    "notebook.reset": "重置筛选",
    "notebook.archive": "绘画档案",
    "notebook.title": "与时代时间线相连的画家档案",
    "notebook.intro": "这个档案以绘画为中心。当某件作品也出现在主时间线中，它的笔记会链接回完整的跨媒介语境。",
    "filters.all": "全部",
    "filters.allPeriods": "全部时代",
    "filters.fullTimeline": "完整时间线",
    "actions.openTimeline": "在时代时间线中查看",
    "actions.openComplete": "打开完整时间线笔记",
    "actions.askHistorian": "询问艺术史学者",
    "actions.save": "保存",
    "actions.saved": "已保存",
    "actions.saveReview": "保存复习",
    "actions.savedReview": "已保存复习",
    "actions.remove": "移除",
    "detail.background": "历史 / 社会背景",
    "detail.visual": "视觉分析",
    "detail.implications": "意义与影响",
    "detail.questions": "延伸探索问题",
    "detail.source": "来源",
    "greek.note": "希腊作品笔记",
    "greek.look": "观看重点",
    "greek.why": "为什么重要",
    "dossier.eyebrow": "画家档案",
    "dossier.movement": "流派",
    "dossier.hook": "记忆点",
    "dossier.major": "主要作品",
    "dossier.core": "画家核心笔记",
    "dossier.workNotes": "主要作品笔记",
    "dossier.context": "语境 / 社会评论",
    "dossier.openLinked": "打开已链接的时间线笔记",
    "timeline.empty": "没有符合筛选的画家。请重置或扩大搜索范围。",
    "tunnel.caption": "画框正在打开"
  },
  fr: {
    "top.coffee": "Café",
    "top.map": "Carte",
    "top.greek": "Grec",
    "top.timeline": "Chronologie",
    "top.study": "Salle d'étude",
    "top.painters": "Peintres",
    "top.top": "Retour en haut",
    "top.language": "Langue",
    "nav.subtitle": "Art grec · chronologie · artistes · notes d'œuvres",
    "hero.coffee": "Prendre un café",
    "hero.map": "Carte du musée",
    "hero.essay": "Essai / essayer",
    "hero.explore": "Explorer",
    "cafe.eyebrow": "Café du common room",
    "cafe.title": "Prendre un café avec un historien de l'art",
    "cafe.intro": "Choisissez une boisson, installez-vous, puis interrogez l'historien de l'art sur une œuvre, une période ou un détail visuel.",
    "cafe.order": "Commande du jour",
    "cafe.buy": "Acheter un café",
    "cafe.ai": "Historien de l'art IA",
    "cafe.askTitle": "Poser une question",
    "cafe.open": "Ouvert",
    "cafe.greeting": "Demandez-moi pourquoi Manet paraît moderne, comment les cathédrales gothiques enseignent, ou pourquoi la sculpture grecque semble idéale.",
    "cafe.question": "Question",
    "cafe.placeholder": "Posez une question sur une œuvre, une période ou un détail visuel...",
    "cafe.ask": "Demander",
    "map.eyebrow": "Carte du musée",
    "map.title": "Choisir une salle par période",
    "map.intro": "Un petit plan du musée du common room. Chaque salle ouvre la période correspondante dans la chronologie.",
    "essay.eyebrow": "Essai / essayer",
    "essay.title": "Salle d'essai d'histoire de l'art",
    "essay.intro": "Pratiquez deux habitudes d'examen : d'abord l'analyse visuelle d'une œuvre; ensuite une courte question d'essai tirée des œuvres sauvegardées.",
    "essay.thesis": "Thèse provisoire",
    "essay.thesisPlaceholder": "Cette œuvre compte parce que...",
    "essay.draft": "Réponse",
    "essay.draftPlaceholder": "Commencez par ce que vous voyez. Passez ensuite des preuves visuelles au sens historique.",
    "essay.words": "mots",
    "essay.moves": "Quatre gestes",
    "greek.eyebrow": "Salle 1",
    "greek.title": "Art grec : la première galerie",
    "greek.intro": "Commencez ici comme dans une salle d'ouverture guidée. La chronologie complète garde l'index entier; cette salle ralentit la première rencontre avec le corps, le temple, le mythe, le rituel civique et le dialogue entre réalisme et forme idéale.",
    "collection.eyebrow": "Chronologie des périodes",
    "collection.title": "L'histoire de l'art par époque, pas par médium",
    "collection.intro": "La chronologie mêle peinture, sculpture et architecture dans chaque période. Le carnet des peintres ci-dessous est une archive centrée sur la peinture; les œuvres liées circulent entre les deux.",
    "collection.compact": "Cartes compactes",
    "collection.expanded": "Cartes développées",
    "chronology.eyebrow": "Chronologie horizontale",
    "chronology.title": "Qui se chevauche avec quoi ?",
    "chronology.intro": "Les œuvres sont des points; les peintres sont des barres de vie. Touchez un marqueur pour ouvrir la note ou le dossier correspondant.",
    "study.eyebrow": "Salle de mémoire",
    "study.title": "Transformer le regard en mémoire",
    "study.intro": "Utilisez les repères de mémoire, les images et les notes visuelles comme boucle d'apprentissage : sauvegarder, retourner une carte, puis demander pourquoi l'œuvre compte.",
    "study.modeImage": "Image vers œuvre",
    "study.modeHook": "Repère vers œuvre",
    "study.list": "Liste d'étude",
    "study.savedTitle": "À réviser",
    "study.savedLine": "œuvres sauvegardées sur cet appareil.",
    "study.saveCurrent": "Sauvegarder",
    "study.removeCurrent": "Retirer",
    "study.next": "Carte suivante",
    "study.reveal": "Révéler",
    "study.empty": "Aucune œuvre sauvegardée. Utilisez Sauvegarder pour réviser une œuvre que vous voulez étudier.",
    "study.promptImage": "Nommez cette œuvre à partir de l'image.",
    "study.promptHook": "Nommez cette œuvre à partir du repère de mémoire.",
    "study.hidden": "Réponse cachée. Essayez de vous souvenir avant de révéler.",
    "study.openNote": "Ouvrir la note complète",
    "study.openDossier": "Ouvrir le dossier {name}",
    "notebook.find": "Trouver un peintre",
    "notebook.controls": "Filtres de chronologie",
    "notebook.searchLabel": "Chercher peintre, œuvre, pays, mouvement",
    "notebook.searchPlaceholder": "Essayez Manet, Japon, Baroque...",
    "notebook.periods": "Périodes",
    "notebook.countries": "Pays",
    "notebook.reset": "Réinitialiser",
    "notebook.archive": "Archive de peinture",
    "notebook.title": "Dossiers de peintres liés à la chronologie",
    "notebook.intro": "Cette archive est centrée sur la peinture. Lorsqu'une œuvre apparaît aussi dans la chronologie principale, sa note renvoie au contexte complet.",
    "filters.all": "Tous",
    "filters.allPeriods": "Toutes les périodes",
    "filters.fullTimeline": "chronologie complète",
    "actions.openTimeline": "Voir dans la chronologie",
    "actions.openComplete": "Ouvrir la note complète",
    "actions.askHistorian": "Demander à l'historien",
    "actions.save": "Sauver",
    "actions.saved": "Sauvé",
    "actions.saveReview": "Sauver pour réviser",
    "actions.savedReview": "Sauvé pour réviser",
    "actions.remove": "Retirer",
    "detail.background": "Contexte historique / social",
    "detail.visual": "Analyse visuelle",
    "detail.implications": "Implications",
    "detail.questions": "Questions pour explorer",
    "detail.source": "Source",
    "greek.note": "Note d'objet grec",
    "greek.look": "À observer",
    "greek.why": "Pourquoi c'est important",
    "dossier.eyebrow": "Dossier de peintre",
    "dossier.movement": "Mouvement",
    "dossier.hook": "Repère de mémoire",
    "dossier.major": "Œuvres majeures",
    "dossier.core": "Note centrale du peintre",
    "dossier.workNotes": "Notes sur les œuvres majeures",
    "dossier.context": "Contexte / commentaire social",
    "dossier.openLinked": "Ouvrir la note liée",
    "timeline.empty": "Aucun peintre ne correspond. Réinitialisez ou élargissez la recherche.",
    "tunnel.caption": "Le cadre s'ouvre"
  }
};

const supportedLanguages = ["en", "zh", "fr"];
let currentLanguage = supportedLanguages.includes(localStorage.getItem("ahcrLanguage"))
  ? localStorage.getItem("ahcrLanguage")
  : "en";

function t(key, replacements = {}) {
  const phrase = translations[currentLanguage]?.[key] || translations.en[key] || key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    phrase
  );
}

function translatedCategory(category) {
  return currentLanguage === "zh" ? zhContent.categories[category] || category : category;
}

function translatedEra(era) {
  if (currentLanguage !== "zh") return era;
  const zhEra = zhContent.eras[era.id];
  return zhEra ? { ...era, ...zhEra } : era;
}

function translatedCollectionWork(work) {
  if (currentLanguage !== "zh") return work;
  const zhWork = zhContent.collectionWorks[work.id];
  return zhWork ? { ...work, ...zhWork } : work;
}

function translatedPeriodLabel(work) {
  if (currentLanguage !== "zh") return work.period;
  const era = collectionEras.find((item) => item.id === work.periodId);
  return era ? translatedEra(era).label : work.period;
}

function translatedGreekWork(work) {
  if (currentLanguage !== "zh") return work;
  const zhWork = zhContent.greekWorks[work.title];
  return zhWork ? { ...work, ...zhWork } : work;
}

let savedStudyIds = new Set();
try {
  savedStudyIds = new Set(JSON.parse(localStorage.getItem("ahcrSavedStudyIds") || "[]"));
} catch {
  savedStudyIds = new Set();
}

const state = {
  period: "All",
  country: "All",
  query: "",
  selected: "manet",
  selectedGreek: 0,
  collectionEra: "All",
  selectedCollection: collectionWorks[0].id,
  density: localStorage.getItem("ahcrCardDensity") === "compact" ? "compact" : "expanded",
  studyMode: "image",
  studyIndex: 0,
  studyRevealed: false,
  essayMode: "visual",
  essayVisualIndex: 0,
  essayQuestionIndex: 0
};

function setText(selector, key, replacements = {}) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = t(key, replacements);
  }
}

function setPlaceholder(selector, key) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute("placeholder", t(key));
  }
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-Hans" : currentLanguage;
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.setAttribute("aria-label", t("top.language"));
  }

  setText('[data-nav-room="cafe"]', "top.coffee");
  setText('[data-nav-room="map"]', "top.map");
  setText('.topbar-nav a[href="#greek-art"]', "top.greek");
  setText('.topbar-nav a[href="#collection-atlas"]', "top.timeline");
  setText('.topbar-nav a[href="#study-room"]', "top.study");
  setText('.topbar-nav a[href="#notebook"]', "top.painters");
  setText('.topbar-nav a[href="#top"]', "top.top");
  setText(".language-switcher span", "top.language");
  setText(".nav-subtitle", "nav.subtitle");
  setText("#have-coffee > span:last-child", "hero.coffee");
  setText("#museum-map > span:last-child", "hero.map");
  setText("#essay-room-button > span:last-child", "hero.essay");
  setText("#explore-random > span:last-child", "hero.explore");

  setText("#cafe-room .cafe-counter .eyebrow", "cafe.eyebrow");
  setText("#cafe-room-title", "cafe.title");
  setText("#cafe-room .cafe-counter p:not(.eyebrow)", "cafe.intro");
  setText(".coffee-ticket .eyebrow", "cafe.order");
  setText("#buy-coffee", "cafe.buy");
  setText(".historian-chat .chat-heading .eyebrow", "cafe.ai");
  setText("#historian-chat-title", "cafe.askTitle");
  setText(".chat-heading > span", "cafe.open");
  setText(".chat-message.historian p", "cafe.greeting");
  setText('.chat-form label[for="historian-question"]', "cafe.question");
  setPlaceholder("#historian-question", "cafe.placeholder");
  setText(".chat-form button", "cafe.ask");

  setText("#map-room .eyebrow", "map.eyebrow");
  setText("#map-room-title", "map.title");
  setText("#map-room .map-room-heading p:not(.eyebrow)", "map.intro");

  setText("#essay-room .eyebrow", "essay.eyebrow");
  setText("#essay-room-title", "essay.title");
  setText("#essay-room .essay-heading p:not(.eyebrow)", "essay.intro");
  setText('label[for="essay-thesis"]', "essay.thesis");
  setPlaceholder("#essay-thesis", "essay.thesisPlaceholder");
  setText('label[for="essay-draft"]', "essay.draft");
  setPlaceholder("#essay-draft", "essay.draftPlaceholder");
  setText(".essay-method h3", "essay.moves");
  const essayCountText = document.querySelector(".essay-count");
  if (essayCountText && essayWordCount) {
    const textNode = Array.from(essayCountText.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = ` ${t("essay.words")}`;
    }
  }

  setText(".greek-intro .eyebrow", "greek.eyebrow");
  setText("#greek-art-title", "greek.title");
  setText(".greek-intro p:last-child", "greek.intro");

  setText(".collection-heading .eyebrow", "collection.eyebrow");
  setText("#collection-atlas-title", "collection.title");
  setText(".collection-intent", "collection.intro");
  setText(".chronology-heading .eyebrow", "chronology.eyebrow");
  setText("#chronology-title", "chronology.title");
  setText(".chronology-heading > p", "chronology.intro");

  setText(".study-heading .eyebrow", "study.eyebrow");
  setText("#study-room-title", "study.title");
  setText(".study-heading p:not(.eyebrow)", "study.intro");
  setText('[data-study-mode="image"]', "study.modeImage");
  setText('[data-study-mode="hook"]', "study.modeHook");
  setText(".study-list .eyebrow", "study.list");
  setText(".study-list h3", "study.savedTitle");
  const savedLine = document.querySelector(".study-list > p:not(.eyebrow)");
  if (savedLine && savedCount) {
    savedCount.textContent = String(savedStudyIds.size);
    const textNode = Array.from(savedLine.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = ` ${t("study.savedLine")}`;
    } else {
      savedLine.append(` ${t("study.savedLine")}`);
    }
  }
  setText("#next-study-card", "study.next");
  setText("#reveal-study-answer", "study.reveal");

  setText(".controls .section-heading .eyebrow", "notebook.find");
  setText(".controls .section-heading h2", "notebook.controls");
  setText(".search-box span", "notebook.searchLabel");
  setPlaceholder("#search", "notebook.searchPlaceholder");
  setText(".controls .control-label:nth-of-type(1)", "notebook.periods");
  document.querySelectorAll(".control-label").forEach((label, index) => {
    label.textContent = index === 0 ? t("notebook.periods") : t("notebook.countries");
  });
  setText("#reset", "notebook.reset");
  setText(".timeline-feed .section-heading .eyebrow", "notebook.archive");
  setText(".timeline-feed .section-heading h2", "notebook.title");
  setText(".timeline-feed .section-heading > p:not(.eyebrow)", "notebook.intro");
  setText(".tunnel-caption span", "tunnel.caption");
}

function rerenderLanguageSensitiveUI() {
  renderFilters();
  renderGreekWorks();
  renderGreekDetail();
  renderMuseumFloorMap();
  renderCollectionFilters();
  renderChronology();
  syncDensity();
  renderCollection();
  render();
  renderEssayRoom();
  applyStaticLanguage();
}

function unique(list, key) {
  return ["All", ...Array.from(new Set(list.map((item) => item[key]))).sort()];
}

function makeChip(label, type) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.textContent = label === "All" ? t("filters.all") : label;
  button.dataset[type] = label;
  button.addEventListener("click", () => {
    state[type] = label;
    render();
  });
  return button;
}

function renderFilters() {
  periodFilters.innerHTML = "";
  countryFilters.innerHTML = "";
  unique(painters, "period").forEach((period) => periodFilters.appendChild(makeChip(period, "period")));
  unique(painters, "country").forEach((country) => countryFilters.appendChild(makeChip(country, "country")));
}

function matches(painter) {
  const haystack = [
    painter.name,
    painter.country,
    painter.period,
    painter.movement,
    painter.hook,
    painter.position,
    painter.works.map((work) => [work.title, work.date, work.visual.join(" "), work.context.join(" ")].join(" ")).join(" ")
  ]
    .join(" ")
    .toLowerCase();
  return (
    (state.period === "All" || painter.period === state.period) &&
    (state.country === "All" || painter.country === state.country) &&
    haystack.includes(state.query.toLowerCase())
  );
}

function renderTimeline() {
  const visible = painters.filter(matches);
  if (painterCount) {
    painterCount.textContent = String(painters.length);
  }
  timeline.innerHTML = "";

  if (visible.length === 0) {
    timeline.innerHTML = `<div class="empty-state">${t("timeline.empty")}</div>`;
    return;
  }

  visible.forEach((painter) => {
    const card = document.createElement("button");
    const timelineWork = painter.works[0];
    card.type = "button";
    card.className = `painter-card ${painter.id === state.selected ? "is-active" : ""}`;
    card.dataset.id = painter.id;
    card.innerHTML = `
      <figure class="timeline-art">
        <img src="${timelineWork.image}" alt="${timelineWork.title} by ${painter.name}" loading="lazy" />
        <figcaption>${painter.period}</figcaption>
      </figure>
      <strong>${painter.name}</strong>
      <small>${painter.years} · ${painter.country}</small>
      <span class="movement">${painter.movement}</span>
      <span class="hook">${painter.hook}</span>
    `;
    card.addEventListener("click", () => {
      openPainter(painter.id);
    });
    timeline.appendChild(card);
  });
}

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderArtworkThumb(work, index) {
  return `
    <button class="art-thumb ${index === 0 ? "is-selected" : ""}" type="button" data-work-index="${index}">
      <img src="${work.image}" alt="${work.title}" loading="lazy" />
      <span>${work.title}</span>
    </button>
  `;
}

function renderWork(work) {
  const collectionWork = findCollectionWorkForPainterWork(work);
  const displayCollectionWork = collectionWork ? translatedCollectionWork(collectionWork) : null;
  const displayTitle = displayCollectionWork?.title || work.title;
  const displayVisual = displayCollectionWork?.visual || work.visual;
  const displayContext = displayCollectionWork ? [displayCollectionWork.context] : work.context;
  const displayExam = displayCollectionWork?.implications || work.exam;
  return `
    <article class="work-note">
      <div class="work-hero">
        <img src="${work.image}" alt="${work.title}" loading="lazy" />
        <div>
          <p class="eyebrow">${work.date}</p>
          <h4>${displayTitle}</h4>
          <p class="exam-line">${displayExam}</p>
          ${
            collectionWork
              ? `
                <div class="detail-actions">
                  <button type="button" class="inline-action" data-open-collection-id="${collectionWork.id}">${t("actions.openTimeline")}</button>
                  <button type="button" class="inline-action" data-save-work="${collectionWork.id}">${savedStudyIds.has(collectionWork.id) ? t("actions.savedReview") : t("actions.saveReview")}</button>
                </div>
              `
              : ""
          }
        </div>
      </div>
      <div class="note-columns">
        <section>
          <strong>${t("detail.visual")}</strong>
          <ul>${listItems(displayVisual)}</ul>
        </section>
        <section>
          <strong>${t("dossier.context")}</strong>
          <ul>${listItems(displayContext)}</ul>
        </section>
      </div>
    </article>
  `;
}

function renderDossier() {
  const painter = painters.find((item) => item.id === state.selected) || painters[0];
  const linkedWorks = painter.works.map(findCollectionWorkForPainterWork).filter(Boolean);
  const firstLinkedWork = linkedWorks[0];

  dossier.innerHTML = `
    <div class="dossier-header">
      <p class="eyebrow">${t("dossier.eyebrow")}</p>
      <h2>${painter.name}</h2>
      <p>${painter.years} · ${painter.country} · ${painter.period}</p>
      <div class="detail-actions">
        <button type="button" class="inline-action" data-ask-about-painter="${painter.id}">${t("actions.askHistorian")}</button>
        ${
          firstLinkedWork
            ? `<button type="button" class="inline-action" data-open-collection-id="${firstLinkedWork.id}">${t("dossier.openLinked")}</button>`
            : ""
        }
      </div>
    </div>

    <div class="art-gallery">
      ${painter.works.map(renderArtworkThumb).join("")}
    </div>

    <div class="fact-grid">
      <article><strong>${t("dossier.movement")}</strong><span>${painter.movement}</span></article>
      <article><strong>${t("dossier.hook")}</strong><span>${painter.hook}</span></article>
      <article><strong>${t("dossier.major")}</strong><span>${painter.works.map((work) => work.title).join(", ")}</span></article>
    </div>

    <section class="deep-note">
      <h3>${t("dossier.core")}</h3>
      <p>${painter.position}</p>
    </section>

    <section class="works-stack">
      <h3>${t("dossier.workNotes")}</h3>
      <div id="work-notes">${painter.works.map(renderWork).join("")}</div>
    </section>
  `;

  dossier.querySelectorAll(".art-thumb").forEach((button) => {
    button.addEventListener("click", () => {
      const workIndex = Number(button.dataset.workIndex);
      dossier.querySelectorAll(".art-thumb").forEach((thumb) => thumb.classList.toggle("is-selected", thumb === button));
      dossier.querySelectorAll(".work-note")[workIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  dossier.querySelectorAll("[data-open-collection-id]").forEach((button) => {
    button.addEventListener("click", () => openCollectionWork(button.dataset.openCollectionId));
  });
  dossier.querySelectorAll("[data-save-work]").forEach((button) => {
    button.addEventListener("click", () => toggleStudyWork(button.dataset.saveWork));
  });
  dossier.querySelector("[data-ask-about-painter]")?.addEventListener("click", () => {
    openCafeRoom();
    if (historianQuestion) {
      historianQuestion.value = `Explain ${painter.name}'s importance through social context, visual evidence, and one memorable artwork.`;
      historianQuestion.focus();
    }
  });
}

function renderGreekWorks() {
  greekWorksContainer.innerHTML = greekWorks
    .map(
      (work, index) => {
        const displayWork = translatedGreekWork(work);
        return `
        <article class="greek-work-card ${index === state.selectedGreek ? "is-active" : ""}" role="button" tabindex="0" data-greek-index="${index}" aria-label="Open ${work.title} notes">
          <img src="${work.image}" alt="${work.title}" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
          <div>
            <p class="eyebrow">${work.date}</p>
            <h3>${work.title}</h3>
            <strong>${displayWork.theme}</strong>
            <p>${displayWork.note}</p>
          </div>
        </article>
      `;
      }
    )
    .join("");

  greekWorksContainer.querySelectorAll(".greek-work-card").forEach((card) => {
    const openGreekWork = () => {
      state.selectedGreek = Number(card.dataset.greekIndex);
      renderGreekWorks();
      renderGreekDetail();
      greekDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    card.addEventListener("click", openGreekWork);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGreekWork();
      }
    });
  });
}

function renderGreekDetail() {
  const work = greekWorks[state.selectedGreek] || greekWorks[0];
  const displayWork = translatedGreekWork(work);
  const collectionWork = collectionWorks.find((item) => titlesMatch(item.title, work.title));
  greekDetail.innerHTML = `
    <img src="${work.image}" alt="${work.title}" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
    <div>
      <p class="eyebrow">${t("greek.note")}</p>
      <h3>${work.title}</h3>
      <p class="greek-detail-meta">${work.date} · ${displayWork.theme}</p>
      <p>${displayWork.note}</p>
      <strong>${t("greek.look")}</strong>
      <ul>${listItems(displayWork.lookFor)}</ul>
      <strong>${t("greek.why")}</strong>
      <p>${displayWork.whyItMatters}</p>
      ${
        collectionWork
          ? `
            <div class="detail-actions">
              <button type="button" class="inline-action" data-open-collection-id="${collectionWork.id}">${t("actions.openComplete")}</button>
              <button type="button" class="inline-action" data-save-work="${collectionWork.id}">${savedStudyIds.has(collectionWork.id) ? t("actions.savedReview") : t("actions.saveReview")}</button>
            </div>
          `
          : ""
      }
    </div>
  `;

  greekDetail.querySelector("[data-open-collection-id]")?.addEventListener("click", (event) => {
    openCollectionWork(event.currentTarget.dataset.openCollectionId);
  });
  greekDetail.querySelector("[data-save-work]")?.addEventListener("click", (event) => {
    toggleStudyWork(event.currentTarget.dataset.saveWork);
  });
}

function getEraWorks(era) {
  return era.workIds.map((workId) => collectionWorks.find((work) => work.id === workId)).filter(Boolean);
}

function visibleCollectionEras() {
  return collectionEras.filter((era) => state.collectionEra === "All" || era.id === state.collectionEra);
}

function visibleCollectionWorks() {
  return visibleCollectionEras().flatMap(getEraWorks);
}

function mediumSummary(works) {
  return ["Painting", "Sculpture", "Architecture"]
    .map((medium) => {
      const count = works.filter((work) => work.category === medium).length;
      return count ? `${count} ${currentLanguage === "zh" ? translatedCategory(medium) : medium.toLowerCase()}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titlesMatch(firstTitle, secondTitle) {
  const first = normalizeKey(firstTitle);
  const second = normalizeKey(secondTitle);
  if (!first || !second) return false;
  return first === second || first.endsWith(second) || second.endsWith(first);
}

function findCollectionWorkForPainterWork(work) {
  return collectionWorks.find((item) => titlesMatch(item.title, work.title));
}

function findPainterForCollectionWork(work) {
  return painters.find((painter) => painter.works.some((item) => titlesMatch(item.title, work.title)));
}

function openPainter(painterId) {
  const painter = painters.find((item) => item.id === painterId);
  if (!painter) return;
  state.selected = painter.id;
  render();
  document.querySelector("#notebook")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document.querySelector(".dossier")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function parseStartYear(value) {
  const text = String(value || "");
  const centuryMatch = text.match(/(\d{1,2})(?:st|nd|rd|th)\s+century/i);
  if (centuryMatch) {
    const century = Number(centuryMatch[1]);
    const midpoint = (century - 1) * 100 + 50;
    return /BCE/i.test(text) ? -midpoint : midpoint;
  }
  const match = text.match(/\d{2,4}/);
  if (!match) return 0;
  const year = Number(match[0]);
  return /BCE/i.test(text) ? -year : year;
}

function parseYearRange(value) {
  const text = String(value || "");
  const years = [...text.matchAll(/\d{2,4}/g)].map((match) => Number(match[0]));
  const start = years[0] || 0;
  const end = years[1] || start + 70;
  return { start, end };
}

function yearLabel(year) {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year}`;
}

function timelinePosition(year) {
  const min = -600;
  const max = 1900;
  return Math.max(0, Math.min(100, ((year - min) / (max - min)) * 100));
}

function renderChronology() {
  if (!chronology) return;
  const scaleMarks = [-600, 0, 500, 1000, 1500, 1700, 1900];
  const workItems = collectionWorks.map((work) => {
    const displayWork = translatedCollectionWork(work);
    return {
      kind: "work",
      id: work.id,
      title: displayWork.title,
      subtitle: `${translatedCategory(work.category)} · ${work.date}`,
      year: parseStartYear(work.date)
    };
  });
  const painterItems = painters.map((painter) => {
    const years = parseYearRange(painter.years);
    return {
      kind: "painter",
      id: painter.id,
      title: painter.name,
      subtitle: painter.period,
      start: years.start,
      end: years.end
    };
  });

  chronology.innerHTML = `
    <div class="chronology-canvas">
      <div class="chronology-line"></div>
      ${scaleMarks
        .map(
          (year) => `
            <span class="chronology-mark" style="left: ${timelinePosition(year)}%">
              <i></i>
              <b>${yearLabel(year)}</b>
            </span>
          `
        )
        .join("")}
      ${painterItems
        .map((item, index) => {
          const left = timelinePosition(item.start);
          const right = timelinePosition(item.end);
          return `
            <button type="button" class="life-bar" data-painter-id="${item.id}" style="left: ${left}%; width: ${Math.max(4, right - left)}%; top: ${80 + (index % 5) * 34}px">
              <span>${item.title}</span>
              <small>${item.start}-${item.end}</small>
            </button>
          `;
        })
        .join("")}
      ${workItems
        .map(
          (item, index) => `
            <button type="button" class="work-dot" data-work-id="${item.id}" style="left: ${timelinePosition(item.year)}%; top: ${262 + (index % 4) * 38}px">
              <i></i>
              <span>${item.title}</span>
              <small>${item.subtitle}</small>
            </button>
          `
        )
        .join("")}
    </div>
  `;

  chronology.querySelectorAll("[data-work-id]").forEach((button) => {
    button.addEventListener("click", () => openCollectionWork(button.dataset.workId));
  });
  chronology.querySelectorAll("[data-painter-id]").forEach((button) => {
    button.addEventListener("click", () => openPainter(button.dataset.painterId));
  });
}

function syncDensity() {
  document.body.classList.toggle("is-compact", state.density === "compact");
  if (densityToggle) {
    densityToggle.setAttribute("aria-pressed", String(state.density === "compact"));
    densityToggle.textContent = state.density === "compact" ? t("collection.expanded") : t("collection.compact");
  }
}

function persistSavedStudyIds() {
  localStorage.setItem("ahcrSavedStudyIds", JSON.stringify([...savedStudyIds]));
  if (savedCount) {
    savedCount.textContent = String(savedStudyIds.size);
  }
}

function selectStudyWork(workId) {
  const pool = currentStudyPool();
  const index = pool.findIndex((item) => item.id === workId);
  state.studyIndex = Math.max(0, index);
  state.studyRevealed = false;
}

function toggleStudyWork(workId) {
  if (!workId) return;
  if (savedStudyIds.has(workId)) {
    savedStudyIds.delete(workId);
  } else {
    savedStudyIds.add(workId);
    selectStudyWork(workId);
  }
  persistSavedStudyIds();
  renderCollection();
  renderGreekDetail();
  renderDossier();
  renderStudyCard();
  renderEssayRoom();
}

function renderSavedWorks() {
  if (!savedWorkList) return;
  const savedWorks = collectionWorks.filter((work) => savedStudyIds.has(work.id));

  if (savedWorks.length === 0) {
    savedWorkList.innerHTML = `<p class="saved-empty">${t("study.empty")}</p>`;
    return;
  }

  savedWorkList.innerHTML = savedWorks
    .map(
      (work) => {
        const displayWork = translatedCollectionWork(work);
        return `
        <article class="saved-work-item">
          <button type="button" class="saved-work-open" data-open-saved-work="${work.id}">
            <img src="${work.image}" alt="" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
            <span>
              <strong>${displayWork.title}</strong>
              <small>${work.date} · ${translatedCategory(work.category)}</small>
            </span>
          </button>
          <button type="button" class="saved-work-remove" data-remove-saved-work="${work.id}" aria-label="${t("actions.remove")} ${work.title}">${t("actions.remove")}</button>
        </article>
      `;
      }
    )
    .join("");

  savedWorkList.querySelectorAll("[data-open-saved-work]").forEach((button) => {
    button.addEventListener("click", () => {
      selectStudyWork(button.dataset.openSavedWork);
      renderStudyCard();
      openCollectionWork(button.dataset.openSavedWork);
    });
  });

  savedWorkList.querySelectorAll("[data-remove-saved-work]").forEach((button) => {
    button.addEventListener("click", () => {
      savedStudyIds.delete(button.dataset.removeSavedWork);
      persistSavedStudyIds();
      state.studyIndex = 0;
      state.studyRevealed = false;
      renderCollection();
      renderGreekDetail();
      renderDossier();
      renderStudyCard();
    });
  });
}

function currentStudyPool() {
  const saved = collectionWorks.filter((work) => savedStudyIds.has(work.id));
  return saved.length ? saved : collectionWorks;
}

function currentStudyWork() {
  const pool = currentStudyPool();
  return pool[state.studyIndex % pool.length] || collectionWorks[0];
}

function renderStudyCard() {
  if (!studyCard) return;
  const work = currentStudyWork();
  const displayWork = translatedCollectionWork(work);
  const displayPeriod = translatedPeriodLabel(work);
  const hiddenText = state.studyMode === "image" ? t("study.promptImage") : t("study.promptHook");
  const relatedPainter = findPainterForCollectionWork(work);
  const memoryHook =
    currentLanguage === "zh"
      ? displayWork.questions?.[0] || displayWork.visual?.[0]
      : relatedPainter?.hook || work.questions[0] || work.visual[0];
  const prompt = state.studyMode === "image" ? work.image : memoryHook;
  const answer = `${displayWork.title} (${work.date}) · ${displayPeriod}. ${displayWork.implications}`;

  studyCard.innerHTML = `
    <div class="study-card-media ${state.studyMode === "hook" ? "is-hook" : ""}">
      ${
        state.studyMode === "image"
          ? `<img src="${work.image}" alt="Study prompt artwork" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />`
          : `<p>${prompt}</p>`
      }
    </div>
    <div class="study-card-body">
      <p class="eyebrow">${translatedCategory(work.category)} · ${displayPeriod}</p>
      <h3>${hiddenText}</h3>
      <p class="study-answer ${state.studyRevealed ? "is-revealed" : ""}">${state.studyRevealed ? answer : t("study.hidden")}</p>
      <button type="button" class="inline-action" data-study-open-work="${work.id}">${t("study.openNote")}</button>
      ${
        relatedPainter
          ? `<button type="button" class="inline-action" data-study-open-painter="${relatedPainter.id}">${t("study.openDossier", { name: relatedPainter.name })}</button>`
          : ""
      }
    </div>
  `;

  studyCard.querySelector("[data-study-open-work]")?.addEventListener("click", () => openCollectionWork(work.id));
  studyCard.querySelector("[data-study-open-painter]")?.addEventListener("click", () => openPainter(relatedPainter.id));
  studyModeButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.studyMode === state.studyMode);
  });
  if (saveStudyWork) {
    saveStudyWork.textContent = savedStudyIds.has(work.id) ? t("study.removeCurrent") : t("study.saveCurrent");
  }
  persistSavedStudyIds();
  renderSavedWorks();
}

function renderCollectionFilters() {
  collectionFilters.innerHTML = [
    {
      id: "All",
      label: t("filters.allPeriods"),
      range: t("filters.fullTimeline")
    },
    ...collectionEras.map(translatedEra)
  ]
    .map(
      (era) => `
        <button class="collection-chip ${era.id === state.collectionEra ? "is-selected" : ""}" type="button" data-collection-era="${era.id}">
          <span>${era.label}</span>
          <small>${era.range}</small>
        </button>
      `
    )
    .join("");

  collectionFilters.querySelectorAll(".collection-chip").forEach((button) => {
    button.addEventListener("click", () => {
      state.collectionEra = button.dataset.collectionEra;
      const visible = visibleCollectionWorks();
      if (!visible.some((work) => work.id === state.selectedCollection)) {
        state.selectedCollection = visible[0]?.id || collectionWorks[0].id;
      }
      renderCollectionFilters();
      renderCollection();
    });
  });
}

function renderCollectionCard(work) {
  const saved = savedStudyIds.has(work.id);
  const displayWork = translatedCollectionWork(work);
  return `
    <article class="collection-card ${work.id === state.selectedCollection ? "is-active" : ""}" role="button" tabindex="0" data-collection-id="${work.id}" aria-label="Open ${work.title} collection note">
      <img src="${work.image}" alt="${work.title}" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
      <div class="collection-card-copy">
        <span>${translatedCategory(work.category)}</span>
        <h3>${displayWork.title}</h3>
        <p class="collection-card-meta">${work.date} · ${displayWork.culture}</p>
        <p>${displayWork.context}</p>
        <button type="button" class="save-pill ${saved ? "is-saved" : ""}" data-card-save-work="${work.id}">${saved ? t("actions.saved") : t("actions.save")}</button>
      </div>
    </article>
  `;
}

function renderCollectionGrid() {
  const eras = visibleCollectionEras();
  collectionGrid.innerHTML = eras
    .map(
      (era) => {
        const works = getEraWorks(era);
        const displayEra = translatedEra(era);
        return `
          <section class="era-block" aria-labelledby="era-${era.id}">
            <div class="era-header">
              <div class="era-time">
                <strong>${era.number}</strong>
                <span>${era.range}</span>
              </div>
              <div>
                <h3 id="era-${era.id}">${displayEra.label}</h3>
                <p>${displayEra.summary}</p>
                <small>${mediumSummary(works)}</small>
              </div>
            </div>
            <div class="era-work-grid">
              ${works.map(renderCollectionCard).join("")}
            </div>
          </section>
        `;
      }
    )
    .join("");

  collectionGrid.querySelectorAll(".collection-card").forEach((card) => {
    const openCollectionWork = () => {
      state.selectedCollection = card.dataset.collectionId;
      const work = collectionWorks.find((item) => item.id === state.selectedCollection);
      if (work?.periodId) {
        document
          .querySelector(`#era-${work.periodId}`)
          ?.closest(".era-block")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      renderCollection();
      collectionDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    card.addEventListener("click", openCollectionWork);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCollectionWork();
      }
    });
  });

  collectionGrid.querySelectorAll("[data-card-save-work]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleStudyWork(button.dataset.cardSaveWork);
    });
  });
}

function renderCollectionDetail() {
  const work = collectionWorks.find((item) => item.id === state.selectedCollection) || collectionWorks[0];
  const displayWork = translatedCollectionWork(work);
  const displayPeriod = translatedPeriodLabel(work);
  const painter = findPainterForCollectionWork(work);
  collectionDetail.innerHTML = `
    <img src="${work.image}" alt="${work.title}" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
    <div class="collection-detail-body">
      <p class="eyebrow">${work.periodNumber} · ${displayPeriod} · ${translatedCategory(work.category)}</p>
      <h3>${displayWork.title}</h3>
      <p class="collection-detail-meta">${work.date} · ${displayWork.culture}</p>
      <div class="detail-actions">
        ${
          painter
            ? `<button type="button" class="inline-action" data-open-painter-id="${painter.id}">${t("study.openDossier", { name: painter.name })}</button>`
            : ""
        }
        <button type="button" class="inline-action" data-ask-about-work="${work.id}">${t("actions.askHistorian")}</button>
        <button type="button" class="inline-action" data-save-work="${work.id}">${savedStudyIds.has(work.id) ? t("actions.savedReview") : t("actions.saveReview")}</button>
      </div>
      <section>
        <strong>${t("detail.background")}</strong>
        <p>${displayWork.context}</p>
      </section>
      <section>
        <strong>${t("detail.visual")}</strong>
        <ul>${listItems(displayWork.visual)}</ul>
      </section>
      <section>
        <strong>${t("detail.implications")}</strong>
        <p>${displayWork.implications}</p>
      </section>
      <section>
        <strong>${t("detail.questions")}</strong>
        <ul>${listItems(displayWork.questions)}</ul>
      </section>
      <a href="${work.sourceUrl}" target="_blank" rel="noreferrer">${t("detail.source")}: ${work.source}</a>
    </div>
  `;

  collectionDetail.querySelector("[data-open-painter-id]")?.addEventListener("click", (event) => {
    openPainter(event.currentTarget.dataset.openPainterId);
  });
  collectionDetail.querySelector("[data-ask-about-work]")?.addEventListener("click", () => {
    openCafeRoom();
    if (historianQuestion) {
      historianQuestion.value = `Explain ${work.title} through context, visual analysis, and implications.`;
      historianQuestion.focus();
    }
  });
  collectionDetail.querySelector("[data-save-work]")?.addEventListener("click", () => {
    toggleStudyWork(work.id);
    document.querySelector("#study-room")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderCollection() {
  const visible = visibleCollectionWorks();
  if (!visible.some((work) => work.id === state.selectedCollection)) {
    state.selectedCollection = visible[0]?.id || collectionWorks[0].id;
  }
  renderCollectionGrid();
  renderCollectionDetail();
  renderStudyCard();
}

function renderActiveChips() {
  document.querySelectorAll(".chip").forEach((chip) => {
    const type = chip.dataset.period ? "period" : "country";
    chip.classList.toggle("is-selected", chip.dataset[type] === state[type]);
  });
}

function render() {
  renderActiveChips();
  renderTimeline();
  renderDossier();
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  render();
});

resetButton.addEventListener("click", () => {
  state.period = "All";
  state.country = "All";
  state.query = "";
  searchInput.value = "";
  render();
});

document.querySelector("#open-manet")?.addEventListener("click", () => {
  state.selected = "manet";
  state.period = "All";
  state.country = "All";
  state.query = "";
  searchInput.value = "";
  render();
  document.querySelector("#notebook").scrollIntoView({ behavior: "smooth" });
});

const cafeRoom = document.querySelector("#cafe-room");
const essayRoom = document.querySelector("#essay-room");
const mapRoom = document.querySelector("#map-room");
const museumFloorMap = document.querySelector("#museum-floor-map");
const coffeeChoices = document.querySelectorAll(".coffee-choice");
const coffeeTicket = document.querySelector(".coffee-ticket");
const coffeeOrderName = document.querySelector("#coffee-order-name");
const coffeeOrderNote = document.querySelector("#coffee-order-note");
const coffeeStatus = document.querySelector("#coffee-status");
const buyCoffee = document.querySelector("#buy-coffee");
const chatLog = document.querySelector("#chat-log");
const historianChatForm = document.querySelector("#historian-chat-form");
const historianQuestion = document.querySelector("#historian-question");
const essayRoomButton = document.querySelector("#essay-room-button");
const essayModeButtons = document.querySelectorAll("[data-essay-mode]");
const essayArtworkCard = document.querySelector("#essay-artwork-card");
const essayTaskKicker = document.querySelector("#essay-task-kicker");
const essayTaskTitle = document.querySelector("#essay-task-title");
const essayTaskPrompt = document.querySelector("#essay-task-prompt");
const essayNewTask = document.querySelector("#essay-new-task");
const essayThesis = document.querySelector("#essay-thesis");
const essayDraft = document.querySelector("#essay-draft");
const essayWordCount = document.querySelector("#essay-word-count");
const essaySubmitResponse = document.querySelector("#essay-submit-response");
const essayClearResponse = document.querySelector("#essay-clear-response");
const essayFeedback = document.querySelector("#essay-feedback");
const essaySavedNote = document.querySelector("#essay-saved-note");

const coffeeNotes = {
  Latte: "A silky bowl of milk and crema for looking carefully at marble, myth, and brushwork.",
  "Hot Chocolate": "Dark cocoa, soft cream, and a slower kind of thinking for difficult paintings.",
  Espresso: "A sharp little shot for Baroque drama, Manet scandals, and fast visual analysis.",
  Tea: "A quieter pot for Gothic light, Renaissance line, and long museum wandering."
};

function drinkSlug(drink) {
  return String(drink || "latte").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const chatHistory = [];

const conceptGuides = [
  {
    label: "modernity",
    keywords: ["modern", "modernity", "modernism", "manet", "olympia", "city", "paris", "scandal", "realism"],
    works: ["olympia-collection", "eiffel-tower", "starry-night-collection"],
    response:
      "For modernity, look for art becoming honest about its own time. Manet makes the nude socially specific instead of mythological; the Eiffel Tower makes exposed engineering into a public image; Van Gogh makes inner intensity more truthful than optical calm."
  },
  {
    label: "the body",
    keywords: ["body", "nude", "venus", "aphrodite", "kouros", "david", "figure", "ideal", "beauty", "human"],
    works: ["kouros-collection", "aphrodite-knidos-collection", "michelangelo-david"],
    response:
      "When art history studies the body, it is rarely just anatomy. The body can be civic ideal, divine beauty, erotic gaze, political courage, or psychological pressure."
  },
  {
    label: "architecture and space",
    keywords: ["architecture", "building", "space", "temple", "cathedral", "dome", "columns", "light", "structure"],
    works: ["parthenon-collection", "pantheon", "hagia-sophia", "chartres"],
    response:
      "Architecture answers with space. Ask how the building controls your body: procession at the Parthenon, cosmic interior at the Pantheon, floating light at Hagia Sophia, teaching-through-glass at Chartres."
  },
  {
    label: "Gothic",
    keywords: ["gothic", "medieval", "chartres", "cathedral", "stained", "glass", "portal", "light"],
    works: ["chartres", "chartres-portal", "wilton-diptych"],
    response:
      "Gothic art is not dark or primitive; it is an intelligent system of height, light, sculpture, ritual, and public teaching. The cathedral turns belief into a spatial experience."
  },
  {
    label: "Renaissance",
    keywords: ["renaissance", "humanism", "botticelli", "michelangelo", "david", "bramante", "perspective", "classical"],
    works: ["birth-of-venus-collection", "bramante-tempietto", "michelangelo-david"],
    response:
      "Renaissance art often asks how antiquity can be reborn for a new social world. Look for measured form, classical reference, ideal bodies, and human presence treated as intellectually serious."
  },
  {
    label: "Baroque",
    keywords: ["baroque", "bernini", "velazquez", "drama", "theater", "emotion", "movement", "power"],
    works: ["ecstasy-teresa", "san-carlo", "las-meninas-collection"],
    response:
      "Baroque art is built to move you. It uses theatrical light, unstable space, bodily intensity, and staged spectatorship so belief and power feel immediate."
  },
  {
    label: "painting surface",
    keywords: ["painting", "brush", "brushwork", "flat", "surface", "color", "line", "composition", "visual"],
    works: ["birth-of-venus-collection", "olympia-collection", "starry-night-collection"],
    response:
      "Painting often thinks through surface. Botticelli makes line poetic, Manet makes flatness socially blunt, and Van Gogh makes brushstroke carry feeling."
  },
  {
    label: "power",
    keywords: ["power", "political", "empire", "king", "city", "public", "state", "authority", "social"],
    works: ["parthenon-collection", "pantheon", "las-meninas-collection", "olympia-collection"],
    response:
      "Art handles power by making it visible and natural. Temples, courts, portraits, and even scandalous modern paintings all ask who gets seen, who commands space, and who controls looking."
  }
];

function openCafeRoom() {
  if (!cafeRoom) return;
  cafeRoom.hidden = false;
  cafeRoom.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openEssayRoom() {
  if (!essayRoom) return;
  essayRoom.hidden = false;
  renderEssayRoom();
  essayRoom.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#essay-thesis")?.focus();
}

function essayWordTotal(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return 0;
  const spacedWords = trimmed.match(/[\p{L}\p{N}'-]+/gu) || [];
  const cjkCharacters = trimmed.match(/[\u3400-\u9fff]/g) || [];
  return Math.max(spacedWords.length, Math.ceil(cjkCharacters.length / 2));
}

function updateEssayWordCount() {
  if (!essayWordCount || !essayDraft) return;
  essayWordCount.textContent = String(essayWordTotal(essayDraft.value));
}

function essayPracticePool() {
  const saved = collectionWorks.filter((work) => savedStudyIds.has(work.id));
  return state.essayMode === "essay" && saved.length ? saved : collectionWorks;
}

function currentEssayWork() {
  const pool = essayPracticePool();
  const index = state.essayMode === "visual" ? state.essayVisualIndex : state.essayQuestionIndex;
  return pool[index % pool.length] || collectionWorks[0];
}

function essayQuestionForWork(work) {
  const displayWork = translatedCollectionWork(work);
  const questions = displayWork.questions?.length ? displayWork.questions : work.questions;
  return questions[state.essayQuestionIndex % questions.length] || `Why does ${displayWork.title} matter?`;
}

function renderEssayRoom({ keepDraft = true } = {}) {
  if (!essayRoom) return;
  const work = currentEssayWork();
  const displayWork = translatedCollectionWork(work);
  const isEssayMode = state.essayMode === "essay";
  const savedCountForEssay = collectionWorks.filter((item) => savedStudyIds.has(item.id)).length;

  essayModeButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.essayMode === state.essayMode);
  });

  if (essayArtworkCard) {
    essayArtworkCard.innerHTML = `
      <img src="${work.image}" alt="${displayWork.title}" loading="lazy" style="object-position: ${work.imagePosition || "center center"}" />
      <figcaption>${displayWork.title} · ${work.date}</figcaption>
    `;
  }

  if (essayTaskKicker) {
    essayTaskKicker.textContent = isEssayMode ? "Essay practice" : "Visual analysis practice";
  }
  if (essayTaskTitle) {
    essayTaskTitle.textContent = isEssayMode ? essayQuestionForWork(work) : `Visual analysis: ${displayWork.title}`;
  }
  if (essayTaskPrompt) {
    essayTaskPrompt.textContent = isEssayMode
      ? "Answer the question using the saved artwork as your anchor. Build a claim, use visual evidence, add context, and end with implication."
      : "Write a close visual analysis. Begin with what is visible: composition, light, body, surface, material, space, gesture, color, scale. Then explain how those choices create meaning.";
  }
  if (essaySavedNote) {
    essaySavedNote.textContent =
      savedCountForEssay > 0
        ? `Essay mode is using your ${savedCountForEssay} saved study artwork${savedCountForEssay === 1 ? "" : "s"}.`
        : "Essay mode will use your saved study artworks. Save a work first to make the questions personal; until then, it uses the whole collection.";
  }
  if (essayDraft && !keepDraft) {
    essayDraft.value = "";
  }
  if (essayThesis && !keepDraft) {
    essayThesis.value = "";
  }
  if (essayFeedback && !keepDraft) {
    essayFeedback.hidden = true;
    essayFeedback.innerHTML = "";
  }
  updateEssayWordCount();
}

function nextEssayTask() {
  const pool = essayPracticePool();
  if (state.essayMode === "visual") {
    state.essayVisualIndex = (state.essayVisualIndex + 1) % pool.length;
  } else {
    state.essayQuestionIndex = (state.essayQuestionIndex + 1) % pool.length;
  }
  renderEssayRoom({ keepDraft: false });
}

function scoreEssayResponse(work, mode, thesis, response) {
  const displayWork = translatedCollectionWork(work);
  const text = `${thesis} ${response}`.toLowerCase();
  const words = essayWordTotal(response);
  const visualTerms = [
    "line",
    "color",
    "colour",
    "composition",
    "space",
    "scale",
    "light",
    "shadow",
    "surface",
    "texture",
    "body",
    "gesture",
    "gaze",
    "material",
    "brushwork",
    "form",
    "proportion",
    "perspective",
    "构图",
    "色彩",
    "线条",
    "空间",
    "光",
    "身体",
    "凝视",
    "表面",
    "比例"
  ];
  const contextTerms = [
    normalizeText(translatedPeriodLabel(work)),
    normalizeText(displayWork.culture),
    normalizeText(displayWork.category),
    "context",
    "society",
    "political",
    "religious",
    "modern",
    "history",
    "语境",
    "社会",
    "政治",
    "宗教",
    "历史",
    "现代"
  ].filter(Boolean);
  const titleTokens = normalizeText(displayWork.title).split(/\s+/).filter((token) => token.length > 2);
  const visualHits = visualTerms.filter((term) => text.includes(term)).length;
  const contextHits = contextTerms.filter((term) => text.includes(term)).length;
  const titleHits = titleTokens.filter((term) => normalizeText(text).includes(term)).length;
  const hasThesis = essayWordTotal(thesis) >= 6 || /\b(argue|because|therefore|shows|reveals|matters)\b|因为|说明|揭示|重要/.test(text);
  const hasImplication = /\bmatters|implies|therefore|reveals|shows|changes|means|significant|重要|意味着|说明|揭示|因此/.test(text);

  const lengthScore = words >= 180 ? 2 : words >= 100 ? 1.5 : words >= 55 ? 1 : words >= 25 ? 0.5 : 0;
  const visualScore = Math.min(3, visualHits * 0.75);
  const specificityScore = Math.min(2, titleHits * 0.8 + (text.includes(normalizeText(displayWork.title)) ? 0.8 : 0));
  const argumentScore = hasThesis ? 2 : 0.5;
  const contextScore = Math.min(1, contextHits * 0.4);
  const implicationScore = hasImplication ? 1 : 0;
  const rawScore =
    mode === "visual"
      ? lengthScore + visualScore + specificityScore + argumentScore + implicationScore
      : lengthScore + visualScore + specificityScore + argumentScore + contextScore + implicationScore;
  const score = Math.max(1, Math.min(10, Math.round(rawScore * 10) / 10));

  const feedback = [];
  if (words < 80) feedback.push("Write more. A marked response needs enough sentences for evidence, interpretation, and implication.");
  if (visualHits < 3) feedback.push("Add more visual vocabulary: line, color, light, composition, surface, body, space, scale, or material.");
  if (!hasThesis) feedback.push("Make the thesis sharper. Do not only describe; say what the work is doing or arguing.");
  if (mode === "essay" && contextHits < 2) feedback.push("Add historical or social context so the answer does not float away from the period.");
  if (!hasImplication) feedback.push("End by saying why the analysis matters.");
  if (feedback.length === 0) {
    feedback.push("Strong structure. Next improvement: use one more precise detail from the image and connect it to the larger historical claim.");
  }

  return {
    score,
    band:
      score >= 8
        ? "Strong"
        : score >= 6.5
          ? "Promising"
          : score >= 5
            ? "Developing"
            : "Needs more evidence",
    words,
    feedback
  };
}

function submitEssayResponse() {
  if (!essayFeedback || !essayDraft) return;
  const work = currentEssayWork();
  const displayWork = translatedCollectionWork(work);
  const result = scoreEssayResponse(work, state.essayMode, essayThesis?.value || "", essayDraft.value);
  essayFeedback.hidden = false;
  essayFeedback.innerHTML = `
    <h3>${result.band}: ${result.score} / 10</h3>
    <p><strong>${displayWork.title}</strong> · ${result.words} words · ${state.essayMode === "visual" ? "visual analysis" : "essay"}</p>
    <ul>${result.feedback.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

function openMapRoom() {
  if (!mapRoom) return;
  mapRoom.hidden = false;
  renderMuseumFloorMap();
  mapRoom.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCollectionEra(eraId) {
  state.collectionEra = eraId;
  const era = collectionEras.find((item) => item.id === eraId);
  if (era?.workIds[0]) {
    state.selectedCollection = era.workIds[0];
  }
  renderCollectionFilters();
  renderCollection();
  document.querySelector("#collection-atlas").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCollectionWork(workId) {
  const work = collectionWorks.find((item) => item.id === workId);
  if (!work) return;
  state.collectionEra = work.periodId || "All";
  state.selectedCollection = work.id;
  renderCollectionFilters();
  renderCollection();
  document.querySelector("#collection-atlas").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document
      .querySelector(`#era-${work.periodId}`)
      ?.closest(".era-block")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    collectionDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 80);
}

function renderMuseumFloorMap() {
  if (!museumFloorMap) return;
  museumFloorMap.innerHTML = collectionEras
    .map((era, index) => {
      const works = getEraWorks(era);
      const displayEra = translatedEra(era);
      return `
        <button type="button" class="map-room-card" data-era-id="${era.id}" data-era-index="${index}" aria-label="Open ${era.label}">
          <div>
            <strong>${era.number}</strong>
            <h3>${displayEra.label}</h3>
            <p>${era.range}</p>
          </div>
          <small>${mediumSummary(works)}</small>
        </button>
      `;
    })
    .join("");

  museumFloorMap.querySelectorAll(".map-room-card").forEach((card) => {
    card.addEventListener("click", () => openCollectionEra(card.dataset.eraId));
  });
}

function addChatMessage(speaker, text, type = "historian") {
  if (!chatLog) return;
  const message = document.createElement("article");
  const speakerLabel = document.createElement("strong");
  const body = document.createElement("p");
  message.className = `chat-message ${type}`;
  speakerLabel.textContent = speaker;
  body.textContent = text;
  message.append(speakerLabel, body);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
  return body;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

function questionTokens(question) {
  return normalizeText(question)
    .split(/\s+/)
    .map((token) => {
      const synonyms = {
        building: "architecture",
        buildings: "architecture",
        statue: "sculpture",
        statues: "sculpture",
        naked: "nude",
        sex: "nude",
        woman: "body",
        women: "body",
        church: "cathedral",
        churches: "cathedral",
        ai: "question"
      };
      return synonyms[token] || token;
    })
    .filter(
      (token) =>
        token.length > 2 &&
        !["the", "and", "for", "what", "why", "how", "does", "this", "that", "tell", "about", "explain"].includes(token)
    );
}

function collectionSearchItems() {
  const objectItems = collectionWorks.map((work) => ({
    ...work,
    display: translatedCollectionWork(work)
  })).map(({ display, ...work }) => ({
    type: "object",
    title: display.title,
    period: translatedPeriodLabel(work),
    date: work.date,
    medium: translatedCategory(work.category),
    context: display.context,
    visual: display.visual,
    implications: display.implications,
    questions: display.questions,
    haystack: [
      work.title,
      display.title,
      work.period,
      translatedPeriodLabel(work),
      work.date,
      work.culture,
      display.culture,
      work.category,
      translatedCategory(work.category),
      work.context,
      display.context,
      work.visual.join(" "),
      display.visual.join(" "),
      work.implications,
      display.implications,
      work.questions.join(" "),
      display.questions.join(" ")
    ].join(" ")
  }));

  const painterItems = painters.flatMap((painter) =>
    painter.works.map((work) => ({
      type: "painter",
      title: `${painter.name}, ${work.title}`,
      period: painter.period,
      date: work.date,
      medium: "Painting",
      context: [...work.context, painter.position].join(" "),
      visual: work.visual,
      implications: work.exam,
      questions: [
        `How does ${work.title} express ${painter.period}?`,
        `What does ${painter.name}'s technique make visible?`
      ],
      haystack: [
        painter.name,
        painter.period,
        painter.country,
        painter.movement,
        painter.hook,
        painter.position,
        work.title,
        work.date,
        work.visual.join(" "),
        work.context.join(" "),
        work.exam
      ].join(" ")
    }))
  );

  return [...objectItems, ...painterItems];
}

function rankedArtMatches(question) {
  const tokens = questionTokens(question);
  if (tokens.length === 0) return [];
  return collectionSearchItems()
    .map((item) => {
      const haystack = normalizeText(item.haystack);
      const title = normalizeText(item.title);
      const score = tokens.reduce((total, token) => {
        if (title.includes(token)) return total + 5;
        if (haystack.includes(token)) return total + 1;
        if (token.length > 4 && haystack.includes(token.slice(0, -1))) return total + 0.5;
        return total;
      }, 0);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function rankedConceptGuides(question) {
  const tokens = questionTokens(question);
  const normalized = normalizeText(question);
  return conceptGuides
    .map((guide) => {
      const guideLabel = normalizeText(guide.label);
      const labelScore = normalized.includes(guideLabel) ? 6 : 0;
      const score = guide.keywords.reduce((total, keyword) => {
        if (tokens.includes(keyword)) return total + 4;
        if (normalized.includes(keyword)) return total + 3;
        if (tokens.some((token) => keyword.includes(token) || token.includes(keyword))) return total + 1;
        return total;
      }, labelScore);
      return { ...guide, score };
    })
    .filter((guide) => guide.score > 0)
    .sort((a, b) => b.score - a.score);
}

function conceptImplication(guide) {
  const implications = {
    modernity:
      "The implication is that modern art often stops pretending to be timeless; it shows the conditions of modern life, including money, technology, alienation, and the act of looking.",
    "the body":
      "The implication is that the body is a cultural argument. Each period decides what kind of body can stand for beauty, virtue, divinity, desire, or thought.",
    "architecture and space":
      "The implication is that architecture is not background. It scripts movement, frames authority, and turns belief or power into something you physically enter.",
    Gothic:
      "The implication is that Gothic art makes theology environmental: stone, glass, sculpture, height, and colored light work together as one public teaching system.",
    Renaissance:
      "The implication is that Renaissance artists use antiquity to invent a new dignity for human presence, not simply to copy old forms.",
    Baroque:
      "The implication is that Baroque art wants to persuade through experience: it uses motion, light, and theatrical pressure to make belief feel immediate.",
    "painting surface":
      "The implication is that painting can think through its own material surface. Brushwork, flatness, line, and color are not decoration; they are arguments.",
    power:
      "The implication is that power becomes more convincing when it is made visible as beauty, order, ceremony, scale, or even scandal."
  };
  return implications[guide.label] || "The implication is that style is a way of organizing belief, power, desire, or attention.";
}

function buildArtContext(question) {
  return rankedArtMatches(question)
    .map(
      (item) => `
Title: ${item.title}
Period/date: ${item.period || "Unknown"} / ${item.date}
Medium: ${item.medium}
Historical context: ${item.context}
Visual analysis: ${item.visual.join(" ")}
Implications: ${item.implications}
Further questions: ${item.questions.join(" ")}
`
    )
    .join("\n---\n");
}

function localArtHistorianReply(question) {
  const matches = rankedArtMatches(question);
  const guides = rankedConceptGuides(question);
  const guide = guides[0];
  const isGreeting = /^(hi|hello|hey|hiya|bonjour|你好|嗨)\b/i.test(question.trim());
  const isChinese = currentLanguage === "zh";

  if (isGreeting) {
    if (isChinese) {
      return "欢迎回到公共书房。你可以问我一件作品、一个时代，或一个很具体的视觉问题。比如：为什么《奥林匹亚》显得现代？哥特式教堂为什么那么重视光？希腊雕塑为什么会显得理想化？";
    }
    return "Welcome back to the common room. Ask me about one object, one period, or one visual problem. For example: why is Olympia modern, why do Gothic cathedrals use so much light, or how does Greek sculpture idealize the body?";
  }

  if (guide) {
    const guideWorks = guide.works
      .map((id) => collectionWorks.find((work) => work.id === id))
      .filter(Boolean)
      .slice(0, 3);
    const examples = guideWorks.map((work) => `${work.title} (${work.date})`).join("; ");
    const visualAnchor = guideWorks[0]?.visual[0] || matches[0]?.visual[0] || "Start by describing what your eye actually sees before interpreting it.";
    const questionPrompt =
      guideWorks[0]?.questions[0] || "What does this object make visible that its culture needed to think about?";
    return `${guide.response} In this collection, start with ${examples}. Visually, ${visualAnchor} ${conceptImplication(guide)} Follow-up question: ${questionPrompt}`;
  }

  if (matches.length === 0) {
    const sample = collectionWorks[Math.floor(Math.random() * collectionWorks.length)];
    if (isChinese) {
      const displaySample = translatedCollectionWork(sample);
      return `我现在没有找到非常贴近的问题匹配，但可以先把问题落到一件可见的作品上。比如从${displaySample.title}开始问：${displaySample.questions[0]} 然后用三层回答：历史语境、视觉证据、意义影响。`;
    }
    return `I do not have a close match yet, but here is a useful way in: turn the question toward a visible object. For example, with ${sample.title}, ask: ${sample.questions[0]} Then answer through three layers: historical context, visual evidence, and implication.`;
  }

  const primary = matches[0];
  const second = matches[1];
  const visualPoint = primary.visual[0];
  const comparison = second ? ` You can compare it with ${second.title}, because both sit near the question but solve it through different visual choices.` : "";
  const method =
    primary.medium === "Architecture"
      ? "Notice how the work choreographs your body in space."
      : primary.medium === "Sculpture"
        ? "Notice how mass, pose, and surface turn an idea into a body."
        : "Notice how surface, color, composition, and gaze organize attention.";
  if (isChinese) {
    const comparison = second ? ` 你也可以把它和${second.title}比较，因为它们接近同一个问题，却用不同的视觉方式解决。` : "";
    const method =
      primary.medium === "建筑"
        ? "注意它如何安排人的身体在空间中移动。"
        : primary.medium === "雕塑"
          ? "注意体量、姿态和表面如何把观念变成身体。"
          : "注意画面表面、色彩、构图和凝视如何组织注意力。";
    return `我会先从${primary.title}（${primary.period}，${primary.date}）入手。历史上，${primary.context} 视觉上，${primary.visual[0]} ${method} 它的意义是：${primary.implications}${comparison} 更好的追问可以是：${primary.questions[0]}`;
  }
  return `I would start with ${primary.title} (${primary.period}, ${primary.date}). Historically, ${primary.context} Visually, ${visualPoint} ${method} The implication is: ${primary.implications}${comparison} A better next question would be: ${primary.questions[0]}`;
}

async function artHistorianReply(question) {
  const context = buildArtContext(question);
  const fallbackPrefix =
    currentLanguage === "zh"
      ? "真人工智能还没有连接成功，所以我先用馆内笔记给你一个临时回答。要让它真正像 AI 一样回答，需要在 Vercel 里配置 OPENAI_API_KEY。"
      : currentLanguage === "fr"
        ? "L'IA réelle n'est pas encore connectée; j'utilise donc une réponse provisoire à partir des notes du site. Pour activer le vrai mode IA, ajoutez OPENAI_API_KEY dans Vercel."
        : "The real AI connection is not active yet, so I am using the site's local notes for this temporary answer. To make this truly AI-powered, add OPENAI_API_KEY in Vercel.";

  if (window.location.protocol === "file:") {
    return `${fallbackPrefix}\n\n${localArtHistorianReply(question)}`;
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        context,
        drink: coffeeOrderName?.textContent || "coffee",
        history: chatHistory.slice(-6),
        language: currentLanguage
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Chat API returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.answer) {
      throw new Error("Chat API returned no answer");
    }
    return data.answer;
  } catch {
    return `${fallbackPrefix}\n\n${localArtHistorianReply(question)}`;
  }
}

document.querySelector("#have-coffee")?.addEventListener("click", openCafeRoom);
essayRoomButton?.addEventListener("click", openEssayRoom);

essayModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.essayMode = button.dataset.essayMode === "essay" ? "essay" : "visual";
    renderEssayRoom({ keepDraft: false });
  });
});

essayNewTask?.addEventListener("click", nextEssayTask);

essayDraft?.addEventListener("input", updateEssayWordCount);

essayClearResponse?.addEventListener("click", () => {
  if (essayDraft) essayDraft.value = "";
  if (essayThesis) essayThesis.value = "";
  if (essayFeedback) {
    essayFeedback.hidden = true;
    essayFeedback.innerHTML = "";
  }
  updateEssayWordCount();
});

essaySubmitResponse?.addEventListener("click", submitEssayResponse);

coffeeChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const drink = choice.dataset.drink;
    coffeeChoices.forEach((button) => button.classList.toggle("is-selected", button === choice));
    if (coffeeTicket) {
      coffeeTicket.dataset.drink = drinkSlug(drink);
    }
    coffeeOrderName.textContent = drink;
    coffeeOrderNote.textContent = coffeeNotes[drink];
    coffeeStatus.textContent = "";
  });
});

buyCoffee?.addEventListener("click", () => {
  const drink = coffeeOrderName?.textContent || "coffee";
  coffeeStatus.textContent = `${drink} ordered. The art historian has pulled up a chair.`;
  historianQuestion?.focus();
});

historianChatForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = historianQuestion.value.trim();
  if (!question) return;
  addChatMessage("You", question, "guest");
  chatHistory.push({ role: "user", content: question });
  historianQuestion.value = "";
  const replyNode = addChatMessage("Art historian", "Reading the room notes...", "historian");
  const answer = await artHistorianReply(question);
  replyNode.textContent = answer;
  chatHistory.push({ role: "assistant", content: answer });
});

document.querySelector("#museum-map")?.addEventListener("click", openMapRoom);

function exploreRandomArtwork() {
  const randomWork = collectionWorks[Math.floor(Math.random() * collectionWorks.length)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!exploreTunnel || prefersReducedMotion) {
    openCollectionWork(randomWork.id);
    return;
  }

  if (tunnelWorkTitle) {
    tunnelWorkTitle.textContent = randomWork.title;
  }
  exploreTunnel.style.setProperty("--tunnel-image", `url("${randomWork.image}")`);
  exploreTunnel.classList.add("is-active");
  document.body.classList.add("is-exploring");

  window.setTimeout(() => {
    openCollectionWork(randomWork.id);
  }, 1040);

  window.setTimeout(() => {
    exploreTunnel.classList.remove("is-active");
    document.body.classList.remove("is-exploring");
  }, 1760);
}

document.querySelector("#explore-random")?.addEventListener("click", () => {
  exploreRandomArtwork();
});

document.querySelectorAll("[data-nav-room]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.navRoom === "cafe") {
      openCafeRoom();
    }
    if (button.dataset.navRoom === "map") {
      openMapRoom();
    }
  });
});

densityToggle?.addEventListener("click", () => {
  state.density = state.density === "compact" ? "expanded" : "compact";
  localStorage.setItem("ahcrCardDensity", state.density);
  syncDensity();
});

studyModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.studyMode = button.dataset.studyMode;
    state.studyRevealed = false;
    renderStudyCard();
  });
});

saveStudyWork?.addEventListener("click", () => {
  const work = currentStudyWork();
  toggleStudyWork(work.id);
});

nextStudyCard?.addEventListener("click", () => {
  const pool = currentStudyPool();
  state.studyIndex = (state.studyIndex + 1) % pool.length;
  state.studyRevealed = false;
  renderStudyCard();
});

revealStudyAnswer?.addEventListener("click", () => {
  state.studyRevealed = true;
  renderStudyCard();
});

languageSelect?.addEventListener("change", (event) => {
  currentLanguage = supportedLanguages.includes(event.target.value) ? event.target.value : "en";
  localStorage.setItem("ahcrLanguage", currentLanguage);
  rerenderLanguageSensitiveUI();
});

renderFilters();
renderGreekWorks();
renderGreekDetail();
renderMuseumFloorMap();
renderCollectionFilters();
renderChronology();
syncDensity();
renderCollection();
render();
applyStaticLanguage();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The site still works without offline support if registration is blocked.
    });
  });
}
