 Facebook Integration Frontend Guide

  Overview

  This guide explains how to integrate the new Facebook Page posting feature into the frontend. Facebook uses the same Meta app as Instagram but has a unique page selection flow where users must choose which Facebook Page to connect.

  ---
  OAuth Flow (Different from Other Platforms)

  Facebook has a two-step connection flow:

  1. Initiate OAuth → User authorizes on Facebook
  2. Callback returns page list → Frontend displays pages for user selection
  3. User selects a page → Frontend calls select-page endpoint to complete connection

  This differs from Instagram/LinkedIn/Twitter which auto-complete after callback.

  ---
  API Endpoints

  1. Initiate Facebook Connection

  GET /api/connections/facebook/connect

  Requires: User must be authenticated (session cookie)

  Behavior: Redirects user to Facebook OAuth consent screen

  Frontend Usage:
  // Simply redirect the user (like other platforms)
  window.location.href = '/api/connections/facebook/connect';

  ---
  2. OAuth Callback (Returns Page List)

  GET /api/oauth/facebook/callback?code=xxx&state=xxx

  Response (Success):
  {
    "success": true,
    "message": "Please select a Facebook Page to connect...",
    "data": {
      "userId": "user-uuid",
      "platform": "facebook",
      "pendingKey": "user-uuid-1733567890123",
      "pages": [
        {
          "id": "123456789",
          "name": "My Business Page",
          "category": "Local Business"
        },
        {
          "id": "987654321",
          "name": "My Personal Brand",
          "category": "Personal Blog"
        }
      ]
    }
  }

  Frontend Handling:
  The callback page should detect the pages array in the response and display a page selection UI instead of showing "Connected successfully".

  ---
  3. Complete Connection (Select Page)

  POST /api/oauth/facebook/select-page
  Content-Type: application/json

  {
    "pendingKey": "user-uuid-1733567890123",
    "pageId": "123456789"
  }

  Response (Success):
  {
    "success": true,
    "message": "Facebook Page connected successfully",
    "data": {
      "connectionId": "connection-uuid",
      "userId": "user-uuid",
      "platform": "facebook",
      "pageId": "123456789",
      "pageName": "My Business Page",
      "displayName": "My Business Page",
      "expiresAt": "2025-02-05T12:00:00.000Z"
    }
  }

  ---
  4. Get Pending Pages (Optional)

  If user navigates away and comes back within 10 minutes:

  GET /api/oauth/facebook/pages?pendingKey=xxx

  Response:
  {
    "success": true,
    "data": {
      "userId": "user-uuid",
      "pages": [...],
      "expiresAt": "2024-12-07T12:10:00.000Z"
    }
  }

  ---
  Frontend Implementation

  Step 1: Update OAuth Callback Handler

  The callback page needs to handle Facebook differently:

  // In your OAuth callback component/page

  async function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Get platform from URL path (e.g., /connections/facebook/callback)
    const platform = window.location.pathname.split('/')[2];

    if (error) {
      showError(`Connection failed: ${urlParams.get('error_description')}`);
      return;
    }

    try {
      const response = await fetch(
        `/api/oauth/${platform}/callback?code=${code}&state=${state}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // FACEBOOK SPECIAL CASE: Check if page selection is needed
      if (platform === 'facebook' && data.data.pages) {
        // Show page selection UI
        showPageSelectionModal(data.data.pendingKey, data.data.pages);
      } else {
        // Other platforms: connection complete
        showSuccess(`${platform} connected successfully!`);
        redirectToConnections();
      }
    } catch (err) {
      showError(err.message);
    }
  }

  Step 2: Create Page Selection Component

  // FacebookPageSelector.tsx

  interface FacebookPage {
    id: string;
    name: string;
    category?: string;
  }

  interface Props {
    pendingKey: string;
    pages: FacebookPage[];
    onSuccess: (connection: any) => void;
    onCancel: () => void;
  }

  function FacebookPageSelector({ pendingKey, pages, onSuccess, onCancel }: Props) {
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConfirm() {
      if (!selectedPageId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/oauth/facebook/select-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pendingKey,
            pageId: selectedPageId,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        onSuccess(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="page-selector-modal">
        <h2>Select a Facebook Page</h2>
        <p>Choose which Facebook Page you want to connect for posting:</p>

        {error && <div className="error">{error}</div>}

        <div className="pages-list">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`page-option ${selectedPageId === page.id ? 'selected' : ''}`}
              onClick={() => setSelectedPageId(page.id)}
            >
              <div className="page-name">{page.name}</div>
              {page.category && (
                <div className="page-category">{page.category}</div>
              )}
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={!selectedPageId || loading}
          >
            {loading ? 'Connecting...' : 'Connect Page'}
          </button>
        </div>

        <p className="hint">
          Note: You can connect multiple pages by repeating this process.
        </p>
      </div>
    );
  }

  Step 3: Update Connections List

  Facebook connections show page name instead of username:

  // When displaying connections
  function ConnectionCard({ connection }) {
    return (
      <div className="connection-card">
        <PlatformIcon platform={connection.platform} />
        <div className="info">
          <div className="display-name">
            {connection.displayName || connection.platformUsername}
          </div>
          {/* For Facebook, displayName IS the page name */}
          {connection.platform === 'facebook' && (
            <div className="type">Facebook Page</div>
          )}
          {connection.platform !== 'facebook' && connection.platformUsername && (
            <div className="username">@{connection.platformUsername}</div>
          )}
        </div>
        <ConnectionStatus connection={connection} />
      </div>
    );
  }

  Step 4: Update "Add Connection" Button

  Add Facebook to the platform list:

  const SUPPORTED_PLATFORMS = [
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon },
    { id: 'twitter', name: 'Twitter/X', icon: TwitterIcon },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
    { id: 'facebook', name: 'Facebook Page', icon: FacebookIcon }, // NEW
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
    { id: 'pinterest', name: 'Pinterest', icon: PinterestIcon },
    { id: 'youtube', name: 'YouTube', icon: YouTubeIcon },
  ];

  ---
  Post Creation Updates

  Platform-Specific UI Differences

  When creating a post, Facebook has different constraints:

  | Platform  | Text Required | Media Required | Max Text Length |
  |-----------|---------------|----------------|-----------------|
  | Instagram | No            | Yes            | 2,200 chars     |
  | Facebook  | No            | No             | 63,206 chars    |
  | Twitter   | No            | No             | 280 chars       |
  | LinkedIn  | No            | No             | 3,000 chars     |

  // Platform validation for post creation
  const PLATFORM_CONSTRAINTS = {
    facebook: {
      maxTextLength: 63206,
      requiresMedia: false,
      supportsTextOnly: true,
      supportsLinks: true,
    },
    instagram: {
      maxTextLength: 2200,
      requiresMedia: true,
      supportsTextOnly: false,
      supportsLinks: false,
    },
    // ... other platforms
  };

  function validatePostForPlatform(platform: string, post: Post): string[] {
    const errors: string[] = [];
    const constraints = PLATFORM_CONSTRAINTS[platform];

    if (constraints.requiresMedia && (!post.media || post.media.length === 0)) {
      errors.push(`${platform} requires at least one image or video`);
    }

    if (post.text && post.text.length > constraints.maxTextLength) {
      errors.push(`Text exceeds ${platform}'s ${constraints.maxTextLength} character limit`);
    }

    return errors;
  }

  Post Creation API

  The existing multi-platform post API works with Facebook:

  // POST /api/posts
  {
    "caption": "Check out our new product!",
    "social_accounts": [
      "facebook-connection-uuid",
      "instagram-connection-uuid"
    ],
    "media_urls": ["https://example.com/image.jpg"],
    "platform_configurations": {
      "facebook": {
        "caption": "Custom caption for Facebook with a link! https://example.com"
      }
    }
  }

  ---
  Error Handling

  Common Facebook-Specific Errors

  const FACEBOOK_ERRORS = {
    'No Facebook Pages found':
      'You must be an admin of at least one Facebook Page to connect.',

    'Connection session expired':
      'Your session expired. Please try connecting again.',

    'Selected page not found':
      'The selected page is no longer available. Please try again.',

    'Token refresh failed':
      'Your Facebook connection needs to be re-authenticated.',
  };

  function getFriendlyError(error: string): string {
    for (const [key, message] of Object.entries(FACEBOOK_ERRORS)) {
      if (error.includes(key)) {
        return message;
      }
    }
    return error;
  }

  ---
  Session Expiry Note

  The pending page selection session expires after 10 minutes. If the user doesn't select a page in time:

  // Handle expired session
  if (response.status === 404 && response.error === 'Pending connection not found') {
    showMessage('Session expired. Please start the connection process again.');
    redirectTo('/connections');
  }

  ---
  Testing Checklist

  - "Connect Facebook" button redirects to Facebook OAuth
  - After OAuth, page selection modal appears with user's pages
  - Selecting a page and clicking "Connect" creates the connection
  - Connection appears in connections list with page name
  - Can create text-only posts to Facebook (no media required)
  - Can create posts with images/videos to Facebook
  - Multi-platform posts work (e.g., Facebook + Instagram together)
  - Disconnecting Facebook works correctly
  - Expired session shows appropriate error message

