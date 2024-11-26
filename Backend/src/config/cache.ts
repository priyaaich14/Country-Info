import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache expires after 1 hour
export default cache;
