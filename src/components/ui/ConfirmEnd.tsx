export default function ConfirmEnd({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', background: '#111', borderRadius: '20px 20px 0 0', padding: '28px 24px', paddingBottom: 'max(140px,calc(env(safe-area-inset-bottom)+110px))', animation: 'slideUp 0.2s ease-out both' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>End session?</div>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 24, letterSpacing: '0.02em' }}>Your sets so far will be saved.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onConfirm} style={{ width: '100%', padding: '18px 0', background: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', cursor: 'pointer', color: '#000' }}>
            YES, END SESSION
          </button>
          <button onClick={onCancel} style={{ width: '100%', padding: '16px 0', background: 'transparent', border: '0.5px solid #333', borderRadius: 12, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', color: '#666' }}>
            KEEP GOING
          </button>
          <button disabled style={{ width: '100%', padding: '22px 0', background: '#000', border: 'none', cursor: 'default', display: 'block' }} />
        </div>
      </div>
    </div>
  );
}
