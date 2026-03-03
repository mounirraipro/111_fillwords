export default function PlayGamePage() {
    return (
        <>
            <style>{`
                html, body { margin: 0; padding: 0; overflow: hidden; height: 100%; }
            `}</style>
            <iframe
                src="/game/index.html"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block',
                    overflow: 'hidden',
                }}
                title="FillWords Game"
                allow="autoplay"
                scrolling="no"
            />
        </>
    );
}
