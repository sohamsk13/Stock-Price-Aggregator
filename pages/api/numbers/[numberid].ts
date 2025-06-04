

//Provided numnbers sample manually bacause API header is not working 

import { NextApiRequest, NextApiResponse } from 'next';

const keyMap: Record<string, string> = {
  p: 'prime',
  f: 'fibonacci',
  e: 'even',
  r: 'random',
};

// hi team , Provided numnbers sample manually bacause API header is not working 

const SAMPLE_VALUES: Record<string, number[]> = {
  p: [2, 3, 5, 7, 11],
  f: [1, 1, 2, 3, 5, 8, 13, 21],
  e: [2, 4, 6, 8, 10, 12, 14, 16],
  r: [19, 23, 27, 5, 8, 1, 13],
};

const MAX_BUFFER = 10;
let buffer: number[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { numberid } = req.query;

  if (typeof numberid !== 'string' || !keyMap[numberid]) {
    return res.status(400).json({ error: 'Invalid key' });
  }

  const previous = [...buffer];
  const incoming = SAMPLE_VALUES[numberid] || [];
  const unseen = incoming.filter((val) => !buffer.includes(val));

  buffer = [...buffer, ...unseen];
  if (buffer.length > MAX_BUFFER) {
    buffer = buffer.slice(-MAX_BUFFER);
  }

  const mean = buffer.length
    ? parseFloat((buffer.reduce((a, b) => a + b, 0) / buffer.length).toFixed(2))
    : 0;

  return res.status(200).json({
    previousWindow: previous,
    currentWindow: buffer,
    received: incoming,
    average: mean,
  });
}
