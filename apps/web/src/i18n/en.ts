import type zh from "./zh";

const en: typeof zh = {
  meta: {
    siteName: "The Art Historian's Common Room",
    siteNameEn: "The Art Historian's Common Room"
  },
  top: {
    brand: "AHCR",
    cafe: "Café",
    map: "Map",
    timeline: "Timeline",
    study: "Study Room",
    painters: "Painters",
    workshop: "Workshop",
    me: "My Study",
    login: "Log in",
    top: "Go back to Top",
    language: "Language",
    navLabel: "Jump to room"
  },
  nav: {
    eyebrow: "The Art Historian's Common Room",
    subtitle: "Greek art · period timeline · artists · object notes"
  },
  hero: {
    coffee: "Have a coffee",
    coffeeLabel: "Have a coffee in the common room cafe",
    map: "Museum map",
    mapLabel: "Open the museum map",
    essay: "Essai / essayer",
    essayLabel: "Open the art history essay room",
    explore: "Explore",
    exploreLabel: "Explore a random artwork",
    welcomeLabel: "Welcome in Greek, English, French, and Chinese"
  },
  cafe: {
    eyebrow: "Common room cafe",
    title: "Have a coffee with an art historian",
    intro:
      "Choose a drink, settle into the common room, and ask the resident art historian about any artwork, period, or strange visual detail you noticed.",
    menu: "Coffee menu",
    order: "Today's order",
    buy: "Order this one",
    ordered: "Your {drink} is on the table. Take your time looking and asking.",
    orderNote: "This is part of the scene only — nothing is ordered or charged.",
    ai: "AI art historian",
    askTitle: "Ask across the table",
    open: "Open",
    greeting: "Ask me why Manet felt modern, how Gothic cathedrals teach, or what makes Greek sculpture feel ideal.",
    question: "Question",
    placeholder: "Ask about a work, period, or visual detail...",
    ask: "Ask",
    you: "You",
    historian: "Art historian",
    thinking: "Reading the room notes...",
    sourceAi: "AI answer",
    sourceLocal: "Collection notes",
    notice: {
      not_configured: "The AI service is not switched on yet, so this answer is assembled from the collection notes.",
      quota: "Today's AI questions are used up, so this answer is assembled from the collection notes.",
      upstream_error: "The AI service is unavailable right now, so this answer is assembled from the collection notes."
    },
    networkError: "The connection seems to be down. Please try again shortly.",
    historyHint: "Log in to keep your conversation in your study.",
    clearHistory: "Clear history",
    askWork: "Explain {title} through context, visual analysis, and implications.",
    askPainter: "Explain {name}'s importance through social context, visual evidence, and one memorable artwork."
  },
  map: {
    eyebrow: "Museum map",
    title: "Choose a room by period",
    intro: "A small floor plan of the common room museum. Each room opens the matching period in the timeline.",
    openEra: "Open {label}"
  },
  essay: {
    eyebrow: "Essai / essayer",
    title: "Art history essay room",
    intro:
      "Practice two exam habits: first, close visual analysis from an artwork; second, a short essay question drawn from the works you saved to study.",
    modeLabel: "Essay room mode",
    modeVisual: "Visual analysis",
    modeEssay: "Essay",
    kickerVisual: "Visual analysis practice",
    kickerEssay: "Essay practice",
    titleVisual: "Visual analysis: {title}",
    promptVisual:
      "Write a close visual analysis. Begin with what is visible: composition, light, body, surface, material, space, gesture, color, scale. Then explain how those choices create meaning.",
    promptEssay:
      "Answer the question using the saved artwork as your anchor. Build a claim, use visual evidence, add context, and end with implication.",
    fallbackQuestion: "Why does {title} matter?",
    newTask: "New task",
    thesis: "Working thesis",
    thesisPlaceholder: "This artwork matters because...",
    draft: "Response",
    draftPlaceholder: "Start with what you see. Then move from visual evidence to historical meaning.",
    words: "words",
    clear: "Clear",
    submit: "Get practice feedback",
    moves: "Four moves",
    moveContext: "Context",
    moveContextText: "Who made it, when, where, and for what world?",
    moveVisual: "Visual evidence",
    moveVisualText: "What do line, color, body, space, surface, or scale do?",
    moveArgument: "Argument",
    moveArgumentText: "What claim are you making, not just what facts do you know?",
    moveImplication: "Implication",
    moveImplicationText: "What changes when we understand the work this way?",
    savedNoteSome: "Essay mode is using your {count} saved study artwork(s).",
    savedNoteNone:
      "Essay mode will use your saved study artworks. Save a work first to make the questions personal; until then, it uses the whole collection.",
    feedbackTitle: "{band}: {score} / 10",
    feedbackMeta: "{title} · {words} words · {mode}",
    feedbackDisclaimer:
      "Practice guidance from local rules (length, visual vocabulary, thesis and implication cues). It is not AI marking and not an exam grade.",
    band: {
      strong: "Strong",
      promising: "Promising",
      developing: "Developing",
      needsEvidence: "Needs more evidence"
    },
    feedback: {
      length: "Write more. A marked response needs enough sentences for evidence, interpretation, and implication.",
      visual: "Add more visual vocabulary: line, color, light, composition, surface, body, space, scale, or material.",
      thesis: "Make the thesis sharper. Do not only describe; say what the work is doing or arguing.",
      context: "Add historical or social context so the answer does not float away from the period.",
      implication: "End by saying why the analysis matters.",
      strong:
        "Strong structure. Next improvement: use one more precise detail from the image and connect it to the larger historical claim."
    },
    save: {
      local: "Draft saved on this device only",
      saving: "Saving…",
      saved: "Saved to your account",
      failed: "Couldn't save — your text is still on this page"
    },
    submitToAuthor: "Ask the author to look",
    submitIntro:
      "Send the current version of this practice to the author. The author replies around one specific observation; editing your draft afterwards won't change the submitted version.",
    helpRequested: "What would you most like help with? (optional)",
    helpPlaceholder: "e.g. Is my visual evidence specific enough?",
    preview: "Preview",
    confirmSubmit: "Confirm and send",
    cancel: "Cancel",
    submitted: "Sent. You'll find the author's reply in My Study.",
    loginToSubmit: "Log in to send this to the author. Your draft stays on this device.",
    submissionsClosed: "The author isn't taking new submissions right now. Your draft is still saved.",
    pendingExists: "You already have a submission waiting for a reply. You can send another after it's answered.",
    bodyTooShort: "That's a little short — write a few full sentences of observation first."
  },
  greek: {
    eyebrow: "Room 1",
    title: "Greek Art: the first gallery",
    intro:
      "Start here as the guided opening room. The full period timeline below keeps the complete index; this room slows down the first encounter with body, temple, myth, civic ritual, and the long conversation between realism and ideal form.",
    note: "Greek object note",
    look: "Look for",
    why: "Why it matters",
    openNotes: "Open {title} notes"
  },
  collection: {
    eyebrow: "Period timeline",
    title: "Art history by era, not by medium",
    intro:
      "The timeline mixes painting, sculpture, and architecture in each period. The painter notebook below is a focused painting archive; linked works move between the two.",
    compact: "Compact cards",
    expanded: "Expanded cards",
    periods: "Timeline periods",
    openNote: "Open {title} collection note",
    openPage: "Open work page",
    category: {
      painting: "Painting",
      sculpture: "Sculpture",
      architecture: "Architecture"
    }
  },
  chronology: {
    eyebrow: "Horizontal chronology",
    title: "Who overlaps with what?",
    intro: "Works are points; painters are lifespan bars. Tap any marker to jump into the matching note or dossier.",
    label: "Horizontal art history timeline",
    bce: "{year} BCE"
  },
  study: {
    eyebrow: "Memory room",
    title: "Turn looking into recall",
    intro:
      "Use the existing memory hooks, images, and visual notes as a small learning loop: save objects, flip a card, then ask the art historian why the answer matters.",
    modeLabel: "Study mode",
    modeImage: "Image to work",
    modeHook: "Hook to work",
    list: "Learning list",
    savedTitle: "Saved for review",
    savedLineGuest: "works saved on this device.",
    savedLineUser: "works saved to your account.",
    saveCurrent: "Save current",
    removeCurrent: "Remove current",
    next: "Next card",
    reveal: "Reveal answer",
    empty: "No saved works yet. Use Save for review on an artwork you want to study again.",
    promptImage: "Name this work from the image.",
    promptHook: "Name this work from the memory hook.",
    promptAlt: "Study prompt artwork",
    hidden: "Answer hidden. Try to recall before revealing.",
    openNote: "Open full note",
    openDossier: "Open {name} dossier"
  },
  notebook: {
    find: "Find painter",
    controls: "Timeline controls",
    searchLabel: "Search painter, work, country, movement",
    searchPlaceholder: "Try Manet, Japan, Baroque...",
    periods: "Periods",
    countries: "Countries",
    reset: "Reset filters",
    archive: "Painting archive",
    title: "Painter dossiers linked to the period timeline",
    intro:
      "This archive is painting-focused. When a work also appears in the main period timeline, its note links back to the full mixed-medium context.",
    empty: "No painters match this filter yet. Reset or try a broader search.",
    artAlt: "{title} by {name}"
  },
  filters: {
    all: "All",
    allPeriods: "All periods",
    fullTimeline: "full timeline"
  },
  actions: {
    openTimeline: "See this in the period timeline",
    openComplete: "Open complete timeline note",
    askHistorian: "Ask the art historian",
    save: "Save",
    saved: "Saved",
    saveReview: "Save for review",
    savedReview: "Saved for review",
    remove: "Remove",
    back: "Back",
    previous: "Previous",
    next: "Next",
    writeAbout: "Write about this work"
  },
  detail: {
    background: "Historical / social background",
    visual: "Visual analysis",
    implications: "Implications",
    questions: "Questions for further exploration",
    source: "Source",
    image: "Image",
    imageCredit: "Image: {author} · {license}",
    era: "Period"
  },
  dossier: {
    eyebrow: "Painter dossier",
    movement: "Movement",
    hook: "Memory hook",
    major: "Major works",
    core: "Core painter note",
    workNotes: "Major work notes",
    context: "Context / social commentary",
    openLinked: "Open linked timeline note",
    openPage: "Open dossier page"
  },
  tunnel: {
    caption: "The frame is opening",
    waiting: "A work is waiting"
  },
  auth: {
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters",
    newPassword: "New password",
    code: "Email code",
    sendCode: "Send code",
    resend: "Resend in {seconds}s",
    codeSent: "We've emailed you a code. It expires in 10 minutes.",
    displayName: "What should we call you? (optional)",
    loginTitle: "Log in to your study",
    loginIntro:
      "Once you log in, your saved works, drafts, conversations and the author's replies are kept in your account — on any device.",
    login: "Log in",
    registerTitle: "Create an account",
    registerIntro: "All you need is an email. Browsing never requires an account; logging in keeps your learning in sync.",
    register: "Create account",
    noAccount: "No account yet?",
    toRegister: "Sign up",
    hasAccount: "Already registered?",
    toLogin: "Log in",
    forgot: "Forgot password?",
    resetTitle: "Reset password",
    resetIntro: "Enter your email to get a code, then choose a new password.",
    reset: "Reset and log in",
    logout: "Log out",
    agree: "By signing up you agree to the {terms} and {privacy}.",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    mergedSaved: "Moved {count} saved work(s) from this device into your account.",
    errors: {
      invalid_credentials: "That email and password don't match.",
      account_disabled: "This account has been disabled. Please contact us if you think this is a mistake.",
      email_taken: "That email is already registered — try logging in.",
      code_invalid: "That code is wrong or has expired. Please request a new one.",
      code_cooldown: "Please wait a minute before requesting another code.",
      code_daily_limit: "Too many codes today. Please try again tomorrow.",
      mail_failed: "We couldn't send the email. Please try again shortly.",
      rate_limited: "Too many attempts. Please try again shortly.",
      password_too_short: "Passwords need at least 8 characters.",
      validation_error: "Please check the highlighted fields.",
      network: "Network error. Please try again.",
      unknown: "Something went wrong. Please try again."
    }
  },
  me: {
    title: "My Study",
    intro: "Your saved works, writing drafts, practice sent to the author, and conversations live here.",
    greeting: "Hello, {name}",
    tabs: {
      saved: "Saved",
      drafts: "Drafts",
      submissions: "Author replies",
      chat: "Conversations",
      workshop: "Workshop",
      account: "Account"
    },
    savedEmpty: "Nothing saved yet. Use Save for review on any artwork.",
    draftsEmpty: "No drafts yet. Head to the essay room and write your first observation.",
    continueWriting: "Keep writing",
    updatedAt: "Updated {time}",
    submissionsEmpty: "You haven't sent any practice yet. After writing in the essay room, you can ask the author to look.",
    status: {
      pending: "Waiting for reply",
      replied: "Replied",
      closed: "Closed",
      withdrawn: "Withdrawn"
    },
    yourThesis: "Your thesis",
    yourResponse: "Your response",
    helpRequested: "Help requested",
    authorReply: "Author's reply",
    withdraw: "Withdraw",
    complete: "I've read it — close this exchange",
    closeReason: "Note: {reason}",
    reviseInEssay: "Revise in the essay room",
    chatEmpty: "No conversations yet.",
    workshopEmpty: "No workshop applications yet.",
    applicationStatus: {
      new: "Received",
      contacted: "Author in touch",
      accepted: "Confirmed",
      declined: "Not a fit for now",
      archived: "Archived"
    },
    accountEmail: "Login email",
    save: "Save",
    saved: "Saved",
    changePassword: "Change password",
    currentPassword: "Current password",
    passwordChanged: "Password updated."
  },
  workshop: {
    eyebrow: "A-level History of Art",
    closed: "Applications will open soon. In the meantime, explore the collection and try the essay room.",
    formTitle: "Register your interest",
    formIntro: "The author will contact you by email or WeChat. This only registers interest — nothing is charged.",
    name: "Name",
    email: "Email",
    wechat: "WeChat ID (optional)",
    school: "School (optional)",
    grade: "Year / grade (optional)",
    examBoard: "Exam board & course (optional)",
    examBoardPlaceholder: "e.g. Pearson Edexcel 9HT0",
    examSession: "Planned exam session (optional)",
    examSessionPlaceholder: "e.g. Summer 2027",
    currentNeeds: "What would you most like to work on?",
    currentNeedsPlaceholder: "e.g. My essays drift into description; I struggle to connect visual evidence with context…",
    preferredFormat: "Preferred format (optional)",
    preferredFormatPlaceholder: "e.g. online small group / weekends / one-to-one chat",
    consent: "I agree that the author may use these details to contact me about the workshop.",
    submit: "Send application",
    submitted: "Thanks — your application is in. The author will be in touch soon.",
    submittedLoggedIn: "You can check its status in My Study.",
    required: "Required"
  },
  footer: {
    tagline: "An art history common room that starts from the work itself.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    workshop: "A-level Workshop",
    imageNote: "Artwork images come from Wikimedia Commons and other open sources; credits appear on each work page."
  },
  common: {
    loading: "Loading…",
    loadFailed: "Couldn't load the collection. Please refresh.",
    retry: "Retry",
    notFound: "This room doesn't exist.",
    backHome: "Back to the entrance",
    required: "Required",
    optional: "Optional"
  }
};

export default en;
