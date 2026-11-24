import os

path = r'src/components/vortex/VortexDashboard.tsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# SECTION 1: ROSTER (from m1 to m2)
m1 = '{/* 5 PARTY SLOTS */}'
m2 = '{/* FIND MATCH BUTTON (CENTERED AS IN SCREENSHOT) */}'

roster_replacement = '''{/* 5-STACK SQUAD ROSTER (COMMANDER & OPERATIVES TACTICAL FORMATION) */}
                <div className="relative space-y-4">
                  {(() => {
                    const leaderIdx = partyLeaderIndex;
                    const leaderMember = partySlots[leaderIdx];
                    const operativeIndices = [0, 1, 2, 3, 4].filter(i => i !== leaderIdx);

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                        {/* 1. SQUAD COMMANDER / IGL (FEATURED TACTICAL COMMAND CARD - 5 COLS) */}
                        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#1C2612] via-[#10141D] to-[#0A0D14] border-2 border-[#A3E635]/80 shadow-[0_0_30px_rgba(163,230,53,0.22)] p-5 flex flex-col justify-between relative overflow-hidden group">
                          {/* Tactical Decals */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#A3E635]/15 to-transparent pointer-events-none" />
                          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#A3E635]/10 rounded-full blur-2xl pointer-events-none" />

                          {/* Header: Commander Callout */}
                          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-xl bg-[#A3E635] text-slate-950 font-black text-[11px] font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
                                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                                SQUAD COMMANDER // IGL
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">SLOT #01</span>
                            </div>

                            {leaderMember && (leaderMember.id === 'current-user' || leaderMember.name === currentGamerTag) ? (
                              partySlots.filter(Boolean).length > 1 && (
                                <button
                                  onClick={handleLeaveParty}
                                  className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                  title="Disband / Leave Party"
                                >
                                  <LogOut className="w-3.5 h-3.5" />
                                </button>
                              )
                            ) : null}
                          </div>

                          {/* Commander Profile & Details */}
                          <div className="py-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                            <div className="relative shrink-0">
                              <div className="w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-br from-[#A3E635] via-emerald-400 to-[#10141D] shadow-[0_0_20px_rgba(163,230,53,0.35)]">
                                {leaderMember?.name === 'M18' || !leaderMember?.avatar ? (
                                  <div className="w-full h-full rounded-2xl bg-black flex flex-col items-center justify-center p-1">
                                    <svg className="w-10 h-5 text-white" viewBox="0 0 100 40" fill="currentColor">
                                      <path d="M 6 22 L 20 22 L 22 17 L 36 17 L 38 20 L 52 20 L 57 18 L 82 18 L 84 20 L 92 20 L 92 23 L 83 23 L 83 26 L 76 26 L 75 23 L 52 23 L 50 30 L 44 30 L 47 23 L 38 23 L 34 32 L 28 32 L 26 24 L 6 26 Z" />
                                    </svg>
                                    <span className="text-[10px] font-black text-white">M18</span>
                                  </div>
                                ) : (
                                  <img
                                    src={leaderMember?.avatar || currentAvatarUrl}
                                    alt={leaderMember?.name || currentGamerTag}
                                    className="w-full h-full rounded-2xl object-cover"
                                  />
                                )}
                              </div>
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#10141D] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            </div>

                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                <span className="font-display font-black text-lg text-white truncate max-w-[170px]" title={leaderMember?.name || currentGamerTag}>
                                  {leaderMember?.name || currentGamerTag}
                                </span>
                                <FaceitVerificationBadge type={leaderMember?.verification || currentVerification} size="xs" />
                                <CountryFlag code={leaderMember?.code || currentCountry.code} name={leaderMember?.countryName || currentCountry.name} size="xs" />
                              </div>

                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
                                <span className="px-2 py-0.5 rounded-md bg-black/60 border border-[#A3E635]/40 text-[#A3E635] font-black">
                                  {caliberTier.tier} • {caliberTier.name}
                                </span>
                                <span className="text-slate-300 font-bold">
                                  {effectiveElo} MMR
                                </span>
                              </div>

                              <div className="text-[11px] font-mono text-slate-400">
                                Tactical Authority: <strong className="text-slate-200">Map Vetoes & Squad Calling</strong>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Commander Status Ribbon */}
                          <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">READY FOR DEPLOYMENT</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">Signal: 100% Locked</span>
                          </div>
                        </div>

                        {/* 2. 4 SQUAD OPERATIVES (TACTICAL 2x2 GRID - 7 COLS) */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {operativeIndices.map((slotIdx, orderIdx) => {
                            const member = partySlots[slotIdx];
                            const pendingPlayer = pendingSlotInvites[slotIdx];
                            const roleLabels = [
                              'ENTRY FRAGGER',
                              'AWP SNIPER',
                              'SUPPORT & UTILITY',
                              'LURKER & ANCHOR'
                            ];
                            const slotRole = roleLabels[orderIdx] || 'TACTICAL OPERATIVE';
                            const slotNumber = String(orderIdx + 2).padStart(2, '0');

                            if (member) {
                              const memberTier = getCaliberTier(member.elo);
                              const isCurrentUser = member.id === 'current-user' || member.name === currentGamerTag;

                              return (
                                <div
                                  key={member.id}
                                  className="rounded-2xl bg-[#121520] border border-[#232838] hover:border-[#A3E635]/50 p-4 flex flex-col justify-between transition-all relative group overflow-hidden"
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-white/5">
                                    <span className="text-slate-400 font-bold">
                                      OPERATIVE #{slotNumber} // {slotRole}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => handlePromoteToLeader(slotIdx, e)}
                                        className="p-1 rounded hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                                        title="Promote to Commander"
                                      >
                                        <Crown className="w-3.5 h-3.5" />
                                      </button>
                                      {!isCurrentUser ? (
                                        <button
                                          onClick={(e) => handleKickMember(slotIdx, e)}
                                          className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                          title="Remove from squad"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>

                                  {/* Member Content */}
                                  <div className="flex items-center gap-3 py-2.5">
                                    <div className="relative shrink-0">
                                      <img
                                        src={member.avatar || currentAvatarUrl}
                                        alt={member.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-[#A3E635]/40"
                                      />
                                      <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-black" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1 text-xs font-bold text-white font-display">
                                        <span className="truncate max-w-[110px]">{member.name}</span>
                                        <FaceitVerificationBadge type={member.verification || 'none'} size="xs" />
                                        <CountryFlag code={member.code || 'XK'} name={member.countryName || 'Kosovo'} size="xs" />
                                      </div>
                                      <div className="text-[11px] font-mono text-[#A3E635] font-bold mt-0.5">
                                        {memberTier.tier} • {member.elo} MMR
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status */}
                                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-emerald-400 font-bold">✓ READY</span>
                                    <span className="text-slate-500">{slotRole}</span>
                                  </div>
                                </div>
                              );
                            }

                            if (pendingPlayer) {
                              return (
                                <div
                                  key={`pending-${slotIdx}`}
                                  onClick={() => {
                                    sound.playClick();
                                    setPartyInviteCountdown(88);
                                    setActivePartyInvite({
                                      id: `invite-${Date.now()}`,
                                      sender: pendingPlayer.name,
                                      avatar: pendingPlayer.avatar,
                                      level: pendingPlayer.level,
                                      code: pendingPlayer.code || 'XK',
                                      countryName: pendingPlayer.countryName || 'Kosovo',
                                      targetSlotIdx: slotIdx,
                                      playerObj: pendingPlayer,
                                    });
                                  }}
                                  className="rounded-2xl bg-[#0F1118] border-2 border-dashed border-amber-500/60 p-4 flex flex-col justify-between transition-all relative cursor-pointer hover:border-amber-400"
                                >
                                  <div className="flex items-center justify-between text-[10px] font-mono pb-1">
                                    <span className="text-amber-400 font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                      WAITING FOR ACCEPTANCE...
                                    </span>
                                    <button
                                      onClick={(e) => handleCancelPendingInvite(slotIdx, e)}
                                      className="text-slate-400 hover:text-red-400 p-0.5"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2.5 py-1.5">
                                    <img src={pendingPlayer.avatar} alt={pendingPlayer.name} className="w-10 h-10 rounded-xl object-cover border border-amber-500/40" />
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-white truncate">{pendingPlayer.name}</div>
                                      <div className="text-[10px] font-mono text-amber-300">Invite dispatched • {pendingPlayer.elo} MMR</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        sound.playClick();
                                        setPartyInviteCountdown(88);
                                        setActivePartyInvite({
                                          id: `invite-${Date.now()}`,
                                          sender: currentGamerTag,
                                          avatar: currentAvatarUrl,
                                          level: 7,
                                          code: currentCountry.code,
                                          countryName: currentCountry.name,
                                          verification: currentVerification,
                                          targetSlotIdx: slotIdx,
                                          playerObj: pendingPlayer,
                                          isOutgoingSimulation: true,
                                          invitedPlayerName: pendingPlayer.name,
                                        });
                                      }}
                                      className="flex-1 py-1 rounded bg-[#A3E635]/20 hover:bg-[#A3E635]/30 text-[#A3E635] text-[10px] font-mono font-bold"
                                    >
                                      PREVIEW INVITE
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            // Empty Operative Slot
                            return (
                              <div
                                key={`empty-${slotIdx}`}
                                onClick={() => handleOpenInviteModal(slotIdx)}
                                className="rounded-2xl bg-[#0E1017] border border-white/10 hover:border-[#A3E635]/70 hover:bg-[#121622] p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(163,230,53,0.15)] select-none"
                              >
                                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 pb-1">
                                  <span>OPERATIVE #{slotNumber}</span>
                                  <span className="text-[#A3E635] font-semibold">{slotRole}</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] group-hover:bg-[#A3E635]/15 border border-white/10 group-hover:border-[#A3E635]/50 flex items-center justify-center text-slate-400 group-hover:text-[#A3E635] transition">
                                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="text-center">
                                  <span className="block text-xs font-mono font-bold text-slate-300 group-hover:text-white transition">
                                    + Invite Operative
                                  </span>
                                  <span className="block text-[10px] font-mono text-slate-500 group-hover:text-[#A3E635] transition">
                                    Open Squad Roster
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                '''

idx1 = text.find(m1)
idx2 = text.find(m2)
assert idx1 != -1 and idx2 != -1, "Could not find roster markers"

text = text[:idx1] + roster_replacement + text[idx2:]

# SECTION 2: DEPLOY BUTTON (from m2 to m3)
idx2 = text.find(m2)
m3 = '{/* MATCHMAKING SUB-NAVIGATION (MATCH TYPE • MAPS • SERVERS) */}'
idx3 = text.find(m3)
assert idx2 != -1 and idx3 != -1, "Could not find deploy button markers"

deploy_replacement = '''{/* DEPLOY 5-STACK BUTTON */}
                <div className="flex justify-center mt-6">
                  {isQueuing ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="flex flex-wrap items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-[#1A130D] border border-[#A3E635]/60 text-xs font-mono shadow-xl shadow-lime-500/15">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-ping shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-black tracking-wider">DEPLOYING 5-STACK TO CS2 MATCH...</span>
                            <span className="text-amber-400 font-bold font-mono">00:{queueSeconds.toString().padStart(2, '0')}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="text-emerald-400 font-bold">
                              {realtimeQueuePlayers.length > 0 ? `${realtimeQueuePlayers.length}/10 Active Queued` : '5/10 In Queue'}
                            </span>
                            <span>•</span>
                            <span className="text-[#A3E635] font-bold">5v5 Squad Deployment</span>
                            <span>•</span>
                            <span>Bracket: {caliberTier.tier} (MMR {effectiveElo - 50} - {effectiveElo + 50})</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isProjectAdmin && (
                          <button
                            onClick={() => {
                              sound.playMatchFound();
                              triggerMatchFound();
                            }}
                            className="px-4 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#A3E635] hover:brightness-110 text-slate-950 text-xs font-mono font-black uppercase cursor-pointer transition shadow-md flex items-center gap-1.5"
                            title="Administrator shortcut: immediately trigger match ready check"
                          >
                            <Zap className="w-4 h-4 fill-slate-950" />
                            <span>LAUNCH SCRIM NOW</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sound.playClick();
                            realtimeMatchmaking.leaveQueue(currentGamerTag);
                            setIsQueuing(false);
                          }}
                          className="px-5 py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-mono font-bold cursor-pointer transition shadow-md"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : selectedMatchTier === 'premium' && userMembershipTier === 'free' ? (
                    <button
                      onClick={() => {
                        sound.playTournamentVictory();
                        setShowPremiumModal(true);
                      }}
                      className="w-full sm:w-auto min-w-[340px] px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Lock className="w-4 h-4 fill-slate-950" />
                      <span>PRO PASS REQUIRED TO DEPLOY RANKED SERIES</span>
                    </button>
                  ) : selectedMatchTier === 'vip' && userMembershipTier !== 'vip' ? (
                    <button
                      onClick={() => {
                        sound.playTournamentVictory();
                        setShowPremiumModal(true);
                      }}
                      className="w-full sm:w-auto min-w-[340px] px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>UPGRADE TO DEPLOY 5v5 PRIZE CLASH</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playJoinScrim();
                        setIsQueuing(true);
                        setQueueSeconds(0);
                      }}
                      className="w-full sm:w-auto min-w-[340px] px-12 py-4 rounded-2xl bg-gradient-to-r from-[#84CC16] via-[#A3E635] to-[#84CC16] hover:brightness-110 text-slate-950 font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_30px_rgba(163,230,53,0.35)] hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3"
                    >
                      <Crosshair className="w-4 h-4 text-slate-950" />
                      <span>DEPLOY 5-STACK ({selectedMatchTier === 'free' ? 'OPEN SCRIM' : selectedMatchTier === 'premium' ? 'RANKED SERIES' : 'PRIZE CLASH'})</span>
                    </button>
                  )}
                </div>

                '''

text = text[:idx2] + deploy_replacement + text[idx3:]

# SECTION 3: MATCHMAKING SUBNAV & 3 CARDS (from m3 to m4)
idx3 = text.find(m3)
m4 = '{/* SUBTAB 3: SERVER COUNTRY PICKER (MATCHING REFERENCE EXACTLY) */}'
idx4 = text.find(m4)
assert idx3 != -1 and idx4 != -1, "Could not find subnav / cards markers"

cards_replacement = '''{/* MATCHMAKING SUB-NAVIGATION (MATCH FORMAT • ACTIVE DUTY MAP POOL) */}
                <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => { sound.playClick(); setPlaySubTab('match_type'); }}
                      className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                        playSubTab === 'match_type'
                          ? 'text-white border-b-2 border-[#A3E635]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>5v5 COMPETITIVE FORMAT</span>
                    </button>

                    <button
                      onClick={() => { sound.playClick(); setPlaySubTab('maps'); }}
                      className={`relative pb-3 font-bold transition flex items-center gap-2 cursor-pointer ${
                        playSubTab === 'maps'
                          ? 'text-white border-b-2 border-[#A3E635]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>MAPS ({selectedMaps.length}/7)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#A3E635] text-black font-black uppercase shadow-[0_0_8px_rgba(163,230,53,0.3)]">
                        ACTIVE DUTY
                      </span>
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px] pb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5-Stack Squads • Automated Map Vetoes</span>
                  </div>
                </div>

                {/* SUBTAB 1: 3 5-STACK MATCH TIERS (OPEN SCRIM • RANKED SERIES • PRIZE CLASH) */}
                {playSubTab === 'match_type' && (
                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
                    
                    {/* CARD 1: 5v5 OPEN SCRIM */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('free');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'free'
                          ? 'bg-gradient-to-b from-[#18210C] via-[#11141C] to-[#0E1017] border-[#A3E635]/70 shadow-[0_0_25px_rgba(163,230,53,0.18)] ring-1 ring-[#A3E635]/30'
                          : 'bg-[#12141C] border-[#222736] hover:border-[#A3E635]/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
                              <Swords className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">5v5 Open Scrim</h4>
                              <div className="text-[10px] font-mono text-slate-400">Free • All 5-Stacks</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                            FREE
                          </span>
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Users className="w-3 h-3 text-[#A3E635] shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">All 5-Stacks</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Verified</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Open MMR</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-[#A3E635] fill-[#A3E635] shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Veteran Squads</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Target className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">CS2 Precision</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Anti-Cheat</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~30s</span>
                        <span className={`font-bold ${selectedMatchTier === 'free' ? 'text-[#A3E635]' : 'text-slate-400'}`}>
                          {selectedMatchTier === 'free' ? '✓ SELECTED' : 'Click to Select'}
                        </span>
                      </div>
                    </div>

                    {/* CARD 2: 5v5 RANKED SERIES */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('premium');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'premium'
                          ? 'bg-gradient-to-b from-amber-500/15 via-[#16131C] to-[#0E1017] border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/40'
                          : 'bg-[#12141C] border-[#222736] hover:border-amber-500/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                              <Zap className="w-4 h-4 fill-amber-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">5v5 Ranked Series</h4>
                              <div className="text-[10px] font-mono text-amber-400 font-bold">Pro Pass • Verified 5-Stacks</div>
                            </div>
                          </div>
                          {userMembershipTier === 'free' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Lock className="w-3 h-3 text-amber-400" />
                              PRO PASS
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <Zap className="w-3 h-3 fill-amber-400" />
                              PRO PASS ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Users className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Verified 5-Stacks</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">ID Verified</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">±150 MMR Bracket</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Captain Vetoes</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Anti-Smurf Shield</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Division Points</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~20s</span>
                        {userMembershipTier === 'free' ? (
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 inline" />
                            {selectedMatchTier === 'premium' ? 'PRO PASS REQUIRED' : 'Click to Preview'}
                          </span>
                        ) : (
                          <span className={`font-bold ${selectedMatchTier === 'premium' ? 'text-amber-400' : 'text-slate-400'}`}>
                            {selectedMatchTier === 'premium' ? '✓ SELECTED' : 'Click to Select'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CARD 3: 5v5 PRIZE CLASH */}
                    <div
                      onClick={() => {
                        sound.playSelect();
                        setSelectedMatchTier('vip');
                      }}
                      className={`rounded-2xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 ${
                        selectedMatchTier === 'vip'
                          ? 'bg-gradient-to-b from-purple-500/15 via-[#171322] to-[#0E1017] border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/40'
                          : 'bg-[#12141C] border-[#222736] hover:border-purple-500/40 text-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                              <Trophy className="w-4 h-4 fill-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-base font-black font-display text-white">5v5 Prize Clash</h4>
                              <div className="text-[10px] font-mono text-purple-400 font-bold">Tournament Entry • Prize Pool</div>
                            </div>
                          </div>
                          {userMembershipTier !== 'vip' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 flex items-center gap-1 shadow-sm">
                              <Lock className="w-3 h-3 text-purple-400" />
                              PRIZE POOL ENTRY
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                              <Crown className="w-3 h-3 fill-amber-300" />
                              PRIZE ENTRY ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Perk Pills Grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Users className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Elite 5-Stacks</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <ShieldCheck className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Cash Prize Pool</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <TrendingUp className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">High Stakes MMR</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Film className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Full GOTV VOD</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">2x Season Points</span>
                          </div>
                          <div className="px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-1 text-slate-300 min-w-0 overflow-hidden">
                            <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-[10px] font-sans font-semibold tracking-tight whitespace-nowrap">Prize Qualifiers</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono border-t border-white/[0.04]">
                        <span className="text-slate-500">Wait time: ~15s</span>
                        {userMembershipTier !== 'vip' ? (
                          <span className="font-bold text-purple-400 flex items-center gap-1">
                            <Crown className="w-3 h-3 inline" />
                            {selectedMatchTier === 'vip' ? 'ENTRY PASS REQUIRED' : 'Click to Preview'}
                          </span>
                        ) : (
                          <span className={`font-bold ${selectedMatchTier === 'vip' ? 'text-purple-400' : 'text-slate-400'}`}>
                            {selectedMatchTier === 'vip' ? '✓ SELECTED' : 'Click to Select'}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                )}
'''

# We need to preserve the maps subtab which is between end of match_type and m4
idx_maps = text.find('{/* SUBTAB 2: MAP POOL SELECTOR */}')
assert idx_maps != -1, "Could not find maps subtab"

text = text[:idx3] + cards_replacement + "\n                " + text[idx_maps:]

# SECTION 4: REMOVE SERVERS SUBTAB (from m4 to m5)
idx4 = text.find(m4)
m5 = '{/* LIVE QUEUE FOOTER METRICS (AS SHOWN IN PHOTO) */}'
idx5 = text.find(m5)
assert idx4 != -1 and idx5 != -1, "Could not find servers / footer markers"

# We completely remove from idx4 to idx5!
text = text[:idx4] + text[idx5:]

# SECTION 5: FOOTER BAR (from m5 to m6)
idx5 = text.find(m5)
m6 = '{/* INTERACTIVE TEAM FINDER // SQUAD RADAR MODULE */}'
idx6 = text.find(m6)
assert idx5 != -1 and idx6 != -1, "Could not find footer / radar markers"

footer_replacement = '''{/* 5v5 QUEUE FOOTER METRICS */}
                <div className="mt-6 pt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-4">
                    <span>Live matches: <strong className="text-slate-300">10,697</strong></span>
                    <span>•</span>
                    <span>Players queueing: <strong className="text-[#A3E635]">3,164</strong></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-slate-400">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Steam Account: Verified Competitive Status</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1.5 text-slate-300 font-semibold">
                      <Users className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Format: 5v5 Full Stack</span>
                    </span>
                  </div>
                </div>

              </div>

              '''

text = text[:idx5] + footer_replacement + text[idx6:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: 5v5 Lobby Redesign applied cleanly!")
