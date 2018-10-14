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

const fetchRecord = createFetcher(
    (id) => axios.get(`https://swapi.co/api/planets/${id}/`),
);

export default function Detail(props) {
    const { data } = fetchRecord(props.id);
    return ( 
        <div>
            <h4 onClick={props.clickBack}>Go back</h4>
            Name: {data.name}<br />
            Terrain: {data.terrain}
        </div>
    );
}
