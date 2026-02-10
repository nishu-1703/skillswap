/**
 * SkillSwap - Component Implementation Examples
 * Shows how to use the design system for consistent UI
 */

/* ============================================================================
   EXAMPLE 1: ACCESSIBLE BUTTON VARIATIONS
   ============================================================================ */

export function ButtonExamples() {
  return (
    <>
      <h2>Button States</h2>
      
      {/* Primary button - main action */}
      <button className="btn btn-primary">
        Save Changes
      </button>

      {/* Primary button with icon */}
      <button className="btn btn-primary">
        <span className="icon">✓</span>
        Accept Request
      </button>

      {/* Secondary button - alternative action */}
      <button className="btn btn-secondary">
        Cancel
      </button>

      {/* Success button - positive action */}
      <button className="btn btn-success">
        <span className="icon">✓</span>
        Mark Complete
      </button>

      {/* Danger button - destructive action */}
      <button className="btn btn-danger">
        <span className="icon">🗑️</span>
        Delete
      </button>

      {/* Disabled state */}
      <button disabled>
        Loading...
      </button>

      {/* Small button */}
      <button className="btn btn-primary btn-sm">
        Learn More
      </button>

      {/* Icon-only button (MUST have aria-label) */}
      <button 
        className="btn-icon" 
        aria-label="Close modal"
        title="Close (press Escape)"
      >
        ✕
      </button>
    </>
  )
}

/* ============================================================================
   EXAMPLE 2: ACCESSIBLE FORM
   ============================================================================ */

export function AccessibleForm() {
  const [errors, setErrors] = React.useState({})
  const [formData, setFormData] = React.useState({ name: '', email: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    
    setErrors(newErrors)
  }

  return (
    <div className="container">
      {/* Page heading */}
      <h1>Create Account</h1>
      <p className="text-muted">Join SkillSwap to start teaching and learning</p>

      <form onSubmit={handleSubmit}>
        {/* Name field */}
        <div className="form-group">
          <label htmlFor="fullname">
            Full Name
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="fullname"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            required
            aria-required="true"
            aria-describedby={errors.name ? "fullname-error" : undefined}
            className={errors.name ? "error" : ""}
          />
          {errors.name && (
            <div id="fullname-error" role="alert" className="error-message">
              <span>⚠️</span>
              {errors.name}
            </div>
          )}
        </div>

        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email">
            Email Address
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
            aria-required="true"
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            className={errors.email ? "error" : ""}
          />
          <small id="email-hint">We'll never share your email</small>
          {errors.email && (
            <div id="email-error" role="alert" className="error-message">
              <span>⚠️</span>
              {errors.email}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary btn-lg">
          Create Account
        </button>
      </form>
    </div>
  )
}

/* ============================================================================
   EXAMPLE 3: SKILL CARD - CONSISTENT LAYOUT
   ============================================================================ */

export function SkillCard({ skill, teacher, onRequest }) {
  return (
    <article className="card">
      {/* Card header with title and badge */}
      <header className="card-header">
        <h3>{skill.name}</h3>
        <span className="badge">{skill.category}</span>
      </header>

      {/* Card body with description */}
      <div className="card-body">
        <p>{skill.description}</p>
        
        {/* Teacher info */}
        <div className="flex gap-md mt-md">
          <div className="teacher-avatar">
            {teacher.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="m-0"><strong>{teacher.name}</strong></p>
            <p className="text-muted text-small m-0">{teacher.email}</p>
            {teacher.rating && (
              <p className="text-small m-0">
                ⭐ {teacher.rating} ({teacher.reviews} reviews)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer with action button */}
      <footer className="card-footer">
        <button 
          className="btn btn-primary"
          onClick={() => onRequest(skill.id)}
          aria-label={`Request to learn ${skill.name} from ${teacher.name}`}
        >
          Request Lesson
        </button>
      </footer>
    </article>
  )
}

/* ============================================================================
   EXAMPLE 4: ALERT & STATUS MESSAGES
   ============================================================================ */

export function AlertExamples() {
  return (
    <>
      <h2>Alert States</h2>

      {/* Success alert */}
      <div className="alert alert-success" role="alert">
        <span className="alert-icon">✓</span>
        <p>Your profile has been updated successfully</p>
      </div>

      {/* Error alert */}
      <div className="alert alert-error" role="alert">
        <span className="alert-icon">⚠️</span>
        <p>Failed to save changes. Please try again.</p>
      </div>

      {/* Warning alert */}
      <div className="alert alert-warning" role="alert">
        <span className="alert-icon">⚡</span>
        <p>You have low credits. Learn more to earn credits.</p>
      </div>

      {/* Info alert */}
      <div className="alert alert-primary">
        <span className="alert-icon">ℹ️</span>
        <p>Skills are shared peer-to-peer. No refunds apply.</p>
      </div>
    </>
  )
}

/* ============================================================================
   EXAMPLE 5: MESSAGE BUBBLE - MESSAGING PAGE
   ============================================================================ */

export function MessageBubble({ message, isOwn, userName }) {
  return (
    <div className={`message ${isOwn ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        <div className="message-text">{message.text}</div>
        <div className="message-time">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {isOwn && (
            <span className="message-status">
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   EXAMPLE 6: ACCESSIBLE NAVIGATION TABS
   ============================================================================ */

export function NavigationTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'browse', label: '🔍 Browse Skills', ariaLabel: 'Browse available skills' },
    { id: 'teach', label: '📚 My Teaching', ariaLabel: 'Manage your teaching skills' },
    { id: 'sessions', label: '📅 My Sessions', ariaLabel: 'View your learning sessions' },
    { id: 'messages', label: '💬 Messages', ariaLabel: 'Chat with connections' },
    { id: 'profile', label: '👤 My Profile', ariaLabel: 'View your profile' }
  ]

  return (
    <nav className="tab-navigation" aria-label="Dashboard navigation">
      <div className="tab-nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            aria-label={tab.ariaLabel}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

/* ============================================================================
   EXAMPLE 7: CONSISTENT STATUS INDICATORS
   ============================================================================ */

export function SessionStatus({ status, creditsEarned, costsCredits }) {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳'
      case 'accepted': return '✓'
      case 'completed': return '✓✓'
      case 'rejected': return '✗'
      default: return '❓'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b'
      case 'accepted': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="session-status-card">
      <h3>Session Status</h3>
      
      <div className="status-badge" style={{ color: getStatusColor(status) }}>
        <span className="status-icon">
          {getStatusIcon(status)}
        </span>
        <span className="status-text">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {creditsEarned && (
        <p className="credit-earn">
          📈 <strong>+{creditsEarned}</strong> credits earned
        </p>
      )}

      {costsCredits && (
        <p className="credit-spend">
          📉 <strong>{costsCredits}</strong> credits needed
        </p>
      )}
    </div>
  )
}

/* ============================================================================
   EXAMPLE 8: ACCESSIBLE PROFILE SECTION
   ============================================================================ */

export function ProfileHeader({ user }) {
  return (
    <header className="profile-header">
      {/* Main heading */}
      <h1>{user.name}</h1>
      <p className="profile-email">{user.email}</p>
      
      {/* Stats grid with proper heading hierarchy */}
      <div className="profile-stats-grid">
        <article className="stat-card">
          <h2 className="stat-number">{user.skillsTaught}</h2>
          <p className="stat-label">Skills Teaching</p>
          <p className="text-small text-muted">Help others learn</p>
        </article>

        <article className="stat-card">
          <h2 className="stat-number">{user.creditsBalance}</h2>
          <p className="stat-label">Credit Balance</p>
          <p className="text-small text-muted">Available to spend</p>
        </article>

        <article className="stat-card">
          <h2 className="stat-number">
            ⭐ {user.avgRating || 'N/A'}
          </h2>
          <p className="stat-label">Average Rating</p>
          <p className="text-small text-muted">From {user.totalReviews} reviews</p>
        </article>

        <article className="stat-card">
          <h2 className="stat-number">{user.sessionsCompleted}</h2>
          <p className="stat-label">Transactions</p>
          <p className="text-small text-muted">Completed sessions</p>
        </article>
      </div>
    </header>
  )
}

/* ============================================================================
   EXAMPLE 9: ONLINE STATUS INDICATOR
   ============================================================================ */

export function UserStatus({ userId, name, isOnline, lastSeen }) {
  return (
    <div className="user-status-item">
      <div className="user-avatar">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="user-info">
        <p className="user-name">{name}</p>
        <p className={`user-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? (
            <>
              <span className="online-indicator">🟢</span>
              <span>Online now</span>
            </>
          ) : (
            <>
              <span className="offline-indicator">⚪</span>
              <span>Last seen {lastSeen}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

/* ============================================================================
   EXAMPLE 10: UTILITY CLASSES IN ACTION
   ============================================================================ */

export function UtilityClassesDemo() {
  return (
    <div className="container">
      {/* Flexbox utilities */}
      <div className="flex flex-between gap-lg mb-xl">
        <h2>My Skills</h2>
        <button className="btn btn-primary">+ Add Skill</button>
      </div>

      {/* Grid with margin utilities */}
      <div className="grid gap-lg mt-lg mb-xl">
        {/* Cards with padding utilities */}
        <article className="card p-lg">
          <h3 className="mb-md">Guitar</h3>
          <p className="text-muted text-small">Beginner lessons available</p>
        </article>
      </div>

      {/* Text utilities */}
      <p className="text-center text-small text-muted mt-xl">
        No skills added yet. Create your first skill above!
      </p>

      {/* SR-only text for screen readers only */}
      <span className="sr-only">
        You have 0 skills listed. Skills help you connect with learners.
      </span>
    </div>
  )
}

/* ============================================================================
   USAGE NOTES
   ============================================================================ */

/**
 * How to Use These Examples:
 *
 * 1. Import components into your pages
 * 2. All styling comes from design-system.css
 * 3. Props control content, classes control styling
 * 4. All components are accessible by default
 * 5. Customization via CSS variables (see design-system.css)
 *
 * Example:
 * import { SkillCard } from './examples'
 * 
 * <SkillCard 
 *   skill={skillData}
 *   teacher={teacherData}
 *   onRequest={handleRequest}
 * />
 */
