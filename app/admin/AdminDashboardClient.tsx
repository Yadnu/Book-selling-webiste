'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/admin/TiptapEditor';
import {
  BookOpen,
  Feather,
  Video,
  Camera,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Truck,
  Shield,
  Save,
} from 'lucide-react';

interface AdminDashboardClientProps {
  adminName: string;
  initialBooks: any[];
  initialPosts: any[];
  initialVideos: any[];
  initialPhotos: any[];
  initialOrders: any[];
  initialSettings: any[];
}

export default function AdminDashboardClient({
  adminName,
  initialBooks,
  initialPosts,
  initialVideos,
  initialPhotos,
  initialOrders,
  initialSettings,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'books' | 'posts' | 'media' | 'orders' | 'settings'>('books');
  const [books, setBooks] = useState(initialBooks);
  const [posts, setPosts] = useState(initialPosts);
  const [videos, setVideos] = useState(initialVideos);
  const [photos, setPhotos] = useState(initialPhotos);
  const [orders, setOrders] = useState(initialOrders);
  const [settings, setSettings] = useState(initialSettings);

  const [notification, setNotification] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // --- DELETE HANDLERS ---
  const handleDeleteBook = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/books?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete book');
      setBooks(books.filter((b) => b.id !== id));
      showToast('Book deleted.');
    } catch {
      showToast('Failed to delete book.');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter((p) => p.id !== id));
      showToast('Essay deleted.');
    } catch {
      showToast('Failed to delete essay.');
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete order');
      setOrders(orders.filter((o) => o.id !== id));
      showToast('Order deleted.');
    } catch {
      showToast('Failed to delete order.');
    } finally {
      setConfirmDelete(null);
    }
  };

  // --- ORDER FULFILLMENT HANDLER ---
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, trackingNumber }),
      });

      if (!res.ok) throw new Error('Failed to update order');

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status, trackingNumber: trackingNumber || o.trackingNumber } : o)));
      showToast('Order fulfillment updated!');
    } catch (err: any) {
      showToast('Failed to update order.');
    }
  };

  // --- BOOK FORM STATE ---
  const [bookForm, setBookForm] = useState({
    title: '',
    subtitle: '',
    coverImage: '',
    synopsis: '',
    excerpt: '',
    priceInCents: 2400,
    isbn: '',
    pageCount: 200,
    format: 'Hardcover',
    stockQuantity: 50,
  });

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      });

      if (!res.ok) throw new Error('Failed to create book');
      const newBook = await res.json();
      setBooks([newBook, ...books]);
      showToast(`Book "${newBook.title}" created successfully!`);
      setBookForm({
        title: '',
        subtitle: '',
        coverImage: '',
        synopsis: '',
        excerpt: '',
        priceInCents: 2400,
        isbn: '',
        pageCount: 200,
        format: 'Hardcover',
        stockQuantity: 50,
      });
    } catch (err) {
      showToast('Error creating book.');
    }
  };

  // --- POST FORM STATE ---
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '<p>Write essay content here...</p>',
    coverImage: '',
    readingTime: '5 min read',
    tags: 'Essays, Cornwall',
  });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      });

      if (!res.ok) throw new Error('Failed to create post');
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      showToast(`Post "${newPost.title}" published!`);
      setPostForm({
        title: '',
        excerpt: '',
        content: '',
        coverImage: '',
        readingTime: '5 min read',
        tags: 'Essays, Cornwall',
      });
    } catch (err) {
      showToast('Error creating post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-brass text-abyssal font-mono text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-seafoam/20 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-brass/10 border border-brass/40 flex items-center justify-center text-brass">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-fog font-semibold">Writer Studio Control Center</h1>
            <p className="font-mono text-xs text-seafoam">Logged in as {adminName}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded bg-storm border border-seafoam/20 text-fog hover:text-brass font-mono text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-seafoam/15">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs tracking-wider transition-colors ${
            activeTab === 'books' ? 'bg-brass text-abyssal font-bold' : 'text-fog/70 hover:text-fog bg-storm/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Books ({books.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs tracking-wider transition-colors ${
            activeTab === 'posts' ? 'bg-brass text-abyssal font-bold' : 'text-fog/70 hover:text-fog bg-storm/60'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Blog Essays ({posts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs tracking-wider transition-colors ${
            activeTab === 'orders' ? 'bg-brass text-abyssal font-bold' : 'text-fog/70 hover:text-fog bg-storm/60'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs tracking-wider transition-colors ${
            activeTab === 'media' ? 'bg-brass text-abyssal font-bold' : 'text-fog/70 hover:text-fog bg-storm/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Videos & Photos</span>
        </button>
      </div>

      {/* TAB 1: BOOKS MANAGER */}
      {activeTab === 'books' && (
        <div className="space-y-8">
          {/* Create Book Form */}
          <div className="gothic-card p-6 rounded-lg space-y-4 border border-brass/30">
            <h3 className="font-display text-xl text-fog font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5 text-brass" />
              <span>Add Published Book / Edition</span>
            </h3>

            <form onSubmit={handleCreateBook} className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-seafoam">Title *</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. The Salt Light Keeper"
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">Subtitle</label>
                <input
                  type="text"
                  value={bookForm.subtitle}
                  onChange={(e) => setBookForm({ ...bookForm, subtitle: e.target.value })}
                  placeholder="e.g. A Novella of Cornish Fog"
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">Cover Image URL *</label>
                <input
                  type="text"
                  required
                  value={bookForm.coverImage}
                  onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">ISBN *</label>
                <input
                  type="text"
                  required
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  placeholder="978-0-99381-04-1"
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">Price (in Cents) *</label>
                <input
                  type="number"
                  required
                  value={bookForm.priceInCents}
                  onChange={(e) => setBookForm({ ...bookForm, priceInCents: parseInt(e.target.value, 10) })}
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={bookForm.stockQuantity}
                  onChange={(e) => setBookForm({ ...bookForm, stockQuantity: parseInt(e.target.value, 10) })}
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-seafoam">Synopsis *</label>
                <textarea
                  rows={3}
                  required
                  value={bookForm.synopsis}
                  onChange={(e) => setBookForm({ ...bookForm, synopsis: e.target.value })}
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-seafoam">Sample Excerpt *</label>
                <textarea
                  rows={3}
                  required
                  value={bookForm.excerpt}
                  onChange={(e) => setBookForm({ ...bookForm, excerpt: e.target.value })}
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-2 bg-brass hover:bg-brass-hover text-abyssal font-bold py-3 rounded text-xs uppercase"
              >
                Save New Book
              </button>
            </form>
          </div>

          {/* Books List */}
          <div className="space-y-4">
            <h3 className="font-display text-xl text-fog font-semibold">Published Editions List</h3>
            <div className="space-y-3">
              {books.map((b) => (
                <div key={b.id} className="gothic-card p-4 rounded-lg flex items-center justify-between font-mono text-xs">
                  <div>
                    <h4 className="font-display text-lg text-fog font-medium">{b.title}</h4>
                    <span className="text-seafoam">
                      ISBN: {b.isbn} • {b.format} • Price: ${(b.priceInCents / 100).toFixed(2)} • Stock: {b.stockQuantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-brass font-semibold uppercase">{b.isForSale ? 'For Sale' : 'Draft'}</span>
                    {confirmDelete?.type === 'book' && confirmDelete.id === b.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-fog/70">Delete?</span>
                        <button
                          onClick={() => handleDeleteBook(b.id)}
                          className="px-2 py-1 bg-red-900/60 text-red-300 border border-red-500/40 rounded hover:bg-red-800/60 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 bg-storm text-fog/70 border border-seafoam/20 rounded hover:text-fog transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete({ type: 'book', id: b.id })}
                        className="p-1.5 text-fog/40 hover:text-red-400 transition-colors rounded"
                        title="Delete book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {books.length === 0 && (
                <p className="font-mono text-xs text-seafoam">No books added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLOG POSTS (TIPTAP EDITOR) */}
      {activeTab === 'posts' && (
        <div className="space-y-8">
          {/* Published Essays List */}
          {posts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-xl text-fog font-semibold">Published Essays</h3>
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="gothic-card p-4 rounded-lg flex items-center justify-between font-mono text-xs">
                    <div>
                      <h4 className="font-display text-lg text-fog font-medium">{p.title}</h4>
                      <span className="text-seafoam">
                        {p.tags} • {p.readingTime} • {p.status}
                      </span>
                    </div>
                    {confirmDelete?.type === 'post' && confirmDelete.id === p.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-fog/70">Delete?</span>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="px-2 py-1 bg-red-900/60 text-red-300 border border-red-500/40 rounded hover:bg-red-800/60 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 bg-storm text-fog/70 border border-seafoam/20 rounded hover:text-fog transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete({ type: 'post', id: p.id })}
                        className="p-1.5 text-fog/40 hover:text-red-400 transition-colors rounded"
                        title="Delete essay"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="gothic-card p-6 rounded-lg space-y-6 border border-brass/30">
            <h3 className="font-display text-xl text-fog font-semibold flex items-center gap-2">
              <Feather className="w-5 h-5 text-brass" />
              <span>Write & Publish Essay (Tiptap Editor + Emoji Mart)</span>
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-seafoam">Essay Title *</label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="e.g. On the Preservation of Fog and Silence"
                    className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-seafoam">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    placeholder="Essays, Gothic Literature, Cornwall"
                    className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-seafoam">Short Summary / Excerpt</label>
                <input
                  type="text"
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  placeholder="Summary for showcase cards..."
                  className="w-full bg-storm text-fog p-2.5 rounded border border-seafoam/20 focus:border-brass focus:outline-none"
                />
              </div>

              {/* Tiptap Rich Text Editor */}
              <div className="space-y-1">
                <label className="text-brass font-bold">Body Content (Rich Text + Image Upload + Emoji)</label>
                <TiptapEditor
                  content={postForm.content}
                  onChange={(html) => setPostForm({ ...postForm, content: html })}
                />
              </div>

              <button
                type="submit"
                className="bg-brass hover:bg-brass-hover text-abyssal font-bold py-3 px-8 rounded text-xs uppercase"
              >
                Publish Essay Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-display text-xl text-fog font-semibold">Customer Orders & Shipment Tracking</h3>

          {orders.length === 0 ? (
            <p className="font-mono text-xs text-seafoam">No orders placed yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="gothic-card p-6 rounded-lg space-y-4 border border-seafoam/20 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-seafoam/15 pb-3 gap-2">
                    <div>
                      <span className="text-brass font-bold">Order #{order.id.slice(-8).toUpperCase()}</span>
                      <span className="block text-fog">{order.customerName} ({order.customerEmail})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase ${
                        order.status === 'paid' ? 'bg-brass/20 text-brass border border-brass/40' :
                        order.status === 'fulfilled' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/40' :
                        'bg-storm text-seafoam'
                      }`}>
                        Status: {order.status}
                      </span>
                      {confirmDelete?.type === 'order' && confirmDelete.id === order.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-fog/70">Delete?</span>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="px-2 py-1 bg-red-900/60 text-red-300 border border-red-500/40 rounded hover:bg-red-800/60 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 bg-storm text-fog/70 border border-seafoam/20 rounded hover:text-fog transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete({ type: 'order', id: order.id })}
                          className="p-1.5 text-fog/40 hover:text-red-400 transition-colors rounded"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-seafoam"><strong className="text-fog">Address:</strong> {order.shippingAddress}</p>

                  {order.personalization && (
                    <p className="italic text-brass bg-storm p-2.5 rounded border border-brass/20">
                      Dedication Note: "{order.personalization}"
                    </p>
                  )}

                  {/* Tracking Number Input */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="text"
                      defaultValue={order.trackingNumber || ''}
                      placeholder="Enter Royal Mail tracking number..."
                      onBlur={(e) => handleUpdateOrderStatus(order.id, 'fulfilled', e.target.value)}
                      className="bg-storm text-fog p-2 rounded border border-seafoam/20 w-64 focus:border-brass focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'fulfilled')}
                      className="bg-brass text-abyssal font-bold px-4 py-2 rounded flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mark Shipped</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
