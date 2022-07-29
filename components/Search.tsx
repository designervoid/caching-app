import { FormElement, Input, Loading, Row, Spacer } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { WeatherResponse } from "types/Weather";
import useSWR from 'swr'
import { fetcher } from "utils/fetcher";
import useDebounce from "hooks/useDebounce";

export const Search = () => {
  const [search, setSearch] = useState('');
  
  const queryParams = useDebounce(`city=${search}`, 1000);

  const { data, error } = useSWR<WeatherResponse>(`/api/v1/getCurrentWeather?${queryParams}`, fetcher, {
    revalidateOnMount: false,
  })

  const isDataLoading = !data;
  
  const handleInputChange = (e: ChangeEvent<FormElement>) => {
    setSearch(e.target.value);
  };

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
            {JSON.stringify(data)}
          </code>}
          {error &&  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>Something happened</div>}
        </>}
      </Row>
    </div>
  );
}
