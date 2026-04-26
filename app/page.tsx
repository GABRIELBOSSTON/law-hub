"use client";
import Link from "next/link";

import { useEffect, useState } from "react";


const FallbackImage = ({ src, alt, className, style }: any) => {
  const [error, setError] = useState(false);
  if (error) {
    const initials = alt ? alt.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'NL';
    return (
      <div className={className} style={{...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: 600, color: 'var(--gold)', background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))'}}>
        {initials}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setError(true)} />;
};

export default function Home() {

  
  const [showBackTop, setShowBackTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const closeMobileMenu = () => setMenuOpen(false);

  const submitForm = () => {
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('sent');
      // Clear inputs manually if needed, or if we had a form ref
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    // Custom cursor logic
    const cursor = document.querySelector(".cursor") as HTMLElement;
    const ring = document.querySelector(".cursor-ring") as HTMLElement;
    
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    const moveCursor = (e: MouseEvent) => {
      if (cursor && ring) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      }
    };

    document.addEventListener("mousemove", moveCursor);
    return () => {
      observer.disconnect();
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-ring"></div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={closeMobileMenu}>Home</a>
        <a href="#about" onClick={closeMobileMenu}>About</a>
        <Link href="/articles" onClick={closeMobileMenu}>Articles</Link>
        <a href="#logo-section" onClick={closeMobileMenu}>Our Logo</a>
        <a href="#team" onClick={closeMobileMenu}>Our Team</a>
        <a href="#contract" onClick={closeMobileMenu}>Legal Contract</a>
        <a href="#contact" onClick={closeMobileMenu}>Contact Us</a>
      </div>

      
      <a href="#home" className={`back-top ${showBackTop ? 'visible' : ''}`} aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
      </a>

      <nav id="navbar">
  <a href="#home" className="nav-logo">Nusantara <span>Law Hub</span></a>
  <ul className="nav-links">
    <li><a href="#home" className="active">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><Link href="/articles">Articles</Link></li>
    <li><a href="#logo-section">Our Logo</a></li>
    <li><a href="#team">Our Team</a></li>
    <li><a href="#contract">Legal Contract</a></li>
    <li><a href="#contact">Contact Us</a></li>
  </ul>
  <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
    <span></span><span></span><span></span>
  </button>
</nav>

{/* HERO */}
<section id="home">
  <div className="hero-bg"></div>
  <div className="hero-lines"></div>
  <div className="hero-content">
    <div className="hero-badge">Student-Based Legal Initiative</div>
    <h1 className="hero-title">
      <em>Nusantara</em>
      <span className="block-2">Law Hub</span>
    </h1>
    <p className="hero-subtitle">Legal Consultation & Documentation Project</p>
    <div className="hero-desc">
      <p>Nusantara Law Hub is an academic-based legal documentation and awareness initiative, designed to help students, early-stage entrepreneurs, and small businesses understand and apply essential legal practices in their projects and operations.</p>
      <p>We prioritize preventive legal understanding — translating general legal principles into practical, easy-to-use documentation guidance, with a primary focus on supporting President University students across all majors.</p>
    </div>
    <div className="hero-cta">
      <a href="#contact" className="btn-primary">
        <span>Get Consultation</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
      <a href="#about" className="btn-outline">
        Learn More
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>
  </div>
  <div className="hero-scroll"><div className="scroll-line"></div>Scroll to explore</div>
</section>

{/* STATS */}
<div className="stats-bar">
  <div className="stat-item"><span className="stat-num">9</span><span className="stat-label">Team Members</span></div>
  <div className="stat-divider"></div>
  <div className="stat-item"><span className="stat-num">3</span><span className="stat-label">Core Divisions</span></div>
  <div className="stat-divider"></div>
  <div className="stat-item"><span className="stat-num">100%</span><span className="stat-label">Student-Based</span></div>
  <div className="stat-divider"></div>
  <div className="stat-item"><span className="stat-num">1</span><span className="stat-label">Mission: Awareness</span></div>
</div>

{/* MARQUEE */}
<div className="marquee-section">
  <div className="marquee-track">
    <div className="marquee-item">Legal Consultation</div><div className="marquee-item">Documentation Project</div><div className="marquee-item">Student Legal Awareness</div><div className="marquee-item">Risk Prevention</div><div className="marquee-item">Academic Project Support</div><div className="marquee-item">Legal Writing</div><div className="marquee-item">Contract Guidance</div><div className="marquee-item">Ethical Decision Making</div><div className="marquee-item">Legal Consultation</div><div className="marquee-item">Documentation Project</div><div className="marquee-item">Student Legal Awareness</div><div className="marquee-item">Risk Prevention</div><div className="marquee-item">Academic Project Support</div><div className="marquee-item">Legal Writing</div><div className="marquee-item">Contract Guidance</div><div className="marquee-item">Ethical Decision Making</div>
  </div>
</div>

{/* ABOUT */}
<section id="about">
  <div className="about-grid">
    <div className="about-left">
      <div className="section-label reveal">About Us</div>
      <h2 className="section-title reveal reveal-delay-1">Empowering Students<br />Through <em>Legal Clarity</em></h2>
      <p className="about-text reveal reveal-delay-2">Nusantara Law Hub is a student-based legal documentation initiative developed as part of an academic project. We focus on helping students and small project teams understand basic legal matters that commonly arise in collaborations, events, and early business activities.</p>
      <p className="about-text reveal reveal-delay-3">Our goal is not to replace licensed lawyers, but to promote legal awareness, prevention, and responsible decision-making among students — equipping the next generation with the knowledge to navigate agreements and obligations confidently.</p>
      <div className="divider" style={{margin: "40px 0"}}></div>
      <div className="reveal reveal-delay-4" style={{display: "flex", gap: "40px"}}>
        <div>
          <div style={{fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "var(--gold)", fontWeight: "300"}}>9</div>
          <div style={{fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)"}}>Dedicated Members</div>
        </div>
        <div style={{width: "1px", background: "rgba(201,168,76,0.15)"}}></div>
        <div>
          <div style={{fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "var(--gold)", fontWeight: "300"}}>∞</div>
          <div style={{fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)"}}>Legal Insights</div>
        </div>
        <div style={{width: "1px", background: "rgba(201,168,76,0.15)"}}></div>
        <div>
          <div style={{fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", color: "var(--gold)", fontWeight: "300"}}>1st</div>
          <div style={{fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)"}}>Academic Initiative</div>
        </div>
      </div>
    </div>
    <div className="about-visual">
      <div className="about-cards-stack">
        <div className="about-card reveal reveal-delay-1">
          <div className="about-card-num">01</div>
          <h3>Legal Consultation</h3>
          <p>We provide clear, accessible guidance on legal matters relevant to student projects, academic collaborations, and early-stage entrepreneurial activities.</p>
        </div>
        <div className="about-card reveal reveal-delay-2">
          <div className="about-card-num">02</div>
          <h3>Documentation Support</h3>
          <p>We assist in drafting, reviewing, and understanding basic legal documents — from collaboration agreements to event contracts and organizational bylaws.</p>
        </div>
        <div className="about-card reveal reveal-delay-3">
          <div className="about-card-num">03</div>
          <h3>Awareness & Education</h3>
          <p>Through workshops, publications, and one-on-one sessions, we educate students about their legal rights, obligations, and the importance of ethical decision-making.</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* LOGO SECTION */}
<section id="logo-section">
  <div className="logo-section-inner">
    <div className="logo-section-header">
      <div className="section-label reveal" style={{justifyContent: "center"}}>Identity</div>
      <h2 className="section-title reveal reveal-delay-1" style={{textAlign: "center"}}>Our <em>Logo</em> & What It Stands For</h2>
      <p className="reveal reveal-delay-2" style={{textAlign: "center", fontSize: "15px", color: "var(--text-muted)", maxWidth: "580px", margin: "0 auto", lineHeight: "1.85", fontWeight: "300"}}>
        Every element of our logo is intentional — crafted to reflect the values of legal certainty, integrity, and a spirit of education for the younger generation.
      </p>
    </div>

    <div className="logo-main-grid">
      <div className="logo-image-wrapper reveal">
        <div className="logo-image-frame">
          <div className="logo-corner logo-corner-tl"></div>
          <div className="logo-corner logo-corner-tr"></div>
          <div className="logo-corner logo-corner-bl"></div>
          <div className="logo-corner logo-corner-br"></div>
          <FallbackImage src="/images/logo.jpeg" alt="Nusantara Law Hub Logo" />
          <div className="logo-placeholder" style={{display: "none"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
              <path d="M5 8l7-3 7 3v4l-7 3-7-3z"/>
              <path d="M5 12v4l7 3 7-3v-4"/>
            </svg>
            <p>Place logo.jpeg<br />in the same folder</p>
          </div>
        </div>
        <div className="logo-name-tag">
          <span>Nusantara Law Hub</span>
          <small>Official Brand Mark</small>
        </div>
      </div>

      <div className="reveal reveal-delay-1">
        <p className="logo-overview-intro">
          This logo is designed to reflect the values of legal certainty, integrity, and the spirit of education for the younger generation — embodying everything Nusantara Law Hub stands for as a student-based legal initiative.
        </p>
        <div className="logo-symbols">
          <div className="logo-symbol-card">
            <div className="logo-symbol-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="3" x2="12" y2="21"/><path d="M5 7l7-4 7 4"/><path d="M5 7v5l7 2 7-2V7"/>
              </svg>
            </div>
            <div className="logo-symbol-content">
              <h4>Scales of Justice</h4>
              <p>Positioned at the center, the scales are the universal symbol of law — representing justice, balance, and objectivity. For Nusantara Law Hub, this reflects our core focus on providing fair and accurate legal guidance to students and early entrepreneurs.</p>
            </div>
          </div>
          <div className="logo-symbol-card">
            <div className="logo-symbol-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <path d="M8 12s1-2 4-2 4 2 4 2-1 2-4 2-4-2-4-2z"/>
              </svg>
            </div>
            <div className="logo-symbol-content">
              <h4>Laurel Wreath</h4>
              <p>The ring of laurel leaves framing the central symbol represents honor, achievement, and excellence. In an academic context, it affirms that this initiative was born from a university environment (President University) and aspires toward the highest standards of legal literacy.</p>
            </div>
          </div>
          <div className="logo-symbol-card">
            <div className="logo-symbol-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
            <div className="logo-symbol-content">
              <h4>Central Circle</h4>
              <p>The circular form symbolizes a solid community, protection, and a holistic approach — aligned with our mission to provide preventive protection through clear legal documentation and structured guidance for every student.</p>
            </div>
          </div>
        </div>

        <div style={{marginTop: "32px"}}>
          <div style={{fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px"}}>
            <span style={{display: "block", width: "24px", height: "1px", background: "var(--gold)"}}></span>
            Color Philosophy
          </div>
          <div className="logo-palette">
            <div className="palette-card reveal reveal-delay-2">
              <div className="palette-swatch gold"></div>
              <div className="palette-info">
                <h5>Gold / Bronze</h5>
                <p>Symbolizes wisdom, prestige, and the high value of knowledge — a mark of quality and intellectual aspiration.</p>
              </div>
            </div>
            <div className="palette-card reveal reveal-delay-3">
              <div className="palette-swatch dark-brown"></div>
              <div className="palette-info">
                <h5>Deep Brown</h5>
                <p>Conveys stability, trust, and grounded professionalism — making the logo feel luxurious yet serious.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* PROBLEM */}
<section id="problem">
  <div className="problem-inner">
    <div className="problem-header">
      <div className="section-label reveal" style={{justifyContent: "center"}}>The Problem</div>
      <h2 className="section-title reveal reveal-delay-1" style={{textAlign: "center", maxWidth: "600px", margin: "0 auto 16px"}}>Why Legal Awareness <em>Matters</em> for Students</h2>
      <p className="reveal reveal-delay-2" style={{textAlign: "center", fontSize: "15px", color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: "1.8"}}>Many students engage in projects and business activities without understanding the legal implications involved.</p>
    </div>
    <div className="problem-grid">
      <div className="problem-item reveal">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        <h3>Unclear Responsibilities</h3>
        <p>Without proper legal understanding, student collaborators often enter agreements without clear delineation of duties, leading to disputes and unequal contribution that could have been prevented.</p>
      </div>
      <div className="problem-item reveal reveal-delay-1">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        <h3>Legal Blind Spots</h3>
        <p>Students routinely overlook critical legal considerations — intellectual property rights, liability clauses, and termination conditions — exposing themselves and their teams to unnecessary risk.</p>
      </div>
      <div className="problem-item reveal reveal-delay-2">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
        <h3>Financial Losses</h3>
        <p>Financial disputes arising from poorly documented agreements are among the most common challenges faced by student project teams, many of which could have been avoided with basic legal awareness.</p>
      </div>
      <div className="problem-item reveal reveal-delay-1">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <h3>Rights & Obligations</h3>
        <p>Legal awareness helps students recognize their rights and obligations, enabling them to manage risks and make informed decisions when entering agreements or handling organizational finances.</p>
      </div>
      <div className="problem-item reveal reveal-delay-2">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <h3>Early Exposure</h3>
        <p>Early exposure to legal knowledge prepares students to act responsibly and ethically in professional and entrepreneurial environments, reducing the likelihood of future conflicts.</p>
      </div>
      <div className="problem-item reveal reveal-delay-3">
        <svg className="problem-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <h3>Preventive Approach</h3>
        <p>We advocate for a preventive rather than reactive legal mindset — equipping students with tools and knowledge to identify and address potential legal issues before they escalate into costly problems.</p>
      </div>
    </div>
    <div className="problem-quote reveal">
      <p>"We help students avoid legal mistakes before they become real problems by translating legal concepts into clear, practical guidance that students can actually understand."</p>
      <cite>— Nusantara law hub</cite>
    </div>
  </div>
</section>

{/* TEAM */}
<section id="team">
  <div className="team-inner">
    <div className="team-header">
      <div>
        <div className="section-label reveal">The People</div>
        <h2 className="section-title reveal reveal-delay-1">Our <em>Team</em></h2>
      </div>
      <p className="reveal" style={{fontSize: "14px", color: "var(--text-muted)", maxWidth: "320px", textAlign: "right", lineHeight: "1.7", fontWeight: "300"}}>Passionate, dedicated students bringing legal awareness to their peers.</p>
    </div>

    <div className="team-grid" style={{marginBottom: "2px"}}>
      <div className="team-card team-featured reveal">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/dhie.png" alt="Dhiezella Sihite" />
          </div>
          <div className="team-num">01</div>
        </div>
        <h3>Dhiezella Sihite</h3>
        <div className="team-role">Managing Partner</div>
        <div className="team-divider"></div>
        <p>Leads the firm's overall direction and strategy, ensuring alignment between all divisions and upholding the firm's commitment to accessible, high-quality legal education for students.</p>
        <a href="https://www.linkedin.com/in/dhiezella-s-sihite-310727364" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
    </div>
      <div className="team-card reveal reveal-delay-1">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/head.png" alt="Fara Hanifah" />
          </div>
          <div className="team-num">02</div>
        </div>
        <h3>Fara Hanifah</h3>
        <div className="team-role">Head of Legal Consultant</div>
        <div className="team-divider"></div>
        <p>Oversees all legal consultation activities, guiding students through complex legal matters with clarity and precision. Ensures all advice adheres to ethical and academic standards.</p>
        <a href="https://www.linkedin.com/in/fara-hanifah-ba5596305" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
      <div className="team-card reveal reveal-delay-2">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/legal.png" alt="Anastasia Novenia" />
          </div>
          <div className="team-num">03</div>
        </div>
        <h3>Anastasia Novenia P. Y</h3>
        <div className="team-role">Head of Legal Writer</div>
        <div className="team-divider"></div>
        <p>Leads the production of all legal documentation, publications, and written materials. Transforms complex legal language into accessible, well-structured content for student audiences.</p>
        <a href="https://www.linkedin.com/in/anastasia-novenia-putri-yogaswara-352086381" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
    </div>

    <div className="team-row-2" style={{marginBottom: "2px"}}>
      <div className="team-card reveal">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/human.png" alt="Andreas Bramantio" />
          </div>
          <div className="team-num">04</div>
        </div>
        <h3>Andreas Bramantio S</h3>
        <div className="team-role">Human Resource Manager</div>
        <div className="team-divider"></div>
        <p>Manages the firm's talent, team culture, and internal coordination. Ensures every member thrives in their role and contributes meaningfully to the firm's mission.</p>
        <a href="https://www.linkedin.com/in/andreas-simalango-1237a0380" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
      <div className="team-card reveal reveal-delay-1">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/marketing.png" alt="Natasha Aderina" />
          </div>
          <div className="team-num">05</div>
        </div>
        <h3>Natasha Aderina P</h3>
        <div className="team-role">Marketing Officer</div>
        <div className="team-divider"></div>
        <p>Drives the firm's outreach and brand visibility, crafting campaigns that connect with student audiences and communicate the value of legal awareness in an engaging way.</p>
        <a href="https://www.linkedin.com/in/natasha-aderina-pinem-1a8ab2380" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
      <div className="team-card reveal reveal-delay-2">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/PR.png" alt="Zahwa" />
          </div>
          <div className="team-num">06</div>
        </div>
        <h3>Zahwa</h3>
        <div className="team-role">Public Relation & Partnership Officer</div>
        <div className="team-divider"></div>
        <p>Builds and maintains strategic relationships with student organizations, faculty, and external partners. Represents Nusantara's values in all public-facing communications.</p>
        <a href="https://www.linkedin.com/in/zahwa-a-6ab676380" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
    </div>

    <div className="team-row-3">
      <div className="team-card reveal">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/design.png" alt="Sevita M. Sibarani" />
          </div>
          <div className="team-num">07</div>
        </div>
        <h3>Sevita M. Sibarani</h3>
        <div className="team-role">Publication & Design Officer</div>
        <div className="team-divider"></div>
        <p>Shapes the firm's visual identity and publication strategy. Creates compelling design assets and manages content releases that reflect Nusantara's professional and approachable brand.</p>
        <a href="https://www.linkedin.com/in/sevita-s-240088381" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
      <div className="team-card reveal reveal-delay-1">
        <div className="team-card-top">
          <div className="team-avatar">
            <FallbackImage src="/images/inibukanygngoding.png" alt="Reky Febrio Putrawan" />
          </div>
     <div className="team-num">08</div>
        </div>
        <h3>Reky Febrio Putrawan</h3>
        <div className="team-role">Staff of Marketing</div>
        <div className="team-divider"></div>
        <p>Supports marketing initiatives and campaign execution, contributing fresh ideas and creative energy to expand the firm's reach within the student community and beyond.</p>
        <a href="https://www.linkedin.com/in/reky-putrawan-3983263b4" target="_blank" rel="noopener noreferrer" className="team-linkedin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
    </div>

    <div style={{display: "grid", gridTemplateColumns: "1fr", gap: "2px", marginTop: "2px"}}>
      <div className="team-card reveal" style={{display: "grid", gridTemplateColumns: "auto 1fr", gap: "32px", alignItems: "center"}}>
        <div>
          <div className="team-card-top" style={{marginBottom: "0"}}>
            <div className="team-avatar" style={{width: "72px", height: "72px", fontSize: "26px"}}>
              <FallbackImage src="/images/xu.png" alt="Xu Wanru" style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", borderRadius: "50%", display: "block"}} />
            </div>
          </div>
        </div>
        <div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
            <div>
              <h3>Xu Wanru</h3>
              <div className="team-role">Staff of Public Relation & Partnership</div>
              <div className="team-divider"></div>
              <p>Assists in building and maintaining the firm's public relations network, fostering partnerships that amplify Nusantara's impact and legal awareness mission.</p>
              <a href="https://www.linkedin.com/in/wanru-xu-b112103ab" target="_blank" rel="noopener noreferrer" className="team-linkedin">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
            <div className="team-num">09</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/* LEGAL CONTRACT */}
<section id="contract">
  <div className="contract-inner">
    <div className="contract-header">
      <div className="section-label reveal" style={{justifyContent: "center"}}>Our Services</div>
      <h2 className="section-title reveal reveal-delay-1" style={{textAlign: "center", maxWidth: "640px", margin: "0 auto 20px"}}>Provide Legal <em>Contract</em></h2>
      <p className="contract-intro reveal reveal-delay-2">We help students and early-stage project teams navigate the world of legal agreements — providing structured, clear, and practical contract documentation tailored to academic and entrepreneurial needs.</p>
    </div>
    <div className="contract-grid">
      <div className="contract-card reveal">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <h3>Collaboration Agreement</h3>
        <p>A structured contract defining roles, responsibilities, and ownership between parties in a joint academic project, startup, or team collaboration — preventing disputes before they arise.</p>
        <span className="contract-tag">Academic & Project Use</span>
      </div>
      <div className="contract-card reveal reveal-delay-1">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        <h3>Event & Organizational Contract</h3>
        <p>Formal agreements for student organizations and event committees — covering vendor arrangements, sponsorship terms, and participant obligations to protect all parties involved.</p>
        <span className="contract-tag">Student Organizations</span>
      </div>
      <div className="contract-card reveal reveal-delay-2">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        <h3>Non-Disclosure Agreement</h3>
        <p>Protect your ideas, research, and business concepts with a clear NDA. Essential for student entrepreneurs sharing sensitive information with potential partners, investors, or collaborators.</p>
        <span className="contract-tag">Confidentiality & IP</span>
      </div>
      <div className="contract-card reveal reveal-delay-1">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        <h3>Service Agreement</h3>
        <p>A clear service contract for freelance work, internship arrangements, or student-run business services — outlining deliverables, timelines, payment terms, and termination clauses.</p>
        <span className="contract-tag">Freelance & Business</span>
      </div>
      <div className="contract-card reveal reveal-delay-2">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <h3>Partnership MOU</h3>
        <p>A Memorandum of Understanding for inter-organizational partnerships, university collaborations, or community engagement programs — establishing mutual goals and shared obligations clearly.</p>
        <span className="contract-tag">Institutional Partnerships</span>
      </div>
      <div className="contract-card reveal reveal-delay-3">
        <svg className="contract-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <h3>Custom Contract Review</h3>
        <p>Submit an existing agreement for review. Our team will analyze the terms, flag potential risks, and provide guidance to help you make informed decisions before signing.</p>
        <span className="contract-tag">Review & Analysis</span>
      </div>
    </div>
    <div className="contract-cta-block reveal">
      <div className="contract-cta-text">
        <h3>Need a <em>Custom Contract</em>?</h3>
        <p>Every situation is unique. If your project requires a tailored legal document not listed above, reach out to our team. We'll work with you to understand your needs and provide the right documentation guidance.</p>
      </div>
      <a href="#contact" className="btn-primary"><span>Request a Contract</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
    </div>
  </div>
</section>

{/* CONTACT */}
<section id="contact">
  <div className="contact-inner">
    <div className="section-label reveal" style={{marginBottom: "16px"}}>Get in Touch</div>
    <div className="contact-grid">
      <div className="contact-info">
        <h2 className="reveal reveal-delay-1">Let's Start a<br /><em>Conversation</em></h2>
        <p className="reveal reveal-delay-2">Whether you have a legal question about your student project, need documentation guidance, or simply want to learn more about legal awareness — we're here to help.</p>
        <div className="contact-detail reveal reveal-delay-2">
          <div className="contact-detail-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div className="contact-detail-text"><small>Office Address</small><span>Jababeka Education Park, Jl. Ki Hajar Dewantara,<br />Mekarmukti, Cikarang Utara, Bekasi Regency,<br />West Java 17530</span></div>
        </div>
        <div className="contact-detail reveal reveal-delay-3">
          <div className="contact-detail-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.31-1.32a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
          <div className="contact-detail-text"><small>Contact Person (PR)</small><span><a href="tel:+6285282738263">+62 852-8273-8263</a></span></div>
        </div>
        <div className="contact-detail reveal reveal-delay-3">
          <div className="contact-detail-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
          <div className="contact-detail-text"><small>Email</small><span><a href="mailto:nusantara.lawhub@gmail.com">nusantara.lawhub@gmail.com</a></span></div>
        </div>
        <div className="contact-detail reveal reveal-delay-4">
          <div className="contact-detail-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div>
          <div className="contact-detail-text"><small>Instagram</small><span><a href="https://www.instagram.com/nusantaralawhub" target="_blank" rel="noopener noreferrer">@nusantaralawhub</a></span></div>
        </div>
        <div className="contact-detail reveal reveal-delay-4">
          <div className="contact-detail-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg></div>
          <div className="contact-detail-text"><small>Services</small><span>Legal Consultation · Documentation Review<br />Legal Writing · Awareness Workshops</span></div>
        </div>
      </div>
      <div className="contact-form reveal reveal-delay-2" id="contactFormWrapper">
        <div id="formContent">
          <h3 className="form-title">Send a Message</h3>
          <p className="form-subtitle">We'll get back to you as soon as possible.</p>
          <div className="form-row">
            <div className="form-group"><label>First Name</label><input type="text" placeholder="Your first name" id="firstName" /></div>
            <div className="form-group"><label>Last Name</label><input type="text" placeholder="Your last name" id="lastName" /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" id="email" /></div>
          <div className="form-group">
            <label>Subject</label>
            <select id="subject" defaultValue="">
              <option value="" disabled>Select a topic...</option>
              <option value="consultation">Legal Consultation</option>
              <option value="documentation">Documentation Review</option>
              <option value="writing">Legal Writing Assistance</option>
              <option value="contract">Legal Contract</option>
              <option value="workshop">Workshop Inquiry</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group"><label>Message</label><textarea placeholder="Tell us about your legal matter or inquiry..." id="message"></textarea></div>
          <button 
        className="btn-submit" 
        onClick={submitForm}
        style={{
          pointerEvents: formStatus === 'sending' ? 'none' : 'auto',
          background: formStatus === 'sent' ? 'var(--gold)' : '',
          color: formStatus === 'sent' ? '#000' : ''
        }}
      >
        <span>
          {formStatus === 'idle' && 'Send Message'}
          {formStatus === 'sending' && 'Sending...'}
          {formStatus === 'sent' && 'Message Sent'}
        </span>
      </button>
        </div>
        <div className="form-success" id="formSuccess">
          <div className="check">✓</div>
          <h3>Message Received</h3>
          <p>Thank you for reaching out. Our team will review your inquiry and respond within 1–2 business days.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div className="footer-top">
    <div className="footer-brand">
      <span className="logo">Nusantara <span>Law Hub</span></span>
      <p>A student-based legal documentation initiative promoting legal awareness, prevention, and responsible decision-making among students in academic and entrepreneurial settings.</p>
    </div>
    <div className="footer-col">
      <h4>Navigation</h4>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#logo-section">Our Logo</a></li>
        <li><a href="#problem">The Problem</a></li>
        <li><a href="#team">Our Team</a></li>
        <li><a href="#contract">Legal Contract</a></li>
        <li><a href="#contact">Contact Us</a></li>
      </ul>
    </div>
    <div className="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="#contract">Legal Contract</a></li>
        <li><a href="#contact">Legal Consultation</a></li>
        <li><a href="#contact">Documentation Review</a></li>
        <li><a href="#contact">Legal Writing</a></li>
        <li><a href="#contact">Awareness Workshops</a></li>
        <li><a href="#contact">Partnership Inquiries</a></li>
      </ul>
    </div>
  </div>
  <div className="footer-bottom">
    <p>© 2025 <span>nusantara law hub</span>. Student Academic Project.</p>
    <p>Jababeka Education Park · Cikarang Utara · West Java</p>
  </div>
</footer>
    </>
  );
}
