import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { subjects } from '../data/subjects'

function PdfViewer() {
    const { code, examType, year } = useParams()
    const navigate = useNavigate()
    const subject = subjects.find((s) => s.code === code)
    const [saved, setSaved] = useState(false)

    function handleSaveOffline() {
        const stored = localStorage.getItem('offlinePapers')
        const list = stored ? JSON.parse(stored) : []
        list.push({ code, examType, year })
        localStorage.setItem('offlinePapers', JSON.stringify(list))
        setSaved(true)
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="bg-surface border-b border-outline-variant flex items-center justify-between px-4 py-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 -ml-1">
                        <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-sm font-semibold truncate max-w-[180px]">{code} - {year} {examType}</h1>
                        <p className="text-xs text-outline uppercase font-mono">PDF</p>
                    </div>
                </div>
                <button onClick={handleSaveOffline} className="p-2">
                    <span className="material-symbols-outlined" style={saved ? { color: '#004ac6', fontVariationSettings: "'FILL' 1" } : {}}>
                        {saved ? 'cloud_done' : 'cloud_download'}
                    </span>
                </button>
            </header>

            {/* PDF content area — placeholder until real file storage exists */}
            <main className="flex-grow bg-surface-container-highest overflow-y-auto p-4 flex justify-center">
                <div className="w-full max-w-2xl bg-surface shadow-lg rounded-lg border border-outline-variant p-8">
                    <div className="text-center border-b border-outline-variant pb-4 mb-4">
                        <h2 className="text-lg font-bold">APJ ABDUL KALAM TECHNOLOGICAL UNIVERSITY</h2>
                        <h3 className="text-base font-semibold mt-1">{subject?.name}</h3>
                        <p className="text-sm font-bold mt-2">Course Code: {code}</p>
                    </div>
                    <p className="text-sm text-on-surface-variant text-center italic">
                        Actual PDF rendering comes later — once file storage/upload is wired to a real backend.
                    </p>
                </div>
            </main>

            {/* Bottom action bar */}
            <footer className="bg-surface border-t border-outline-variant p-3 flex-shrink-0 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl text-sm font-semibold">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>flag</span>
                    Report Issue
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-semibold">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                    Verify
                </button>
            </footer>
        </div>
    )
}

export default PdfViewer