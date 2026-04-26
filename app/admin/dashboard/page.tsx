"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Fungsi untuk mengekstrak area gambar yang di-crop menjadi File baru
async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop, fileName: string): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // STATE UNTUK MODE EDIT
  const [editMode, setEditMode] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  // STATE UNTUK CROP GAMBAR
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      fetchArticles();
    }
  }, [router]);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadOrEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);

    if (editMode && editingArticleId) {
      formData.append('id', editingArticleId);
      formData.append('existingImageUrl', existingImageUrl);
    }

    // Jika ada gambar hasil crop, timpa file image asli di formData
    if (croppedFile) {
      formData.set('image', croppedFile);
    }

    try {
      const res = await fetch('/api/articles', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage(editMode ? 'Article updated successfully!' : 'Article created successfully!');
        if (formRef.current) formRef.current.reset();

        setEditMode(false);
        setEditingArticleId(null);
        setExistingImageUrl('');
        setCroppedFile(null);
        setImgSrc('');

        fetchArticles();
      } else {
        setMessage('Failed to process article.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, field: 'isFeatured' | 'isDeepRead', currentValue: boolean) => {
    try {
      await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: !currentValue })
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (article: any) => {
    setActiveTab('upload');
    setEditMode(true);
    setEditingArticleId(article.id);
    setExistingImageUrl(article.imageUrl || '');
    setMessage('');
    setCroppedFile(null);
    setImgSrc('');

    setTimeout(() => {
      if (formRef.current) {
        const form = formRef.current;
        (form.elements.namedItem('title') as HTMLInputElement).value = article.title;
        (form.elements.namedItem('slug') as HTMLInputElement).value = article.slug;
        (form.elements.namedItem('category') as HTMLSelectElement).value = article.category;
        (form.elements.namedItem('author') as HTMLInputElement).value = article.author;
        (form.elements.namedItem('tags') as HTMLInputElement).value = article.tags.join(', ');
        (form.elements.namedItem('lead') as HTMLTextAreaElement).value = article.lead;
        (form.elements.namedItem('body') as HTMLTextAreaElement).value = article.body;
      }
    }, 100);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditingArticleId(null);
    setExistingImageUrl('');
    setMessage('');
    setCroppedFile(null);
    setImgSrc('');
    if (formRef.current) formRef.current.reset();
  };

  // LOGIKA KETIKA GAMBAR DIPILIH
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCroppedFile(null); // Reset hasil crop sebelumnya
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // EKSEKUSI CROP
  const confirmCrop = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const file = await getCroppedImg(imgRef.current, completedCrop, `cropped-${Date.now()}.jpg`);
        setCroppedFile(file);
        setImgSrc(''); // Tutup area cropper setelah sukses
        setMessage('Image cropped successfully! Ready to upload.');
      } catch (e) {
        console.error('Failed to crop image', e);
      }
    }
  };

  const inputStyle = { width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '12px 0', color: 'var(--text)', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', color: 'var(--text)', fontFamily: "'Outfit', sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: '250px', background: 'var(--dark-2)', padding: '40px 20px', borderRight: '1px solid rgba(201,168,76,0.1)' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--gold)', marginBottom: '40px' }}>Admin Panel</h2>

        <button onClick={() => { setActiveTab('upload'); cancelEdit(); }} style={{ display: 'block', width: '100%', padding: '15px', textAlign: 'left', background: activeTab === 'upload' ? 'var(--dark-3)' : 'transparent', border: '1px solid', borderColor: activeTab === 'upload' ? 'var(--gold)' : 'transparent', color: activeTab === 'upload' ? 'var(--gold)' : 'var(--text)', marginBottom: '10px', cursor: 'pointer' }}>
          + {editMode ? 'Edit Article' : 'Upload Article'}
        </button>

        <button onClick={() => { setActiveTab('manage'); cancelEdit(); }} style={{ display: 'block', width: '100%', padding: '15px', textAlign: 'left', background: activeTab === 'manage' ? 'var(--dark-3)' : 'transparent', border: '1px solid', borderColor: activeTab === 'manage' ? 'var(--gold)' : 'transparent', color: activeTab === 'manage' ? 'var(--gold)' : 'var(--text)', cursor: 'pointer' }}>
          ≡ Manage Articles
        </button>

        <div style={{ marginTop: '40px' }}>
          <Link href="/articles" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline' }}>Back to Public Web</Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>

        {activeTab === 'upload' && (
          <div style={{ background: 'var(--dark-3)', padding: '48px', border: '1px solid rgba(201,168,76,0.1)', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px' }}>{editMode ? 'Edit Article' : 'Create New Article'}</h2>
              {editMode && (
                <button type="button" onClick={cancelEdit} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', padding: '5px 10px', fontSize: '11px', cursor: 'pointer' }}>
                  Cancel Edit
                </button>
              )}
            </div>

            <form ref={formRef} onSubmit={handleUploadOrEdit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div><label style={labelStyle}>Article Title</label><input type="text" name="title" required style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div><label style={labelStyle}>Slug (Unique ID)</label><input type="text" name="slug" required style={inputStyle} placeholder="e.g., student-law-101" /></div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select name="category" required defaultValue="" style={{ ...inputStyle, appearance: 'auto', background: 'var(--dark-3)' }}>
                    <option value="" disabled>Select Category</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Business">Business</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Rights & Obligations">Rights & Obligations</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div><label style={labelStyle}>Author</label><input type="text" name="author" required style={inputStyle} /></div>
                <div><label style={labelStyle}>Tags (comma separated)</label><input type="text" name="tags" required style={inputStyle} /></div>
              </div>

              {/* IMAGE UPLOAD & CROPPER SECTION */}
              <div style={{ padding: '20px', border: '1px dashed rgba(201,168,76,0.3)', background: 'rgba(0,0,0,0.2)' }}>
                <label style={labelStyle}>Thumbnail Image</label>
                {editMode && existingImageUrl && !croppedFile && !imgSrc && (
                  <div style={{ marginBottom: '15px', fontSize: '12px', color: 'var(--gold)' }}>
                    Current image: {existingImageUrl.split('/').pop()} <br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>(Upload a new file below if you want to replace it)</span>
                  </div>
                )}

                <input type="file" name="image" accept="image/*" onChange={onSelectFile} style={{ ...inputStyle, borderBottom: 'none' }} />

                {/* AREA PEMOTONGAN GAMBAR (MUNCUL JIKA ADA GAMBAR BARU DIPILIH) */}
                {imgSrc && (
                  <div style={{ marginTop: '20px', background: 'var(--dark-4)', padding: '20px', borderRadius: '4px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '10px' }}>Select the area you want to keep:</p>
                    <ReactCrop
                      crop={crop}
                      onChange={c => setCrop(c)}
                      onComplete={c => setCompletedCrop(c)}
                      aspect={16 / 9} // Paksa rasio landscape agar seragam di depan
                    >
                      <img ref={imgRef} src={imgSrc} alt="Crop me" style={{ maxHeight: '400px' }} />
                    </ReactCrop>
                    <button type="button" onClick={confirmCrop} style={{ marginTop: '15px', padding: '10px 20px', background: 'var(--gold)', color: 'var(--dark)', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                      Confirm Crop
                    </button>
                  </div>
                )}

                {/* INDIKATOR JIKA CROP SELESAI */}
                {croppedFile && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#4ade80' }}>
                    ✓ Image cropped and ready.
                  </div>
                )}
              </div>

              <div><label style={labelStyle}>Lead (Short Summary)</label><textarea name="lead" required style={{ ...inputStyle, minHeight: '80px' }} /></div>
              <div><label style={labelStyle}>Body (HTML supported)</label><textarea name="body" required style={{ ...inputStyle, minHeight: '200px' }} /></div>

              {message && <div style={{ color: message.includes('success') ? '#4ade80' : 'var(--gold)', textAlign: 'center', fontSize: '14px' }}>{message}</div>}

              <button type="submit" disabled={loading} style={{ padding: '18px', background: 'var(--gold)', border: 'none', color: 'var(--dark)', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? (editMode ? 'Updating...' : 'Uploading...') : (editMode ? 'Update Article' : 'Publish Article')}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Manage Articles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {articles.map((article) => (
                <div key={article.id} style={{ background: 'var(--dark-3)', padding: '20px', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: '5px' }}>{article.category}</div>
                    <div style={{ fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: article.title }}></div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
                      {article.isFeatured && <span style={{ marginRight: '10px', color: '#E8C96A' }}>⭐ Headline</span>}
                      {article.isDeepRead && <span style={{ color: '#E8E0D0' }}>📚 Deep Read</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditClick(article)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text)', cursor: 'pointer', fontSize: '11px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleToggleStatus(article.id, 'isFeatured', article.isFeatured)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', cursor: 'pointer', fontSize: '11px' }}>
                      {article.isFeatured ? 'Remove Headline' : 'Set Headline'}
                    </button>
                    <button onClick={() => handleToggleStatus(article.id, 'isDeepRead', article.isDeepRead)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', cursor: 'pointer', fontSize: '11px' }}>
                      {article.isDeepRead ? 'Remove Deep Read' : 'Set Deep Read'}
                    </button>
                    <button onClick={() => handleDelete(article.id)} style={{ padding: '8px 12px', background: '#ff4444', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {articles.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No articles found.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}