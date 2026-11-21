import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeQueuePlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  elo: number;
  countryCode: string;
  isCaptain: boolean;
  joinedAt: number;
}

export interface RealtimeVetoAction {
  matchId: string;
  step: number;
  bannedMapId: string;
  bannedMapName: string;
  team: string;
  timestamp: number;
}

export interface RealtimeSideAction {
  matchId: string;
  side: 'ct' | 't' | 'knife';
  team: string;
  timestamp: number;
}

class RealtimeMatchmakingService {
  private queueChannel: RealtimeChannel | null = null;
  private vetoChannel: RealtimeChannel | null = null;
  private activeRoomId: string | null = null;

  /**
   * Subscribe to global live 5v5 matchmaking queue
   */
  public subscribeToQueue(
    currentPlayer: RealtimeQueuePlayer,
    onQueueUpdate: (players: RealtimeQueuePlayer[]) => void,
    onMatchFound: (matchData: any) => void
  ) {
    if (this.queueChannel) {
      this.leaveQueue(currentPlayer.id);
    }

    const channel = supabase.channel('caliber_matchmaking_live', {
      config: {
        broadcast: { ack: true },
        presence: { key: currentPlayer.id }
      }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const players: RealtimeQueuePlayer[] = [];
        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.player) players.push(p.player);
          });
        });
        onQueueUpdate(players);
      })
      .on('broadcast', { event: 'match_ready' }, (payload) => {
        if (payload?.payload?.matchId) {
          onMatchFound(payload.payload);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            player: currentPlayer,
            online_at: new Date().toISOString()
          });
        }
      });

    this.queueChannel = channel;
    return channel;
  }

  /**
   * Broadcast match found event to all connected queue participants
   */
  public async broadcastMatchFound(matchPayload: any) {
    if (!this.queueChannel) return;
    await this.queueChannel.send({
      type: 'broadcast',
      event: 'match_ready',
      payload: matchPayload
    });
  }

  /**
   * Leave queue
   */
  public async leaveQueue(playerId: string) {
    if (this.queueChannel) {
      await this.queueChannel.untrack();
      await supabase.removeChannel(this.queueChannel);
      this.queueChannel = null;
    }
  }

  /**
   * Connect to real-time interactive Map Veto room
   */
  public connectToVetoRoom(
    matchId: string,
    onVetoAction: (action: RealtimeVetoAction) => void,
    onSideChosen: (action: RealtimeSideAction) => void
  ) {
    if (this.vetoChannel && this.activeRoomId === matchId) {
      return this.vetoChannel;
    }

    if (this.vetoChannel) {
      supabase.removeChannel(this.vetoChannel);
    }

    this.activeRoomId = matchId;
    const channel = supabase.channel(`caliber_veto_${matchId}`, {
      config: { broadcast: { ack: true } }
    });

    channel
      .on('broadcast', { event: 'map_banned' }, (payload) => {
        if (payload?.payload) {
          onVetoAction(payload.payload as RealtimeVetoAction);
        }
      })
      .on('broadcast', { event: 'side_selected' }, (payload) => {
        if (payload?.payload) {
          onSideChosen(payload.payload as RealtimeSideAction);
        }
      })
      .subscribe();

    this.vetoChannel = channel;
    return channel;
  }

  /**
   * Broadcast map ban live across real-time room
   */
  public async broadcastMapBan(action: RealtimeVetoAction) {
    if (!this.vetoChannel) return;
    await this.vetoChannel.send({
      type: 'broadcast',
      event: 'map_banned',
      payload: action
    });
  }

  /**
   * Broadcast captain side selection live across real-time room
   */
  public async broadcastSideSelection(action: RealtimeSideAction) {
    if (!this.vetoChannel) return;
    await this.vetoChannel.send({
      type: 'broadcast',
      event: 'side_selected',
      payload: action
    });
  }

  /**
   * Disconnect from veto room
   */
  public disconnectVetoRoom() {
    if (this.vetoChannel) {
      supabase.removeChannel(this.vetoChannel);
      this.vetoChannel = null;
      this.activeRoomId = null;
    }
  }
}

export const realtimeMatchmaking = new RealtimeMatchmakingService();
