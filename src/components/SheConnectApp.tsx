import { useMemo, useState, type ReactNode } from "react";
import { LanguageProvider, useLanguage, parseLanguage } from "@/lib/sheconnect-language";

type Screen =
  | "home"
  | "signup"
  | "guide"
  | "results"
  | "learn"
  | "path"
  | "mentors"
  | "mentor-request"
  | "confirmation"
  | "story"
  | "opportunities"
  | "community"
  | "safety"
  | "profile";

type IconName =
  | "home"
  | "spark"
  | "book"
  | "people"
  | "briefcase"
  | "shield"
  | "profile"
  | "arrow"
  | "check"
  | "clock"
  | "signal"
  | "heart"
  | "menu"
  | "close"
  | "message"
  | "bookmark"
  | "calendar"
  | "globe";

const iconPaths: Record<IconName, ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5M9 21v-7h6v7" /></>,
  spark: <><path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z" /><path d="m5 15 .8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" /></>,
  book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 4.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
  shield: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  signal: <><path d="M4 18h2M9 14h2v4H9zM14 10h2v8h-2zM19 6h2v12h-2z" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
  bookmark: <path d="M6 3h12v19l-6-4-6 4V3Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

const navItems: { id: Screen; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "guide", label: "Guide", icon: "spark" },
  { id: "learn", label: "Learn", icon: "book" },
  { id: "mentors", label: "Mentors", icon: "people" },
  { id: "opportunities", label: "Jobs & bursaries", icon: "briefcase" },
];

const moreItems: { id: Screen; label: string; icon: IconName; sub: string }[] = [
  { id: "community", label: "Community", icon: "message", sub: "Learn and share safely" },
  { id: "safety", label: "Safety & support", icon: "shield", sub: "Stay safe online" },
  { id: "profile", label: "Profile & progress", icon: "profile", sub: "Your saved activity" },
];

function Button({ children, onClick, variant = "primary", icon, type = "button", className = "" }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "pink"; icon?: IconName; type?: "button" | "submit"; className?: string;
}) {
  return <button type={type} onClick={onClick} className={`button button-${variant} ${className}`}>{children}{icon && <Icon name={icon} size={18} />}</button>;
}

function Tag({ children, tone = "purple" }: { children: ReactNode; tone?: "purple" | "pink" | "green" | "cream" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`card ${className}`} onClick={onClick}>{children}</div>;
}

function Header({ language, setLanguage, saver, setSaver, menuOpen, setMenuOpen, go }: {
  language: "English" | "Sepedi"; setLanguage: (v: "English" | "Sepedi") => void; saver: boolean; setSaver: (v: boolean) => void; menuOpen: boolean; setMenuOpen: (v: boolean) => void; go: (s: Screen) => void;
}) {
  const { t } = useLanguage();
  return <header className="topbar">
    <button className="brand" onClick={() => go("home")} aria-label={t("SheConnect home")}>
      <span className="brand-mark">{t("S")}</span><span>{t("SheConnect")}</span>
    </button>
    <div className="header-tools">
      <button className="language-toggle" onClick={() => setLanguage(language === "English" ? "Sepedi" : "English")} aria-label={t("Change language")}>
        <Icon name="globe" size={17} /><span>{language === "English" ? "EN" : "SEP"}</span>
      </button>
      <label className="saver-control">
        <span className="desktop-only">{t("Data saver")}</span>
        <input type="checkbox" checked={saver} onChange={e => setSaver(e.target.checked)} />
        <span className="switch" aria-hidden="true" />
      </label>
      <button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("Open menu")}><Icon name={menuOpen ? "close" : "menu"} /></button>
    </div>
  </header>;
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <nav className="bottom-nav" aria-label={t("Main navigation")}>{navItems.map(item =>
    <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => go(item.id)}>
      <Icon name={item.icon} size={21} /><span>{t(item.label)}</span>
    </button>)}</nav>;
}

function DesktopRail({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <aside className="desktop-rail"><div className="rail-label">{t("EXPLORE")}</div>{navItems.map(item =>
    <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => go(item.id)}>
      <Icon name={item.icon} /><span>{t(item.label)}</span>
    </button>)}
    <div className="rail-rule" />{moreItems.map(item =>
      <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => go(item.id)}>
        <Icon name={item.icon} /><span>{t(item.label)}</span>
      </button>)}
  </aside>;
}

function PageHead({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  const { t } = useLanguage();
  return <div className="page-head">{eyebrow && <div className="eyebrow">{t(eyebrow)}</div>}<h1>{t(title)}</h1>{text && <p>{t(text)}</p>}</div>;
}

function Home({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div className="home">
    <section className="hero">
      <div className="hero-copy">
        <Tag tone="pink">{t("Built for South African women")}</Tag>
        <h1>{t("Your future in tech starts here")}</h1>
        <p>{t("Discover careers, learn useful skills and meet women who can help you take the next step.")}</p>
        <div className="hero-actions">
          <Button onClick={() => go("signup")} icon="spark">{t("Chat with the career guide")}</Button>
          <Button onClick={() => go("learn")} variant="secondary" icon="arrow">{t("Browse learning paths")}</Button>
        </div>
        <span className="microcopy"><Icon name="signal" size={16} />{" "}{t("Designed to use less data")}</span>
      </div>
      <div className="hero-visual optional-visual" aria-label={t("Illustration of a young woman exploring technology")}>
        <span className="orbit orbit-one" /><span className="orbit orbit-two" />
        <div className="illustration-person"><div className="hair" /><div className="face" /><div className="body">{t("SC")}</div></div>
        <div className="float-card code-card">{t("&lt;/&gt;")}<span>{t("Build")}</span></div>
        <div className="float-card idea-card"><Icon name="spark" /><span>{t("Grow")}</span></div>
      </div>
    </section>

    <section className="section-block">
      <div className="section-intro"><div><span className="eyebrow">{t("MADE FOR YOUR JOURNEY")}</span><h2>{t("One place. Many possibilities.")}</h2></div><p>{t("Start where you are. Everything is beginner-friendly.")}</p></div>
      <div className="benefit-grid">
        <Card><span className="feature-icon"><Icon name="spark" /></span><h3>{t("Find your direction")}</h3><p>{t("Answer a few easy questions and discover tech careers that match you.")}</p><button className="text-link" onClick={() => go("guide")}>{t("Try the guide")}{" "}<Icon name="arrow" size={16} /></button></Card>
        <Card><span className="feature-icon pink"><Icon name="book" /></span><h3>{t("Learn step by step")}</h3><p>{t("Free, practical learning paths you can complete on your phone.")}</p><button className="text-link" onClick={() => go("learn")}>{t("Start learning")}{" "}<Icon name="arrow" size={16} /></button></Card>
        <Card><span className="feature-icon gold"><Icon name="people" /></span><h3>{t("Grow with support")}</h3><p>{t("Connect with mentors and a community that wants you to succeed.")}</p><button className="text-link" onClick={() => go("mentors")}>{t("Meet mentors")}{" "}<Icon name="arrow" size={16} /></button></Card>
      </div>
    </section>

    <section className="role-section">
      <div className="section-intro"><div><span className="eyebrow">{t("REAL WOMEN, REAL PATHS")}</span><h2>{t("Women in tech")}</h2></div><button className="text-link" onClick={() => go("story")}>{t("Read their stories")}{" "}<Icon name="arrow" size={16} /></button></div>
      <div className="role-strip">
        {[
          ["NM", "Naledi M.", "Data analyst", "Johannesburg"],
          ["AZ", "Ayesha Z.", "UX designer", "Cape Town"],
          ["TN", "Thandi N.", "Cybersecurity", "Durban"],
        ].map((person, i) => <Card key={person[0]} className="role-card" onClick={() => go("story")}>
          <div className={`avatar optional-visual avatar-${i}`}>{person[0]}</div><div><h3>{person[1]}</h3><strong>{t(person[2])}</strong><p>{person[3]}</p></div><Icon name="arrow" />
        </Card>)}
      </div>
    </section>
    <section className="join-banner"><div><span className="eyebrow light">{t("YOUR NEXT STEP CAN BE SMALL")}</span><h2>{t("Ready to see where tech could take you?")}</h2></div><Button variant="pink" onClick={() => go("signup")} icon="arrow">{t("Create your free profile")}</Button></section>
  </div>;
}

function SignUp({ go }: { go: (s: Screen) => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  return <div className="narrow-page">
    <PageHead eyebrow="STEP 1 OF 3" title="Let’s get to know you" text="Just the basics, so we can make your experience useful. You can change these later." />
    <form className="form-card" onSubmit={e => { e.preventDefault(); setSubmitted(true); if ((e.currentTarget.elements.namedItem("consent") as HTMLInputElement).checked) go("guide"); }}>
      <label className="field"><span>{t("Name or nickname")}</span><input name="name" placeholder={t("What should we call you?")} required /></label>
      <label className="field"><span>{t("Where are you in your journey?")}</span><select defaultValue=""><option value="" disabled>{t("Choose your education level")}</option><option value={"Grade 10–12"}>{t("Grade 10–12")}</option><option value={"University or college student"}>{t("University or college student")}</option><option value={"Graduate or looking for work"}>{t("Graduate or looking for work")}</option><option value={"Early in my career"}>{t("Early in my career")}</option></select></label>
      <fieldset><legend>{t("What are you interested in?")}{" "}<small>{t("Choose all that fit")}</small></legend><div className="check-grid">
        {["Design & creativity", "Solving problems", "Working with data", "Helping people", "Building things", "I’m not sure yet"].map(item => <label className="check-card" key={item}><input type="checkbox" /><span className="check-box"><Icon name="check" size={14} /></span>{t(item)}</label>)}
      </div></fieldset>
      <fieldset><legend>{t("Preferred language")}</legend><div className="radio-row"><label><input type="radio" name="language" value="English" checked={language === "English"} onChange={() => setLanguage("English")} /><span>{t("English")}</span></label><label><input type="radio" name="language" value="Sepedi" checked={language === "Sepedi"} onChange={() => setLanguage("Sepedi")} /><span>{t("Sepedi")}</span></label></div></fieldset>
      <div className="privacy-note"><Icon name="shield" /><p><strong>{t("Your information is yours.")}</strong>{" "}{t("We only use it to personalise SheConnect. We protect it in line with POPIA and never sell it.")}</p></div>
      <label className="consent"><input name="consent" type="checkbox" /><span className="check-box"><Icon name="check" size={14} /></span><span>{t("I agree to SheConnect using my answers to personalise my experience.")}</span></label>
      {submitted && <p className="error-message">{t("Please tick the consent box to continue.")}</p>}
      <Button type="submit" icon="arrow" className="full">{t("Continue to career guide")}</Button>
      <p className="form-foot">{t("No ID number, address or payment details needed.")}</p>
    </form>
  </div>;
}

function ChatGuide({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(true);
  const replies = ["I like design", "I like problem solving", "I’m not sure"];
  const chooseReply = (nextStep: number) => {
    setLoading(true);
    window.setTimeout(() => {
      setStep(nextStep);
      setLoading(false);
    }, 650);
  };
  return <div className="chat-layout">
    <div className="chat-top"><div><span className="online-dot" />{" "}{t("AI Career Guide")}</div><div className="chat-links"><button className="text-link" onClick={() => { setStarted(false); setStep(0); }}>{t("Start over")}</button><button className="text-link" onClick={() => go("learn")}>{t("Skip chat and browse manually")}</button></div></div>
    <div className="chat-body">
      {!started && <div className="empty-chat"><span className="bot-avatar"><Icon name="message" size={18} /></span><h2>{t("Your chat is ready")}</h2><p>{t("Start when you feel ready. It only takes about two minutes.")}</p><Button onClick={() => setStarted(true)} icon="arrow">{t("Start a new chat")}</Button></div>}
      {started && <>
      <div className="chat-date">{t("TODAY")}</div>
      <div className="bot-row"><span className="bot-avatar"><Icon name="spark" size={17} /></span><div className="bubble bot"><strong>{t("Hi, I’m Lindi, your career guide.")}</strong><p>{t("I’ll ask you a few simple questions to help find tech paths that could suit you. There are no wrong answers.")}</p></div></div>
      <div className="bot-row"><span className="bot-avatar"><Icon name="spark" size={17} /></span><div className="bubble bot"><p>{t("Which of these sounds most like you?")}</p></div></div>
      {step > 0 && <><div className="bubble user">{t(replies[step - 1])}</div><div className="bot-row"><span className="bot-avatar"><Icon name="spark" size={17} /></span><div className="bubble bot"><p>{t(step === 1 ? "Great choice. You may enjoy creating useful, easy-to-use digital experiences." : step === 2 ? "That’s a strong tech skill. Let’s look at paths where curiosity matters." : "That’s completely okay. Trying a short beginner path can help you decide.")}</p></div></div></>}
      {busy && <div className="status-card error-state"><strong>{t("The AI guide is busy.")}</strong><p>{t("Try the simple questions instead — you’ll still get useful career ideas.")}</p><Button variant="secondary" onClick={() => setBusy(false)}>{t("Use simple questions")}</Button></div>}
      {loading && <div className="bot-row loading-row"><span className="bot-avatar"><Icon name="spark" size={17} /></span><div className="bubble bot typing" aria-label={t("The AI guide is thinking")}><i /><i /><i /></div></div>}
      {step === 0 && !busy && !loading && <div className="quick-replies">{replies.map((reply, i) => <button key={t(reply)} onClick={() => chooseReply(i + 1)}>{t(reply)}</button>)}<button className="simulate-error" onClick={() => setBusy(true)}>{t("Having trouble?")}</button></div>}
      {step > 0 && <div className="chat-next"><p>{t("Ready to see your suggested pathways?")}</p><Button onClick={() => go("results")} icon="arrow">{t("Show my matches")}</Button></div>}
      </>}
    </div>
    <div className="ai-note"><Icon name="shield" size={16} />{" "}{t("AI can make mistakes. You decide.")}</div>
  </div>;
}

const paths = [
  { title: "UX Design", match: "Best match", desc: "Design digital products that are simple and enjoyable to use.", why: "You enjoy creativity and understanding what people need.", time: "4 weeks", progress: 25, icon: "◌" },
  { title: "Web Development", match: "Strong match", desc: "Build websites and digital tools used by people every day.", why: "You like making things and seeing clear results.", time: "6 weeks", progress: 45, icon: "</>" },
  { title: "Data Analytics", match: "Worth exploring", desc: "Use information to answer questions and support decisions.", why: "You are curious and notice patterns.", time: "5 weeks", progress: 10, icon: "⌁" },
];

function Results({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div><PageHead eyebrow="YOUR CAREER MATCHES" title="You have options worth exploring" text="Based on your answers, these pathways could be a good place to start. You’re not locked in — try what interests you." />
    <div className="path-grid results-grid">{paths.map((path, i) => <Card key={t(path.title)} className={i === 0 ? "path-card featured" : "path-card"}>
      <div className="path-top"><span className="path-icon">{path.icon}</span><Tag tone={i === 0 ? "pink" : "purple"}>{t(path.match)}</Tag></div><h2>{t(path.title)}</h2><p>{t(path.desc)}</p>
      <div className="why-box"><strong>{t("Why this suits you")}</strong><p>{t(path.why)}</p></div>
      <Button className="full" variant={i === 0 ? "primary" : "secondary"} onClick={() => go("path")} icon="arrow">{t("Start learning")}</Button>
    </Card>)}</div>
    <div className="reassure"><Icon name="heart" /><div><strong>{t("Not sure yet?")}</strong><p>{t("That’s normal. Start with any short lesson and change direction whenever you like.")}</p></div></div>
  </div>;
}

function Progress({ value }: { value: number }) {
  const { t } = useLanguage();
  return <div className="progress" aria-label={`${value}% ${t("complete")}`}><span style={{ width: `${value}%` }} /></div>;
}

function Learning({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div><PageHead eyebrow="LEARNING PATHS" title="Build skills, one step at a time" text="Beginner-friendly lessons and free resources chosen to work well on mobile." />
    <div className="filter-scroll"><button className="pill active">{t("All paths")}</button><button className="pill">{t("Design")}</button><button className="pill">{t("Coding")}</button><button className="pill">{t("Data")}</button><button className="pill">{t("Cybersecurity")}</button></div>
    <div className="learning-list">{paths.map((path, i) => <Card key={t(path.title)} className="learning-card">
      <div className={`path-icon large tone-${i}`}>{path.icon}</div><div className="learning-copy"><div className="tag-row"><Tag tone="green">{t("Free")}</Tag><Tag tone="cream"><Icon name="signal" size={13} />{" "}{t("Low-data friendly")}</Tag></div><h2>{t(path.title)}{" "}{t("foundations")}</h2><p>{t(path.desc)}</p><div className="meta"><span><Icon name="clock" size={16} /> {t(path.time)}</span><span>{path.progress}{t("% complete")}</span></div><Progress value={path.progress} /></div>
      <Button variant="secondary" onClick={() => go("path")} icon="arrow">{t(i ? "View path" : "Continue")}</Button>
    </Card>)}</div>
  </div>;
}

function PathDetail({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  const steps = [
    ["Meet UX design", "Learn what UX designers do and how they solve everyday problems.", "12 min read", true],
    ["Understand your user", "Practice asking good questions and listening without assumptions.", "25 min activity", false],
    ["Sketch your first idea", "Turn a problem into a simple screen design using paper.", "30 min activity", false],
    ["Test and improve", "Ask someone to try your idea and learn from their feedback.", "20 min activity", false],
  ];
  return <div className="detail-layout">
    <div className="path-summary"><button className="back-link" onClick={() => go("learn")}>{t("← All learning paths")}</button><div className="path-icon hero-path">{t("◌")}</div><Tag tone="green">{t("Free beginner path")}</Tag><h1>{t("UX Design foundations")}</h1><p>{t("Learn how to design simple digital experiences that work for real people.")}</p><div className="summary-meta"><span><Icon name="clock" />{" "}{t("4 weeks")}</span><span><Icon name="signal" />{" "}{t("Low-data")}</span></div><Progress value={25} /><small>{t("1 of 4 steps completed")}</small></div>
    <div className="lesson-panel"><h2>{t("Your learning steps")}</h2><p>{t("Save your progress automatically as you go.")}</p><div className="step-list">{steps.map((step, i) => <div className={`lesson-step ${step[3] ? "done" : ""}`} key={String(step[0])}>
      <span className="step-number">{step[3] ? <Icon name="check" size={16} /> : i + 1}</span><div><h3>{t(String(step[0]))}</h3><p>{t(String(step[1]))}</p><small><Icon name="clock" size={14} /> {t(String(step[2]))}{" "}{t("· Free resource")}</small></div><button aria-label={`Open ${t(String(step[0]))}`}><Icon name="arrow" /></button>
    </div>)}</div>
    <div className="mentor-nudge"><div><Icon name="people" /><span><strong>{t("Want help along the way?")}</strong><p>{t("A mentor can answer questions and encourage you.")}</p></span></div><Button variant="pink" onClick={() => go("mentors")}>{t("Find a mentor")}</Button></div></div>
  </div>;
}

const mentors = [
  { initials: "LM", name: "Lerato Molefe", title: "Product Designer at FinLink", skills: ["UX Design", "Career change"], languages: "English, Sepedi", tone: 0 },
  { initials: "NK", name: "Nandi Khumalo", title: "Software Developer at MzansiCode", skills: ["Web development", "CV support"], languages: "English, isiZulu", tone: 1 },
  { initials: "SB", name: "Samira Botha", title: "Data Analyst at GreenGrid", skills: ["Data", "First job"], languages: "English, Afrikaans", tone: 2 },
];

function Mentors({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div><PageHead eyebrow="MENTORS & ROLE MODELS" title="You don’t have to figure it out alone" text="Meet women in tech who volunteer their time to share guidance, experience and encouragement." />
    <div className="filter-scroll"><button className="pill active">{t("All mentors")}</button><button className="pill">{t("Design")}</button><button className="pill">{t("Development")}</button><button className="pill">{t("Data")}</button></div>
    <div className="mentor-grid">{mentors.map(m => <Card className="mentor-card" key={m.name}><div className={`mentor-avatar optional-visual mentor-${m.tone}`}>{m.initials}<span /></div><div className="mentor-info"><h2>{m.name}</h2><p className="job-title">{t(m.title)}</p><div className="tag-row">{m.skills.map(s => <Tag key={t(s)}>{t(s)}</Tag>)}</div><p className="language"><Icon name="globe" size={15} /> {m.languages}</p><Button className="full" onClick={() => go("mentor-request")}>{t("Request a mentor")}</Button></div></Card>)}</div>
    <Card className="role-promo"><div className="role-illustration optional-visual">{t("“")}</div><div><span className="eyebrow">{t("ROLE-MODEL STORY")}</span><h2>{t("“I started coding with only a borrowed phone.”")}</h2><p>{t("Read Neo’s story of moving from a small town in Limpopo to her first role in cloud support.")}</p><button className="text-link" onClick={() => go("story")}>{t("Read Neo’s story")}{" "}<Icon name="arrow" size={16} /></button></div></Card>
  </div>;
}

function MentorRequest({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div className="narrow-page"><PageHead eyebrow="MENTOR REQUEST" title="Ask Lerato for support" text="Tell us what you’d like help with. Keep it simple — no private contact details needed." />
    <form className="form-card" onSubmit={e => { e.preventDefault(); go("confirmation"); }}>
      <div className="selected-mentor"><div className="mini-avatar">{t("LM")}</div><div><strong>{t("Lerato Molefe")}</strong><p>{t("Product Designer · English, Sepedi")}</p></div></div>
      <label className="field"><span>{t("What would you like help with?")}</span><select required defaultValue=""><option value="" disabled>{t("Choose a topic")}</option><option value={"Understanding a career"}>{t("Understanding a career")}</option><option value={"Choosing a learning path"}>{t("Choosing a learning path")}</option><option value={"CV or interview support"}>{t("CV or interview support")}</option><option value={"Starting my first project"}>{t("Starting my first project")}</option></select></label>
      <label className="field"><span>{t("Write a short message")}</span><textarea rows={5} placeholder={t("Hi Lerato, I’m learning about UX design and would like help with...")} required /><small>{t("Do not share your phone number, address or ID number.")}</small></label>
      <label className="field"><span>{t("How should we contact you?")}</span><select><option value={"Message inside SheConnect"}>{t("Message inside SheConnect")}</option><option value={"Email notification"}>{t("Email notification")}</option></select></label>
      <label className="consent"><input type="checkbox" required /><span className="check-box"><Icon name="check" size={14} /></span><span>{t("I understand that mentors are volunteers and may take a few days to reply.")}</span></label>
      <Button type="submit" className="full" icon="arrow">{t("Send mentor request")}</Button>
    </form>
  </div>;
}

function Confirmation({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <div className="confirmation"><div className="success-mark"><Icon name="check" size={38} /></div><span className="eyebrow">{t("REQUEST SENT")}</span><h1>{t("You’ve taken a brave next step")}</h1><p>{t("Lerato has received your mentor request. We’ll let you know here when she responds — usually within 3 to 5 days.")}</p><Card className="what-next"><h2>{t("While you wait")}</h2><button onClick={() => go("path")}><span><Icon name="book" /></span><div><strong>{t("Continue your UX learning path")}</strong><small>{t("Next: Understand your user")}</small></div><Icon name="arrow" /></button><button onClick={() => go("community")}><span><Icon name="message" /></span><div><strong>{t("Visit the design community")}</strong><small>{t("Learn with 240 other women")}</small></div><Icon name="arrow" /></button></Card><Button onClick={() => go("profile")} variant="secondary">{t("View my profile & progress")}</Button></div>;
}

function Opportunities() {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState("All types");
  const [provinceFilter, setProvinceFilter] = useState("All provinces");
  const [dateFilter, setDateFilter] = useState("Any date");
  const jobs = [
    { organisation: "Tech4Her Foundation", title: "Women in Data Bursary 2026", type: "Bursary", deadline: "Closes 28 Feb", province: "Gauteng", dateGroup: "This week" },
    { organisation: "CodeSA", title: "Junior Frontend Learnership", type: "Learnership", deadline: "Closes 12 Mar", province: "Nationwide", dateGroup: "This month" },
    { organisation: "Ubuntu Mobile", title: "Graduate UX Internship", type: "Internship", deadline: "Closes 20 Mar", province: "Western Cape", dateGroup: "This month" },
    { organisation: "Connect4All", title: "Affordable student data packs", type: "Data support", deadline: "Ongoing", province: "Nationwide", dateGroup: "Ongoing" },
    { organisation: "FutureCloud SA", title: "Junior Cloud Support Assistant", type: "Junior job", deadline: "Closes 7 Mar", province: "Limpopo", dateGroup: "This week" },
  ];
  const filteredJobs = jobs.filter(job =>
    (typeFilter === "All types" || job.type === typeFilter) &&
    (provinceFilter === "All provinces" || job.province === provinceFilter) &&
    (dateFilter === "Any date" || job.dateGroup === dateFilter)
  );
  const clearFilters = () => {
    setTypeFilter("All types");
    setProvinceFilter("All provinces");
    setDateFilter("Any date");
  };
  return <div><PageHead eyebrow="JOBS & BURSARIES" title="Find your next open door" text="Bursaries, work experience, junior roles and practical support — all in one place." />
    <div className="filters">
      <label>{t("Type")}<select value={typeFilter} onChange={event => setTypeFilter(event.target.value)}><option value={"All types"}>{t("All types")}</option><option value={"Bursary"}>{t("Bursary")}</option><option value={"Learnership"}>{t("Learnership")}</option><option value={"Internship"}>{t("Internship")}</option><option value={"Junior job"}>{t("Junior job")}</option><option value={"Data support"}>{t("Data support")}</option></select></label>
      <label>{t("Province")}<select value={provinceFilter} onChange={event => setProvinceFilter(event.target.value)}><option value={"All provinces"}>{t("All provinces")}</option><option value={"Gauteng"}>{t("Gauteng")}</option><option value={"Limpopo"}>{t("Limpopo")}</option><option value={"Western Cape"}>{t("Western Cape")}</option><option value={"Nationwide"}>{t("Nationwide")}</option></select></label>
      <label>{t("Closing date")}<select value={dateFilter} onChange={event => setDateFilter(event.target.value)}><option value={"Any date"}>{t("Any date")}</option><option value={"This week"}>{t("This week")}</option><option value={"This month"}>{t("This month")}</option><option value={"Ongoing"}>{t("Ongoing")}</option></select></label>
    </div>
    <div className="results-bar"><p className="result-count">{filteredJobs.length} {t(filteredJobs.length === 1 ? "opportunity" : "opportunities")}{" "}{t("found")}</p>{(typeFilter !== "All types" || provinceFilter !== "All provinces" || dateFilter !== "Any date") && <button className="text-link" onClick={clearFilters}>{t("Clear filters")}</button>}</div>
    {filteredJobs.length > 0 ? <div className="opportunity-list">{filteredJobs.map((job, i) => <Card className="job-card" key={t(job.title)}><div className={`org-mark org-${i % 4}`}>{job.organisation.charAt(0)}</div><div className="job-copy"><div className="tag-row"><Tag tone={job.type === "Data support" ? "green" : "pink"}>{t(job.type)}</Tag><Tag tone="cream">{t(job.province)}</Tag></div><small>{job.organisation}</small><h2>{t(job.title)}</h2><p><Icon name="calendar" size={16} /> {t(job.deadline)}</p></div><Button variant="secondary" icon="arrow">{t("Apply")}</Button></Card>)}</div> :
      <Card className="jobs-empty"><span className="feature-icon"><Icon name="briefcase" /></span><h2>{t("No matches yet")}</h2><p>{t("Try changing one of your filters to see more jobs and bursaries.")}</p><Button variant="secondary" onClick={clearFilters}>{t("Clear all filters")}</Button></Card>}
  </div>;
}

function Community() {
  const { t } = useLanguage();
  return <div><PageHead eyebrow="COMMUNITY" title="Learn together, grow together" text="A kind, moderated space to ask questions and share what you’re learning." />
    <div className="community-grid"><div>
      <Card className="whatsapp-card"><div className="whatsapp-icon"><Icon name="message" /></div><div><Tag tone="green">{t("WhatsApp channel")}</Tag><h2>{t("SheConnect updates on WhatsApp")}</h2><p>{t("Get weekly bursary alerts, free learning resources and community news. Only admins can post, so it stays low-data and focused.")}</p><a className="button button-whatsapp" href="https://www.whatsapp.com/channel/" target="_blank" rel="noreferrer">{t("Join the WhatsApp channel")}{" "}<Icon name="arrow" size={18} /></a><small>{t("WhatsApp opens in a new tab. Your number stays private from other followers.")}</small></div></Card>
      <h2 className="subheading">{t("Your groups")}</h2><div className="group-scroll"><Card className="group-card"><span className="group-icon"><Icon name="book" /></span><div><strong>{t("First-year ICT students")}</strong><small>{t("1,280 members")}</small></div></Card><Card className="group-card"><span className="group-icon pink"><Icon name="shield" /></span><div><strong>{t("Women in cybersecurity")}</strong><small>{t("840 members")}</small></div></Card></div>
      <div className="feed-head"><h2>{t("Latest conversations")}</h2><Button variant="primary">{t("Start a post")}</Button></div>
      <div className="post-list"><Card className="post"><div className="post-author"><div className="mini-avatar">{t("KM")}</div><div><strong>{t("Karabo M.")}</strong><small>{t("First-year ICT students · 2h")}</small></div></div><p>{t("I finished my first HTML page today! What small project should I build next to practise?")}</p><div className="post-actions"><button><Icon name="heart" size={17} />{" "}{t("24")}</button><button><Icon name="message" size={17} />{" "}{t("8 replies")}</button><button>{t("Report post")}</button></div></Card><Card className="post"><div className="post-author"><div className="mini-avatar alt">{t("ZS")}</div><div><strong>{t("Zinhle S.")}</strong><small>{t("Women in cybersecurity · 5h")}</small></div></div><p>{t("Sharing a free, low-data introduction to online safety that helped me understand phishing.")}</p><div className="post-actions"><button><Icon name="heart" size={17} />{" "}{t("41")}</button><button><Icon name="message" size={17} />{" "}{t("12 replies")}</button><button>{t("Report post")}</button></div></Card></div></div>
      <aside className="rules-card"><Icon name="shield" /><h2>{t("Our community promise")}</h2><p>{t("Be kind. Protect privacy. Share useful knowledge. No harassment or discrimination.")}</p><button className="text-link">{t("Read community rules")}{" "}<Icon name="arrow" size={16} /></button></aside>
    </div>
  </div>;
}

function Safety() {
  const { t } = useLanguage();
  return <div><PageHead eyebrow="SAFETY & SUPPORT" title="You deserve to feel safe online" text="Simple steps to protect yourself, respond to harassment and find help when you need it." />
    <div className="safety-grid"><Card className="safety-card"><span className="feature-icon"><Icon name="shield" /></span><h2>{t("Protect your information")}</h2><ul><li>{t("Never share your ID number, home address or passwords.")}</li><li>{t("Use a different, strong password for each account.")}</li><li>{t("Check who can see your posts and profile.")}</li></ul></Card><Card className="safety-card"><span className="feature-icon pink"><Icon name="message" /></span><h2>{t("If someone harasses you")}</h2><ul><li>{t("Do not reply. Save screenshots as evidence.")}</li><li>{t("Block and report the account.")}</li><li>{t("Tell someone you trust. It is not your fault.")}</li></ul></Card></div>
    <section className="support-section"><h2>{t("Get support")}</h2><div className="support-list"><Card><strong>{t("SheConnect safety team")}</strong><p>{t("Report a mentor, member or post privately.")}</p><Button variant="secondary">{t("Make a report")}</Button></Card><Card><strong>{t("Film and Publication Board hotline")}</strong><p>{t("Report harmful or abusive online content.")}</p><a href="tel:0800148148">{t("0800 148 148")}</a></Card><Card><strong>{t("GBV Command Centre")}</strong><p>{t("24-hour support from trained social workers.")}</p><a href="tel:0800428428">{t("0800 428 428")}</a></Card></div></section>
  </div>;
}

function Profile({ saver, setSaver }: { saver: boolean; setSaver: (v: boolean) => void }) {
  const { t, language, setLanguage } = useLanguage();
  return <div><div className="profile-head"><div className="profile-avatar">{t("TM")}</div><div><span className="eyebrow">{t("MY PROFILE")}</span><h1>{t("Hi, Thato")}</h1><p>{t("You’ve made a strong start. Keep going at your own pace.")}</p></div></div>
    <div className="stat-grid"><Card><strong>{t("1")}</strong><span>{t("Saved career")}</span></Card><Card><strong>{t("25%")}</strong><span>{t("Learning progress")}</span></Card><Card><strong>{t("1")}</strong><span>{t("Mentor request")}</span></Card></div>
    <div className="profile-grid"><Card className="profile-section"><h2>{t("Learning progress")}</h2><div className="saved-item"><span className="path-icon">{t("◌")}</span><div><strong>{t("UX Design foundations")}</strong><Progress value={25} /><small>{t("1 of 4 steps complete")}</small></div><Icon name="arrow" /></div></Card>
      <Card className="profile-section"><h2>{t("Saved careers")}</h2><div className="saved-item"><span className="path-icon">{t("&lt;/&gt;")}</span><div><strong>{t("Web Development")}</strong><small>{t("Saved from your career matches")}</small></div><Icon name="arrow" /></div></Card>
      <Card className="profile-section"><h2>{t("Mentor requests")}</h2><div className="saved-item"><span className="mini-avatar">{t("LM")}</span><div><strong>{t("Lerato Molefe")}</strong><small><Tag tone="cream">{t("Waiting for reply")}</Tag></small></div></div></Card>
      <Card className="profile-section settings"><h2>{t("Settings")}</h2><label><span><Icon name="globe" />{" "}{t("Language")}</span><select aria-label={t("Language")} value={language} onChange={e => setLanguage(parseLanguage(e.target.value))}><option value="English">English</option><option value="Sepedi">Sepedi</option></select></label><label><span><Icon name="signal" />{" "}{t("Data saver mode")}<small>{t("Hide images and reduce data use")}</small></span><span className="saver-control"><input type="checkbox" checked={saver} onChange={e => setSaver(e.target.checked)} /><span className="switch" /></span></label></Card></div>
  </div>;
}

function Story({ go }: { go: (s: Screen) => void }) {
  const { t } = useLanguage();
  return <article className="story"><button className="back-link" onClick={() => go("mentors")}>{t("← Mentors & role models")}</button><div className="story-hero"><div className="story-portrait optional-visual">{t("NM")}</div><div><Tag tone="pink">{t("Role-model story")}</Tag><h1>{t("“I started with curiosity, not confidence.”")}</h1><p className="lead">{t("How Neo Matlala found her way from a borrowed phone in Limpopo to a career in cloud support.")}</p><div className="story-byline"><strong>{t("Neo Matlala")}</strong><span>{t("Cloud Support Specialist · Johannesburg")}</span></div></div></div>
    <div className="story-body"><p>{t("I did not grow up thinking tech was for me. At school, I liked solving puzzles, but I had never met a woman who worked with computers.")}</p><blockquote>{t("“You do not need to know everything before you begin. You only need one next step.”")}</blockquote><p>{t("My first online course took me three months because I shared a phone and saved lessons for when I had data. Every small lesson counted. Later, a mentor helped me understand which skills employers looked for.")}</p><h2>{t("Neo’s advice")}</h2><ul><li>{t("Download learning materials when you have Wi-Fi.")}</li><li>{t("Practise by helping solve a real problem around you.")}</li><li>{t("Ask questions early — nobody learns alone.")}</li></ul><Button onClick={() => go("learn")} icon="arrow">{t("Explore beginner paths")}</Button></div>
  </article>;
}

function MenuOverlay({ go, close }: { go: (s: Screen) => void; close: () => void }) {
  const { t } = useLanguage();
  return <div className="menu-overlay"><div className="menu-panel"><span className="eyebrow">{t("MORE FROM SHECONNECT")}</span>{moreItems.map(item => <button key={item.id} onClick={() => { go(item.id); close(); }}><span><Icon name={item.icon} /></span><div><strong>{t(item.label)}</strong><small>{t(item.sub)}</small></div><Icon name="arrow" /></button>)}</div><button className="menu-backdrop" onClick={close} aria-label={t("Close menu")} /></div>;
}

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [screen, setScreen] = useState<Screen>("home");
  const [saver, setSaver] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: Screen) => { setScreen(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const content = useMemo(() => {
    switch (screen) {
      case "home": return <Home go={go} />;
      case "signup": return <SignUp go={go} />;
      case "guide": return <ChatGuide go={go} />;
      case "results": return <Results go={go} />;
      case "learn": return <Learning go={go} />;
      case "path": return <PathDetail go={go} />;
      case "mentors": return <Mentors go={go} />;
      case "mentor-request": return <MentorRequest go={go} />;
      case "confirmation": return <Confirmation go={go} />;
      case "opportunities": return <Opportunities />;
      case "community": return <Community />;
      case "safety": return <Safety />;
      case "profile": return <Profile saver={saver} setSaver={setSaver} />;
      case "story": return <Story go={go} />;
    }
  }, [screen, saver]);
  return <div className={saver ? "app data-saver" : "app"}>
    <Header language={language} setLanguage={setLanguage} saver={saver} setSaver={setSaver} menuOpen={menuOpen} setMenuOpen={setMenuOpen} go={go} />
    <div className="app-shell"><DesktopRail screen={screen} go={go} /><main className="main-content">{content}</main></div>
    <footer><div className="footer-brand"><span className="brand-mark">{t("S")}</span><div><strong>{t("SheConnect")}</strong><p>{t("Your future in tech starts here.")}</p></div></div><div className="footer-links"><button onClick={() => go("safety")}>{t("Safety")}</button><button>{t("Privacy")}</button><button>{t("About")}</button><button>{t("Help")}</button></div><small>{t("Made in South Africa for women building their future.")}</small></footer>
    <BottomNav screen={screen} go={go} />
    {menuOpen && <MenuOverlay go={go} close={() => setMenuOpen(false)} />}
  </div>;
}

export default function SheConnectApp() {
  return <LanguageProvider><App /></LanguageProvider>;
}
