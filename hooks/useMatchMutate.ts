import { useSWRConfig } from 'swr'
import { fetcher } from 'utils/fetcher';

export function useMatchMutate() {
    const { cache, mutate } = useSWRConfig();

    return (matcher: RegExp) => {
      if (!(cache instanceof Map)) {
        throw new Error('matchMutate requires the cache provider to be a Map instance')
      }
  
      const keys = []
  
      for (const key of cache.keys()) {
        if (matcher.test(key)) {
          keys.push(key)
        }
      }

      const mutations = keys.map(async (key) => {
        const data = await fetcher(key);
        mutate(key, data);
      })

      return Promise.all(mutations)
    }
  }