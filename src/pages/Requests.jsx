import { useState, useEffect } from 'react'

function Requests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:5000/api/requests')
            .then((res) => res.json())
            .then((data) => {
                setRequests(data)
                setLoading(false)
            })
    }, [])

    async function handleUpvote(id) {
        const res = await fetch(`http://localhost:5000/api/requests/${id}/upvote`, {
            method: 'POST',
        })
        const updated = await res.json()
        setRequests((prev) =>
            prev.map((r) => (r._id === id ? updated : r))
        )
    }

    return (
        <main className="flex-1 pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">Open Requests</h1>

            {loading ? (
                <p className="text-sm text-on-surface-variant">Loading...</p>
            ) : requests.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center">
                    <p className="text-sm text-on-surface-variant">No open requests yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {requests.map((r) => (
                        <div key={r._id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{r.code}</span>
                                <h3 className="font-semibold text-sm mt-1">{r.name}</h3>
                                <p className="text-xs text-on-surface-variant mt-0.5">{r.examType} · {r.year}</p>
                            </div>
                            <button
                                onClick={() => handleUpvote(r._id)}
                                className="flex flex-col items-center bg-surface-container px-3 py-2 rounded-lg active:scale-90 transition-transform"
                            >
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>arrow_upward</span>
                                <span className="text-xs font-semibold">{r.upvotes}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default Requests