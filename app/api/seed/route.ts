import { NextResponse } from 'next/server';
import { readDB, writeDB, Article } from '../../../src/lib/db';

const initialData: Record<string, any> = {
  featured: {
    cat: 'Contracts', date: '15 January 2025', read: '8 min read', author: 'Fara Hanifah',
    title: 'Understanding <em>Collaboration Agreements</em> in Student Projects: What You Must Know',
    lead: 'When students partner on academic or entrepreneurial projects, the absence of a written agreement is the most common root cause of disputes. Legal protection begins with a document, not a handshake.',
    tags: ['Contracts', 'Agreements', 'Students', 'Documentation'],
    related: ['collab1', 'contracts2'],
    body: `<h2>Why Verbal Agreements Are <em>Not Enough</em></h2><p>Every year, countless student collaborations unravel not because of a lack of talent or effort, but because of legal ambiguity.</p>`
  },
  ip1: {
    cat: 'Intellectual Property', date: '10 Jan 2025', read: '6 min read', author: 'Anastasia Novenia',
    title: 'Who Owns the <em>Idea</em>? IP Rights in Group Academic Projects',
    lead: 'Group projects create shared intellectual output — but who legally owns the final product? We clarify IP ownership rules relevant to Indonesian students.',
    tags: ['IP', 'Rights', 'Academic', 'Ideas'],
    related: ['ip2', 'collab1'],
    body: `<p>The distinction between an idea and its execution is paramount in IP law.</p>`
  },
  collab1: {
    cat: 'Collaboration', date: '5 Jan 2025', read: '5 min read', author: 'Dhiezella Sihite',
    title: 'Dividing Responsibilities: <em>Legal Clarity</em> in Team Roles',
    lead: 'Unclear task division leads to academic conflicts. Learn how a simple role document can protect every team member.',
    tags: ['Team', 'Roles', 'Clarity', 'Conflict'],
    related: ['featured', 'contracts2'],
    body: `<p>Drafting a simple role document clarifies expectations and protects all parties.</p>`
  },
  biz1: {
    cat: 'Business', date: '28 Dec 2024', read: '7 min read', author: 'Natasha Aderina',
    title: 'Financial Disputes in Student Ventures: <em>Prevention</em> First',
    lead: 'Money matters are the #1 cause of student team breakdowns. Discover the documentation practices that prevent financial conflicts.',
    tags: ['Finance', 'Business', 'Disputes'],
    related: ['biz2', 'contracts2'],
    body: `<p>Documenting every financial contribution and expected return is critical.</p>`
  },
  rights1: {
    cat: 'Rights & Obligations', date: '20 Dec 2024', read: '4 min read', author: 'Andreas Bramantio',
    title: 'Your <em>Legal Rights</em> as a Student Organizer at Campus Events',
    lead: 'Organizing a campus event carries more legal weight than most students realize. From vendor contracts to liability waivers.',
    tags: ['Events', 'Rights', 'Obligations'],
    related: ['ethics1', 'collab1'],
    body: `<p>Always ensure liability waivers are signed before high-risk events.</p>`
  },
  contracts2: {
    cat: 'Contracts', date: '14 Dec 2024', read: '9 min read', author: 'Sevita M.',
    title: '5 Clauses Every <em>Student Contract</em> Must Include',
    lead: 'These five essential clauses can protect your project, your investment, and your relationships.',
    tags: ['Contracts', 'Clauses', 'Drafting'],
    related: ['featured', 'biz1'],
    body: `<p>Termination clauses and dispute resolution mechanisms are non-negotiable.</p>`
  },
  ethics1: {
    cat: 'Rights & Obligations', date: '5 Dec 2024', read: '6 min read', author: 'Xu Wanru',
    title: 'Ethical Decision Making: When <em>Rules</em> Meet <em>Reality</em>',
    lead: 'Legal compliance is the baseline, but ethical decision-making ensures long-term trust and reputation.',
    tags: ['Ethics', 'Decisions', 'Integrity'],
    related: ['rights1', 'collab1'],
    body: `<p>Ethics go beyond the law; they dictate how you act when no one is watching.</p>`
  },
  ip2: {
    cat: 'Intellectual Property', date: '28 Nov 2024', read: '8 min read', author: 'Reky Febrio',
    title: 'Protecting Your Code: Open Source vs. <em>Proprietary</em> Licenses',
    lead: 'For computer science and IT students, understanding software licenses is critical before publishing your repository.',
    tags: ['Code', 'Licenses', 'Open Source'],
    related: ['ip1', 'biz2'],
    body: `<p>Choose your license carefully to dictate how others can use your work.</p>`
  },
  biz2: {
    cat: 'Business', date: '15 Nov 2024', read: '10 min read', author: 'Zahwa',
    title: 'From Project to <em>Startup</em>: Legal Steps to Incorporate',
    lead: 'Transitioning a successful campus project into a legal entity (PT) in Indonesia requires specific structural steps.',
    tags: ['Startup', 'PT', 'Incorporation'],
    related: ['biz1', 'contracts2'],
    body: `<p>Understanding the PT structure in Indonesia is the first step to scaling.</p>`
  }
};

export async function GET() {
  const db = readDB();

  if (db.articles.length > 0) {
    return NextResponse.json({ message: 'Database already seeded', count: db.articles.length });
  }

  const articles: Article[] = [];

  for (const [key, data] of Object.entries(initialData)) {
    articles.push({
      id: key,
      slug: key,
      category: data.cat,
      author: data.author,
      title: data.title,
      lead: data.lead,
      body: data.body,
      tags: data.tags,
      readTime: data.read,
      date: data.date,
      imageUrl: '', // Hardcoded old data didn't have specific images per article (they were icons)
      related: data.related
    });
  }

  db.articles = articles;
  writeDB(db);

  return NextResponse.json({ message: 'Database seeded successfully', count: articles.length });
}
