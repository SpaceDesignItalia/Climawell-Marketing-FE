import { useState, useEffect } from "react"
import { Spinner } from "@heroui/react"
import axios from "axios"

interface Stat {
  name: string
  stat: number | string
}

export default function StatsList() {
  const [stats, setStats] = useState<Stat[]>([
    { name: "Totale Clienti (Persone)", stat: "..." },
    { name: "Totale Clienti (Aziende)", stat: "..." },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [privateCustomers, companyCustomers] = await Promise.all([
          axios.get("/Contacts/GET/GetAllPrivate", { params: { isPremium: false } }),
          axios.get("/Contacts/GET/GetAllCompany", { params: { isPremium: false } }),
        ])

        setStats([
          { name: "Totale Clienti (Persone)", stat: privateCustomers.data.length },
          { name: "Totale Clienti (Aziende)", stat: companyCustomers.data.length },
        ])
      } catch (err) {
        console.error("Errore nel caricamento delle statistiche:", err)
        setError("Si è verificato un errore nel caricamento delle statistiche")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden border-2 rounded-lg bg-white px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" />
                  <span className="text-gray-400">Caricamento...</span>
                </div>
              ) : (
                item.stat
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

