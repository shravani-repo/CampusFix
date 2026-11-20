import { useCallback, useEffect, useState } from 'react'

export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    setLoading(true)
    return fn()
      .then((d) => { setData(d); setError(null) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => { load() }, [load])
  return { data, setData, error, loading, reload: load }
}
