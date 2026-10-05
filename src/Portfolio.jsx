import { useRef, useState } from 'react';
import { projects } from './projects';

export function ProjectCards({ Link, Reveal }) {
  return <div className="project-grid">{projects.map((project, i) => <Reveal key={project.slug} delay={i * 100}><Link to={`portfolio/${project.slug}`} className="project-card"><div className="project-preview"><img src={project.cover} alt={`${project.name} public homepage`} loading="lazy" width="1280" height="720"/></div><div className="project-card-copy"><p className="eyebrow">{project.category}</p><h3>{project.name}</h3><p>{project.summary}</p><span className="project-card-action">Explore the project</span></div></Link></Reveal>)}</div>;
}

export function Portfolio({ Link, Reveal }) {
  return <section className="section portfolio-page"><div className="section-wrapper"><Reveal><p className="eyebrow">SELECTED WORK / MNK LABS</p><h1>Ideas made useful.</h1><p className="portfolio-lead">Two different worlds. The same care in how they’re built.</p><p className="intro">Explore the product thinking, customer experiences, and engineering behind GetPrio and PrintCollective.</p></Reveal><ProjectCards Link={Link} Reveal={Reveal}/></div></section>;
}

function ScreenshotGallery({ project }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(0);
  return <><div className="screenshot-gallery">{project.screenshots.map((shot, i) => <figure key={shot.src}><button className="screenshot-button" aria-label={`Enlarge ${project.name}: ${shot.title}`} onClick={() => { setSelected(i); dialog.current.showModal(); }}><img src={shot.src} alt={`${project.name}: ${shot.title}`} loading="lazy" width="1280" height="720"/><span>Enlarge screenshot</span></button><figcaption><h3>{shot.title}</h3><p>{shot.caption}</p></figcaption></figure>)}</div><dialog ref={dialog} className="screenshot-dialog" aria-label={`${project.name} screenshot`} onClick={event => { if(event.target === dialog.current) dialog.current.close(); }}><button className="dialog-close" onClick={() => dialog.current.close()} autoFocus>Close screenshot</button><img src={project.screenshots[selected].src} alt={`${project.name}: ${project.screenshots[selected].title}`}/><p>{project.screenshots[selected].caption}</p></dialog></>;
}

export function ProjectDetail({ project, Link, Reveal }) {
  const next = projects.find(item => item.slug !== project.slug);
  return <article className={`case-study case-${project.slug}`}>
    <section className="section auto case-hero"><div className="section-wrapper"><Link to="portfolio" className="case-back">Back to portfolio</Link><Reveal><p className="eyebrow">{project.category}</p><h1>{project.name}</h1><p className="case-headline">{project.headline}</p><p className="case-summary">{project.summary}</p><a className="btn primary" href={project.url} target="_blank" rel="noopener noreferrer">Visit {project.name}</a></Reveal><Reveal className="case-cover"><img src={project.cover} alt={`${project.name} live public homepage`} width="1280" height="720"/></Reveal><dl className="project-facts"><div><dt>Project</dt><dd>{project.name}</dd></div><div><dt>Who it serves</dt><dd>{project.audience}</dd></div><div><dt>Product scope</dt><dd>{project.scope}</dd></div></dl></div></section>
    <section className="section auto"><div className="section-wrapper case-section"><p className="eyebrow">01 / THE PROJECT</p><div className="case-columns"><h2>{project.headline}</h2><div>{project.overview.map(text => <p key={text}>{text}</p>)}</div></div><div className="case-columns case-challenge"><h2>The challenge</h2><p>{project.challenge}</p></div></div></section>
    <section className="section auto case-surface"><div className="section-wrapper case-section"><p className="eyebrow">02 / THE EXPERIENCE</p><h2>What the product makes possible.</h2><div className="feature-grid">{project.features.map(([title, text], i) => <div key={title}><span className="card-label">0{i + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section auto"><div className="section-wrapper case-section"><p className="eyebrow">03 / IN THE PRODUCT</p><h2>A closer look.</h2><p>Public product screens, captured October 5, 2026. Select an image to explore it at full size.</p><ScreenshotGallery project={project}/></div></section>
    <section className="section auto case-surface"><div className="section-wrapper case-section"><p className="eyebrow">04 / THE ENGINEERING</p><h2>The thinking behind the experience.</h2><div className="engineering-list">{project.engineering.map(([title,text]) => <div className="case-columns" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section auto"><div className="section-wrapper case-section"><p className="eyebrow">05 / BUILT WITH</p><h2>The technology behind {project.name}.</h2><div className="stack-grid">{project.stack.map(([label,tools,text]) => <div key={label}><p className="stack-label">{label}</p><h3>{tools}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section auto case-surface"><div className="section-wrapper case-section"><p className="eyebrow">06 / THE RESULT</p><div className="case-columns"><h2>A connected product.</h2><p>{project.result}</p></div><div className="case-next"><Link to={`portfolio/${next.slug}`}><span className="eyebrow">NEXT PROJECT</span><h3>{next.name}</h3><p>{next.summary}</p></Link><Link to="contact" className="btn primary">Let’s build your next chapter</Link></div></div></section>
  </article>;
}
