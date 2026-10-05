import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { services } from './content';
import { projectForPage } from './projects';
import { Portfolio, ProjectCards, ProjectDetail } from './Portfolio';
import { ContactForm } from './ContactForm';

const pages = ['home', 'about', 'capabilities', 'portfolio', 'contact'];
const pathFor = page => page === 'home' ? '/' : `/${page}`;
const currentPage = () => {
  const slug = location.pathname.replace(/\/$/, '').slice(1);
  if (slug === '') return 'home';
  return pages.includes(slug) || projectForPage(slug) ? slug : 'missing';
};

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.08 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`} style={{ '--delay': `${delay}ms` }}>{children}</div>;
}

const NavigationContext = createContext(null);
const Link = ({ to, children, className = '', ...props }) => { const navigate = useContext(NavigationContext); return <a href={pathFor(to)} className={className} onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate(to); } }} {...props}>{children}</a>; };
const Button = ({ to, children, tone = 'secondary' }) => <Link to={to} className={`btn ${tone}`}>{children}</Link>;
const Cards = ({ items = services }) => <div className="cards">{items.map((service, i) => <Reveal className="service-card" key={service.title} delay={i * 80}><span className="card-label">0{services.indexOf(service) + 1} / {service.type}</span><h3>{service.title}</h3><p>{service.description}</p><span className="card-detail">{service.tools}</span><Link to="contact" className="card-link">Let’s talk about it</Link></Reveal>)}</div>;

export function App() {
  const [page, setPage] = useState(currentPage);
  const project = projectForPage(page);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [transition, setTransition] = useState('');
  const [filter, setFilter] = useState('All');
  const main = useRef(null);
  const menuButton = useRef(null);
  const navRef = useRef(null);
  const timers = useRef([]);
  const busy = useRef(false);
  function navigate(next, push = true) {
    if (busy.current) return;
    setMenu(false);
    if (next === page) { main.current?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    busy.current = true;
    setTransition('leaving');
    timers.current.push(setTimeout(() => {
      if (push) history.pushState({}, '', pathFor(next));
      setPage(next); setScrolled(false); setFilter('All');
      main.current?.scrollTo(0, 0);
      setTransition('entering');
      timers.current.push(setTimeout(() => { setTransition(''); busy.current = false; main.current?.focus({ preventScroll: true }); }, 450));
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350));
  }
  useEffect(() => {
    const back = () => { timers.current.forEach(clearTimeout); busy.current = false; setTransition(''); setPage(currentPage()); setMenu(false); setScrolled(false); main.current?.scrollTo(0, 0); };
    window.addEventListener('popstate', back);
    return () => { window.removeEventListener('popstate', back); timers.current.forEach(clearTimeout); };
  }, []);
  useEffect(() => { document.title = `${project ? project.name : page === 'home' ? 'Thoughtful software' : page[0].toUpperCase() + page.slice(1)} — MNK Labs`; }, [page, project]);
  useEffect(() => {
    if (!menu) return;
    const links = navRef.current.querySelectorAll('a'); links[0]?.focus();
    const keydown = e => {
      if (e.key === 'Escape') { setMenu(false); menuButton.current.focus(); }
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === menuButton.current) { e.preventDefault(); links[links.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === links[links.length - 1]) { e.preventDefault(); menuButton.current.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [menu]);


  return <NavigationContext.Provider value={navigate}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className={`nav ${scrolled ? 'scrolled' : ''} ${menu ? 'menu-open' : ''}`}>
      <Link to="home" className="branding" aria-label="MNK Labs home"><img src={`/assets/logo${scrolled ? '' : '_light'}.png`} alt=""/><span>LABS</span></Link>
      <button ref={menuButton} className="burger" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}><span/><span/><span/></button>
      {menu && <button className="menu-backdrop" aria-label="Close navigation" tabIndex={-1} onClick={() => { setMenu(false); menuButton.current.focus(); }}/>}
      <nav id="navigation" ref={navRef} aria-label="Main navigation"><ul>{pages.map(item => <li key={item}><Link to={item} aria-current={page === item || (item === 'portfolio' && project) ? 'page' : undefined}>{item}</Link></li>)}</ul></nav>
    </header>
    <main id="main" ref={main} tabIndex={-1} className={`main ${transition}`} onScroll={e => setScrolled(e.currentTarget.scrollTop > 40)}>
      <div key={page} className="page">
        {page === 'home' && <>
          <section className="section hero photo"><div className="section-wrapper"><Reveal className="hero-content"><h1>A different<br/>software approach.</h1><p>We’re MNK Labs, an independent software development studio. We turn complex ideas into thoughtful digital products — built with purpose and precision.</p><Button to="about">Meet the studio</Button></Reveal></div></section>
          <section className="section auto"><div className="section-wrapper"><Reveal><p className="eyebrow">WHAT WE DO</p><h2>Software that works for you.</h2><p className="intro">From your first idea to the systems that keep it running. We build dependable software with clear thinking, close collaboration, and careful engineering.</p></Reveal><Cards items={services.slice(0, 3)}/></div></section>
          <section className="section auto"><div className="section-wrapper"><Reveal><p className="eyebrow">SELECTED WORK</p><h2>Ideas made useful.</h2></Reveal><ProjectCards Link={Link} Reveal={Reveal}/><Button to="portfolio" tone="primary">Explore our portfolio</Button></div></section>
          <section className="section auto"><div className="section-wrapper"><div className="split"><Reveal><p className="eyebrow">THE WAY WE WORK</p><h2>Purpose.<br/>Precision.<br/>Partnership.</h2></Reveal><Reveal delay={120}><p>Every good product starts with a problem worth solving. We work with you to understand what matters, choose the right foundation, and turn it into something useful.</p><p>Small, deliberate steps. Clear communication. Software built for your next chapter.</p><Button to="capabilities" tone="primary">Explore our capabilities</Button></Reveal></div></div></section>
          <section className="section auto"><div className="section-wrapper"><Reveal><h2>Your next chapter, together.</h2><p>A new idea. A difficult problem. A better way of doing things.</p><Button to="contact">Start a conversation</Button></Reveal></div></section>
        </>}
        {page === 'about' && <section className="section about photo"><div className="section-wrapper"><div className="about-grid"><Reveal><img className="big-logo" src="/assets/icon_light.png" alt="MNK studio mark"/></Reveal><div><Reveal><p className="eyebrow">THE STUDIO</p><h1>About MNK Labs.</h1><p className="intro">We turn complex ideas into software that works.</p><p>MNK Labs is an independent software development studio building thoughtful digital products. We partner with people and teams to bring useful ideas to life — from web platforms and mobile apps to the systems that connect them.</p><p>We believe the best software is shaped by the people who use it. That means asking good questions, collaborating closely, and making careful engineering choices.</p><Button to="contact" tone="primary">Let’s work together</Button><Button to="capabilities">What we build</Button></Reveal><Reveal delay={140}><h2>Clear thinking. Careful delivery.</h2><p>We start with your problem, agree on what success looks like, and build in stages you can review. From discovery and design to development and ongoing improvements, we keep the work practical and the conversation open.</p><h2>The right tools for the task.</h2><p>React · Next.js · TypeScript · Node.js · Flutter · Python · PostgreSQL · Docker · Firebase · Cloud infrastructure</p></Reveal></div></div></div></section>}
        {page === 'capabilities' && <><section className="section capabilities photo"><div className="section-wrapper"><Reveal><p className="eyebrow">WHAT WE BUILD</p><h1>Built around your next step.</h1><p className="intro">Considered experiences. Connected systems. A dependable foundation for what comes next.</p><p>We bring product thinking and engineering together to build web platforms, mobile experiences, and the infrastructure behind them.</p></Reveal><div className="filters" aria-label="Filter capabilities">{['All','Web','Mobile'].map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><Cards items={services.filter(s => filter === 'All' || s.categories.includes(filter))}/></div></section><section className="section auto"><div className="section-wrapper"><Reveal><h2>From first question to launch.</h2><p>Discover the problem. Design the experience. Build the product. Keep improving.</p><Button to="contact" tone="primary">Tell us what you’re thinking</Button></Reveal></div></section></>}
        {page === 'portfolio' && <Portfolio Link={Link} Reveal={Reveal}/>}
        {project && <ProjectDetail project={project} Link={Link} Reveal={Reveal}/>}
        {page === 'contact' && <section className="section contact photo"><div className="section-wrapper"><Reveal className="contact-panel"><p className="eyebrow">LET’S MAKE SOMETHING USEFUL</p><h1>Start a conversation.</h1><p>A new idea. A difficult problem. A better way of doing things. We’d love to hear what you have in mind.</p><p>Tell us a little about your project, who it’s for, and what you want to achieve. We can start from there.</p><ContactForm/><Link to="capabilities" className="text-link">Explore what we build</Link></Reveal></div></section>}
        {page === 'missing' && <section className="section contact photo"><div className="section-wrapper"><Reveal className="contact-panel"><h1>Page not found.</h1><p>Let’s get you back to the studio.</p><Button to="home">Back to home</Button></Reveal></div></section>}
      </div>
    </main>
    <div className={`transition-cover ${transition}`} aria-hidden="true"><img src="/assets/icon_light.png" alt=""/></div>
    <footer className="footer">© {new Date().getFullYear()} <Link to="home">MNK LABS</Link><span>SOFTWARE DEVELOPMENT STUDIO</span></footer>
  </NavigationContext.Provider>;
}
