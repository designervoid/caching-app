// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Data {
  city:             string;
  temperature:      number;
  weatherCondition: WeatherCondition;
  wind:             Wind;
}

export interface WeatherCondition {
  type:     string;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed:     number;
  direction: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { city } = req.query;
  const url = `https://openweathermap.org/data/2.5/find?q=${city}&units=metric&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
  const result = await fetch(url);
  const resultJson = await result.json();

  res.status(200).json(resultJson)
}
