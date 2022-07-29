import { FormElement, Input, Loading, Row, Spacer } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { WeatherResponse } from "types/Weather";
import useSWR from 'swr'
import { fetcher } from "utils/fetcher";
import useDebounce from "hooks/useDebounce";

const thousandMilliseconds = 1e3;
const minute = thousandMilliseconds * 60;

export const Search = () => {
  const [lastSavedHistory, setLastSavedHistory] = useState<undefined | WeatherResponse>()

  const [search, setSearch] = useState('');
  
  const [queryParamsHistory, setQueryParamsHistory] = useState<string[]>([]);

  const queryParams = useDebounce(`city=${search}`, 1000);

  const { data, error, mutate } = useSWR<WeatherResponse>(`/api/v1/getCurrentWeather?${queryParams}`, fetcher, {
    revalidateOnMount: false,
    onSuccess: (data) => {
      setLastSavedHistory(data)
    }
  })

  const isDataLoading = !data;
  
  const handleInputChange = (e: ChangeEvent<FormElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setQueryParamsHistory(prev => {
      return [...new Set([...prev, queryParams])]
    });
  }, [queryParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueryParamsHistory(prev => {
        prev.forEach(async (e) => 
          {
            const response = await fetcher(`/api/v1/getCurrentWeather?${e}`);
            mutate(
              response,
            );
        })
        return [...prev];
      })
    }, minute);

    return () => {
      clearInterval(interval);
    }
  }, [mutate]);
  
  return (
    <div>
      <Row>
        <Input clearable label="City" placeholder="Enter the city" initialValue="" onChange={handleInputChange} />
      </Row>
      <Spacer y={1} />
      <Row>
        {search.length > 0 && <>
          {isDataLoading && <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}><Loading /></div>}
          {data && <code style={{ width: '100%', wordBreak: 'break-all' }}>
            {JSON.stringify(lastSavedHistory)}
          </code>}
          {error &&  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Something happened</div>}
        </>}
      </Row>
    </div>
  );
}
