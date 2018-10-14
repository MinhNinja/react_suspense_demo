import React from 'react';
import axios from 'axios';
import { createCache, createResource } from 'simple-cache-provider';

/**
 * Implement cache with createResource
 */
const cache = createCache(Symbol('CacheDemo'));

function createFetcher(fetch) {
  const res = createResource(fetch);
  return (...args) => res(cache, ...args);
}

function SingleItem({ name, url, onClick, ...rest }) {
    const [, id] = url.match(/https:\/\/swapi.co\/api\/planets\/([0-9]+)/);
    return (
      <div onClick={() => onClick(id)}>
        <h4>{name}</h4>
      </div>
    );
}

const fetchRecords = createFetcher(
    (id) => axios.get(`https://swapi.co/api/planets`),
); 

export default function List(props) {
    //const onClick = props.onClick;
    const { data } = fetchRecords();
    return data.results.map(result =>
      <SingleItem
        key={result.url}
        onClick={props.clickDetail}
        {...result}
      />
    );
}
