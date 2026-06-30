import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Upload() {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle')
    const [form, setForm] = useState({ code: '', name: '', examType: '', year: '', department: '', semester: '', scheme: '' })
    const navigate = useNavigate()

    async function handleFileChange(e) {
        const selected = e.target.files[0]
        if (!selected) return
        setFile(selected)
        setStatus('scanning')

        const data = new FormData()
        data.append('file', selected)

        try {
            const res = await fetch('http://localhost:5000/api/scan', {
                method: 'POST',
                body: data,
            })
            const extracted = await res.json()
            setForm({
                code: extracted.code || '',
                name: extracted.name || '',
                examType: extracted.examType || '',
                year: extracted.year ? String(extracted.year) : '',
                department: extracted.department || '',
                semester: extracted.semester ? String(extracted.semester) : '',
                scheme: extracted.scheme || '',
            })
        } catch (err) {
            console.error('Auto-tag failed:', err)
            setForm({ code: '', name: '', examType: '', year: '', department: '', semester: '', scheme: '' })
        }

        setStatus('done')
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('submitting')

        const data = new FormData()
        data.append('file', file)
        data.append('code', form.code.toUpperCase())
        data.append('name', form.name)
        data.append('examType', form.examType)
        data.append('year', form.year)
        data.append('department', form.department)
        data.append('semester', form.semester)
        data.append('scheme', form.scheme)

        await fetch('http://localhost:5000/api/papers', {
            method: 'POST',
            body: data,
        })

        alert('Uploaded! Thanks for contributing.')
        const submittedCode = form.code.toUpperCase()
        setFile(null)
        setStatus('idle')
        setForm({ code: '', name: '', examType: '', year: '', department: '', semester: '', scheme: '' })
        navigate(`/subject/${submittedCode}`)
    }

    const lowConfidence = status === 'done' && !form.code

    return (
        <main className="flex-1 pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">Upload a Paper</h1>

            {!file && (
                <label className="block border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer">
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: 40 }}>upload_file</span>
                    <p className="text-sm text-on-surface-variant mt-2">Tap to choose a PDF (max 10MB)</p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
            )}

            {status === 'scanning' && (
                <div className="text-center mt-6">
                    <p className="text-sm text-on-surface-variant">Scanning paper...</p>
                </div>
            )}

            {(status === 'done' || status === 'submitting') && (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    {lowConfidence && (
                        <p className="text-sm text-error bg-error-container rounded-lg p-3">
                            Couldn't auto-detect details — please fill manually.
                        </p>
                    )}

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Subject Code {form.code && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <input
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Subject Name {form.name && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Department {form.department && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <select
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select department</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                            <option value="EEE">EEE</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Semester {form.semester && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <select
                            name="semester"
                            value={form.semester}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <option key={n} value={n}>Semester {n}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Scheme {form.scheme && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <select
                            name="scheme"
                            value={form.scheme}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select scheme</option>
                            <option value="2019">2019</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Exam Type</label>
                        <select
                            name="examType"
                            value={form.examType}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select exam type</option>
                            <option value="University Exam">University Exam</option>
                            <option value="Series Test 1">Series Test 1</option>
                            <option value="Series Test 2">Series Test 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Year {form.year && <span className="text-xs text-primary font-normal">AI suggested</span>}
                        </label>
                        <input
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            placeholder="e.g. 2024"
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="bg-primary text-white font-semibold py-3 rounded-lg mt-2 disabled:opacity-50"
                    >
                        {status === 'submitting' ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
            )}
        </main>
    )
}

export default Upload