/**
 * Caliber Clutch Real-Time Friends & Social Management Service
 * Pure real-time architecture: no fake demo friends.
 * Supports registered player discovery, real-time friend requests, and persistent DMs.
 */

import { supabase } from '../lib/supabase';

export interface RegisteredPlayer {
  id: string;
  gamerTag: string;
  avatar: string;
  level: number;
  elo: number;
  verification: 'vip' | 'verified' | 'none';
  countryCode: string;
  countryName: string;
  role: string;
  isRegistered: boolean;
}

export interface SocialFriend {
  id: string;
  name: string;
  avatar: string;
  status: 'playing' | 'online' | 'offline';
  gameStatus?: string;
  hasPriority?: boolean;
  verification?: 'vip' | 'verified' | 'none';
  code?: string;
  countryName?: string;
  level?: number;
  elo?: number;
  addedAt?: number;
}

export interface FriendRequest {
  id: string;
  fromGamerTag: string;
  fromAvatar: string;
  fromLevel: number;
  fromElo: number;
  fromVerification: 'vip' | 'verified' | 'none';
  fromCountryCode: string;
  fromCountryName: string;
  toGamerTag: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface DMMessage {
  id: string;
  sender: string;
  avatar?: string;
  text?: string;
  imageUrl?: string;
  timestamp: string;
}

// Default directory of verified registered players on the platform arena
export const PLATFORM_REGISTERED_PLAYERS: RegisteredPlayer[] = [
  {
    id: 'u-juanflatroo',
    gamerTag: 'juanflatroo',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3890,
    verification: 'vip',
    countryCode: 'XK',
    countryName: 'Kosovo',
    role: 'Entry Fragger',
    isRegistered: true
  },
  {
    id: 'u-gxx',
    gamerTag: 'gxx-',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3420,
    verification: 'verified',
    countryCode: 'XK',
    countryName: 'Kosovo',
    role: 'AWPer',
    isRegistered: true
  },
  {
    id: 'u-sinnopsyy',
    gamerTag: 'Sinnopsyy',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3310,
    verification: 'verified',
    countryCode: 'XK',
    countryName: 'Kosovo',
    role: 'In-Game Leader',
    isRegistered: true
  },
  {
    id: 'u-rigon',
    gamerTag: 'rigoN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3280,
    verification: 'verified',
    countryCode: 'CH',
    countryName: 'Switzerland',
    role: 'Entry / Rifler',
    isRegistered: true
  },
  {
    id: 'u-karrigan',
    gamerTag: 'karrigan',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3150,
    verification: 'verified',
    countryCode: 'DK',
    countryName: 'Denmark',
    role: 'Tactical IGL',
    isRegistered: true
  },
  {
    id: 'u-niko',
    gamerTag: 'NiKo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    level: 10,
    elo: 3500,
    verification: 'verified',
    countryCode: 'BA',
    countryName: 'Bosnia',
    role: 'Rifler',
    isRegistered: true
  }
];

const STORAGE_REGISTERED_PLAYERS = 'caliber_platform_registered_players';
const STORAGE_FRIENDS_PREFIX = 'caliber_friends_';
const STORAGE_REQUESTS_PREFIX = 'caliber_friend_requests_';
const STORAGE_DMS_PREFIX = 'caliber_dms_';
const LEGACY_STORAGE_REGISTERED_PLAYERS = 'vortex_platform_registered_players';
const LEGACY_STORAGE_FRIENDS_PREFIX = 'vortex_friends_';
const LEGACY_STORAGE_REQUESTS_PREFIX = 'vortex_friend_requests_';
const LEGACY_STORAGE_DMS_PREFIX = 'vortex_dms_';

/**
 * Registers or updates a player in the platform's searchable directory
 */
export const registerPlatformPlayer = (player: RegisteredPlayer) => {
  if (typeof window === 'undefined' || !player.gamerTag) return;
  try {
    const raw = localStorage.getItem(STORAGE_REGISTERED_PLAYERS) || localStorage.getItem(LEGACY_STORAGE_REGISTERED_PLAYERS);
    const list: RegisteredPlayer[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex(p => 
      p.gamerTag.toLowerCase() === player.gamerTag.toLowerCase() || 
      (p.gamerTag.toLowerCase().includes('m14') && player.gamerTag.toLowerCase().includes('m14'))
    );
    if (index >= 0) {
      list[index] = { ...list[index], ...player };
    } else {
      list.push(player);
    }
    localStorage.setItem(STORAGE_REGISTERED_PLAYERS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('caliber_players_updated'));
    window.dispatchEvent(new CustomEvent('vortex_players_updated'));
  } catch (err) {
    console.error('Failed to register platform player', err);
  }
};

/**
 * Searches registered users on Caliber Clutch platform
 */
export const searchRegisteredPlayers = (query: string, currentGamerTag: string): RegisteredPlayer[] => {
  let dynamicPlayers: RegisteredPlayer[] = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_REGISTERED_PLAYERS) || localStorage.getItem(LEGACY_STORAGE_REGISTERED_PLAYERS);
      if (raw) dynamicPlayers = JSON.parse(raw);
    } catch {
      dynamicPlayers = [];
    }
  }

  // Merge default pro players and dynamically registered players (deduplicating by gamerTag)
  const playerMap = new Map<string, RegisteredPlayer>();
  for (const p of PLATFORM_REGISTERED_PLAYERS) {
    playerMap.set(p.gamerTag.toLowerCase(), p);
  }
  for (const p of dynamicPlayers) {
    playerMap.set(p.gamerTag.toLowerCase(), p);
  }

  const allPlayers = Array.from(playerMap.values());
  const currentLower = (currentGamerTag || '').toLowerCase();

  if (!query.trim()) {
    return allPlayers.filter(p => p.gamerTag.toLowerCase() !== currentLower);
  }
  const q = query.toLowerCase().trim();
  return allPlayers.filter(p => 
    p.gamerTag.toLowerCase() !== currentLower &&
    (p.gamerTag.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q))
  );
};

const LEGACY_DEMO_NAMES = new Set([
  'icykilleer', 'amatuero', 'feimmih', 'rudeusx', 'dionitt2h-',
  'zozio', 'orkzz', 'shushalko6', 'blackbars1', 'diva-', 'ndyw', 'edd1-'
]);

// Automatically purge legacy demo keys from older app builds
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('vortex_social_friends');
    localStorage.removeItem('vortex_demo_friends');
  } catch {}
}

/**
 * Gets real friends list for current user (Strictly returns empty [] if none added)
 */
export const getUserFriends = (gamerTag: string): SocialFriend[] => {
  if (typeof window === 'undefined' || !gamerTag) return [];
  const key = `${STORAGE_FRIENDS_PREFIX}${gamerTag.toLowerCase()}`;
  const legacyKey = `${LEGACY_STORAGE_FRIENDS_PREFIX}${gamerTag.toLowerCase()}`;
  const raw = localStorage.getItem(key) || localStorage.getItem(legacyKey);
  if (!raw) return [];
  try {
    const list: SocialFriend[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    // Strictly purge any legacy demo names
    const cleaned = list.filter(f => !LEGACY_DEMO_NAMES.has((f.name || '').toLowerCase()));
    if (cleaned.length !== list.length) {
      localStorage.setItem(key, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
};

/**
 * Saves friends list and dispatches real-time update
 */
export const saveUserFriends = (gamerTag: string, friends: SocialFriend[]) => {
  if (typeof window === 'undefined' || !gamerTag) return;
  const key = `${STORAGE_FRIENDS_PREFIX}${gamerTag.toLowerCase()}`;
  localStorage.setItem(key, JSON.stringify(friends));
  window.dispatchEvent(new CustomEvent('caliber_friends_updated', { detail: { gamerTag, count: friends.length } }));
  window.dispatchEvent(new CustomEvent('vortex_friends_updated', { detail: { gamerTag, count: friends.length } }));
};

/**
 * Retrieves incoming and outgoing friend requests
 */
export const getUserFriendRequests = (gamerTag: string): { incoming: FriendRequest[]; outgoing: FriendRequest[] } => {
  if (typeof window === 'undefined' || !gamerTag) return { incoming: [], outgoing: [] };
  const key = `${STORAGE_REQUESTS_PREFIX}${gamerTag.toLowerCase()}`;
  const legacyKey = `${LEGACY_STORAGE_REQUESTS_PREFIX}${gamerTag.toLowerCase()}`;
  const raw = localStorage.getItem(key) || localStorage.getItem(legacyKey);
  if (!raw) return { incoming: [], outgoing: [] };
  try {
    const all: FriendRequest[] = JSON.parse(raw);
    const incoming = all.filter(r => r.toGamerTag.toLowerCase() === gamerTag.toLowerCase() && r.status === 'pending');
    const outgoing = all.filter(r => r.fromGamerTag.toLowerCase() === gamerTag.toLowerCase() && r.status === 'pending');
    return { incoming, outgoing };
  } catch {
    return { incoming: [], outgoing: [] };
  }
};

/**
 * Sends a real-time friend request to another registered player
 */
export const sendFriendRequest = (
  fromUser: {
    gamerTag: string;
    avatar?: string;
    level?: number;
    elo?: number;
    verification?: 'vip' | 'verified' | 'none';
    countryCode?: string;
    countryName?: string;
  },
  toPlayer: RegisteredPlayer
): FriendRequest => {
  const req: FriendRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fromGamerTag: fromUser.gamerTag,
    fromAvatar: fromUser.avatar || 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
    fromLevel: fromUser.level || 1,
    fromElo: fromUser.elo ?? 0,
    fromVerification: fromUser.verification || 'none',
    fromCountryCode: fromUser.countryCode || 'XK',
    fromCountryName: fromUser.countryName || 'Kosovo',
    toGamerTag: toPlayer.gamerTag,
    status: 'pending',
    createdAt: Date.now()
  };

  // Save in sender's requests
  const senderKey = `${STORAGE_REQUESTS_PREFIX}${fromUser.gamerTag.toLowerCase()}`;
  const senderList: FriendRequest[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(senderKey) || '[]');
    } catch { return []; }
  })();
  senderList.unshift(req);
  localStorage.setItem(senderKey, JSON.stringify(senderList));

  // Save in receiver's requests
  const receiverKey = `${STORAGE_REQUESTS_PREFIX}${toPlayer.gamerTag.toLowerCase()}`;
  const receiverList: FriendRequest[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(receiverKey) || '[]');
    } catch { return []; }
  })();
  receiverList.unshift(req);
  localStorage.setItem(receiverKey, JSON.stringify(receiverList));

  window.dispatchEvent(new CustomEvent('caliber_friend_requests_updated'));
  window.dispatchEvent(new CustomEvent('vortex_friend_requests_updated'));
  return req;
};

/**
 * Accepts a friend request and links both players as real mutual friends
 */
export const acceptFriendRequest = (
  currentGamerTag: string,
  requestId: string,
  currentUserInfo?: {
    avatar?: string;
    verification?: 'vip' | 'verified' | 'none';
    countryCode?: string;
    countryName?: string;
    level?: number;
    elo?: number;
  }
): SocialFriend | null => {
  const receiverKey = `${STORAGE_REQUESTS_PREFIX}${currentGamerTag.toLowerCase()}`;
  const requests: FriendRequest[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(receiverKey) || '[]');
    } catch { return []; }
  })();

  const targetReq = requests.find(r => r.id === requestId);
  if (!targetReq) return null;

  targetReq.status = 'accepted';
  localStorage.setItem(receiverKey, JSON.stringify(requests));

  // Also mark status as accepted in sender's request list
  const senderKey = `${STORAGE_REQUESTS_PREFIX}${targetReq.fromGamerTag.toLowerCase()}`;
  const senderRequests: FriendRequest[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(senderKey) || '[]');
    } catch { return []; }
  })();
  const senderReq = senderRequests.find(r => r.id === requestId);
  if (senderReq) {
    senderReq.status = 'accepted';
    localStorage.setItem(senderKey, JSON.stringify(senderRequests));
  }

  // 1. Create real SocialFriend entry for current user (the receiver)
  const newFriendForReceiver: SocialFriend = {
    id: `f-${targetReq.fromGamerTag.toLowerCase()}`,
    name: targetReq.fromGamerTag,
    avatar: targetReq.fromAvatar,
    status: 'online',
    gameStatus: 'Online • In Lobby',
    verification: targetReq.fromVerification,
    code: targetReq.fromCountryCode,
    countryName: targetReq.fromCountryName,
    level: targetReq.fromLevel,
    elo: targetReq.fromElo,
    addedAt: Date.now()
  };

  const receiverFriends = getUserFriends(currentGamerTag);
  if (!receiverFriends.some(f => f.name.toLowerCase() === newFriendForReceiver.name.toLowerCase())) {
    receiverFriends.unshift(newFriendForReceiver);
    saveUserFriends(currentGamerTag, receiverFriends);
  }

  // 2. Add current user into the sender's friend list (Mutual Friendship)
  const newFriendForSender: SocialFriend = {
    id: `f-${currentGamerTag.toLowerCase()}`,
    name: currentGamerTag,
    avatar: currentUserInfo?.avatar || 'https://distribution.faceit-cdn.net/images/ac453a50-dbca-4d42-a740-dac12bdc74c0.jpeg',
    status: 'online',
    gameStatus: 'Online • In Lobby',
    verification: currentUserInfo?.verification || 'verified',
    code: currentUserInfo?.countryCode || 'XK',
    countryName: currentUserInfo?.countryName || 'Kosovo',
    level: currentUserInfo?.level || 10,
    elo: currentUserInfo?.elo || 1850,
    addedAt: Date.now()
  };

  const senderFriends = getUserFriends(targetReq.fromGamerTag);
  if (!senderFriends.some(f => f.name.toLowerCase() === newFriendForSender.name.toLowerCase())) {
    senderFriends.unshift(newFriendForSender);
    saveUserFriends(targetReq.fromGamerTag, senderFriends);
  }

  window.dispatchEvent(new CustomEvent('caliber_friend_requests_updated'));
  window.dispatchEvent(new CustomEvent('vortex_friend_requests_updated'));
  return newFriendForReceiver;
};

/**
 * Declines a pending friend request
 */
export const declineFriendRequest = (currentGamerTag: string, requestId: string) => {
  const receiverKey = `${STORAGE_REQUESTS_PREFIX}${currentGamerTag.toLowerCase()}`;
  const requests: FriendRequest[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(receiverKey) || '[]');
    } catch { return []; }
  })();

  const targetReq = requests.find(r => r.id === requestId);
  const filtered = requests.filter(r => r.id !== requestId);
  localStorage.setItem(receiverKey, JSON.stringify(filtered));

  if (targetReq) {
    const senderKey = `${STORAGE_REQUESTS_PREFIX}${targetReq.fromGamerTag.toLowerCase()}`;
    const senderRequests: FriendRequest[] = (() => {
      try {
        return JSON.parse(localStorage.getItem(senderKey) || '[]');
      } catch { return []; }
    })();
    const senderFiltered = senderRequests.filter(r => r.id !== requestId);
    localStorage.setItem(senderKey, JSON.stringify(senderFiltered));
  }

  window.dispatchEvent(new CustomEvent('caliber_friend_requests_updated'));
  window.dispatchEvent(new CustomEvent('vortex_friend_requests_updated'));
};

/**
 * Removes a friend from user's friends list (Mutual removal)
 */
export const removeFriend = (currentGamerTag: string, targetFriendNameOrId: string) => {
  const friends = getUserFriends(currentGamerTag);
  const foundFriend = friends.find(f => f.id === targetFriendNameOrId || f.name.toLowerCase() === targetFriendNameOrId.toLowerCase());
  const updated = friends.filter(f => f.id !== targetFriendNameOrId && f.name.toLowerCase() !== targetFriendNameOrId.toLowerCase());
  saveUserFriends(currentGamerTag, updated);

  if (foundFriend) {
    const targetFriends = getUserFriends(foundFriend.name);
    const targetUpdated = targetFriends.filter(f => f.name.toLowerCase() !== currentGamerTag.toLowerCase() && f.id !== `f-${currentGamerTag.toLowerCase()}`);
    saveUserFriends(foundFriend.name, targetUpdated);
  }
};

/**
 * Retrieves direct messages history for a conversation
 */
export const getDirectMessagesHistory = (currentGamerTag: string, targetName: string): DMMessage[] => {
  if (typeof window === 'undefined' || !currentGamerTag || !targetName) return [];
  const pairKey = [currentGamerTag.toLowerCase(), targetName.toLowerCase()].sort().join('__');
  const raw = localStorage.getItem(`${STORAGE_DMS_PREFIX}${pairKey}`) || localStorage.getItem(`${LEGACY_STORAGE_DMS_PREFIX}${pairKey}`);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

/**
 * Saves a direct message in persistent thread
 */
export const appendDirectMessage = (currentGamerTag: string, targetName: string, message: DMMessage) => {
  if (typeof window === 'undefined' || !currentGamerTag || !targetName) return;
  const pairKey = [currentGamerTag.toLowerCase(), targetName.toLowerCase()].sort().join('__');
  const existing = getDirectMessagesHistory(currentGamerTag, targetName);
  existing.push(message);
  localStorage.setItem(`${STORAGE_DMS_PREFIX}${pairKey}`, JSON.stringify(existing));
  window.dispatchEvent(new CustomEvent('caliber_dms_updated', { detail: { targetName } }));
  window.dispatchEvent(new CustomEvent('vortex_dms_updated', { detail: { targetName } }));
};
