import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import SubjectCard from '../components/SubjectCard'

function Search() {
    const [params] = useSearchParams()
    const [query, setQuery] = useState(params.get('q') || '')
    const [subjects, setSubjects] = useState([])
    const [requested, setRequested] = useState(false)

    useEffect(() => {
        fetch('http://localhost:5000/api/subjects')
            .then((res) => res.json())
            .then(setSubjects)
    }, [])

    const fuse = useMemo(() => new Fuse(subjects, { keys: ['code', 'name'], threshold: 0.35 }), [subjects])

    const results = useMemo(() => {
        if (!query.trim()) return []
        return fuse.search(query).map((r) => r.item)
    }, [query, fuse])

    async function handleRequestSubject() {
        await fetch('http://localhost:5000/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: query.toUpperCase(), name: query, examType: 'University Exam', year: new Date().getFullYear() }),
        })
        setRequested(true)
    }

    return (
        <main className="flex-1 pb-24 p-4">
            <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setRequested(false) }}
                    autoFocus
                    placeholder="Search subject code or name..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            {query && results.length === 0 && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 text-center">
                    {requested ? (
                        <p className="text-sm text-primary font-semibold">Request submitted — thanks!</p>
                    ) : (
                        <>
                            <p className="text-sm text-on-surface-variant mb-3">Can't find what you're looking for?</p>
                            <button
                                onClick={handleRequestSubject}
                                className="inline-block bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg"
                            >
                                Request this subject
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-4">
                {results.map((s) => (
                    <SubjectCard key={s.code} code={s.code} name={s.name} papers={s.papers.length} />
                ))}
            </div>
        </main>
    )
}

export default Search