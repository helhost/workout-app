const API_BASE = "http://localhost:3001/api"

export async function getCounter(): Promise<number> {
    const res = await fetch(`${API_BASE}/counter`)
    const data = await res.json()
    return data.value
}

export async function updateCounter(value: number): Promise<number> {
    const res = await fetch(`${API_BASE}/counter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value })
    })
    const data = await res.json()
    return data.value
}
