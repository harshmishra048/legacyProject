import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, Bookmark, Send, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { Avatar, Badge, Button, SectionHeader, EmptyState } from '../../components/ui';
import { COMMUNITY_POSTS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Career', 'Technology', 'Startups', 'Research', 'Alumni', 'Campus', 'Opportunities'];

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (comment.trim()) {
      toast.success('Comment posted!');
      setComment('');
      setShowCommentInput(false);
    }
  };

  const timeDiff = () => {
    const diff = Date.now() - new Date(post.timestamp).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <motion.div className="card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={post.author.name} initials={post.author.initials} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{post.author.name}</span>
            {post.author.isVerified && (
              <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.author.designation} · {timeDiff()}</p>
        </div>
        <Badge variant={post.category === 'Career' ? 'primary' : post.category === 'Research' ? 'violet' : post.category === 'Startups' ? 'cyan' : 'default'}>
          {post.category}
        </Badge>
      </div>

      <p className="text-sm mb-3 leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{post.content}</p>

      {post.tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-semibold text-indigo-500 cursor-pointer hover:text-indigo-600">#{tag}</span>
          ))}
        </div>
      )}

      <div className="divider mb-3" />

      <div className="flex items-center gap-1">
        <motion.button
          className="btn btn-ghost btn-sm flex items-center gap-1.5"
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={15} className={liked ? 'fill-rose-500 text-rose-500' : ''} style={liked ? {} : { color: 'var(--text-muted)' }} />
          <span className={`text-xs font-semibold ${liked ? 'text-rose-500' : ''}`} style={liked ? {} : { color: 'var(--text-muted)' }}>{likes}</span>
        </motion.button>
        <button className="btn btn-ghost btn-sm flex items-center gap-1.5" onClick={() => setShowCommentInput(!showCommentInput)}>
          <MessageSquare size={15} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{post.comments}</span>
        </button>
        <button className="btn btn-ghost btn-sm flex items-center gap-1.5" onClick={() => toast.success('Shared!')}>
          <Share2 size={15} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{post.shares}</span>
        </button>
        <div className="ml-auto">
          <button className="btn btn-ghost btn-sm" onClick={() => { setSaved(!saved); toast(saved ? 'Unsaved' : 'Post saved!', { icon: saved ? '💔' : '🔖' }); }}>
            <Bookmark size={15} className={saved ? 'fill-indigo-500 text-indigo-500' : ''} style={saved ? {} : { color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {showCommentInput && (
        <motion.div className="flex items-center gap-2 mt-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <input
            className="input flex-1"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleComment(); }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleComment} disabled={!comment.trim()}>
            <Send size={14} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [newPost, setNewPost] = useState('');

  const filtered = activeCategory === 'All'
    ? COMMUNITY_POSTS
    : COMMUNITY_POSTS.filter((p) => p.category === activeCategory);

  const handlePost = () => {
    if (newPost.trim()) {
      toast.success('Post published to the community!');
      setNewPost('');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pb-12">
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Community</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connect, share, and learn from the Legacy Sphere community.</p>
      </motion.div>

      {/* Create post */}
      <motion.div className="card p-5 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <Avatar name={user?.name} initials={user?.initials} size="md" />
          <div className="flex-1">
            <textarea
              className="input resize-none mb-3"
              rows={3}
              placeholder="Share something with the community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
                <ImageIcon size={16} /> Photo
              </button>
              <Button variant="primary" size="sm" onClick={handlePost} disabled={!newPost.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
            style={{
              background: activeCategory === cat ? '#6366f1' : 'var(--bg-surface)',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeCategory === cat ? '#6366f1' : 'var(--border-default)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState icon="💬" title="No posts in this category" description="Be the first to share something!" />
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
