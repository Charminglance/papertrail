import { useState, useEffect } from 'react'

function OfflineLibrary() {
    const [saved, setSaved] = useState([])

    useEffect(() => {
        const stored = localStorage.getItem('offlinePapers')
        setSaved(stored ? JSON.parse(stored) : [])
    }, [])

    return (
        <main className="flex-1 pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">Offline Library</h1>

            {saved.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center">
                    <p className="text-sm text-on-surface-variant">No papers saved yet. Open a paper and tap "Save for offline" to see it here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {saved.map((p, i) => (
                        <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
                            <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{p.code}</span>
                            <p className="text-sm font-medium mt-1">{p.year} · {p.examType}</p>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default OfflineLibrary