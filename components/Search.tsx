import { FormElement, Input, Loading, Row, Spacer } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { WeatherResponse } from "types/Weather";
import useSWR, { SWRConfig, useSWRConfig, Cache } from 'swr'
import { fetcher } from "utils/fetcher";
import useDebounce from "hooks/useDebounce";
import { useMatchMutate } from "hooks/useMatchMutate";

const thousandMilliseconds = 1e3;
const oneMinute = thousandMilliseconds * 60;

function localStorageProvider(cache: Cache<any>) {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))

  window.onbeforeunload = (event) => {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();

    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    // Save cache
    const appCache = JSON.stringify([...new Set(Array.from(cache.entries()))])
    localStorage.setItem('app-cache', appCache);

    if (e) {
      e.returnValue = ''; // Legacy method for cross browser support
    }
    return ''; // Legacy method for cross browser support
  };

  // We still use the map for write & read for performance.
  return map
}

export const Search = () => {
  const matchMutate = useMatchMutate()
  
  const [search, setSearch] = useState('');
  const {cache} = useSWRConfig();
  
  const queryParams = useDebounce(`city=${search}`, thousandMilliseconds);
  
  const { data, error } = useSWR<WeatherResponse>(`/api/v1/getCurrentWeather?${queryParams}`, fetcher, {
    revalidateOnMount: false,
  })

  const isDataLoading = !data;
  
  const handleInputChange = (e: ChangeEvent<FormElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const endpointRegex = /^\/api\//;
      matchMutate(endpointRegex);
    }, oneMinute);

    return () => {
      clearInterval(interval);
    }
  }, [matchMutate]);
  
  return (
    <SWRConfig value={{ provider: () => {
      return localStorageProvider(cache);
    } }}>
      <div>
        <Row>
          <Input clearable label="City" placeholder="Enter the city" initialValue="" onChange={handleInputChange} />
        </Row>
        <Spacer y={1} />
        <Row>
          {search.length > 0 && <>
            {isDataLoading && <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><Loading /></div>}
            {data && <code style={{ width: '100%', wordBreak: 'break-all' }}>
              {JSON.stringify(data)}
            </code>}
            {error &&  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Something happened</div>}
          </>}
        </Row>
      </div>
    </SWRConfig>
  );
}
