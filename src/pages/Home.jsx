import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import SubjectCard from '../components/SubjectCard'

const DEPARTMENTS = ['CSE', 'ECE', 'ME', 'CE', 'EEE']
const SEMESTERS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']
const SCHEMES = ['2019', '2024']

function Home() {
    const [query, setQuery] = useState('')
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [scheme, setScheme] = useState('')
    const [dept, setDept] = useState('')
    const [sem, setSem] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate()
    const inputRef = useRef(null)

    useEffect(() => {
        fetch('http://localhost:5000/api/subjects')
            .then((res) => res.json())
            .then((data) => {
                setSubjects(data)
                setLoading(false)
            })
    }, [])

    const fuse = useMemo(() => new Fuse(subjects, {
        keys: ['code', 'name'],
        threshold: 0.35,
    }), [subjects])

    const suggestions = useMemo(() => {
        if (!query.trim()) return []
        return fuse.search(query).slice(0, 5).map((r) => r.item)
    }, [query, fuse])

    function handleSearch(e) {
        e.preventDefault()
        setShowDropdown(false)
        if (query.trim()) navigate(`/search?q=${query}`)
    }

    const filtered = subjects.filter((s) => {
        if (scheme && s.scheme !== scheme) return false
        if (dept && s.department !== dept) return false
        if (sem && s.semester !== Number(sem.replace('S', ''))) return false
        return true
    })

    return (
        <>
            <header className="bg-surface pt-4 px-4 pb-2 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-primary">PaperTrail</h1>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>person</span>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        placeholder="Search subject code or name..."
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />

                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                            {suggestions.map((s) => (
                                <button
                                    key={s.code}
                                    type="button"
                                    onMouseDown={() => {
                                        setShowDropdown(false)
                                        navigate(`/subject/${s.code}`)
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low text-left border-b border-outline-variant last:border-0"
                                >
                                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>description</span>
                                    <div>
                                        <p className="text-sm font-semibold">{s.name}</p>
                                        <p className="font-mono text-xs text-on-surface-variant">{s.code}</p>
                                    </div>
                                </button>
                            ))}
                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-sm text-primary font-semibold text-center hover:bg-surface-container-low"
                            >
                                See all results for "{query}"
                            </button>
                        </div>
                    )}
                </form>
            </header>

            {/* Filter chips row */}
            <section className="px-4 py-2 border-b border-outline-variant overflow-x-auto">
                <div className="flex gap-2 items-center w-max">
                    <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1.5 border border-outline-variant shrink-0">
                        <span className="text-xs font-semibold text-on-surface-variant mr-1 uppercase tracking-wide">Scheme:</span>
                        <select
                            value={scheme}
                            onChange={(e) => setScheme(e.target.value)}
                            className="bg-transparent text-xs font-mono text-on-surface focus:outline-none"
                        >
                            <option value="">All</option>
                            {SCHEMES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {DEPARTMENTS.map((d) => (
                        <button
                            key={d}
                            onClick={() => setDept(dept === d ? '' : d)}
                            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${dept === d
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                                }`}
                        >
                            {d}
                        </button>
                    ))}

                    <div className="w-px h-5 bg-outline-variant shrink-0" />

                    {SEMESTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSem(sem === s ? '' : s)}
                            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${sem === s
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-lowest text-on-surface border-outline-variant'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </section>

            <main className="flex-1 pb-24">
                <section className="p-4 mt-2">
                    <h2 className="text-lg font-semibold mb-4">
                        {dept || sem || scheme ? 'Filtered Subjects' : 'Trending Subjects'}
                    </h2>
                    {loading ? (
                        <p className="text-sm text-on-surface-variant">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <div className="card p-5 text-center">
                            <p className="text-sm text-on-surface-variant">No subjects match these filters.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filtered.map((s) => (
                                <SubjectCard key={s.code} code={s.code} name={s.name} papers={s.papers.length} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Home