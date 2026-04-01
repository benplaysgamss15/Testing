// ── HUD ──
function drawHUD(){
    G.btns=[]; const W=canvas.width, H=canvas.height;
    ctx.fillStyle='rgba(0,0,0,0.82)';ctx.fillRect(0,0,W,52); ctx.strokeStyle='rgba(100,180,255,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,52);ctx.lineTo(W,52);ctx.stroke();
    ctx.fillStyle='#aaddff';ctx.shadowColor='#55aaff';ctx.shadowBlur=8; ctx.font='bold 22px Courier New';ctx.textAlign='left';ctx.textBaseline='middle'; ctx.fillText(`🪣 ${G.wheat}`,16,18);ctx.shadowBlur=0;
    ctx.fillStyle='#aaa'; ctx.font='12px Courier New'; ctx.fillText(`Map: ${G.level===1?'Isla Uno':'Volcano Island'}`, 16, 38);

    if(G.cheatsActive){ const pulse = 0.6 + Math.sin(G.tick * 0.12) * 0.4; ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`; ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 14; ctx.font = 'bold 18px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚠ CHEATS ACTIVE ⚠', W / 2, 40); ctx.shadowBlur = 0; }

    const d=pDino(); ctx.fillStyle=RARITY_COLOR[d.rarity];ctx.shadowColor=RARITY_COLOR[d.rarity];ctx.shadowBlur=10; ctx.font='bold 15px Courier New';ctx.textAlign='center'; ctx.fillText(`${d.em} ${d.name}[${d.rarity}]`,W/2,G.cheatsActive?18:26);ctx.shadowBlur=0;

    const pct=G.playerHp/pMaxHp(); const hcol=pct>0.5?'#44cc44':pct>0.25?'#cccc44':'#cc4444';
    hpBar(W-195,12,180,16,G.playerHp,pMaxHp(),hcol,`HP ${G.playerHp}/${pMaxHp()}`);
    if (G.playerShield > 0) hpBar(W-195,30,180,10,G.playerShield,Math.floor(pMaxHp()*0.4),'#44aaff',`SHIELD`);

    btn(W-100, 32, 85, 20, 'Restart', '#aa2222', '#fff', () => {
        if(confirm("Are you sure you want to restart? All progress will be lost!")) { localStorage.removeItem('dinoworld_save'); window.activeSave = null; if(G.coop.partnerId) { sendCoop({ type: 'coop_break', target: G.coop.partnerId }); breakCoop("You restarted."); } startGame(true); G.state = 'intro'; }
    }, '🔄');

    const isConnected = G.peerId || Object.keys(G.conns).length > 0;
    if (!isConnected) { btn(W-100, 56, 40, 20, 'Host', '#8822cc', '#fff', () => showMpModal('host')); btn(W-55, 56, 40, 20, 'Join', '#cc2288', '#fff', () => showMpModal('join'));
    } else { btn(W-100, 56, 85, 20, 'Leave Room', '#aa2222', '#fff', leaveGame); ctx.fillStyle='#fff'; ctx.font='bold 12px Courier New'; ctx.textAlign='right'; ctx.fillText(G.peerId ? 'Room: '+G.peerId : 'Connected', W-15, 88); }

    if (G.coop.partnerId) {
        btn(16, 56, 130, 20, 'Leave Party', '#cc2244', '#fff', () => { if(confirm("Are you sure you want to leave the party? You will return to your solo save!")) { sendCoop({ type: 'coop_break', target: G.coop.partnerId }); breakCoop("You left the Co-op party."); } }, '💔');
    }

    const bw=95,bh=44,gap=10,by=H-58; const total=4*(bw+gap)-gap; const bsx=(W-total)/2;
    btn(bsx, by,bw,bh,'Index', '#2255cc','#fff',()=>{G.state='index';G.idxPage=0;G.btns=[];},'📘');
    btn(bsx+bw+gap,by,bw,bh,'Shop', '#cc5522','#fff',()=>{G.state='shop';G.btns=[];},'🛒');
    btn(bsx+2*(bw+gap),by,bw,bh,'Shld(40)','#225588','#fff',()=>{ const maxS = Math.floor(pMaxHp()*0.4); const addS = Math.floor(pMaxHp()*0.15); if(G.wheat>=40 && G.playerShield < maxS){ G.wheat-=40; G.playerShield = Math.min(maxS, G.playerShield + addS); spawnParticles(W/2,H-80,'#44aaff',12); if (G.coop.partnerId) sendCoop({ type: 'coop_wheat', target: G.coop.partnerId, wheat: G.wheat }); } },'🛡️');
    btn(bsx+3*(bw+gap),by,bw,bh,'Heal(5)','#225522','#fff',()=>{ const addH = Math.floor(pMaxHp()*0.1); if(G.wheat>=5 && G.playerHp < pMaxHp()){ G.wheat-=5; G.playerHp = Math.min(pMaxHp(), G.playerHp + addH); spawnParticles(W/2,H-80,'#44ff44',8); if (G.coop.partnerId) sendCoop({ type: 'coop_wheat', target: G.coop.partnerId, wheat: G.wheat }); } },'💊');

    const mm=90, mmx=W-mm-8, mmy=H-mm-65; ctx.fillStyle='rgba(0,0,0,0.75)';ctx.fillRect(mmx,mmy,mm,mm); ctx.strokeStyle='rgba(255,200,50,0.4)';ctx.lineWidth=1;ctx.strokeRect(mmx,mmy,mm,mm); const msc=mm/WS;
    for(let ty2=0;ty2<WS;ty2+=2){ for(let tx2=0;tx2<WS;tx2+=2){ const tt=worldMap[ty2][tx2]; let mmCol='#4a7c3f'; if(G.level===2) mmCol=tt===2?'#8a251a':tt===1?'#1f1410':tt===3?'#5a3a2a':tt===4?'#ff2200':'#3d2e25'; else mmCol=tt===2?'#1a6b8a':tt===1?'#2d5a27':tt===3?'#c8a85a':'#4a7c3f'; ctx.fillStyle=mmCol; ctx.fillRect(mmx+tx2*msc,mmy+ty2*msc,msc*2+0.5,msc*2+0.5); } }
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mmx+G.player.x/TS*msc,mmy+G.player.y/TS*msc,3,0,Math.PI*2);ctx.fill();
    for(let id in G.otherPlayers) { if(!G.isHost && G.peer && id === G.peer.id) continue; const op = G.otherPlayers[id]; if(!op) continue; ctx.fillStyle='#aaddff'; ctx.beginPath();ctx.arc(mmx+op.x/TS*msc,mmy+op.y/TS*msc,2.5,0,Math.PI*2);ctx.fill(); }
    for(const w of G.wilds){ ctx.fillStyle=w.isBoss?'#ff3333':RARITY_COLOR[DINOS[w.key].rarity]; ctx.beginPath();ctx.arc(mmx+w.x/TS*msc,mmy+w.y/TS*msc,w.isBoss?3:1.5,0,Math.PI*2);ctx.fill(); }
    ctx.fillStyle='rgba(200,200,200,0.6)';ctx.font='8px Courier New';ctx.textAlign='center';ctx.textBaseline='top'; ctx.fillText('MAP',mmx+mm/2,mmy-10);
    if(G.encCd>0){ ctx.fillStyle='rgba(255,220,0,0.85)';ctx.font='bold 13px Courier New';ctx.textAlign='center';ctx.textBaseline='bottom'; ctx.fillText('⛨ Safe Zone',W/2,H-65); }

    if (G.pvp.cd > 0) G.pvp.cd--;
    if (G.coop.reqFrom) {
        const rw = 280, rh = 80; const rx = 20, ry = H/2 - rh/2; rr(rx, ry, rw, rh, 8, 'rgba(20,20,40,0.95)', '#22ccaa', 2);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Courier New'; ctx.textAlign = 'center'; ctx.fillText(G.coop.reqFromName + ' sent a Co-op request!', rx + rw/2, ry + 25);
        btn(rx + 20, ry + 45, 110, 26, 'Deny', '#cc2222', '#fff', () => { sendCoop({ type: 'coop_reply', target: G.coop.reqFrom, sender: (G.isHost ? 'host' : G.peer.id), accept: false, name: G.username || 'Player' }); G.coop.reqFrom = null; }, '✖');
        
        // NEW HTML POPUP REPLACES CONFIRM() FOR RECEIVING INVITE
        btn(rx + 150, ry + 45, 110, 26, 'View', '#22ccaa', '#000', () => {
            showCoopModal(() => {
                sendCoop({ type: 'coop_reply', target: G.coop.reqFrom, sender: (G.isHost ? 'host' : G.peer.id), accept: true, name: G.username || 'Player' }); bondWithPartner(G.coop.reqFrom, G.coop.reqFromName); G.coop.reqFrom = null;
            });
        }, '🤝');
    } else if (G.pvp.reqFrom) {
        const rw = 280, rh = 80; const rx = W/2 - rw/2, ry = H - 240; rr(rx, ry, rw, rh, 8, 'rgba(20,20,40,0.95)', '#8822cc', 2);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Courier New'; ctx.textAlign = 'center'; ctx.fillText(G.pvp.reqFromName + ' requested PvP!', W/2, ry + 25);
        btn(rx + 20, ry + 45, 110, 26, 'Deny', '#cc2222', '#fff', () => { sendPvP({ type: 'pvp_reply', target: G.pvp.reqFrom, sender: (G.isHost ? 'host' : G.peer.id), accept: false, name: G.username || 'Player' }); G.pvp.reqFrom = null; G.pvp.cd = 1800; }, '✖');
        btn(rx + 150, ry + 45, 110, 26, 'Accept', '#22cc22', '#fff', () => { sendPvP({ type: 'pvp_reply', target: G.pvp.reqFrom, sender: (G.isHost ? 'host' : G.peer.id), accept: true, stats: getMyBattleStats() }); startPvPBattle(G.pvp.reqFrom, G.pvp.reqFromStats, false); G.pvp.reqFrom = null; }, '✔');
    } else if (G.pvp.closeId && G.encCd <= 0) {
        const op = G.otherPlayers[G.pvp.closeId];
        if (op) {
            if (!G.coop.partnerId && !G.pvp.reqTo) {
                btn(W/2 + 20, H - 150, 140, 36, 'PvP Battle', G.pvp.cd > 0 ? '#888888' : '#cc6622', '#fff', () => { if(G.pvp.cd > 0) G.pvp.msgTimer = 180; else { G.pvp.reqTo = G.pvp.closeId; sendPvP({ type: 'pvp_request', target: G.pvp.closeId, sender: (G.isHost ? 'host' : G.peer.id), name: G.username || 'Player', stats: getMyBattleStats() }); addChatMessage('System', 'PvP Request Sent!'); } }, '⚔️');
            }
            if (!G.coop.partnerId && !op.coopPartner && !G.coop.reqTo) {
                
                // NEW HTML POPUP REPLACES CONFIRM() FOR SENDING INVITE
                btn(W/2 - 160, H - 150, 140, 36, 'Add Friend', '#22ccaa', '#000', () => {
                    showCoopModal(() => {
                        G.coop.reqTo = G.pvp.closeId; sendCoop({ type: 'coop_request', target: G.pvp.closeId, sender: (G.isHost ? 'host' : G.peer.id), name: G.username || 'Player' }); addChatMessage('System', 'Co-op Request Sent!');
                    });
                }, '🤝');
            }
        }
    }
    if (G.pvp.msgTimer > 0) { G.pvp.msgTimer--; ctx.fillStyle = '#ff4444'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText("PvP request is on cooldown!", W/2, H/2 - 60 - (180 - G.pvp.msgTimer) * 0.2); ctx.shadowBlur = 0; }
    btn(16, 280, 65, 40, 'Chat', '#44aa44', '#fff', () => { document.getElementById('chatBox').style.display = 'flex'; document.getElementById('chatInp').focus(); document.getElementById('chatMessages').style.pointerEvents = 'auto'; wakeChat(); }, '💬');
}
