import { FormElement, Input, Loading, Row, Spacer } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { WeatherResponse } from "types/Weather";
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from "utils/fetcher";
import useDebounce from "hooks/useDebounce";
import { useMatchMutate } from "hooks/useMatchMutate";

const thousandMilliseconds = 1e3;
const oneMinute = thousandMilliseconds * 60;

export const Search = () => {
  const matchMutate = useMatchMutate()
  
  const [search, setSearch] = useState('');
  
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
    <SWRConfig value={{ provider: () => new Map() }}>
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
