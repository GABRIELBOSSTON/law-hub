"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Articles() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [shareMessage, setShareMessage] = useState(false);

  // STATE UNTUK RANDOM & LIMIT (TOMBOL +)
  const [shuffledRecommended, setShuffledRecommended] = useState<any[]>([]);
  const [shuffledLatest, setShuffledLatest] = useState<any[]>([]);

  const [recLimit, setRecLimit] = useState(3);
  const [latestLimit, setLatestLimit] = useState(6);
  const [deepLimit, setDeepLimit] = useState(4);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        const sortedData = data.reverse(); // Yang terbaru di atas
        setArticles(sortedData);

        const feat = sortedData.find((a: any) => a.isFeatured);
        const deep = sortedData.filter((a: any) => a.isDeepRead);

        // RECOMMENDED: Ambil semua, lalu acak
        setShuffledRecommended([...sortedData].sort(() => 0.5 - Math.random()));

        // LATEST: Ambil artikel lama (lewati 4 artikel terbaru), kecualikan Featured & Deep Read, lalu acak
        const olderArticles = sortedData.slice(4).filter((a: any) => a.id !== feat?.id && !a.isDeepRead);
        setShuffledLatest([...olderArticles].sort(() => 0.5 - Math.random()));

        setLoading(false);

        // FITUR SHARE: Cek URL
        const urlParams = new URLSearchParams(window.location.search);
        const readSlug = urlParams.get('read');
        if (readSlug) openModal(readSlug);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
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
  }, [articles, activeCategory, recLimit, latestLimit, deepLimit]);

  const openModal = (id: string) => {
    setActiveArticleId(id);
    document.body.style.overflow = 'hidden';
    window.history.pushState({}, '', `/articles?read=${id}`);
  };

  const closeModal = () => {
    setActiveArticleId(null);
    document.body.style.overflow = '';
    window.history.pushState({}, '', '/articles');
  };

  const copyLink = () => {
    if (!activeArticle) return;
    const url = `${window.location.origin}/articles?read=${activeArticle.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareMessage(true);
      setTimeout(() => setShareMessage(false), 2000);
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // PEMISAHAN DATA RENDER
  const activeArticle = activeArticleId ? articles.find(a => a.id === activeArticleId) : null;
  const featuredArticle = articles.find(a => a.isFeatured);

  // Sidebar Recent (Selalu 4 terbaru)
  const recentArticles = articles.slice(0, 4);

  // Filter Latest berdasarkan kategori aktif
  const filteredLatest = activeCategory === 'all'
    ? shuffledLatest
    : shuffledLatest.filter(a => a.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const displayLatest = filteredLatest.slice(0, latestLimit);
  const displayRec = shuffledRecommended.slice(0, recLimit);

  const deepReads = articles.filter(a => a.isDeepRead);
  const displayDeep = deepReads.slice(0, deepLimit);

  // CSS Tombol Load More (+)
  const btnLoadMoreStyle = {
    background: 'transparent',
    border: '1px solid var(--gold)',
    color: 'var(--gold)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '30px auto 0',
    transition: 'all 0.3s'
  };

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      <a href="#" className="back-top" id="backTop" aria-label="Back to top" style={{ zIndex: 1100 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
      </a>

      {/* NAVBAR */}
      <nav id="navbar" className="scrolled" style={{ zIndex: 2000, position: 'fixed', top: 0, width: '100%', background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201, 168, 76, 0.15)' }}>
        <Link href="/#home" className="nav-logo">Nusantara <span>Law Hub</span></Link>
        <ul className="nav-links">
          <li><Link href="/#home">Home</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/articles" className="active">Articles</Link></li>
          <li>
            <Link href="/admin/login" style={{ fontSize: '10px', padding: '6px 14px', border: '1px solid var(--gold)', color: 'var(--gold)', marginLeft: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Access
            </Link>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: '100px' }}>

        {/* FILTER BAR */}
        <div className="filter-section" id="filterSection" style={{ position: 'relative', top: 'auto', zIndex: 1 }}>
          <div className="filter-inner">
            <div className="filter-left">
              <h1 className="filter-heading" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>Legal <em>Articles</em> & Insights</h1>
              <div className="filter-tabs" id="filterTabs">
                {['all', 'contracts', 'intellectual property', 'collaboration', 'business', 'rights & obligations'].map(cat => (
                  <button
                    key={cat}
                    className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setLatestLimit(6); }}
                    style={{ padding: '6px 14px', fontSize: '10px' }}
                  >
                    {cat === 'intellectual property' ? 'IP' : cat === 'rights & obligations' ? 'Rights' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" placeholder="Search..." autoComplete="off" />
            </div>
          </div>
        </div>

        <section className="articles-section">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--gold)' }}>Loading articles...</div>
          ) : (
            <>
              {/* HEADLINE ARTICLE */}
              {featuredArticle && activeCategory === 'all' && (
                <div className="featured-article reveal" onClick={() => openModal(featuredArticle.id)} role="button" tabIndex={0}>
                  <div className="featured-img">
                    {featuredArticle.imageUrl ? (
                      <img src={featuredArticle.imageUrl} alt={featuredArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="featured-img-inner bg1"><div className="img-glyph">§</div></div>
                    )}
                    <div className="feat-badge">Headline</div>
                  </div>
                  <div className="featured-content">
                    <div className="article-meta">
                      <span className="article-cat">{featuredArticle.category}</span>
                      <span className="article-date">{featuredArticle.date}</span>
                      <span className="article-read-time">{featuredArticle.readTime}</span>
                    </div>
                    <h2 dangerouslySetInnerHTML={{ __html: featuredArticle.title }}></h2>
                    <p dangerouslySetInnerHTML={{ __html: truncateText(featuredArticle.lead, 150) }}></p>
                    <button className="read-link">Read Full Article</button>
                  </div>
                </div>
              )}

              <div className="articles-layout">
                <div className="articles-main">

                  {/* RECOMMENDED ARTICLES */}
                  {activeCategory === 'all' && shuffledRecommended.length > 0 && (
                    <div style={{ marginBottom: '80px' }}>
                      <div className="sec-label reveal"><span>Recommended For You</span></div>
                      <div className="articles-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {displayRec.map((article, index) => (
                          <div key={`rec-${article.id}`} className="article-card reveal" onClick={() => openModal(article.id)} role="button" tabIndex={0}>
                            <div className="card-img" style={{ height: '150px' }}>
                              {article.imageUrl ? (
                                <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div className={`card-img-inner bg${(index % 6) + 1}`}><div className="card-glyph">{article.category.charAt(0)}</div></div>
                              )}
                            </div>
                            <div className="card-content" style={{ padding: '20px' }}>
                              <div className="article-meta"><span className="article-cat">{article.category}</span></div>
                              <h3 style={{ fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: article.title }}></h3>
                            </div>
                          </div>
                        ))}
                      </div>
                      {shuffledRecommended.length > recLimit && (
                        <button onClick={() => setRecLimit(prev => prev + 3)} style={btnLoadMoreStyle}>+</button>
                      )}
                    </div>
                  )}

                  {/* LATEST ARTICLES (Artikel Lama yang Diacak) */}
                  <div className="sec-label reveal"><span>Latest Articles</span></div>
                  {filteredLatest.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No older articles found for this category.</p>
                  ) : (
                    <>
                      <div className="articles-grid">
                        {displayLatest.map((article, index) => (
                          <div key={article.id} className="article-card reveal" onClick={() => openModal(article.id)} role="button" tabIndex={0}>
                            <div className="card-img">
                              {article.imageUrl ? (
                                <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div className={`card-img-inner bg${(index % 6) + 1}`}><div className="card-glyph">{article.category.charAt(0)}</div></div>
                              )}
                            </div>
                            <div className="card-content">
                              <div className="article-meta">
                                <span className="article-cat">{article.category}</span>
                                <span className="article-date">{article.date}</span>
                              </div>
                              <h3 dangerouslySetInnerHTML={{ __html: article.title }}></h3>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                                {truncateText(article.lead, 90)}
                              </p>
                              <button className="read-link">Read Article</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {filteredLatest.length > latestLimit && (
                        <button onClick={() => setLatestLimit(prev => prev + 6)} style={btnLoadMoreStyle}>+</button>
                      )}
                    </>
                  )}

                  {/* DEEP READS */}
                  {activeCategory === 'all' && deepReads.length > 0 && (
                    <div style={{ marginTop: '80px' }}>
                      <div className="sec-label reveal"><span>Deep Reads</span></div>
                      <div className="articles-grid-2">
                        {displayDeep.map((article, index) => (
                          <div key={article.id} className="article-card article-card-wide reveal" onClick={() => openModal(article.id)} role="button" tabIndex={0}>
                            <div className="card-img">
                              {article.imageUrl ? (
                                <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div className={`card-img-inner bg${(index % 6) + 1}`}><div className="card-glyph">{article.category.charAt(0)}</div></div>
                              )}
                            </div>
                            <div className="card-content">
                              <div className="article-meta">
                                <span className="article-cat">{article.category}</span>
                                <span className="article-read-time">{article.readTime}</span>
                              </div>
                              <h3 dangerouslySetInnerHTML={{ __html: article.title }}></h3>
                              <p dangerouslySetInnerHTML={{ __html: truncateText(article.lead, 120) }}></p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {deepReads.length > deepLimit && (
                        <button onClick={() => setDeepLimit(prev => prev + 4)} style={btnLoadMoreStyle}>+</button>
                      )}
                    </div>
                  )}

                </div>

                {/* SIDEBAR (Recent Articles) */}
                <aside className="sidebar">
                  <div className="sw reveal">
                    <h4>Recent Articles</h4>
                    <ul className="recent-list">
                      {recentArticles.map(article => (
                        <li key={`recent-${article.id}`} className="recent-item" onClick={() => openModal(article.id)}>
                          <span>{article.category} · {article.date.split(' ')[0]} {article.date.split(' ')[1]}</span>
                          <p dangerouslySetInnerHTML={{ __html: article.title }}></p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sw cta-widget reveal reveal-d1" style={{ marginTop: "24px" }}>
                    <h4>Need Consultation?</h4>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "20px" }}>Have a specific legal question about your student project? Our team is here to help.</p>
                    <Link href="/#contact" className="btn-cta" style={{ background: 'var(--gold)', color: 'var(--dark)' }}>Contact Us</Link>
                  </div>
                </aside>
              </div>
            </>
          )}
        </section>
      </div>

      <footer style={{ padding: "40px 60px", background: "var(--dark-2)", borderTop: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
          <p>© 2025 Nusantara Law Hub</p>
          <p>President University Academic Project</p>
        </div>
      </footer>

      {/* REACT MODAL */}
      <div className={`modal-overlay ${activeArticle ? 'open' : ''}`} style={{ zIndex: 3000 }}>
        <div className="modal-container">
          <button className="modal-close" onClick={closeModal}>✕</button>
          <button className="modal-back" onClick={closeModal}>Kembali ke Artikel</button>

          {activeArticle && (
            <div className="modal-content-wrapper">
              <div className="modal-meta">
                <span className="modal-cat">{activeArticle.category}</span>
                <span className="modal-date">{activeArticle.date}</span>
                <span className="modal-read">{activeArticle.readTime}</span>
                <span className="modal-author">{activeArticle.author}</span>
              </div>
              <h1 className="modal-title" dangerouslySetInnerHTML={{ __html: activeArticle.title }}></h1>
              <div className="modal-lead" dangerouslySetInnerHTML={{ __html: activeArticle.lead }}></div>

              {activeArticle.imageUrl && (
                <div style={{ marginBottom: "30px", width: "100%", maxHeight: "400px", overflow: "hidden", borderRadius: "4px" }}>
                  <img src={activeArticle.imageUrl} alt="Article Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              <div className="modal-body" dangerouslySetInnerHTML={{ __html: activeArticle.body }}></div>

              {/* FITUR SHARE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '60px', marginBottom: '40px', padding: '20px', background: 'rgba(201,168,76,0.05)', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>Share this article:</span>
                <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  {shareMessage ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}